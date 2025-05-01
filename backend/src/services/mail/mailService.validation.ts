import joi from 'joi';
import { MessageContent } from './mailService.types';

export const mailMessageValidation = async (message: MessageContent) => {
  const schema = joi.object({
    from: joi.string().required(),
    to: joi.string().required(),
    subject: joi.string().required(),
    html: joi.string().required(),
  });

  const result = schema.validate(message);

  return !result.error;
};
