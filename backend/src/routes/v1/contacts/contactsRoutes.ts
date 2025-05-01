import express from 'express';
import { getContactsCount } from '../../../controllers/contacts/contactsController';
import { authenticateJwt } from '../../../middleware/auth/auth';

const router = express.Router();

router.get('/contacts-count', authenticateJwt, getContactsCount);

export default router;
