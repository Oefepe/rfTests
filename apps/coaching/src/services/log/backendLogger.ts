import { Application, NextFunction, Request, Response } from 'express';
import winston, { format } from 'winston';
import { LogLevels, logLevels } from './logLevels';
import { backendFormat, filterByLevel, httpFormat, appVersionFormat } from './logFormat';
import config from '../../config/config';
import path from 'path';
import fs from 'fs';
import { errorCodesSwitcher } from './errorCodesSwitcher';
import { LogRecordBase, LogRecordError } from '../../entities';

const { combine, timestamp, prettyPrint, simple, colorize, json } = format;

if (!fs.existsSync(config.logs.logFolder)) {
  fs.mkdirSync(config.logs.logFolder);
}

export const logger = <LogLevels>winston.createLogger({
  levels: logLevels.levels,
  transports: [
    new winston.transports.Console({
      level: config.env === 'local' ? 'debug' : 'http',
      format: combine(colorize(), simple(), appVersionFormat()),
    }),
    new winston.transports.File({
      filename: path.join(config.logs.logFolder, config.logs.api),
      level: 'api',
      format: combine(appVersionFormat(), filterByLevel('api'), timestamp(), prettyPrint(), json()),
      maxsize: config.logs.maxLogFileSize,
      maxFiles: config.logs.maxLogFileNumber,
      tailable: true,
      zippedArchive: true,
    }),
    new winston.transports.File({
      filename: path.join(config.logs.logFolder, config.logs.warning),
      level: 'warn',
      format: combine(appVersionFormat(), filterByLevel('warn'), timestamp(), backendFormat, json()),
      maxsize: config.logs.maxLogFileSize,
      maxFiles: config.logs.maxLogFileNumber,
      tailable: true,
      zippedArchive: true,
    }),
    new winston.transports.File({
      filename: path.join(config.logs.logFolder, config.logs.error),
      level: 'error',
      format: combine(appVersionFormat(), filterByLevel('error'), timestamp(), backendFormat, json()),
      maxsize: config.logs.maxLogFileSize,
      maxFiles: config.logs.maxLogFileNumber,
      tailable: true,
      zippedArchive: true,
    }),
    new winston.transports.File({
      filename: path.join(config.logs.logFolder, config.logs.info),
      level: 'user_event',
      format: combine(appVersionFormat(), filterByLevel('user_event'), timestamp(), backendFormat, json()),
      maxsize: config.logs.maxLogFileSize,
      maxFiles: config.logs.maxLogFileNumber,
      tailable: true,
      zippedArchive: true,
    }),
  ],
});

winston.addColors(logLevels.colors);

// logger functions with predefined options:
export const logError = ({
  errorCode,
  message,
  context,
  stacktrace,
}: Pick<LogRecordError, 'errorCode' | 'message' | 'context' | 'stacktrace'>) => {
  logger.log('error', message, { errorCode, context, stacktrace });
};

export const logWarning = ({
  errorCode,
  message,
  context,
  stacktrace,
}: Pick<LogRecordError, 'errorCode' | 'message' | 'context' | 'stacktrace'>) => {
  logger.log('warn', message, { errorCode, context, stacktrace });
};

export const logInfo = ({ message, context }: Pick<LogRecordBase, 'message' | 'context'>) => {
  logger.log('info', message, { context });
};

export const netLogs = (app: Application) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.http(httpFormat(req, res, 'request'));
    res.on('finish', () => {
      logger.http(httpFormat(req, res, 'response'));
    });
    next();
  });
};

export const errorLogs = (app: Application) => {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const errorCode = errorCodesSwitcher(err);
    logError({
      errorCode,
      message: err?.message,
      stacktrace: err?.stack,
    });
    next();
  });
};
