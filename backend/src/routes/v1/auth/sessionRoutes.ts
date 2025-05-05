import express from 'express';
import {
  finishSignup,
  logout,
  sendUser,
  updateRevision,
} from '../../../controllers/auth/authController';
import { authenticateJwt } from '../../../middleware/auth/auth';
import { AuthSchemas, ValidateJoi } from '../../../middleware/validation';
import {
  userPasswordResetRequest,
  userPasswordResetWithToken,
  userPasswordUpdate,
  userPasswordResetLinkRequest
} from '../../../controllers/user/userController';

const router = express.Router();

router.get('/session', authenticateJwt, sendUser);

router.get('/logout', logout);

router.put(
  '/finish-signup',
  authenticateJwt,
  ValidateJoi(AuthSchemas.finishSignup),
  finishSignup
);

router.post(
  '/reset-pwd-request',
  ValidateJoi(AuthSchemas.pwdRequest),
  userPasswordResetRequest
);

router.post(
  '/reset-pwd-request-link',
  ValidateJoi(AuthSchemas.pwdRequest),
  userPasswordResetLinkRequest
);

router.post(
  '/reset-pwd-token',
  ValidateJoi(AuthSchemas.pwdConfirmWithToken),
  userPasswordResetWithToken
);

router.put(
  '/update-pwd',
  authenticateJwt,
  ValidateJoi(AuthSchemas.pwdUpdate),
  userPasswordUpdate
);

router.put(
  '/update-revision',
  authenticateJwt,
  ValidateJoi(AuthSchemas.revisionUpdate),
  updateRevision
);

export default router;
