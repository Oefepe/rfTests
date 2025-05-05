import Joi from 'joi';

export const brandingValidation = {
  get: Joi.object({
    accountId: Joi.number().required(),
  }),
  license: Joi.object({
    type: Joi.string().valid('privacy', 'terms'),
    agent: Joi.string().valid('mobile', 'web'),
  }),
  getByUserId: Joi.object({
    userId: Joi.number().required(),
  }),
};
