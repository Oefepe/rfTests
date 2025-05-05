import { Application } from 'express';
import { logInfo } from '../../../services/log';
import logRoutes from './logRoutes';
import config from '../../../config/config';

export const addLogRoutes = (app: Application) => {
  app.use(`${config.api_prefix}/log`, logRoutes);
  logInfo({ message: 'Log routes added' });
};
