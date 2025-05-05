import { Router } from 'express';
import {
  userCanChangePassword,
  userPasswordResetByAdmin,
  internalChangeEmail,
  userPasswordUpdate,
  internalUpdateUserByLegacyId,
  internalRemoveUserByLegacyId,
} from '../../../controllers/user/userController';
import {
  AuthSchemas,
  InternalSchemas,
  ValidateJoi,
} from '../../../middleware/validation';
import {Request, Response, NextFunction} from 'express'
import { logInfo } from '../../../services/log';

const internalUserRoutes = Router();

internalUserRoutes.get('/reset-password', userPasswordResetByAdmin);

internalUserRoutes.get(
  '/can-change-password',
  ValidateJoi(InternalSchemas.canChangePassword),
  userCanChangePassword
);

internalUserRoutes.post(
  '/change-password',
  ValidateJoi(AuthSchemas.pwdUpdate),
  userPasswordUpdate
);

internalUserRoutes.post('/change-email', internalChangeEmail);

internalUserRoutes.post(
  '/legacy-update-user',
  (req: Request, res: Response, next: NextFunction) => {
    logInfo({ message: `legacy-update-user body:, ${req.body}` });
    next()
  },
  ValidateJoi(InternalSchemas.legacyUpdateUser),
  internalUpdateUserByLegacyId
);

internalUserRoutes.delete(
  '/legacy-delete-user',
  ValidateJoi(InternalSchemas.legacyDeleteUser),
  internalRemoveUserByLegacyId
);

export { internalUserRoutes };
