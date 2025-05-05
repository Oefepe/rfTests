import {NextFunction, Request, Response} from 'express';
import wrapAsync from '../../utils/asyncErrorHandle';
import HttpCode from '../../config/httpCode';
import {
  createContact,
  fetchScContactAssignedDetailsForContact,
  fetchScContactLogForContact,
  getScContactLogs,
  postScContactLog,
} from '../../services/scContactLog';
import ScContactLogDTO from '../../dto/ScContactLogDTO';
import {logInfo} from '../../services/log';

/**
 * Get the List of contact logs and it's associated smart-connectors
 */
export const getScContactWithLogs = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { contactId, connectorId } = req.params;
    const getAllLogs = await getScContactLogs(contactId, connectorId);
    return res.status(HttpCode.OK).json({ getAllLogs });
  }
);

/**
 * Get the Smart Connector Log for a contact
 */
export const getScContactLogForAContact = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const contactId = req.params.contactId;
    const connectorId = req.params.connectorId;

    const contactLog = await fetchScContactLogForContact(
      contactId,
      connectorId
    );
    return res.status(HttpCode.OK).json({ contactLog });
  }
);

/**
 * Get the Smart Connector assigned for a contact
 */
export const getScContactAssignedDetailsForAContact = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    logInfo({
      message: `getScContactAssignedDetailsForAContact method. Request: ${req}`,
    });
    const contactId = req.params.contactId;

    const contactLog = await fetchScContactAssignedDetailsForContact(contactId);
    return res.status(HttpCode.OK).json({ contactLog });
  }
);

/**
 * Assign smart connector, stage, and element id to a contact
 */
export const postScContactWithLogs = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const smartConnectorObj = new ScContactLogDTO(req.body);
    await createContact(req.body);
    const contactLog = await postScContactLog(smartConnectorObj);
    return res.status(HttpCode.OK).json(contactLog);
  }
);
