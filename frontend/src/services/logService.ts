import log from 'loglevel';
import remote from 'loglevel-plugin-remote';
import { mixpanel } from '../services/MixPanel';
import { backendRoutes, config, TOKEN } from '../config';
import { LogRecordBase, LogRecordError } from '../models/Logs';

const deviceId = (): string => {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  let deviceId = localStorage.getItem('deviceId');

  if (!deviceId) {
    deviceId = `web-${uint32.toString(16)}`;
    localStorage.setItem('deviceId', deviceId);
  }

  return deviceId;
};

log.setLevel(config.loglevel as log.LogLevelDesc);

const payloadParser = (payload: string): Record<string, unknown> => {
  const parsed = JSON.parse(payload);
  const { message, context, stacktrace } = parsed;
  const result = {
    message,
    context,
    stacktrace: stacktrace ? stacktrace.replaceAll('\n', '') : stacktrace,
  };

  // Error code is present for error/warning.
  if (parsed?.errorCode) {
    return {
      ...result,
      errorCode: parsed.errorCode,
    };
  } else return result; //< info/user action doesn't have errorCode
};

const logScheme = (log: any) => ({
  deviceId: deviceId(),
  level: log.level.label,
  logger: log.logger,
  message: payloadParser(log.message).message,
  stacktrace: payloadParser(log.message).stacktrace,
  context: payloadParser(log.message).context,
  timestamp: log.timestamp,
  errorCode: payloadParser(log.message)?.errorCode,
  appVersion: config.version,
});

remote.apply(log, {
  format: logScheme,
  timestamp: () => new Date().toISOString(),
  url: backendRoutes.logs,
  method: 'POST',
  backoff: {
    strategy: 'exponential',
    initialDelay: 1000,
    maxDelay: 60 * 1000,
  },
});

export const logError = (
  params: Pick<
    LogRecordError,
    'errorCode' | 'message' | 'context' | 'stacktrace'
  >
) => {
  if (localStorage.getItem(TOKEN)) {
    remote.setToken(localStorage.getItem(TOKEN) as string);
  }
  log.getLogger('app').error('%j', params);
};

export const logWarning = (
  params: Pick<
    LogRecordError,
    'errorCode' | 'message' | 'context' | 'stacktrace'
  >
) => {
  if (localStorage.getItem(TOKEN)) {
    remote.setToken(localStorage.getItem(TOKEN) as string);
  }
  log.getLogger('app').warn('%j', params);
};

export const logInfo = (params: Pick<LogRecordBase, 'message' | 'context'>) => {
  if (localStorage.getItem(TOKEN)) {
    remote.setToken(localStorage.getItem(TOKEN) as string);
  }
  log.getLogger('user').info('%j', params);
};

export const logUserAction = (
  params: Pick<LogRecordBase, 'message' | 'context'>
) => {
  if (localStorage.getItem(TOKEN)) {
    remote.setToken(localStorage.getItem(TOKEN) as string);
    mixpanel.track(params.message, { context: params.context });
  }
  log.getLogger('user').info('%j', params);
};
