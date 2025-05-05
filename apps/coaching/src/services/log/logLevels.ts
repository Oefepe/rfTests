import { LeveledLogMethod, Logger } from 'winston';

export interface LogLevels extends Logger {
  api: LeveledLogMethod;
  trace: LeveledLogMethod;
}

export const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    api: 4,
    debug: 5,
    trace: 6,
    user_event: 7,
  },
  colors: {
    error: 'red',
    warn: 'magenta',
    info: 'blue',
    api: 'cyan',
    http: 'green',
    debug: 'yellow',
  },
};
