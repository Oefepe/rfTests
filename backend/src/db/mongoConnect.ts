import mongoose from 'mongoose';
import config from '../config/config';
import { logInfo } from '../services/log';
import { logErrorType } from '../utils/commonErrorLogging';

/** Connect to Mongo DB */
export default {
  async connect() {
    mongoose.set('strictQuery', false);
    try {
      logInfo({
        message: 'Mongo Host Connection',
        context: { url: config.mongo.url },
      });
      await mongoose.connect(config.mongo.url, {
        retryWrites: true,
        w: 'majority',
      });
      logInfo({ message: 'Successfully connected to MongoDB!' });
    } catch (err) {
      logErrorType(err, 5001, {
        mongoUrl: config?.mongo?.url,
      });
    }
  },
};
