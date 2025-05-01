import express from 'express';
import { Schemas, ValidateJoi } from '../../middleware/validation';
import controller from '../../controllers/contactController';

const router = express.Router();

router.route('/').get(controller.getContacts);

router.route('/log-data').post(ValidateJoi(Schemas.ContactLog.logContactData),controller.logContactData);

export default router;
