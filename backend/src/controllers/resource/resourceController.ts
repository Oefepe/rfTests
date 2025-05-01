import { NextFunction, Request, Response } from 'express';
import resourceService from '../../services/resourceService';
import wrapAsync from '../../utils/asyncErrorHandle';
import HttpCode from '../../config/httpCode';
import { logErrorType } from '../../utils/commonErrorLogging';
import { createQRCode } from '../../features/externalApi';
import { getResourceDetailsById } from '../../features/legacyApi';

export const createResource = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accountId, category, type, ...otherParams } = req.body;

      const data = {
        accountId,
        category,
        type,
        ...otherParams,
      };

      await resourceService.createResourceFile(data);

      return res
        .status(HttpCode.CREATED)
        .json({ message: 'Resource created successfully' });
    } catch (error) {
      logErrorType(error, 1005);
      throw error;
    }
  }
);

//Function to get all the resource for specific type and category.
export const getResources = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accountId, category, type } = req.params;

    const directoryPath = resourceService.getResourceDirectory(
      accountId,
      category,
      type
    );

    try {
      const resources = await resourceService.readResourceFile(directoryPath);
      return res.status(HttpCode.OK).json({ resources });
    } catch (error) {
      logErrorType(error, 1005, { directoryPath });
      return res.status(HttpCode.OK).json({ resources: [] });
    }
  }
);

export const getResourceDetails = wrapAsync(
  async (req: Request, res: Response) => {
    const { resourceId, userId } = req.query as {
      userId: string;
      resourceId: string;
    };

    try {
      const resourceDetails = await getResourceDetailsById(resourceId, userId);
      return res.status(HttpCode.OK).json(resourceDetails);
    } catch (error) {
      logErrorType(error, 1074, { resourceId, userId });
      return res.status(HttpCode.OK).json({ resourceDetails: {} });
    }
  }
);

export const getQRCode = wrapAsync(async (req: Request, res: Response) => {
  const { url, size, color, bgColor } = req.query;

  try {
    const qrCodeUrl = createQRCode({
      url: String(url),
      size: String(size),
      color: String(color),
      bgColor: String(bgColor),
    });

    return res.status(HttpCode.OK).json({
      qrCodeUrl,
    });
  } catch (error) {
    logErrorType(error, 9022, { url });
  }
});
