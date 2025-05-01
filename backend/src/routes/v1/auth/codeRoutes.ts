import express from 'express';
import { checkGroupCode } from '../../../controllers/auth/authController';
import { AuthSchemas, ValidateJoi } from '../../../middleware/validation';

const router = express.Router();

router.get(
  '/code/verify',
  ValidateJoi(AuthSchemas.codeValidation),
  checkGroupCode
);

export default router;
