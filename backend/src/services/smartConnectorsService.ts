import smartConnectors, {
  ISConnectors,
  IStage,
} from '../db/mongo/models/smartConnectors';
import { RFNGAppError } from '../utils/ErrorHandler';
import HttpCode from '../config/httpCode';
import { smartConnectorMsg } from '../config/messages';
import CryptoJS from 'crypto-js';
import { logErrorType } from '../utils/commonErrorLogging';

//Function to get All the smart connectors
export const getAll = async (accountId: number): Promise<ISConnectors[]> => {
  try {
    // 0 means ignore the column & 1 means fetch the column details.
    return await smartConnectors.find({ accountId: accountId }).select({
      _id: 0,
      id: 1,
      accountId: 1,
      name: 1,
      description: 1,
      isPublished: 1,
    });
  } catch (err) {
    logErrorType(err, 1027, { accountId });
    return Promise.reject(err);
  }
};

// Function to get all published smart connectors
export const getAllPublished = (accountId: number): Promise<ISConnectors[]> => {
  try {
    return smartConnectors
      .find({
        accountId,
        isPublished: true, // Add condition for isPublished: true
      })
      .select({
        _id: 0,
        id: 1,
        accountId: 1,
        name: 1,
        description: 1,
        isPublished: 1,
      })
      .exec();
  } catch (err) {
    logErrorType(err, 1028, { accountId });
    return Promise.reject(err);
  }
};

//Function to get the smart connectors with it's staged
export const getAllWithStages = async (): Promise<ISConnectors[]> => {
  try {
    // 0 means ignore the column & 1 means fetch the column details.
    return await smartConnectors.find({}).select({
      _id: 0,
      id: 1,
      accountId: 1,
      name: 1,
      description: 1,
      isPublished: 1,
      stages: { id: 1, name: 1, sequenceNumber: 1 },
    });
  } catch (err) {
    logErrorType(err, 1029);
    return Promise.reject(err);
  }
};

//To Create new Smart Connector
export const createSC = async (smartConnectorData: object): Promise<{}> => {
  try {
    const newSmartConnector = new smartConnectors(smartConnectorData);
    const smartConnector = await newSmartConnector.save();

    return newSmartConnector;
  } catch (error) {
    logErrorType(error, 1030);
    return Promise.reject(error);
  }
};

//To Delete new Smart Connector
export const deleteSC = async (id: string): Promise<{}> => {
  try {
    return await smartConnectors.deleteOne({ id: id });
  } catch (error) {
    logErrorType(error, 1031, { id });
    return Promise.reject(error);
  }
};

//Function to get smart connectors
export const getScWithStage = async (id: string) => {
  return await smartConnectors.findOne({ id: id }).select({
    _id: 0,
    id: 1,
    accountId: 1,
    name: 1,
    description: 1,
    isPublished: 1,
    stages: { id: 1, name: 1, sequenceNumber: 1 },
  });
};

//Function to get smart connectors
export const getStageById = async (connectorId: string, stageId: string) => {
  const smartConnector = await smartConnectors.findOne(
    { id: connectorId, 'stages.id': stageId },
    { 'stages.$': 1 }
  );

  if (smartConnector?.stages?.length == 1) {
    return smartConnector.stages[0];
  } else {
    throw new RFNGAppError({
      statusCode: HttpCode.UNPROCESSABLE_ENTITY,
      message: smartConnectorMsg.noStageFoundWithId,
    });
  }
};

//Function to get the smart connectors with it's staged for a particular smart connector
export const getStagesForaConnectorId = async (
  id: string
): Promise<ISConnectors | null> => {
  try {
    // 0 means ignore the column & 1 means fetch the column details.
    const smartConnector = await getScWithStage(id);

    if (!smartConnector) {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.noSmartConnectorFound,
      });
    } else {
      let existingStages: IStage[] = [];
      if (
        smartConnector.stages !== undefined &&
        smartConnector.stages.length > 0
      ) {
        existingStages = smartConnector.stages;
        //Sort By Sequence number
        existingStages.sort((b, a) => b.sequenceNumber - a.sequenceNumber);
      }

      smartConnector.stages = existingStages;
      return smartConnector;
    }
  } catch (err) {
    logErrorType(err, 1032, { id });
    return Promise.reject(err);
  }
};

export const updateStagesByConnectorId = async (
  smartConnectorId: string,
  stageId: string,
  stageData: IStage[]
): Promise<{} | null> => {
  try {
    const filter = { id: smartConnectorId, 'stages.id': stageId };
    const updatedSc = await smartConnectors.findOneAndUpdate(
      filter,
      {
        $set: { 'stages.$.name': stageData[0].name },
      },
      { new: true }
    );

    return updatedSc;
  } catch (error) {
    return Promise.reject(error);
  }
};

//Function to update the smart connector stages

export const updateScStages = async (
  smartConnectorId: string,
  stageData: IStage[]
): Promise<{} | null> => {
  try {
    const smartConnector = await getScWithStage(smartConnectorId);

    if (!smartConnector) {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.noSmartConnectorFound,
      });
    }

    let firstIndex = 1;
    let existingStages: IStage[] = [];

    // //For newly added stages
    if (
      smartConnector.stages !== undefined &&
      smartConnector.stages.length > 0
    ) {
      firstIndex = smartConnector.stages.length + 1;
      existingStages = smartConnector.stages;
    }

    //Update the ID and Sequence number
    if (stageData.length > 0) {
      stageData.forEach(function (item: IStage, index: number) {
        let sequenceNumber = index + firstIndex;
        const id =
          'sc-stages' +
          new Date().getTime() +
          smartConnectorId +
          sequenceNumber;
        item.id = CryptoJS.SHA256(id).toString();
        item.sequenceNumber = sequenceNumber;
      }, stageData);
    }

    //Combined existing stages and current stages
    let combinedStages = [...stageData, ...existingStages];

    //Sort By Sequence number
    combinedStages.sort((b, a) => b.sequenceNumber - a.sequenceNumber);

    const filter = { id: smartConnectorId };
    const update = { stages: combinedStages };
    const updatedSc = await smartConnectors.findOneAndUpdate(filter, update, {
      new: true,
    });

    return updatedSc;
  } catch (error) {
    logErrorType(error, 1033, { smartConnectorId, stageData });
    return Promise.reject(error);
  }
};

export const publishSC = async (
  smartConnectorId: string,
  payload: []
): Promise<{} | null> => {
  try {
    const smartConnector = await getScWithStage(smartConnectorId);

    if (!smartConnector) {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.noSmartConnectorFound,
      });
    }

    const filter = { id: smartConnectorId };
    const update = payload;
    const updatedSc = smartConnectors.findOneAndUpdate(filter, update, {
      new: true,
    });

    return updatedSc;
  } catch (error) {
    logErrorType(error, 1034, { smartConnectorId, payload });
    return Promise.reject(error);
  }
};
