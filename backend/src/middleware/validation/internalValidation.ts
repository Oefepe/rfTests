import Joi from 'joi';
import { joiEmail } from './validateJoi';

export const InternalSchemas = {
  legacyUpdateUser: Joi.object({
    userId: Joi.number().required(),
    email: joiEmail.required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().allow(''), // we should treat empty password as no change
  }),
  legacyDeleteUser: Joi.object({
    userId: Joi.number().required(),
  }),
  deleteAccount: Joi.object({
    accountId: Joi.number().required(),
  }),
  canChangePassword: Joi.object({
    email: joiEmail.required(),
  }),
};
