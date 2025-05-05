export type LogType = 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type LoggerType = 'user' | 'app' | 'backend';

export interface LogRecordBase {
  deviceId: string;
  message: string;
  level: LogType;
  logger: LoggerType;
  timestamp: string;
  context?: Record<string, unknown>;
  appVersion?: string;
}

export interface LogRecordError extends LogRecordBase {
  errorCode: number;
  stacktrace?: string;
}

export type LogRecordClient = Omit<LogRecordError, 'errorCode' | 'context'> &
  Partial<Pick<LogRecordError, 'errorCode'>> & {
    context?: Record<string, unknown> | string;
  };

export enum UserActions {
  navigate = 'navigate',
  button = 'button-press',
}
