import { Request } from 'express';
import config from '../config/config';

export const defineMobile = (req: Request) => {
  const mobileRegexp = /AppRF/;
  return mobileRegexp.test(req.headers['user-agent'] || '');
};

export const genRedirectBaseUrl = (req: Request) => {
  return defineMobile(req)
    ? `${config.auth.mobileClient}?user=`
    : `${config.auth.webClient}/auth/user?`;
};
