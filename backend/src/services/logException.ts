import logExceptionModel from '../db/mongo/models/logExceptionModel';
import LogExceptionDTO from '../dto/LogExceptionDTO';
import { logErrorType } from '../utils/commonErrorLogging';

//To Log the exception
export const postException = async (
  exceptionMsg: LogExceptionDTO
): Promise<{}> => {
  try {
    const newErrorLog = new logExceptionModel(exceptionMsg);
    return await newErrorLog.save();
  } catch (error) {
    logErrorType(error, 1009);
    return Promise.reject(error);
  }
};
