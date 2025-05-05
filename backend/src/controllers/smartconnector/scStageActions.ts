import {NextFunction, Request, Response} from 'express';

import wrapAsync from '../../utils/asyncErrorHandle';
import HttpCode from '../../config/httpCode';

import {
  createActionForAStage,
  getActionDetails,
  getTheStageElements,
  updateActionForAStage,
} from '../../services/scStageActionService';
import {getTheStageDetailWithSC} from '../../services/scStagesService';
import StageElementDTO from '../../dto/StageElementDTO';

/**
 * Create action for a stage for a smart connector
 */
export const postActionForAStage = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const smartConnectorId = req.params.id;
    const stageId = req.params.stageId;
    const actionId = req.body.id;

    // validate smartConnectorId and stageId
    await getTheStageDetailWithSC(smartConnectorId, stageId);

    const stageActionObj = new StageElementDTO(
      smartConnectorId,
      stageId,
      req.body
    );

    if (actionId) {
      const stageAction = await updateActionForAStage(actionId, stageActionObj);
      return res.status(HttpCode.OK).json(stageAction);
    } else {
      const stageAction = await createActionForAStage(stageActionObj);
      return res.status(HttpCode.OK).json(stageAction);
    }
  }
);

/**
 * Create action for a stage for a smart connector
 */
export const getDetailsForStage = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const smartConnectorId = req.params.id;
    const stageId = req.params.stageId;

    // validate smartConnectorId and stageId
    const stageElements = await getTheStageElements(smartConnectorId, stageId);

    return res.status(HttpCode.OK).json({ stageElements });
  }
);

/**
 * Get the details for an action
 */
export const getDetailsForAction = wrapAsync(
  async (req: Request, res: Response) => {
    const stageElements = await getActionDetails(req.params.id);
    return res.status(HttpCode.OK).json({ stageElements });
  }
);
