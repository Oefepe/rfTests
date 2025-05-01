import express from 'express';
import { default as emailPassport } from '../../../middleware/auth/emailStrategy';
import { default as avbobPassport } from '../../../middleware/auth/avbobStrategy';
import { default as netreadyPassport } from '../../../middleware/auth/netreadyStrategy';
import { AuthSchemas, ValidateJoi } from '../../../middleware/validation';
import { Providers } from '../../../entities';
import {
  checkEmail,
  checkLegacyUser,
  sendToken,
} from '../../../controllers/auth/authController';
import { logInfo } from '../../../services/log';
import config from '../../../config/config';

const router = express.Router();
router.post(
  '/email',
  (req, res, next) =>
    req.query.type === 'login'
      ? ValidateJoi(AuthSchemas.login)(req, res, next)
      : ValidateJoi(AuthSchemas.signupByMail)(req, res, next),
  (req, res, next) => {
    if (
      !(req.user as { id: string })?.id &&
      req.query.type !== 'signup' &&
      (!req.body.accountId ||
        req.body.accountId === config.auth.providers.avbob.accountId)
    ) {
      logInfo({ message: 'Trying AVBOB strategy.' });
      req.body.username = req.body.email;
      avbobPassport.authenticate(Providers.avbob)(req, res, next);
    } else {
      next();
    }
  },
  (req, res, next) => {
    if (
      !(req.user as { id: string })?.id &&
      req.query.type !== 'signup' &&
      (!req.body.accountId ||
        config.auth.providers.netready.some(
          (c) => c.accountId === req.body.accountId
        ))
    ) {
      logInfo({ message: 'Trying Netready strategy.' });
      req.body.username = req.body.email;
      netreadyPassport.authenticate(Providers.netready)(req, res, next);
    } else {
      next();
    }
  },
  (req, res, next) => {
    if (!(req.user as { id: string })?.id) {
      logInfo({ message: 'Trying Email strategy.' });
      const strategy = `email-${req.query.type}`;
      emailPassport.authenticate(strategy)(req, res, next);
    } else {
      next();
    }
  },
  sendToken
);

router.get('/email/verify', checkEmail);

router.post(
  '/email/verify',
  ValidateJoi(AuthSchemas.emailValidation),
  checkLegacyUser
);

export default router;
