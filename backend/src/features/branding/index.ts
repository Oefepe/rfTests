import { Application } from 'express';
import config from '../../config/config';
import { logInfo } from '../../services/log';
import brandingRoutes from './branding.routes';

export const addBrandingRoutes = (app: Application) => {
  app.use(`${config.api_prefix}`, brandingRoutes);
  logInfo({ message: 'Branding routes added' });
};
