import express from 'express';
import { Schemas, ValidateJoi } from '../../middleware/validation';
import {
  getScContactAssignedDetailsForAContact,
  getScContactLogForAContact,
  getScContactWithLogs,
  postScContactWithLogs,
} from '../../controllers/smartconnector/contactLog';

const scContactLogsRoutes = express.Router();

scContactLogsRoutes.get('/:contactId/:connectorId', getScContactWithLogs);
scContactLogsRoutes.post(
  '/',
  ValidateJoi(Schemas.scContactLog.create),
  postScContactWithLogs
);
scContactLogsRoutes.get('/:contactId/:connectorId', getScContactLogForAContact);
scContactLogsRoutes.get('/:contactId', getScContactAssignedDetailsForAContact);

export default scContactLogsRoutes;
