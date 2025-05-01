import express from 'express';
import passport from '../../../middleware/auth/avbobStrategy';
import { sendToken } from '../../../controllers/auth/authController';
import { AuthSchemas, ValidateJoi } from '../../../middleware/validation';

const router = express();

router.post(
  '/avbob',
  ValidateJoi(AuthSchemas.netReadyValidation),
  passport.authenticate('avbob'),
  sendToken);

export default router;
