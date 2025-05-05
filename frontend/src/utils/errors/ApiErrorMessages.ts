import { ResponseCode } from '../../config';

export const ApiErrorMessages = {
  STATUS_9001: 'Database connection failed.',
  STATUS_OTHER: 'Something went wrong, please try again.',
};

export const responseErrorMessages: Record<number, string> = {
  [ResponseCode.success]: 'success',
  [ResponseCode.error]: 'defaultErrorMessage',
  [ResponseCode.userExist]: 'userExist',
  [ResponseCode.invalidPhone]: 'invalidPhone',
  [ResponseCode.invalidEmail]: 'invalidEmail',
};
