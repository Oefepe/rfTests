import { Application } from 'express';
import qrCodeRoutes from './qrCodeRoutes';
import { logInfo } from '../../../services/log';
import config from '../../../config/config';

export const addQRCodeRoutes = (app: Application) => {
  app.use(`${config.api_prefix}`, qrCodeRoutes);
  logInfo({ message: 'QRCode routes added' });
};
