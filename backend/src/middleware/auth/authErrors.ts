import { Request } from 'express';
import { AuthErrorCode, LogContextType, logError } from '../../services/log';
import { AuthCheck } from '../../entities';
import { IVerifyOptions } from 'passport-local';

interface AuthWarning {
  errorCode?: number;
  context: LogContextType;
  req: Request;
  done: (
    error: Error | null,
    user?: Express.User,
    options?: IVerifyOptions
  ) => void;
}

interface AuthError extends AuthWarning {
  error: unknown;
}

/**
 * Default error handler for all strategies to use it in the catch block
 * @param error {Error}
 * @param context {LogContextType}
 * @param req {Express.Request}
 * @param done {PassportJs done function}
 */
export const defaultAuthErrorHandler = ({
  error,
  context,
  req,
  done,
}: AuthError) => {
  const { message, stack } = error as Error;

  logError({
    errorCode: AuthErrorCode.unprocessed,
    message,
    stacktrace: stack,
    context,
  });

  req.params.checkResult = AuthCheck.error;
  return done(null, {});
};
