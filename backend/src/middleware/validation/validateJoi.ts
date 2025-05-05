import Joi, { ArraySchema, ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import HttpCode from '../../config/httpCode';
import { commonErrorMessage, customValidationMsg } from '../../config/messages';
import { logErrorType } from '../../utils/commonErrorLogging';
import { ErrorType } from '../../utils/error';

// schema options
const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

// Some common validation
export const joiEmail = Joi.string().email({ tlds: { allow: false } });

export const ValidateJoi = (schema: ObjectSchema | ArraySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      switch (req.method) {
        case 'GET':
        case 'DELETE':
          await schema.validateAsync(req.query, options);
          break;
        case 'POST':
          await schema.validateAsync(req.body, options);
          break;
        default:
          await schema.validateAsync(req.body, options);
      }

      next();
    } catch (errors: unknown) {
      let message = commonErrorMessage.validationError;

      logErrorType(
        errors,
        2014,
        { endpoint: req.originalUrl, method: req.method, body: req.body, query: req.query },
        ErrorType.Warning
      );

      if (errors instanceof Error) {
        message = errors.message;
      }

      return res.status(HttpCode.OK).json({ status: 12, message });
    }
  };
};

export const ValidateParams = (schema: ObjectSchema | ArraySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.params, options);
      next();
    } catch (errors: unknown) {
      let message = commonErrorMessage.validationError;

      logErrorType(
        errors,
        2014,
        { endpoint: req.originalUrl, method: req.method, body: req.body, query: req.query },
        ErrorType.Warning
      );

      if (errors instanceof Error) {
        message = errors.message;
      }

      return res.status(HttpCode.OK).json({ status: 1, message });
    }
  };
};

//Event Validation
const eventType = {
  eventTitle: Joi.string().required(),
  eventDesc: Joi.string(),
  eventDate: Joi.string().required(),
  eventVenue: Joi.string().required(),
};

//Smart connector category validation
const scCategoryType = {
  name: Joi.string().required(),
};

//Smart connector stage action validation
const scStageAction = {
  name: Joi.string().required(),
};

//Smart connector contact log validation
const logContactData = {
  userId: Joi.string().required(),
  resourceId: Joi.string().required(),
  contactId: Joi.string().required(),
  domain: Joi.string().required(),
};

//Smart connector contact log validation
const scContactLog = {
  userId: Joi.string().required(),
  smartConnectorId: Joi.string().required(),
  contactId: Joi.string().required(),
};

//Smart Connector executed Action req validation
const executedAction = {
  userId: Joi.string().required().messages(customValidationMsg('userId')),
  actionId: Joi.string().required().messages(customValidationMsg('actionId')),
  contactId: Joi.string().required().messages(customValidationMsg('contactId')),
};

const finishDelay = {
  userId: Joi.string().required().messages(customValidationMsg('userId')),
  delayId: Joi.string().required().messages(customValidationMsg('actionId')),
  contactId: Joi.string().required().messages(customValidationMsg('contactId')),
};

//Resource GET and POST API param validation
const getResourceAPiParams = {
  accountId: Joi.string().required().messages(customValidationMsg('accountId')),
  type: Joi.string().required().messages(customValidationMsg('type')),
  category: Joi.string().required().messages(customValidationMsg('category')),
};

const getResourceDetailsParams = {
  resourceId: Joi.string().required(),
  userId: Joi.string().required(),
};

const linkResourceSchema = Joi.object({
  name: Joi.string().required(),
  link: Joi.string().required(),
  description: Joi.string().required(),
});

// Resource specific validation
const resourceValidationByType = Joi.object()
  .keys({
    ...getResourceAPiParams,
  })
  .when('.type', {
    is: 'link',
    then: linkResourceSchema,
  });

export const Schemas = {
  event: {
    create: Joi.object(eventType),
    update: Joi.object(eventType),
  },
  scStages: {
    create: Joi.array().items(Joi.object(scCategoryType)),
  },
  scStageAction: {
    create: Joi.object(scStageAction),
    executedAction: Joi.object(executedAction),
    finishDelay: Joi.object(finishDelay),
  },
  scContactLog: {
    create: Joi.object(scContactLog),
  },
  ContactLog: {
    logContactData: Joi.object(logContactData),
  },
  resourceAPI: {
    get: Joi.object(getResourceAPiParams),
    getById: Joi.object(getResourceDetailsParams),
  },
  resourceValidationByType,
  sendSms: Joi.object({
    accountId: Joi.number().required(),
    receiverPhoneNumber: Joi.string().required(),
    messageToSend: Joi.string().required(),
  }),
  qrCode: Joi.object({
    url: Joi.string().required(),
    size: Joi.string(),
    color: Joi.string(),
    bgColor: Joi.string(),
  }),
};
