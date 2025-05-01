import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import config from '../config/config';
import {
  AccountResponseData,
  AccountUserData,
  AuthCheck,
  IUser,
  ResponseCode,
} from '../entities';

const pwdHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const pwdMatch = async (
  password: string,
  hash?: string | null,
  salt?: string | null
) => {
  // Check salted password from legacy database
  if (salt && password && hash) {
    const saltedPassword = password + salt;
    const saltedHash = crypto
      .createHash('SHA512')
      .update(saltedPassword)
      .digest('hex');
    return hash === saltedHash;
  }
  if (password && hash) return await bcrypt.compare(password, hash);
  return false;
};

const authToken = (type: 'account' | 'user', user?: Express.User | IUser) => {
  if (user && Object.keys(user).length > 0) {
    return sign({ user }, config.auth.secretKey, {
      expiresIn:
        type === 'account'
          ? config.auth.jwtAccLifetime
          : config.auth.jwtUserLifeTime,
    });
  } else {
    return null;
  }
};

const jwtDecrypt = (token: string) => {
  let normalizedToken = token;
  if (token.startsWith('Bearer')) {
    normalizedToken = token.slice(9);
  }

  return verify(normalizedToken, config.auth.secretKey);
};

const tokenQueryParam = (token: string | null) => {
  return token ? `&token=${token}` : '';
};

const accountsQueryParam = (
  accounts?: AccountResponseData[] | AccountUserData[]
) => {
  return `&accounts=${JSON.stringify(accounts)}`;
};

const statusCode = (checkResult: string) => {
  switch (checkResult) {
    case AuthCheck.invalid:
      return ResponseCode.invalidCredentials;
    case AuthCheck.vacant:
      return ResponseCode.vacantUser;
    case AuthCheck.created:
      return ResponseCode.success;
    case AuthCheck.exist:
      return ResponseCode.userExist;
    case AuthCheck.restricted:
      return ResponseCode.restricted;
    default:
      return ResponseCode.error;
  }
};

export {
  pwdHash,
  pwdMatch,
  authToken,
  statusCode,
  tokenQueryParam,
  accountsQueryParam,
  jwtDecrypt,
};
