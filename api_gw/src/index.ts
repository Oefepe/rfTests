import express from 'express';
import { PORT } from './constants';
import { proxy } from './proxy';
import { logger } from './utils/logger';

const server = express();
server.use('/', proxy);

server
  .listen(PORT, () => {
    logger.info(`API Gateway running on port: ${PORT}`);
  })
  .on('error', (err) => {
    logger.error(err.message);
  });
