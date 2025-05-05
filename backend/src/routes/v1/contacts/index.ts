import { Application } from 'express';
import { logInfo } from '../../../services/log';
import config from '../../../config/config';
import contactsRoutes from './contactsRoutes';

export const addContactsRoutes = (app: Application) => {
  app.use(`${config.api_prefix}/contacts`, contactsRoutes);
  logInfo({ message: 'Contacts routes added' });
};
