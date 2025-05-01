import config from '../../config/config';
import formData from 'form-data';
import Mailgun, { InputFormData } from 'mailgun.js';
import { logError, logInfo } from '../log';
import { getUserByEmail, getUserById, getUserByLegacyId } from '../userService';
import HttpCode from '../../config/httpCode';
import { Providers, ResponseCode } from '../../entities';
import { EmailPlaceholders, MessageContent } from './mailService.types';
import { mailMessageValidation } from './mailService.validation';
import { logErrorType } from '../../utils/commonErrorLogging';
import {
  createAuthId,
  genPwdResetCode,
  genPwdResetToken,
  getAuthIdsByUserId,
  getAuthIdByUserName,
} from '../authService';
import { logUserEvent } from '../log/eventLogger';

const { apiDomain, apiKey } = config.mail;

const mailgun = new Mailgun(formData as InputFormData);
const client = mailgun.client({ username: 'api', key: apiKey });

const templateStringsConversion = (
  template: Pick<MessageContent, 'subject' | 'html'>,
  placeholders: Record<string, string | undefined>
): Pick<MessageContent, 'subject' | 'html'> => {
  let string = JSON.stringify(template);

  for (const placeholder in EmailPlaceholders) {
    string = string.replaceAll(
      `[${placeholder}]`,
      placeholders[placeholder] ?? ''
    );
  }

  return JSON.parse(string);
};

export const sendSupportMessage = async (
  content: Omit<MessageContent, 'from'>
) => {
  const supportMessageTemplate = {
    from: config.mail.supportAddress,
  };

  const data = { ...supportMessageTemplate, ...content };

  try {
    const validation = await mailMessageValidation(data);
    if (validation) {
      const response = await client.messages.create(apiDomain, data);
      return response.status === HttpCode.OK
        ? ResponseCode.success
        : ResponseCode.error;
    } else {
      logError({
        errorCode: 2015,
        message: 'Message body invalid',
        context: { data },
      });
      return;
    }
  } catch (error) {
    logErrorType(error, 2015, { emailBody: data });
  }
};

export const sendResetCode = async (to: string) => {
  const authData = await getAuthIdByUserName(`email-${to}`);

  if (!authData?._id) {
    logInfo({
      message: 'AuthId not found',
      context: { email: to },
    });
    return ResponseCode.error;
  }

  const { resetPasswordSingleAccountOld, resetPasswordMultiAccountOld } =
    config.mail.templates;

  if (authData?.userId && authData._id) {
    const userData = await getUserById(authData.userId);

    if (userData) {
      const template =
        userData.accounts?.length === 1
          ? resetPasswordSingleAccountOld
          : resetPasswordMultiAccountOld;

      const { code } = await genPwdResetCode(authData._id);

      const { subject, html } = templateStringsConversion(
        {
          subject: template.subject,
          html: template.body,
        },
        {
          [EmailPlaceholders.firstName]: userData.firstName,
          [EmailPlaceholders.accountName]: userData.accounts?.[0].accountName,
          [EmailPlaceholders.secretCode]: code.toString(),
        }
      );

      return sendSupportMessage({
        to,
        subject,
        html,
      });
    }
  }

  // In all other conditions:
  return ResponseCode.error;
};

export const sendResetLink = async (to: string) => {
  const userData = await getUserByEmail(to);

  if (!userData?._id) {
    logError({
      errorCode: 1066,
      message: 'UserId not found',
      context: { email: to },
    });
    return ResponseCode.userIdNotFound;
  }

  const authIds = await getAuthIdsByUserId(userData?._id);

  if (!authIds.length) {
    logError({
      errorCode: 1059,
      message: 'AuthId not found',
      context: { userData },
    });
    return ResponseCode.authIdNotFound;
  }

  let emailProvider = authIds.find(
    (authId) => authId.provider === Providers.email
  );

  if (!emailProvider) {
    try {
      emailProvider = await createAuthId({
        provider: Providers.email,
        userId: userData._id,
        userName: `email-${to}`,
      });

      logInfo({
        message: 'Create new authId during password reset',
        context: { userId: userData._id, authId: emailProvider._id },
      });
    } catch (error) {
      logError({
        errorCode: 1073,
        message: 'Failed to create new authId during during password reset',
        context: { userId: userData._id, authId: userData.authId },
      });
      return ResponseCode.authIdCreationError;
    }
  }

  const { resetPasswordSingleAccount, resetPasswordMultiAccount } =
    config.mail.templates;

  if (emailProvider?.userId && emailProvider._id) {
    const template =
      userData.accounts?.length === 1
        ? resetPasswordSingleAccount
        : resetPasswordMultiAccount;

    if (userData) {
      const { resetLink: code } = await genPwdResetToken(emailProvider._id, to);

      const { subject, html } = templateStringsConversion(
        {
          subject: template.subject,
          html: template.body,
        },
        {
          [EmailPlaceholders.firstName]: userData.firstName,
          [EmailPlaceholders.accountName]: userData.accounts?.[0].accountName,
          [EmailPlaceholders.resetLink]: code,
        }
      );

      return sendSupportMessage({
        to,
        subject,
        html,
      });
    }
  } else {
    logError({
      errorCode: 1059,
      message: 'AuthId not found',
      context: { userData },
    });
    return ResponseCode.authIdNotFound;
  }
};

export const sendRequestACallEmailToUser = async (
  legacyUserId: number,
  contactFirstName: string,
  contactLastName: string,
  contactPhoneNumber: string,
  requestCallSourcePage: string
) => {
  logInfo({
    message: 'Contact Requested a call from user',
    context: {
      legacyUserId,
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      requestCallSourcePage,
    },
  });

  const userData = await getUserByLegacyId(legacyUserId);

  if (!userData?._id) {
    logInfo({
      message: 'User not found',
      context: { legacyUserId },
    });
    return ResponseCode.error;
  }

  const { sendRequestCallEmailToUser } = config.mail.templates;

  const template = sendRequestCallEmailToUser;

  // Get the matching account based on legacy userId
  const account = userData.accounts?.find((acc) => acc.userId === legacyUserId);

  if (userData && userData.email) {
    const { subject, html } = templateStringsConversion(
      {
        subject: template.subject,
        html: template.body,
      },
      {
        [EmailPlaceholders.firstName]: userData.firstName,
        [EmailPlaceholders.contactFirstName]: contactFirstName,
        [EmailPlaceholders.contactLastName]: contactLastName,
        [EmailPlaceholders.contactPhoneNumber]:
          contactPhoneNumber || 'Never Provided',
        [EmailPlaceholders.requestCallSourcePage]: requestCallSourcePage,
        [EmailPlaceholders.accountName]: account?.accountName,
      }
    );

    return sendSupportMessage({
      to: userData.email,
      subject,
      html,
    });
  }

  logError({
    errorCode: 2015,
    message: 'Request Call Email to user failed',
    context: {
      legacyUserId,
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      requestCallSourcePage,
    },
  });

  return ResponseCode.error;
};

export const sendCtaEmailToUser = async (
  legacyUserId: number,
  contactFirstName: string,
  contactLastName: string,
  contactPhoneNumber: string,
  contactEmail: string,
  ctaLocation: string,
  ctaPageName: string
) => {
  logInfo({
    message: 'Event: Contact clicked on a CTA Button',
    context: {
      legacyUserId,
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      contactEmail,
      ctaLocation,
      ctaPageName,
    },
  });

  logUserEvent({
    legacyUserId: legacyUserId,
    eventType: 'cta_button_clicked',
    subscriptionStatus: 'unknown',
    timestamp: '',
    additionalInfo: {
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      contactEmail,
      ctaLocation,
      ctaPageName,
    },
  });

  const userData = await getUserByLegacyId(legacyUserId);

  if (!userData?._id) {
    logInfo({
      message: 'User not found',
      context: { legacyUserId },
    });
    return ResponseCode.error;
  }

  const { sendCtaEmailToUser } = config.mail.templates;

  const template = sendCtaEmailToUser;

  // Get the matching account based on legacy userId
  const account = userData.accounts?.find((acc) => acc.userId === legacyUserId);

  if (userData && userData.email) {
    const { subject, html } = templateStringsConversion(
      {
        subject: template.subject,
        html: template.body,
      },
      {
        [EmailPlaceholders.firstName]: userData.firstName,
        [EmailPlaceholders.contactFirstName]: contactFirstName,
        [EmailPlaceholders.contactLastName]: contactLastName,
        [EmailPlaceholders.contactEmail]: contactEmail || 'Never Provided',
        [EmailPlaceholders.contactPhoneNumber]:
          contactPhoneNumber || 'Never Provided',
        [EmailPlaceholders.ctaLocation]: ctaLocation,
        [EmailPlaceholders.ctaPageName]: ctaPageName,
        [EmailPlaceholders.accountName]: account?.accountName,
      }
    );

    return sendSupportMessage({
      to: userData.email,
      subject,
      html,
    });
  }

  logError({
    errorCode: 2015,
    message: 'CTA Button Email to user failed',
    context: {
      legacyUserId,
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      contactEmail,
      ctaLocation,
      ctaPageName,
    },
  });

  return ResponseCode.error;
};

export const sendCtaConversionEmailToUser = async (
  legacyUserId: number,
  contactFirstName: string,
  contactLastName: string,
  contactPhoneNumber: string,
  contactEmail: string,
  ctaLocation: string,
  ctaPageName: string
) => {
  logInfo({
    message: 'Event: Contact clicked on a CTA Conversion Button',
    context: {
      legacyUserId,
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      contactEmail,
      ctaLocation,
      ctaPageName,
    },
  });

  logUserEvent({
    legacyUserId: legacyUserId,
    eventType: 'cta_conversion_button_clicked',
    subscriptionStatus: 'unknown',
    timestamp: '',
    additionalInfo: {
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      contactEmail,
      ctaLocation,
      ctaPageName,
    },
  });

  const userData = await getUserByLegacyId(legacyUserId);

  if (!userData?._id) {
    logInfo({
      message: 'User not found',
      context: { legacyUserId },
    });
    return ResponseCode.error;
  }

  const { sendCtaConversionEmailToUser } = config.mail.templates;

  const template = sendCtaConversionEmailToUser;

  // Get the matching account based on legacy userId
  const account = userData.accounts?.find((acc) => acc.userId === legacyUserId);

  if (userData && userData.email) {
    const { subject, html } = templateStringsConversion(
      {
        subject: template.subject,
        html: template.body,
      },
      {
        [EmailPlaceholders.firstName]: userData.firstName,
        [EmailPlaceholders.contactFirstName]: contactFirstName,
        [EmailPlaceholders.contactLastName]: contactLastName,
        [EmailPlaceholders.contactEmail]: contactEmail || 'Never Provided',
        [EmailPlaceholders.contactPhoneNumber]:
          contactPhoneNumber || 'Never Provided',
        [EmailPlaceholders.ctaLocation]: ctaLocation,
        [EmailPlaceholders.ctaPageName]: ctaPageName,
        [EmailPlaceholders.accountName]: account?.accountName,
      }
    );

    return sendSupportMessage({
      to: userData.email,
      subject,
      html,
    });
  }

  logError({
    errorCode: 2015,
    message: 'CTA Conversion Button Email to user failed',
    context: {
      legacyUserId,
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      contactEmail,
      ctaLocation,
      ctaPageName,
    },
  });

  return ResponseCode.error;
};
