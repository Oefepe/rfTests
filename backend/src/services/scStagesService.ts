import smartConnectors, {
  ISConnectors,
} from '../db/mongo/models/smartConnectors';
import { RFNGAppError } from '../utils/ErrorHandler';
import HttpCode from '../config/httpCode';
import { smartConnectorMsg } from '../config/messages';
import { logErrorType } from '../utils/commonErrorLogging';

//Function to get smart connectors
const getTheStageWithSC = async (smartConnectorId: string, stageId: string) => {
  return await smartConnectors
    .findOne({ id: smartConnectorId, 'stages.id': stageId })
    .select({
      _id: 0,
      id: 1,
      accountId: 1,
      name: 1,
      description: 1,
      stages: { id: 1, name: 1, sequenceNumber: 1 },
    });
};

//Function to get the smart connectors with it's staged for a particular smart connector
export const getTheStageDetailWithSC = async (
  smartConnectorId: string,
  stageId: string
): Promise<ISConnectors | null> => {
  try {
    // 0 means ignore the column & 1 means fetch the column details.
    const smartConnector = await getTheStageWithSC(smartConnectorId, stageId);

    if (!smartConnector) {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.noScOrStageFound,
      });
    } else {
      return smartConnector;
    }
  } catch (err) {
    logErrorType(err, 1026, { smartConnectorId, stageId });
    return Promise.reject(err);
  }
};
