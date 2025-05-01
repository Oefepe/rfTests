import dotenv from 'dotenv';

dotenv.config({});

const env = process.env;

export const PORT = Number(env.PORT) || 4000;
export const RFNG = env.RNFG || 'http://rfng-backend-service:3100';
export const AUTH = env.AUTH || `http://${RFNG}/api/auth`;
export const LOGGING = env.LOGGING || `http://${RFNG}/api/log`;
export const NOTIFICATIONS = env.NOTIFICATIONS || `http://notifications:4000`;
export const COACHING = env.COACHING || `http://coaching:5000`;
