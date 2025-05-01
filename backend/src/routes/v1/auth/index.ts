import { Application } from 'express';
import { default as sessionRoutes } from './sessionRoutes';
import { default as emailRoutes } from './emailRoutes';
import { default as avbobRoutes } from './avbobRoutes';
import config from '../../../config/config';
import { logInfo } from '../../../services/log';
import { default as codeRoutes } from './codeRoutes';

const authApi = `${config.api_prefix}/auth`;

export const authRoutes = (app: Application) => {
  app.use(authApi, sessionRoutes);
  app.use(authApi, emailRoutes);
  app.use(authApi, avbobRoutes);
  app.use(authApi, codeRoutes);
  logInfo({ message: 'Authentication routes added' });
};
