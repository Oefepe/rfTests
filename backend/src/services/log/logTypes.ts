import { Providers } from '../../entities';

export type LogContextType = { provider: Providers; username: string } & Record<
  string,
  unknown
>;

export enum AuthErrorCode {
  unprocessed = 3014,
  dataAccess = 3015,
  invalidCredentials = 3016,
  invalidData = 3017,
  accessRestricted = 3018,
}

export enum AuthLogMessages {
  unprocessed = 'Unprocessed result',
  dataAccess = 'Can\'t retrieve data from idp/db',
  invalidCredentials = 'Invalid credentials',
  invalidData = 'User data invalid',
  accessRestricted = 'Access restricted',
  login = 'User logged in',
  created = 'User created'
}
