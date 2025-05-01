import { NextFunction, Request, Response } from 'express';
import HttpCode from '../config/httpCode';
import { commonErrorMessage } from '../config/messages';
import { logError } from '../services/log';

const validationError = (error: Error) => {
  const errorMsg = (error as any)?.errors;
  const validationErrors: { [key: string]: string } = {};

  (Object.keys(errorMsg) as Array<keyof typeof errorMsg>).reduce(
    (accumulator, current) => {
      validationErrors[errorMsg[current].path] = errorMsg[current].message;
      return accumulator;
    },
    [] as (typeof errorMsg)[keyof typeof errorMsg][]
  );

  return validationErrors;
};

function wrapAsync(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any | void>
) {
  return function (req: Request, response: Response, next: NextFunction) {
    fn(req, response, next).catch((exception: Error) => {
      const statusCode =
        (exception as any)?.statusCode || HttpCode.INTERNAL_SERVER_ERROR;
      let errorMsg =
        (exception as any)?.message || commonErrorMessage.unexpectedError;

      if ((exception as any)?.name === 'ValidationError') {
        errorMsg = validationError(exception);
      } else if ((exception as any)?.name === 'MongooseServerSelectionError') {
        return response.json({
          status: HttpCode.DB_CONNECTION_ERROR,
          message: commonErrorMessage.dbConnectionError,
        });
      }
      logError({
        errorCode: statusCode,
        message: exception.message,
        stacktrace: exception.stack,
      });
      return response.json({ status: statusCode, message: errorMsg });
    });
  };
}

export default wrapAsync;
