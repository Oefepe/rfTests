import CryptoJs from 'crypto-js';
import { logErrorType } from './errors/commonErrorLogging';

const secretKey: string = import.meta.env.VITE_SECRET_KEY || '';

// Function to encrypt password
export const encrypt = (data: string): string => {
  return CryptoJs.AES.encrypt(data, secretKey).toString();
};

// Function to decrypt password
export const decrypt = (encryptedData: string): string => {
  const bytes = CryptoJs.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJs.enc.Utf8);
};

// Function to extract email from decrypted token
export const extractEmailFromToken = (token: string): string | false => {
  try {
    const decryptedToken = decrypt(token);
    const payload = JSON.parse(decryptedToken);
    return payload.email;
  } catch (error) {
    logErrorType(error, 1, { token: token });
    return false;
  }
};
