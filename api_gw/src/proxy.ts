import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response } from 'express';
import { RFNG } from './constants';
import { logger } from './utils/logger';
import { authCheck } from './utils/authCheck';

export const proxy = createProxyMiddleware<Request, Response>({
  target: RFNG,
  changeOrigin: true,
  logger,
  router: authCheck,
});
