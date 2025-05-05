import mongoConnect from './mongoConnect';
import config from '../config/config';
import { logInfo } from '../services/log';
import { logErrorType } from '../utils/commonErrorLogging';

const connectDB = () => {
  try {
    if (config.dbProvider === 'mongo') {
      mongoConnect.connect();
    } else {
      logInfo({
        message:
          'Please provide your database provider such as mongo, mySql etc.',
      });
    }
  } catch (err) {
    logErrorType(err, 5000, {
      // partly config to avoid secured data logging
      dbProvider: config?.dbProvider,
      mongoUrl: config?.mongo?.url,
      mongoUsername: config?.mongo?.auth?.username,
    });
  }
};

export default connectDB;
