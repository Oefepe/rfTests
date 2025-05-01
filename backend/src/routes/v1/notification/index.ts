import { Application } from 'express';
import { logInfo } from '../../../services/log';
import config from '../../../config/config';
import notificationRoutes from './notificationRoutes';

export const addNotificationRoutes = (app: Application) => {
  app.use(`${config.api_prefix}/notifications`, notificationRoutes);
  logInfo({ message: 'Notification routes added' });
};
