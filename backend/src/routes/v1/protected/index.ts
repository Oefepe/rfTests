import { default as protectedRoutes } from './protectedRoutes';
import { Application } from 'express';
import { logInfo } from '../../../services/log';

export const addProtectedRoutes = (app: Application) => {
  app.use('/protected', protectedRoutes);
  logInfo({ message: 'Protected routes added' });
};
