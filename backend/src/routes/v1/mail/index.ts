import { Application } from 'express';
import { logInfo } from '../../../services/log';
import logRoutes from './mailRoutes';
import config from '../../../config/config';

export const addMailRoutes = (app: Application) => {
  app.use(`${config.api_prefix}/mail`, logRoutes);
  logInfo({ message: 'Mail routes added' });
};
