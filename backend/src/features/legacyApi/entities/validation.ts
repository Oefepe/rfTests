import Joi from "joi";

export const groupCodeResponseValidation = Joi.object({
    data: Joi.array().items(Joi.object({
        accountId: Joi.number().required(),
        accountName: Joi.string().required(),
        isExternalBilling: Joi.boolean().required(),
    })).required()
});