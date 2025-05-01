import { proxyRoutes } from '../routes';
import { RFNG } from '../constants';
import { Request } from 'express';

export const authCheck = async (req: Request) => {
  const authHeader = req.headers.authorization;
  const path = req.path;

  const route = proxyRoutes.find((route) => {
    return path.startsWith(route.path);
  });

  const publicRoute = route && route.accessTag === 'public';

  if (!publicRoute && !authHeader) {
    // TODO: Authentication logic here
  }
  return route?.server || RFNG;
};
