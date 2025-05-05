import Joi from 'joi';

export const MailSchemas = {
  supportMail: Joi.object({
    from: Joi.forbidden(),
    to: Joi.string().required(),
    subject: Joi.string().required(),
    html: Joi.string().required(),
  }),
  requestCallSchema: Joi.object({
    legacyUserId: Joi.number().required(),
    contactFirstName: Joi.string().required(),
    contactLastName: Joi.string().allow(''),
    contactPhoneNumber: Joi.string().allow(''),
    requestCallSourcePage: Joi.string().allow(''),
  }),
  ctaEmailSchema: Joi.object({
    legacyUserId: Joi.number().required(),
    contactFirstName: Joi.string().required(),
    contactLastName: Joi.string().allow(''),
    contactPhoneNumber: Joi.string().allow(''),
    contactEmail: Joi.string().allow(''),
    ctaLocation: Joi.string().allow(''),
    ctaPageName: Joi.string().allow(''),
  }),
  ctaConversionSchema: Joi.object({
    legacyUserId: Joi.number().required(),
    contactFirstName: Joi.string().required(),
    contactLastName: Joi.string().allow(''),
    contactPhoneNumber: Joi.string().allow(''),
    contactEmail: Joi.string().allow(''),
    ctaLocation: Joi.string().allow(''),
    ctaPageName: Joi.string().allow(''),
  }),
};
