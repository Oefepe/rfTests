import Joi from 'joi';

const clientLogSchema = Joi.object({
  level: Joi.string().required(),
  message: Joi.string().required().allow(''),
  timestamp: Joi.string().required(),
  logger: Joi.string().required(),
  appVersion: Joi.string(),
});

export const LogsSchemas = {
  clientLog: Joi.object({
    logs: Joi.array().items(clientLogSchema),
  }),
};
