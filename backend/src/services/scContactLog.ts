import smConnectContactLog, {
  elementStatus,
  IScContactLog,
} from '../db/mongo/models/scContactLog';
import ScContactLogDTO from '../dto/ScContactLogDTO';
import { IContact } from '../transformers/ContactTransformer';

import smartConnectors, { IStage } from '../db/mongo/models/smartConnectors';
import { getScWithStage } from './smartConnectorsService';
import stageElements, {
  apiUrls,
  IStageElement,
  nodeTypes,
} from '../db/mongo/models/stageElements';

import { RFNGAppError } from '../utils/ErrorHandler';
import HttpCode from '../config/httpCode';
import { smartConnectorMsg, taskMessages } from '../config/messages';
import { getCurrentUtcTime, getDelayEndTime } from '../utils/DateHelper';
import ContactModel from '../db/mongo/models/contactModel';
import axios from 'axios';
import config from '../config/config';
import { logErrorType } from '../utils/commonErrorLogging';
import { logInfo } from './log';
import { commonContentPlaceholders } from '../config/contentPlaceholders';
import smDelayLog, { IScDelayLog } from '../db/mongo/models/scDelayLogs';

//To Fetch all the Contacts Log and it's associated smart connectors stage and element
export const getScContactLogs = async (
  contactId: string,
  connectorId: string
): Promise<IScContactLog[]> => {
  return await smConnectContactLog.find({
    contactId,
    smartConnectorId: connectorId,
  });
};

//Check if the smart connector is assigned to the contact or not
const checkIfContactAssigned = async (
  contactId: string | number,
  smartConnectorId: string
): Promise<IScContactLog[]> => {
  try {
    const smartConnector = await getScWithStage(smartConnectorId);

    if (!smartConnector) {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.noSmartConnectorFound,
      });
    }

    const contactLog = await smConnectContactLog
      .find({ contactId: contactId, smartConnectorId: smartConnectorId })
      .exec();
    return contactLog;
  } catch (error) {
    logErrorType(error, 1010, { contactId, smartConnectorId });
    return Promise.reject(error);
  }
};

//Fetch the first stage Id associated with the smart connector
const fetchFirstStage = async (
  smartConnectorId: string
): Promise<IStage | null> => {
  try {
    const scDetails = await smartConnectors
      .findOne({ id: smartConnectorId })
      .exec();
    const stages = scDetails?.stages;

    if (stages && stages?.length > 0) {
      const firstStage = stages.filter(function (stage) {
        return stage.sequenceNumber === 1;
      });
      return firstStage[0]; //Get the first element
    } else {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.noStageFound,
      });
    }
  } catch (error) {
    logErrorType(error, 1011, { smartConnectorId });
    return Promise.reject(error);
  }
};

//Fetch the first action id associated with a stage
const fetchFirstActionId = async (
  stageId: string
): Promise<IStageElement | null> => {
  try {
    const scActionDetails = await stageElements
      .findOne({ stageId: stageId, parentId: '' })
      .exec();

    if (scActionDetails) {
      return scActionDetails;
    } else {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.noActionFound,
      });
    }
  } catch (error) {
    logErrorType(error, 1012, { stageId });
    return Promise.reject(error);
  }
};

//Fetch the next element Id(s) and assigned it to the contact
const updateNextElementDetails = async (
  stageId: string,
  elementId: string,
  contactId: string | number,
  userId: string | number
): Promise<IScContactLog[] | null> => {
  try {
    const nextElementDetails = await fetchNextElementId(stageId, elementId);

    if (nextElementDetails && nextElementDetails.length === 0) {
      //No element found in the stage
      //TODO : Fetch the next stage Id and it's action Id
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.noElementFound,
      });
    }

    const bulkElementDetails: IScContactLog[] = [];
    const delayDetailsToSave: IScDelayLog[] = [];

    nextElementDetails?.forEach(function (item: IStageElement, index) {
      const objData: IScContactLog = {} as IScContactLog;
      const scDelayObj: IScDelayLog = {} as IScDelayLog;
      objData.smartConnectorId = item.smartConnectorId;
      objData.contactId = contactId;
      objData.userId = userId;
      objData.stageId = stageId;
      objData.elementId = item.id;
      objData.elementType = item.nodeType;
      objData.status = elementStatus.Assigned;
      objData.assignTime = getCurrentUtcTime();

      //Calculate the delay time
      if (item.nodeType === nodeTypes.Delay) {
        const delayTime = item.delayTime || 0;
        const delayTimeUnit = item.delayTimeUnit;
        objData.delayEndTime = getDelayEndTime(delayTime, delayTimeUnit);

        // Create Delay Object with element details
        scDelayObj.userId = userId;
        scDelayObj.smartConnectorId = item.smartConnectorId;
        scDelayObj.contactId = contactId;
        scDelayObj.delayEndTime = objData.delayEndTime;
        scDelayObj.elementId = item.id;

        delayDetailsToSave.push(scDelayObj);
      }

      // Make the API call to create a follow-up task
      if (item.nodeType === nodeTypes.Action) {
        createTask(userId, contactId, item.id);
      }

      bulkElementDetails.push(objData);
    });

    const contactLog = await smConnectContactLog.insertMany(bulkElementDetails);

    // Save all delay details at once
    if (delayDetailsToSave.length > 0) {
      await smDelayLog.insertMany(delayDetailsToSave);
    }

    return contactLog;
  } catch (error) {
    logErrorType(error, 1013, { stageId, elementId, contactId, userId });
    return Promise.reject(error);
  }
};

const updateCurrentElementStatus = async (
  elementId: string,
  contactId: string | number
): Promise<boolean | null> => {
  try {
    const filter = { elementId: elementId, contactId: contactId };

    const doc = await smConnectContactLog.findOneAndUpdate(
      filter,
      {
        $set: { status: elementStatus.Executed },
      },
      {
        returnNewDocument: true,
      }
    );
    return doc ? true : false;
  } catch (error) {
    logErrorType(error, 1014, { elementId, contactId });
    return Promise.reject(error);
  }
};

//Fetch the first action id associated with a stage
const fetchNextElementId = async (
  stageId: string,
  elementId: string
): Promise<IStageElement[] | null> => {
  try {
    const scElementDetails = await stageElements
      .find({ stageId: stageId, parentId: elementId })
      .exec();

    if (scElementDetails) {
      return scElementDetails;
    } else {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.noElementFound,
      });
    }
  } catch (error) {
    logErrorType(error, 1015, { stageId, elementId });
    return Promise.reject(error);
  }
};

/**
 * Function to assign smart connector through API. The API accepts 3 parameters. contactId, smartConnectorId, and userId.
 * First it checks if a smart connector is already assigned to a contact or not. If not assigned, it fetch the first stage
 * associated with the smart connector then the first action form that stage. Then that action assigned to the contact.
 * If the contact already assigned with a smart connector then it fetch the next action and assigned it to the contact.
 * It change the existing smart connector status as executed and newly assigned smart connector status as assigned.
 */
export const postScContactLog = async (
  scContactDto: ScContactLogDTO
): Promise<IScContactLog | IScContactLog[] | null> => {
  try {
    const contactId = scContactDto.contactId;
    const smartConnectorId = scContactDto.smartConnectorId;
    const userId = scContactDto.userId;
    logInfo({ message: `Check if contact is Assigned...` });
    const contactLogs = await checkIfContactAssigned(
      contactId,
      smartConnectorId
    );
    logInfo({ message: `Contact is assigned...contactLog: ${contactLogs}` });

    // Check if the smart connector is already assigned with the contact.
    if (contactLogs && contactLogs.length > 0) {
      //Get the latest element id and fetch the next element Id
      const latestElementDetails = contactLogs.filter(function (contactLog) {
        return contactLog.status === elementStatus.Assigned;
      });

      if (latestElementDetails && latestElementDetails.length == 0) {
        throw new RFNGAppError({
          statusCode: HttpCode.UNPROCESSABLE_ENTITY,
          message: smartConnectorMsg.noActiveElementFound,
        });
      }

      const stageId = latestElementDetails[0].stageId;
      const latestElementId = latestElementDetails[0].elementId;

      //Update the current/latest element status to be executed
      logInfo({ message: `Updating current element Status` });
      const updateStatus = await updateCurrentElementStatus(
        latestElementId,
        contactId
      );
      logInfo({ message: `update element status: ${updateStatus}` });

      //Update the next element Id
      logInfo({ message: `update next element details` });
      const contactLog = await updateNextElementDetails(
        stageId,
        latestElementId,
        contactId,
        userId
      );
      logInfo({
        message: `next element details updated. contactLog: ${contactLog}`,
      });
      return contactLog && contactLog.length > 0 ? contactLog : null; //TODO : Handle multiple child element
    } else {
      //Stage with sequence number 1
      const firstStage = await fetchFirstStage(smartConnectorId);
      const firstStageId = firstStage?.id || '';
      let actionId = '';

      //Get the first action associated with the stage
      if (firstStageId !== '') {
        const actionDetails = await fetchFirstActionId(firstStageId);
        const firstActionId = actionDetails?.id || '';
        actionId = actionDetails?.id || '';
        scContactDto.stageId = firstStageId;
        scContactDto.elementId = firstActionId;
      }

      const newScContactLog = new smConnectContactLog(scContactDto);
      const contactLog = await newScContactLog.save();
      // Create Follow-Up Task
      await createTask(userId, contactId, actionId);
      return contactLog;
    }
  } catch (error) {
    logErrorType(error, 1016, {
      contactId: scContactDto?.contactId,
      smartConnectorId: scContactDto?.smartConnectorId,
      userId: scContactDto?.userId,
    });
    return Promise.reject(error);
  }
};

export const fetchScContactLogForContact = async (
  contactId: string,
  smartConnectorId: string
) => {
  try {
    const scDetails = await smConnectContactLog
      .find({ smartConnectorId: smartConnectorId, contactId: contactId })
      .sort({ assignTime: -1 })
      .limit(1)
      .exec();
    if (scDetails) {
      return scDetails; //Get the first element
    } else {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.noStageFound,
      });
    }
  } catch (error) {
    logErrorType(error, 1017, { contactId, smartConnectorId });
    return Promise.reject(error);
  }
};

/***
 * Get the smart connector assigned details for a contact.
 */

export const fetchScContactAssignedDetailsForContact = async (
  contactId: string
) => {
  try {
    const scDetails = await smConnectContactLog
      .find({ contactId: contactId })
      .sort({ assignTime: -1 })
      .limit(1)
      .exec();
    if (scDetails) {
      return scDetails; //Get the first element
    } else {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.noStageFound,
      });
    }
  } catch (error) {
    logErrorType(error, 1018, { contactId });
    return Promise.reject(error);
  }
};

/***
 * Get the smart connector Id with respect to contact Id and action Id.
 * This function will be used in executed action. So, It will check the smart
 * connector status. The status should be 1 (Assigned), so that next
 * phase action/delay/response can be assigned to that contact. The element type 1
 * means it's a action. So the function only check the elementType equal to 1
 */

export const fetchActionForAContact = async (
  actionId: string,
  contactId: string,
  userId: string
): Promise<ScContactLogDTO> => {
  try {
    const scDetails = await smConnectContactLog
      .findOne({
        elementId: actionId,
        contactId: contactId,
        userId: userId,
        elementType: nodeTypes.Action,
        status: elementStatus.Assigned,
      })
      .select({ _id: 0 })
      .exec();
    if (scDetails) {
      return scDetails; //Get the contact Log
    } else {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.noActionWithContact,
      });
    }
  } catch (error) {
    logErrorType(error, 1019, { actionId, contactId, userId });
    return Promise.reject(error);
  }
};

/***
 * Get the smart connector Id with respect to contact Id and delay Id.
 * This function will be used in finished delay API. It will check the smart
 * connector status. The status should be 1 (Assigned), so that next
 * phase action/delay/response can be assigned to that contact. The element type 3
 * means it's a delay. It will consider only the element type as 3
 */

export const fetchDelayForAContact = async (
  delayId: string,
  contactId: string,
  userId: string
): Promise<ScContactLogDTO> => {
  try {
    const scDetails = await smConnectContactLog
      .findOne({
        elementId: delayId,
        contactId: contactId,
        userId: userId,
        elementType: nodeTypes.Delay,
        status: elementStatus.Assigned,
      })
      .select({ _id: 0 })
      .exec();
    if (scDetails) {
      return scDetails; //Get the contact Log
    } else {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.invalidDelayId,
      });
    }
  } catch (error) {
    logErrorType(error, 1020, { delayId, contactId, userId });
    return Promise.reject(error);
  }
};

/***
 * Get the smart connector Id with respect to contact Id and delay Id.
 * This function will be used to get the contact details
 */

export const fetchDetailsForAContact = async (
  contactId: string | number
): Promise<IContact | null> => {
  try {
    const contactDetails = await ContactModel.findOne({
      contactId,
    });
    logInfo({
      message: 'fetchDetailsForAContact contactDetails',
      context: { contactDetails },
    });
    if (contactDetails) {
      return contactDetails.toObject() as IContact; //Get the contact Log
    } else {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.invalidDelayId,
      });
    }
  } catch (error) {
    logErrorType(error, 1021);
    return Promise.reject(error);
  }
};

// Fetch Task Message and Resource Name Associated with the action
const fetchActionDetailsByActionId = async (actionId: string) => {
  try {
    const actionDetails = await stageElements.find(
      { id: actionId },
      { taskMessage: 1, resourceName: 1, _id: 0 }
    );
    if (!Array.isArray(actionDetails) || actionDetails.length === 0) {
      return { taskMessage: '', resourceName: '' };
    }

    const [taskMessage] = actionDetails.map((result) => result.taskMessage);
    const [resourceName] = actionDetails.map((result) => result.resourceName);

    if (taskMessage && resourceName) {
      return { taskMessage, resourceName };
    } else {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: taskMessages.noTaskMessage,
      });
    }
  } catch (error) {
    logErrorType(error, 1021);
    return Promise.reject(error);
  }
};

const replacePlaceholdersInTaskMessage = (
  actionDetails: { taskMessage: string; resourceName: string },
  contactDetails: IContact | null
) => {
  let replacedTaskMessage = actionDetails.taskMessage;
  let replacedTaskTitle = taskMessages.defaultTaskTitle;

  const placeholderValues: Record<string, string | undefined> = {
    resourceName: actionDetails.resourceName,
    contactFirstName: contactDetails?.firstName,
    contactLastName: contactDetails?.lastName,
  };

  // Replace each placeholder with its corresponding value
  Object.entries(commonContentPlaceholders).forEach(
    ([placeholder, placeholderText]) => {
      const value = placeholderValues[placeholder] || '';

      // Replace placeholders in task message
      replacedTaskMessage = replacedTaskMessage
        .split(placeholderText)
        .join(value);

      // Replace placeholders in task title
      replacedTaskTitle = replacedTaskTitle.split(placeholderText).join(value);
    }
  );

  return { taskMessage: replacedTaskMessage, taskTitle: replacedTaskTitle };
};

//To Log the exception
export const createTask = async (
  userId: string | number,
  contactId: string | number,
  actionId: string
) => {
  try {
    const currentDate = new Date();
    const formattedDateTime = formatDateTime(
      new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
    );
    const contactDetails = await fetchDetailsForAContact(contactId);
    const smDetails = await getScWithStage(
      contactDetails?.smartConnectorId as string
    );
    const actionDetails = await fetchActionDetailsByActionId(actionId);
    const taskDetails = replacePlaceholdersInTaskMessage(
      actionDetails,
      contactDetails
    );

    const headers = {
      apiOrigin: config.serverUrl,
    };
    axios({
      url: config.lumenUrl + apiUrls.tasksUrl,
      method: 'post',
      data: {
        accountId: smDetails?.accountId,
        userId: userId,
        contact_id: contactId,
        title: taskDetails.taskTitle,
        desc: taskDetails.taskMessage,
        task_time: formattedDateTime,
        createdBy: userId,
        is_all_day: 0,
      },
      headers: headers,
    })
      .then(function (response) {
        // do something
        logInfo({ message: 'createTask response', context: { response } });
      })
      .catch(function (error) {
        logErrorType(error, 1022, {
          contactId,
          userId,
          serverUrl: config.serverUrl,
          headers,
        });
        return Promise.reject(error);
      });
  } catch (error) {
    logErrorType(error, 1023, { contactId, userId });
    return Promise.reject(error);
  }
};

function formatDateTime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export const createContact = async (data: any) => {
  const existingContact = await ContactModel.findOne({
    contactId: data.contactId,
  });

  if (existingContact) {
    return existingContact;
  }

  const contact = new ContactModel({
    firstName: data.firstName || 'John',
    lastName: data.lastName || 'Doe',
    contactId: data.contactId || null,
  });

  return await contact.save();
};
