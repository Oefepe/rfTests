import Joi from 'joi';

export const OnboardingSchema = {
  onboarding: Joi.object({
    skipWelcomeVideo: Joi.boolean(),
    addProfilePicture: Joi.boolean(),
    addPhoneNumber: Joi.boolean(),
    addCalendar: Joi.boolean(),
    addSocialMedia: Joi.boolean(),
    setLinkPersonalization: Joi.boolean(),
    skipTrainingPartner: Joi.boolean(),
  }),
  updateStep: Joi.object({
    step: Joi.string()
      .valid(
        'skipWelcomeVideo',
        'addProfilePicture',
        'addPhoneNumber',
        'addCalendar',
        'addSocialMedia',
        'setLinkPersonalization',
        'skipTrainingPartner'
      )
      .required(),
  }),
};
