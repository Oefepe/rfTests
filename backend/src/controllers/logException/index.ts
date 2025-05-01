import {NextFunction, Request, Response} from 'express';
import LogExceptionDTO from '../../dto/LogExceptionDTO';
import {postException} from '../../services/logException';

import wrapAsync from '../../utils/asyncErrorHandle';
import HttpCode from '../../config/httpCode';

/**
 * Post and make a record in the mongo db
 */
export const logException = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const logExceptionObj = new LogExceptionDTO(req.body);
    const status = await postException(logExceptionObj);
    return res.status(HttpCode.OK).json(status);
  }
);
