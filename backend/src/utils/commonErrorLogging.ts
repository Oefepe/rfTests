import { LOG_MASKED_KEYS } from '../entities';
import { logError, logWarning } from '../services/log';
import { ErrorType, RFNGError } from './error';

export const sanitizeKeys = (obj: object): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      if (LOG_MASKED_KEYS.includes(k)) return [k, '***'];

      return [k, v === Object(v) ? sanitizeKeys(v) : v];
    })
  );
};

export const logErrorType = (
  error: unknown,
  errorCode: number,
  context: Record<string, unknown> = {},
  logType: ErrorType = ErrorType.Error
) => {
  // RFNGError logs by itself in c'tor.
  if (error instanceof RFNGError) return;

  if (logType === ErrorType.NoLogging) return;

  const logFunc = logType !== ErrorType.Error ? logWarning : logError;

  if (error instanceof Error) {
    logFunc({
      errorCode,
      message: error?.message,
      stacktrace: error?.stack,
      context: sanitizeKeys(context),
    });
    return;
  }

  logFunc({
    errorCode,
    message: 'Unknown error',
    stacktrace: JSON.stringify(error),
    context: sanitizeKeys(context),
  });
};
