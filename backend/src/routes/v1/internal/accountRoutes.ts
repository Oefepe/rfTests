import { Router } from 'express';
import { internalDeleteAccountByLegacyId } from '../../../controllers/user/userController';
import { InternalSchemas, ValidateJoi } from '../../../middleware/validation';

const internalAccountRoutes = Router();

internalAccountRoutes.delete(
  '/delete-account',
  ValidateJoi(InternalSchemas.deleteAccount),
  internalDeleteAccountByLegacyId
);

export { internalAccountRoutes };
