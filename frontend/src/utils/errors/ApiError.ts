import { ResponseCode } from '../../config';
import { logError, logInfo, logWarning } from '../../services';
import { sanitizeKeys } from './commonErrorLogging';

export enum ErrorType {
  Error,
  Warning,
  Info,
  NoLogging, //< Use it only in special cases
}

export class RFNGError extends Error {
  constructor(
    public readonly errorCode: number,
    public readonly message: string = '',
    public readonly context: Record<string, unknown> = {},
    logType: ErrorType = ErrorType.Error
  ) {
    super(message);

    switch (logType) {
      case ErrorType.Warning:
        logWarning({
          errorCode,
          message,
          stacktrace: JSON.stringify(this.stack),
          context: sanitizeKeys(context),
        });
        break;
      case ErrorType.Info:
        logInfo({
          message,
          context: sanitizeKeys({ errorCode, ...context }),
        });
        break;
      case ErrorType.NoLogging:
        break;
      case ErrorType.Error:
        logAsError(this.stack);
        break;
      default:
        logError({
          errorCode: 1,
          message: `Invalid logType`,
          context: { logType },
          stacktrace: JSON.stringify(this.stack),
        });
        logAsError(this.stack);
        break;
    }

    function logAsError(stack: string | undefined) {
      logError({
        errorCode,
        message,
        stacktrace: JSON.stringify(stack),
        context: sanitizeKeys(context),
      });
    }
  }
}

export class RFNGApiError extends RFNGError {
  constructor(
    errorCode: number,
    public readonly status: ResponseCode | number,
    message = '',
    logType: ErrorType = ErrorType.Error,
    context: Record<string, unknown> = {}
  ) {
    super(errorCode, message, { status, ...context }, logType);
  }
}
