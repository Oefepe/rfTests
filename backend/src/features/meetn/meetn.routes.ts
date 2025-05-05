import express from 'express';
import { createContact } from './meetn.controller';
import { authenticateJwt } from '../../middleware/auth/auth';
import { ValidateJoi } from '../../middleware/validation';
import { meetnValidation } from './meetn.validation';

const router = express.Router();

router.post(
  '/meetn/contact',
  authenticateJwt,
  ValidateJoi(meetnValidation.createContact),
  createContact
);

export default router;
