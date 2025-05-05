import express from 'express';
import { Schemas, ValidateJoi } from '../../middleware/validation';

import {
  createSmartConnector,
  deleteSmartConnector,
  executedAction,
  finishDelay,
  getAllSmartConnectors,
  getSmartConnectors,
  publishSmartConnector,
} from '../../controllers/smartconnector/smartConnectors';

import {
  getSmartConnectorsWithStage,
  getStagesByConnectorId,
  postStagesByConnectorId,
  updateStageById,
} from '../../controllers/smartconnector/scStages';

import {
  getDetailsForAction,
  getDetailsForStage,
  postActionForAStage,
} from '../../controllers/smartconnector/scStageActions';

const connectorRoutes = express.Router();
connectorRoutes.patch('/:smartConnectorId', publishSmartConnector);
connectorRoutes.delete('/:smartConnectorId', deleteSmartConnector);
connectorRoutes.get('/:accountId', getSmartConnectors);
connectorRoutes.get('/:accountId/all', getAllSmartConnectors);
connectorRoutes.post('/', createSmartConnector);
connectorRoutes.get('/stages', getSmartConnectorsWithStage);
connectorRoutes.get('/:id/stages', getStagesByConnectorId);
connectorRoutes.post(
  '/:id/stages',
  ValidateJoi(Schemas.scStages.create),
  postStagesByConnectorId
);
connectorRoutes.patch(
  '/:id/stages/:stageId',
  ValidateJoi(Schemas.scStages.create),
  updateStageById
);

connectorRoutes.post(
  '/:id/stages/:stageId/actions',
  ValidateJoi(Schemas.scStageAction.create),
  postActionForAStage
);

connectorRoutes.post(
  '/:id/stages/:stageId/actions',
  ValidateJoi(Schemas.scStageAction.create),
  postActionForAStage
);

connectorRoutes.get('/:id/stages/:stageId/actions', getDetailsForStage);

connectorRoutes.get('/:id/action', getDetailsForAction);

//To execute an action
connectorRoutes.post(
  '/executedAction',
  ValidateJoi(Schemas.scStageAction.executedAction),
  executedAction
);

//To Execute a delay . It will be called from a cron
connectorRoutes.post(
  '/finishDelay',
  ValidateJoi(Schemas.scStageAction.finishDelay),
  finishDelay
);

export default connectorRoutes;
