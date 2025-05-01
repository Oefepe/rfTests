import joi, {ValidationError} from 'joi';
import { logInfo } from '../services';
import { logErrorType } from './errors/commonErrorLogging';

export const validateEmail = async (email: string) => {
  const schema = joi
    .string()
    .trim()
    .email({ tlds: { allow: false } })
    .required();
  return schema.validateAsync(email);
};

export const isEmail = async (email: string) => {
  try {
    await validateEmail(email);
  } catch (e) {
    if (e instanceof ValidationError) {
      logInfo({
        message: 'Email validation failed',
        context: { email },
      });
    } else {
      logErrorType(e, 1, { email });
    }
    return false;
  }

  return true;
};

export const validatePhone = async (phone: string) => {
  const schema = joi
    .string()
    .min(6)
    .pattern(/^[+]? *[0-9][0-9 ()-]*$/)
    .required();
  return schema.validateAsync(phone);
};

export const validatePassword = async (
  password: string,
  confirmPassword: string
) => {
  const schema = joi.object({
    password: joi.string().trim().min(6).required(),
    confirmPassword: joi.string().trim().valid(joi.ref('password')).required(),
  });
  return schema.validateAsync({ password, confirmPassword });
};
