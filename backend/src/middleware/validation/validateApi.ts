import { ResponseCode } from '../../entities';
import { Application, NextFunction, Request, Response } from 'express';
import HttpCode from '../../config/httpCode';
import { logInfo, logWarning } from '../../services/log';

export const invalidJsonHandler = (app: Application) => {
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (
      error instanceof SyntaxError &&
      'type' in error &&
      error.type === 'entity.parse.failed'
    ) {
      logWarning({
        errorCode: 3019,
        message: 'Invalid JSON in the request body',
        context: {
          url: req.url,
          method: req.method,
          body: 'body' in error ? error.body : {},
        },
      });
      res.status(HttpCode.OK).json({ status: ResponseCode.badRequest });
    } else {
      next();
    }
  });
};

export const notExistHandler = (app: Application) => {
  app.use((req: Request, res: Response) => {
    logInfo({
      message: 'Resource not found',
      context: { url: req.url, method: req.method },
    });
    res.status(HttpCode.OK).json({
      status: ResponseCode.notFound,
    });
  });
};
