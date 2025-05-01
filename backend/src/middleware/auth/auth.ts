import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import httpCode from '../../config/httpCode';
import { ResponseCode } from '../../entities';

const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error, user: Express.User) => {
      if (user) {
        req.user = user;
      } else {
        return res.status(httpCode.OK).json({
          status: ResponseCode.restricted,
          message: err?.message ?? 'Unauthorized',
        });
      }
      return next();
    }
  )(req, res, next);
};

export { authenticateJwt };
