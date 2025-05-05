import Joi from 'joi';
import { joiEmail } from './validateJoi';

export const AuthSchemas = {
  login: Joi.object({
    email: joiEmail.required(),
    password: Joi.string().required(),
    accountId: Joi.string(),
  }),
  signupByMail: Joi.object({
    email: joiEmail.required(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    loginToken: Joi.string(),
    userId: Joi.string(),
    groupCode: Joi.string().required(),
    additionalData: Joi.object({
      additionalEmailNotification: joiEmail,
      repId: Joi.string(),
      repId2: Joi.string(),
    }),
  }),
  pwdRequest: Joi.object({
    to: Joi.string().required(),
  }),
  pwdConfirm: Joi.object({
    email: joiEmail.required(),
    code: Joi.string().required(),
    password: Joi.string().required(),
  }),
  pwdConfirmWithToken: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required(),
  }),
  pwdUpdate: Joi.object({
    email: joiEmail.required(),
    password: Joi.string().required(),
  }),
  revisionUpdate: Joi.object({
    revision: Joi.number().required(),
  }),
  finishSignup: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    groupCode: Joi.string().required(),
    email: joiEmail.required(),
  }),
  codeValidation: Joi.object({
    code: Joi.string().required(),
  }),
  emailValidation: Joi.object({
    email: joiEmail.required(),
    accountId: Joi.number().required(),
  }),
  netReadyValidation: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
