import express from 'express';
import {
  getContactStageTransition,
  getContactsTimeInStage,
  getContactsTransition,
  getContactsTransitionTime,
  getInactiveContacts,
  getTransitionActionCount,
} from '../../controllers/Statistics';

const router = express.Router();

router.get('/inactive-contacts', getInactiveContacts);

router.get('/transitioned-contacts', getContactsTransition);

router.get('/contacts-time-in-stage', getContactsTimeInStage);

router.get('/contact-stage-transition', getContactStageTransition);

router.get('/transition-action-count', getTransitionActionCount);

router.get('/contacts-transition-time', getContactsTransitionTime);

export default router;
