import { default as userRoutes } from './userRoutes';
import { Application } from 'express';
import { logInfo } from '../../../services/log';
import config from '../../../config/config';

export const addUserRoutes = (app: Application) => {
  app.use(`${config.api_prefix}/user`, userRoutes);
  logInfo({ message: 'User routes added' });
};
