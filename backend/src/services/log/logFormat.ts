import { format } from 'winston';
import { Request, Response } from 'express';
import { hostname } from 'os';
import config from '../../config/config';

const { printf } = format;

export const filterByLevel = (level: string) => {
  return format((info) => {
    if (info.level === level) return info;
    return false;
  })();
};

export const httpFormat = (
  req: Request,
  res: Response,
  type: 'request' | 'response'
) => {
  const {
    method,
    url,
    originalUrl,
    socket: { remoteAddress },
  } = req;
  const { statusCode } = res;
  if (type === 'request') {
    return `Request: ${method} URL: [${url}] - IP: [${remoteAddress}]`;
  } else {
    return `Response: ${method} URL: [${originalUrl}] - IP: [${remoteAddress}] - STATUS: [${statusCode}]`;
  }
};

export const clientFormat = printf(({ level, message, timestamp, ...rest }) => {
  const { errorCode, deviceId, logger, stacktrace, context } = rest;

  const result = ['{\n', '}'];

  Object.entries({
    logger,
    deviceId,
    level,
    timestamp,
    message,
    context,
    errorCode,
    stacktrace,
  }).forEach(([key, value]) => {
    if (value) {
      if (key === 'context' && typeof value !== 'string') {
        value = JSON.stringify(value);
      }
      result.splice(-1, 0, `\t${key}: '${value}'\n`);
    }
  });
  return result.join('');
});

export const backendFormat = printf(
  ({ level, message, timestamp, ...rest }) => {
    const { errorCode, stacktrace, context } = rest;

    const result = ['{\n', '}'];

    Object.entries({
      logger: 'backend',
      deviceId: hostname(),
      level,
      timestamp,
      message,
      context,
      errorCode,
      stacktrace: stacktrace && stacktrace.replaceAll('\n', ''),
    }).forEach(([key, value]) => {
      if (value) {
        if (key === 'context' && typeof value !== 'string') {
          value = JSON.stringify(value);
        }
        result.splice(-1, 0, `\t${key}: '${value}'\n`);
      }
    });
    return result.join('');
  }
);

export const appVersionFormat = format((info) => {
  info.appVersion = config.version;
  return info;
});
