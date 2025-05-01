import app from './app';
import config from './config/config';

const PORT = config.server.port;

//Start the express server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
