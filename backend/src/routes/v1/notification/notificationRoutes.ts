import express from 'express';
import { sendSMS } from '../../../controllers/notification/notificationController';
import { Schemas, ValidateJoi } from '../../../middleware/validation';

const router = express.Router();

router.post('/send-sms', ValidateJoi(Schemas.sendSms), sendSMS);

export default router;
