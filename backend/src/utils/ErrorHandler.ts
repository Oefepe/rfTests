import { Response } from 'express';
import HttpCode from '../config/httpCode';
import { commonErrorMessage } from '../config/messages';
import { RFNGError } from './error';

//Need to Improve

interface AppErrorArgs {
  message: string;
  statusCode: HttpCode;
  // description: string;
}

export class RFNGAppError extends RFNGError {
  statusCode: number;
  message: string;

  // description: string;

  constructor(args: AppErrorArgs) {
    super(9013, args.message);
    this.statusCode = args.statusCode;
    this.message = args.message || 'Error';
  }
}

const handleKnownExceptions = (error: RFNGAppError, response: Response) => {
  const { statusCode, message } = error;
  response.json({ status: statusCode, message: message });
};

const handleUnknownExceptions = (error: Error, response: Response) => {
  response.json({
    status: HttpCode.INTERNAL_SERVER_ERROR,
    message: commonErrorMessage.unexpectedError,
  });
};

export const customErrorHandler = (err: RFNGAppError, res: any) => {
  err instanceof RFNGAppError
    ? handleKnownExceptions(err, res)
    : handleUnknownExceptions(err, res);
};
