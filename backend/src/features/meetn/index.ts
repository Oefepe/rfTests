import { Application } from 'express';
import config from '../../config/config';
import { logInfo } from '../../services/log';
import meetnRoutes from './meetn.routes';

export const addMeetnRoutes = (app: Application) => {
  app.use(`${config.api_prefix}`, meetnRoutes);
  logInfo({ message: 'Meetn routes added' });
};
