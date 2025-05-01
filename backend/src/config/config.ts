import dotenv from 'dotenv';
import process from 'node:process';
import * as emailTemplates from '../templates/email.json';

dotenv.config({ path: `.env.${process.env.NODE_ENV?.trim()}` });

const env = process.env.NODE_ENV?.trim();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_DB = process.env.MONGO_DB || '';
const MONGO_HOST = process.env.MONGO_HOST || '';
const MONGO_PORT = process.env.MONGO_PORT || '27017';
const DB_PROVIDER = process.env.DB_PROVIDER || 'mongo';

const MYSQL_USERNAME = process.env.MYSQL_USERNAME || '';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
const MYSQL_DB = process.env.MYSQL_DB || '';
const MYSQL_HOST = process.env.MYSQL_HOST || '';

const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3100;
const SECRET_KEY = process.env.SECRET_KEY || 'RFNGSECRET';
const API_PREFIX = process.env.API_PREFIX || '';

const JWT_ACC_LIFETIME = process.env.JWT_ACC_LIFETIME || '5m';
const JWT_USER_LIFETIME = process.env.JWT_USER_LIFETIME || '24h';
const PWD_LINK_EXPIRATION = 4 * 60 * 60 * 1000; // 4 hours

const KICKBOX_KEY = process.env.KICKBOX_KEY || '';
const KICKBOX_API_URL =
  process.env.KICKBOX_API_URL ?? 'https://api.kickbox.com/v2/verify';

const WEB_CLIENT = process.env.WEB_CLIENT || '';
const MOBILE_CLIENT = process.env.MOBILE_CLIENT || '';

const LOG_FOLDER = process.env.LOG_FOLDER;
const LOG_ERROR = process.env.LOG_ERROR;
const LOG_INFO = process.env.LOG_INFO;
const LOG_WARNING = process.env.LOG_WARNING;
const LOG_PRIVATE_API = process.env.LOG_PRIVATE_API;
const LOG_MAX_FILE_SIZE = Number(process.env.LOG_MAX_FILE_SIZE);
const LOG_MAX_FILE_NUMBER = Number(process.env.LOG_MAX_FILE_NUMBER);

const AVBOB_ACCOUNT_ID = process.env.AVBOB_ACCOUNT_ID || '';
const AVBOB_GROUP_CODE = process.env.AVBOB_GROUP_CODE || '';

const TA_ACCOUNT_ID = process.env.TA_ACCOUNT_ID || '';
const TA_GROUP_CODE = process.env.TA_GROUP_CODE || '';
const KOBO_ACCOUNT_ID = process.env.KOBO_ACCOUNT_ID || '';
const KOBO_GROUP_CODE = process.env.KOBO_GROUP_CODE || '';
const LV_ACCOUNT_ID = process.env.LV_ACCOUNT_ID || '';
const LV_GROUP_CODE = process.env.LV_GROUP_CODE || '';
const TS_ACCOUNT_ID = process.env.TS_ACCOUNT_ID || '';
const TS_GROUP_CODE = process.env.TS_GROUP_CODE || '';

const MAILGUN_KEY = process.env.MAILGUN_KEY || '';
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || '';
const SUPPORT_EMAIL_SUPPORT_ADDRESS =
  process.env.SUPPORT_EMAIL_SUPPORT_ADDRESS || 'support@rapidfunnel.com';

const RESET_PWD_THRESHOLD = process.env.RESET_PWD_THRESHOLD || '10';
const RESET_PWD_SECRET_KEY = process.env.RESET_PWD_SECRET_KEY || '';

const POSTING_KEY = process.env.POSTING_KEY;

const config = {
  mongo: {
    auth: {
      username: MONGO_USERNAME,
      password: MONGO_PASSWORD,
    },
    url: MONGO_URL,
  },
  mysql: {
    username: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    host: MYSQL_HOST,
    db: MYSQL_DB,
  },
  server: {
    port: SERVER_PORT,
  },
  auth: {
    webClient: WEB_CLIENT,
    mobileClient: MOBILE_CLIENT,
    resetPasswordThreshold: Number(RESET_PWD_THRESHOLD),
    resetPwdSecretKey: RESET_PWD_SECRET_KEY,
    secretKey: SECRET_KEY,
    jwtAccLifetime: JWT_ACC_LIFETIME,
    jwtUserLifeTime: JWT_USER_LIFETIME,
    pwdLinkExpiration: PWD_LINK_EXPIRATION,
    providers: {
      avbob: {
        baseUrl: 'https://1021.netready.app/api/v1',
        apiKey:
          '0nYk5PJZdrroZX13S7e0K4Xt7Wrjo%2B6zHrXPrgu5V5vLfm7actsE5OYQrPe6JjVQ',
        accessCard: 'EB4A7E7D-8EDB-48FF-A89C-4B9333D3A0E2',
        accessPro: 'DD8F5014-828E-4CDB-96D6-F65165CDCB87',
        authCookie: 'gappstack_auth',
        groupCode: AVBOB_GROUP_CODE,
        accountId: AVBOB_ACCOUNT_ID,
      },
      netready: [
        {
          baseUrl: 'https://1427.netready.app/api/v1',
          apiKey:
            'X1m7wVhureamSStMK5U2QaXzvvHFubRTSaIMDY6wrhxMdcRDuKOtOq48Ls5AkYDB',
          accessCard: 'BF945AE4-B339-4699-AE6C-E727B02D0917',
          accessPro: 'EE06DEC6-6826-44B1-A70B-B9FFF80BAA64',
          authCookie: 'gappstack_auth',
          groupCode: TA_GROUP_CODE,
          accountId: TA_ACCOUNT_ID,
        },
        {
          baseUrl: 'https://1375.netready.app/api/v1',
          apiKey:
            's6KzmIjH5ufKOoK59m3Tzft5wYqX9jpzldEyKOrpiGIMgigBsujQMz/15roMPnPh',
          accessCard: '2C23D4CF-ADFD-44DB-AF7F-8FD1F23DD662',
          accessPro: '7C860D88-D0F0-4961-A43F-7FDA45AC87F8',
          authCookie: 'gappstack_auth',
          groupCode: KOBO_GROUP_CODE,
          accountId: KOBO_ACCOUNT_ID,
        },
        {
          baseUrl: 'https://1202.netready.app/api/v1',
          apiKey:
            'yUwr429cbb6y3EI7wWI2B73tJG70PW+1oor2ng4ciraTdhwo/k54plioBNh5X8cd',
          accessCard: '493FF954-381E-45F1-8FC8-E5C280D1C5BA',
          accessPro: 'AAB87FF0-46B6-48A7-92B7-F63390554E12',
          authCookie: 'gappstack_auth',
          groupCode: LV_GROUP_CODE,
          accountId: LV_ACCOUNT_ID,
        },
        {
          baseUrl: 'https://1984.netready.app/api/v1',
          apiKey:
            '0ufu5eKLSjuEE83fXxsdSEW8x0H4zqHGcP3LtEBWi2FrzGdy5qNMknh4yxSWoBuU',
          accessCard: '88FC10F9-6FAE-413F-BCB2-A9789EE5FB0B',
          accessPro: '6EBEA9D7-CD4F-4B77-AB1E-7891FCFFC190',
          authCookie: 'gappstack_auth',
          groupCode: TS_GROUP_CODE,
          accountId: TS_ACCOUNT_ID,
        },
      ],
    },
  },
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
  mail: {
    apiKey: MAILGUN_KEY,
    apiDomain: MAILGUN_DOMAIN,
    supportAddress: SUPPORT_EMAIL_SUPPORT_ADDRESS,
    templates: emailTemplates,
  },
  meetn: {
    meetnPartnerGUID: 'c9bdef49d370ee6a8793e76ece53def10f2ab5fa',
    baseUrl: 'https://api.meetn.com/',
  },
  env: env,
  version: process.env.npm_package_version,
  dbProvider: DB_PROVIDER,
  lumenUrl: process.env.LUMEN_API_URL || '',
  zendUrl: process.env.ZEND_API_URL || '',
  serverUrl: process.env.REACT_APP_API || '',
  legacyWebUrl: process.env.LEGACY_WEB_URL || '',
  jwtUserKey: process.env.JWT_USER_KEY || '',
  lumenSecretKey: process.env.LUMEN_SECRET_KEY || '',
  api_prefix: API_PREFIX,
  kickbox: KICKBOX_KEY,
  kickboxApiUrl: KICKBOX_API_URL,
  postingKey: POSTING_KEY,
};

export default config;
