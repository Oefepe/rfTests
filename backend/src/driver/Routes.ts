import { Application } from 'express';
import connectorRoutes from '../routes/v1/smartConnectorsRoute';
import statistics from '../routes/v1/statistics';
import contactRoutes from '../routes/v1/contactRoute';
import scContactLogRoutes from '../routes/v1/scContactLogs';
import exceptionLogRoutes from '../routes/v1/logExceptionRoute';
import resourceRoutes from '../routes/v1/resourceRoute';

const statisticsRoute = '/statistics';
const connectorRoute = '/api/smart-connectors';
const scContactLogsRoute = '/api/sc-contact-logs';
const exceptionLogRoute = '/api/log-exception';
const resourceRoute = '/api/resources';

class Routes {
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  setRoutes() {
    // We can use the auth middleware once we get the JWT token
    this.app.use(statisticsRoute, statistics);
    this.app.use('/contacts', contactRoutes);
    this.app.use(connectorRoute, connectorRoutes);
    this.app.use(scContactLogsRoute, scContactLogRoutes);
    this.app.use(exceptionLogRoute, exceptionLogRoutes);
    this.app.use(resourceRoute, resourceRoutes);
  }
}

export default Routes;
