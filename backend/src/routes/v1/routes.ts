import { Application } from 'express';
import { authRoutes } from './auth';
import { addLogRoutes } from './log';
import { addMailRoutes } from './mail';
import { addProtectedRoutes } from './protected';
import { addUserRoutes } from './user';
import { addInternalRoutes } from './internal';
import config from '../../config/config';
import { Env } from '../../entities';
import { addBrandingRoutes } from '../../features/branding';
import { addMeetnRoutes } from '../../features/meetn';
import { addNotificationRoutes } from './notification';
import { addQRCodeRoutes } from './qrCode';
import { addContactsRoutes } from './contacts';

export const addRoutes = (app: Application) => {
  authRoutes(app);
  addLogRoutes(app);
  addMailRoutes(app);
  if (config.env !== Env.production) {
    // todo: remove when protected routes finished
    addProtectedRoutes(app);
  }
  addUserRoutes(app);
  addBrandingRoutes(app);
  addMeetnRoutes(app);
  addInternalRoutes(app);
  addNotificationRoutes(app);
  addQRCodeRoutes(app);
  addContactsRoutes(app);
};
