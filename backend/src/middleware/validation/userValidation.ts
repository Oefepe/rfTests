import Joi from 'joi';

export const UserSchemas = {
  updateUser: Joi.object({
    accounts: Joi.forbidden(),
  }),
  accountAdd: Joi.object({
    groupCode: Joi.string().required(),
  }),
  accountRemove: Joi.object({
    accountId: Joi.number().required(),
  }),
};
