import { NextFunction, Request, Response } from 'express';
import { getAll, createSC, getAllPublished, publishSC, deleteSC } from '../../services/smartConnectorsService';
import {
  fetchActionForAContact,
  fetchDelayForAContact,
  postScContactLog,
} from '../../services/scContactLog';

import wrapAsync from '../../utils/asyncErrorHandle';
import HttpCode from '../../config/httpCode';
import SmartConnectorDTO from '../../dto/SmartConnectorDTO';

/**
 * Get the List Of Published SmartConnectors
 */
export const getSmartConnectors = wrapAsync(
  async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const SmartConnectors = await getAllPublished(parseInt(accountId));
    return res.status(HttpCode.OK).json({ SmartConnectors });
  }
);

/**
 * Get the List Of All SmartConnectors
 */
export const getAllSmartConnectors = wrapAsync(
  async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const SmartConnectors = await getAll(parseInt(accountId));
    return res.status(HttpCode.OK).json({ SmartConnectors });
  }
);

/**
 * Create a new SmartConnector
 */
export const createSmartConnector = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const smartConnectorObj = new SmartConnectorDTO(req.body);
    const smartConnector = await createSC(smartConnectorObj);
    res.status(HttpCode.CREATED).json(smartConnector);
  }
);

/**
 * Delete a new SmartConnector
 */
export const deleteSmartConnector = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const smartConnectorId = req.params.smartConnectorId;
    const smartConnector = await deleteSC(smartConnectorId);
    res.status(HttpCode.CREATED).json(smartConnector);
  }
);

//To Execute a action
export const executedAction = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: { actionId: string; userId: string; contactId: string } =
      req.body;

    //Validate if the contact is assigned with the action Id or not and get the smart connector details
    const connectorDetails = await fetchActionForAContact(
      reqBody.actionId,
      reqBody.contactId,
      reqBody.userId
    );

    //Update the contact with the latest element if present and update the current element status as executed
    const contactLog = await postScContactLog(connectorDetails);
    res.status(HttpCode.OK).json({ contactLog });
  }
);

//To execute a delay
export const finishDelay = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: { delayId: string; userId: string; contactId: string } =
      req.body;

    //Validate if the contact is assigned with the action Id or not and get the smart connector details
    const connectorDetails = await fetchDelayForAContact(
      reqBody.delayId,
      reqBody.contactId,
      reqBody.userId
    );

    //Update the contact with the latest element if present and update the current element status as executed
    const contactLog = await postScContactLog(connectorDetails);
    res.status(HttpCode.OK).json({ contactLog });
  }
);

/**
 * Publish a SmartConnector
 */
export const publishSmartConnector = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const smartConnectorId = req.params.smartConnectorId;
    const smartConnector = await publishSC(smartConnectorId, req.body);
    res.status(HttpCode.OK).json(smartConnector);
  }
);
