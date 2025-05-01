import { LOG_MASKED_KEYS } from '../../config';
import { logError } from '../../services';

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
  context: Record<string, unknown> = {}
) => {
  if (error instanceof Error) {
    logError({
      errorCode,
      message: error?.message,
      stacktrace: error?.stack,
      context: sanitizeKeys(context),
    });
    return;
  }

  logError({
    errorCode,
    message: 'Unknown error',
    stacktrace: JSON.stringify(error),
    context: sanitizeKeys(context),
  });
};
