import {NextFunction, Request, Response} from 'express';
import wrapAsync from '../../utils/asyncErrorHandle';
import HttpCode from '../../config/httpCode';
import {
  getAllWithStages,
  getStagesForaConnectorId,
  updateScStages,
  updateStagesByConnectorId,
} from '../../services/smartConnectorsService';

/**
 * Get the List Of SmartConnectors with the stages
 */
export const getSmartConnectorsWithStage = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const SmartConnectors = await getAllWithStages();
    return res.status(HttpCode.OK).json({ SmartConnectors });
  }
);

/**
 * Get the List Of SmartConnectors with the stages for a particular SmartConnector
 */
export const getStagesByConnectorId = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const connectorId = req.params.id;
    const SmartConnectors = await getStagesForaConnectorId(connectorId);
    return res.status(HttpCode.OK).json({ SmartConnectors });
  }
);

/**
 * Create stages for a smart connector
 */
export const postStagesByConnectorId = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const connectorId = req.params.id;

    const SmartConnectors = await updateScStages(connectorId, req.body);
    return res.status(HttpCode.OK).json(SmartConnectors);
  }
);

/**
 * Update stages for a smart connector
 */
export const updateStageById = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const connectorId = req.params.id;
    const stageId = req.params.stageId;

    const SmartConnectors = await updateStagesByConnectorId(
      connectorId,
      stageId,
      req.body
    );
    return res.status(HttpCode.OK).json(SmartConnectors);
  }
);
