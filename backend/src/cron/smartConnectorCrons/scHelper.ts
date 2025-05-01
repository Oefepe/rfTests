import smDelayLog, {
  delayStatus,
  IScDelayLog,
} from '../../db/mongo/models/scDelayLogs';
import { logErrorType } from '../../utils/commonErrorLogging';
import HttpCode from '../../config/httpCode';
import smConnectContactLog, {
  elementStatus,
} from '../../db/mongo/models/scContactLog';
import { logInfo } from '../../services/log';
import { postScContactLog } from '../../services/scContactLog';
import ScContactLogDTO from '../../dto/ScContactLogDTO';
import { getCurrentUtcTime } from '../../utils/DateHelper';
import { nodeTypes } from '../../db/mongo/models/stageElements';

export async function getIncompleteScDelayLogs() {
  try {
    const incompleteDelayLogs = await smDelayLog
      .find({
        status: delayStatus.Incomplete,
        delayEndTime: { $lte: new Date() },
      })
      .exec();

    return incompleteDelayLogs;
  } catch (error) {
    logErrorType(error, 5014);
    return [];
  }
}

export function chunkArray(arr: IScDelayLog[], chunkSize: number) {
  const results = [];
  for (let counter = 0; counter < arr.length; counter += chunkSize) {
    results.push(arr.slice(counter, counter + chunkSize));
  }
  return results;
}

export async function processDelayLog(delayLog: IScDelayLog) {
  try {
    // Advance SC to process the delay log
    logInfo({
      message: 'Advance SC after delay. Here is delayLog: ',
      context: { delayLog },
    });
    const response = await advanceScAfterDelay(delayLog);

    // If advancing SC was successful, update delay log status
    if (response && response.success) {
      delayLog.status = delayStatus.Completed;
      await delayLog.save();
    }
  } catch (error) {
    logErrorType(error, 1055);
    return false;
  }
}

async function advanceScAfterDelay(delayLog: IScDelayLog) {
  try {
    // Create a Contact Log DTO object for advancing SC
    const scObjBody: ScContactLogDTO = {
      userId: delayLog.userId,
      smartConnectorId: delayLog.smartConnectorId,
      contactId: delayLog.contactId,
      stageId: '',
      elementId: delayLog.elementId,
      elementType: nodeTypes.Delay,
      assignTime: getCurrentUtcTime(),
      delayEndTime: delayLog.delayEndTime,
      status: elementStatus.Assigned,
    };

    const contactLog = await postScContactLog(scObjBody);
    logInfo({
      message: `Finished advancing SC. Contact Log Response: ${contactLog}`,
    });

    /* We can directly return true here since postScContactLog
       returns a promise. If there's any errors, it will reject
       the error and we will directly go to the catch block
    */
    return { success: true };
  } catch (error) {
    /*
      If we fail to advance SC, either the method call failed
      or delay is the last element of the smart connector
      We want to validate the failure isn't due to delay
      being the last element - we will remove this condition
      once we no longer allow delays to be last element
    */
    const statusCode = await handleDelayLastElement(delayLog);
    if (statusCode === HttpCode.OK) {
      return { success: true };
    }
    logErrorType(error, 1056);
    return { success: false };
  }
}

/* This is temporarily needed as currently there's no check
   to see if delay is last element
*/
async function handleDelayLastElement(delayLog: IScDelayLog) {
  const checkStatusOfDelay = await smConnectContactLog.findOne(
    {
      elementId: delayLog.elementId,
    },
    { status: 1, _id: 0 }
  );

  // If delay is completed, return OK status
  if (checkStatusOfDelay && checkStatusOfDelay.status == 2) {
    return HttpCode.OK;
  }

  return HttpCode.BAD_REQUEST;
}
