import express, { NextFunction, Request, Response } from 'express';
import passport from '../../../middleware/auth/jwtStrategy';
import { LogsSchemas, ValidateJoi } from '../../../middleware/validation';
import { parseClientLogs } from '../../../controllers/log/logController';
import { logUserEvents } from '../../../controllers/log/logController';

const router = express.Router();

const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error, user: Express.User) => {
      if (user) {
        req.user = user;
      }
      return next();
    }
  )(req, res, next);
};

router.post(
  '/',
  authenticateJwt,
  ValidateJoi(LogsSchemas.clientLog),
  parseClientLogs
);

router.post('/log-user-event', logUserEvents);

export default router;
