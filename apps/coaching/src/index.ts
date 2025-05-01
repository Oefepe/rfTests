import app from './app';
import config from './config/config';
import { connectDB } from './db/mysql/mysqlConnect';

const PORT = config.server.port;

async function startServer() {
  try {
    // Connect to the mysql database
    await connectDB();

    //Start the express server
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed during application startup:', error);
  }
}

startServer();
