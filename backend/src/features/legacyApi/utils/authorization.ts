import JWT from 'jsonwebtoken';
import crypto from 'crypto';

type IGetEncodedToken = {
  jwtUserKey: string;
  serverName: string;
  data: unknown;
};

const removeTrailingSlash = (str: string): string => {
  return str.endsWith('/') ? str.slice(0, -1) : str;
};

export const getEncodedToken = ({
  jwtUserKey,
  serverName,
  data,
}: IGetEncodedToken): string => {
  const tokenId = Buffer.from(crypto.randomBytes(32)).toString('base64');
  const issuedAt = Math.floor(Date.now() / 1000);
  const notBeforeUse = issuedAt;
  const expireTime = notBeforeUse + 30 * 60;

  const dataToBeEncoded = {
    iat: issuedAt,
    // time when the token was generated
    jti: tokenId,
    // an unique identifier for the token
    iss: removeTrailingSlash(serverName), // Issuer
    nbf: notBeforeUse, // Not before
    exp: expireTime, // Expire
    data,
  };

  const secretKey = Buffer.from(jwtUserKey, 'base64');
  const jwt = JWT.sign(dataToBeEncoded, secretKey, { algorithm: 'HS512' });

  return JSON.stringify(jwt);
};
