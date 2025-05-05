import { internalUserRoutes } from './userRoutes';
import { Application } from 'express';
import { logInfo } from '../../../services/log';
import { internalAccountRoutes } from './accountRoutes';

export const addInternalRoutes = (app: Application) => {
  app.use('/internal', internalUserRoutes);
  app.use('/internal/accounts', internalAccountRoutes);
  logInfo({ message: 'Internal routes added' });
};
