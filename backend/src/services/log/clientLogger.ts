import winston, { format } from 'winston';
import { logLevels } from './logLevels';
import config from '../../config/config';
import fs from 'fs';
import path from 'path';
import { clientFormat } from './logFormat';

const { combine, timestamp, json, colorize, simple } = format;

export const clientLogger = (userId?: string, logger = 'app') => {
  const clientFolder = userId ?? 'unknown';
  const actionsFolder = logger === 'user' ? 'actions' : '';
  const clientFolderPath = path.join(
    config.logs.logFolder,
    clientFolder,
    actionsFolder
  );

  if (!fs.existsSync(clientFolderPath)) {
    fs.mkdirSync(clientFolderPath, { recursive: true });
  }

  return winston.createLogger({
    levels: logLevels.levels,
    transports: [
      new winston.transports.Console({
        level: config.env === 'local' ? 'debug' : 'http',
        format: combine(colorize(), simple()),
      }),
      new winston.transports.File({
        filename: `${path.join(
          clientFolderPath,
          new Date().toISOString().slice(0, 10)
        )}.jsonl`,
        format: combine(timestamp(), clientFormat, json()),
      }),
    ],
  });
};
