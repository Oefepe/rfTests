import dotenv from 'dotenv';
import process from 'node:process';
import { Prisma } from '@prisma/client';

dotenv.config({ path: `.env.${process.env.NODE_ENV?.trim()}` });

const env = process.env.NODE_ENV?.trim();

const MYSQL_USERNAME = process.env.MYSQL_USERNAME || '';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
const MYSQL_DB = process.env.MYSQL_DB || '';
const MYSQL_HOST = process.env.MYSQL_HOST || '';

const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const LOG_FOLDER = process.env.LOG_FOLDER;
const LOG_ERROR = process.env.LOG_ERROR;
const LOG_INFO = process.env.LOG_INFO;
const LOG_WARNING = process.env.LOG_WARNING;
const LOG_PRIVATE_API = process.env.LOG_PRIVATE_API;
const LOG_MAX_FILE_SIZE = Number(process.env.LOG_MAX_FILE_SIZE);
const LOG_MAX_FILE_NUMBER = Number(process.env.LOG_MAX_FILE_NUMBER);

const PRISMA_LOG_LEVEL: Prisma.LogLevel[] = ['info', 'warn', 'error'];

const config = {
  env: env,
  server: {
    port: SERVER_PORT,
  },
  mysql: {
    username: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    host: MYSQL_HOST,
    db: MYSQL_DB,
  },
  version: process.env.npm_package_version,
  logs: {
    logFolder: LOG_FOLDER || 'logs',
    info: LOG_INFO || 'info.jsonl',
    error: LOG_ERROR || 'error.jsonl',
    warning: LOG_WARNING || 'warning.jsonl',
    api: LOG_PRIVATE_API || 'private_api.jsonl',
    privateApi: ['auth'],
    maxLogFileSize: LOG_MAX_FILE_SIZE > 0 ? LOG_MAX_FILE_SIZE : 2e8,
    maxLogFileNumber: LOG_MAX_FILE_NUMBER > 0 ? LOG_MAX_FILE_NUMBER : 5,
  },
  prisma: {
    logLevel: PRISMA_LOG_LEVEL,
  },
};

export default config;
