import config from '../config/config';
import { logInfo } from '../services/log';
import axios from 'axios';
import { logErrorType } from '../utils/commonErrorLogging';

export const verifyEmail = async (email?: string) => {
  if (email) {
    const trimmedEmail = email.trim();
    const url = config.lumenUrl + `v2/validation/email/${trimmedEmail}`;
    const headers = { 'x-api-key': config.postingKey };

    try {
      const { data: response } = await axios({
        url: url,
        method: 'get',
        headers: headers,
      });
      logInfo({
        message: `Lumen KickBox API response for Email is: ${trimmedEmail} is ${response.data[0].status}`,
      });

      return {
        email: trimmedEmail,
        valid: response.data[0].status,
      };
    } catch (error) {
      logErrorType(error, 1022, {
        serverUrl: url,
        headers,
      });
      return {
        email: trimmedEmail,
        valid: false,
      };
    }
  }
  return { valid: false };
};

export const verifyPhone = (phone?: string) => {
  if (phone) {
    const digitsOnly = phone.replaceAll(/\D+/g, '');
    const numberIsAllowed = digitsOnly.length > 5;
    logInfo({
      message: `Phone number: ${phone} is ${
        numberIsAllowed ? 'allowed' : 'too short'
      }`,
    });
    return {
      phone: digitsOnly,
      valid: numberIsAllowed,
    };
  }
  return { valid: false };
};
