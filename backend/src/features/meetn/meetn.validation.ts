import Joi from 'joi';

export const meetnValidation = {
  createContact: Joi.object({
    room: Joi.string().required(),
  }),
};
