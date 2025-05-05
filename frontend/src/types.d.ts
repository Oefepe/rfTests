declare module 'loglevel-plugin-remote' {
  type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

  interface BackoffOptions {
    strategy: 'linear' | 'exponential';
    initialDelay: number;
    maxDelay: number;
  }

  function format(
    level?: LogLevel,
    name?: string,
    timestamp?: string,
    message?: string
  ): void;

  interface RemoteOptions {
    format?: format;
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    backoff?: BackoffOptions;
    timestamp: () => void;
  }

  function apply(log: unknown, options: RemoteOptions): void;

  function setToken(token: string): void;

  export default {
    apply,
    json: typeof format,
    plain: typeof format,
    setToken,
  };
}
