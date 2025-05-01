import connectDB from '../db/connection';
import app from './startServer';
import config from '../config/config';
import { logInfo } from '../services/log';

const PORT = config.server.port;

//Connect to the database
connectDB();

//Start the express server
app.listen(PORT, () => {
  logInfo({ message: `Server is listening on port ${PORT}` });
});

