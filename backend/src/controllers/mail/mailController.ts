import wrapAsync from '../../utils/asyncErrorHandle';
import {
  sendSupportMessage,
  sendRequestACallEmailToUser,
  sendCtaEmailToUser,
  sendCtaConversionEmailToUser,
} from '../../services/mail/mailService';
import HttpCode from '../../config/httpCode';
import { ResponseCode } from '../../entities';
import { logErrorType } from '../../utils/commonErrorLogging';

const supportEmailMessage = wrapAsync(async (req, res) => {
  const { body } = req;
  try {
    const mailResponse = await sendSupportMessage(body);
    res.status(HttpCode.OK).json({ mailResponse });
  } catch (e) {
    res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

const sendRequestACallEmail = wrapAsync(async (req, res) => {
  const {
    legacyUserId,
    contactFirstName,
    contactLastName,
    contactPhoneNumber,
    requestCallSourcePage,
  } = req.body;
  try {
    const mailResponse = await sendRequestACallEmailToUser(
      legacyUserId,
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      requestCallSourcePage
    );
    res.status(HttpCode.OK).json({ mailResponse });
  } catch (e) {
    logErrorType(e, 2015, {
      legacyUserId,
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      requestCallSourcePage,
    });
    res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

const sendCtaButtonEmail = wrapAsync(async (req, res) => {
  const {
    legacyUserId,
    contactFirstName,
    contactLastName,
    contactPhoneNumber,
    contactEmail,
    ctaLocation,
    ctaPageName,
  } = req.body;
  try {
    const mailResponse = await sendCtaEmailToUser(
      legacyUserId,
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      contactEmail,
      ctaLocation,
      ctaPageName
    );
    res.status(HttpCode.OK).json({ mailResponse });
  } catch (e) {
    logErrorType(e, 2015, {
      legacyUserId,
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      contactEmail,
      ctaLocation,
      ctaPageName,
    });
    res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

const sendCtaConversionEmail = wrapAsync(async (req, res) => {
  const {
    legacyUserId,
    contactFirstName,
    contactLastName,
    contactPhoneNumber,
    contactEmail,
    ctaLocation,
    ctaPageName,
  } = req.body;
  try {
    const mailResponse = await sendCtaConversionEmailToUser(
      legacyUserId,
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      contactEmail,
      ctaLocation,
      ctaPageName
    );
    res.status(HttpCode.OK).json({ mailResponse });
  } catch (e) {
    logErrorType(e, 2015, {
      legacyUserId,
      contactFirstName,
      contactLastName,
      contactPhoneNumber,
      contactEmail,
      ctaLocation,
      ctaPageName,
    });
    res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

export {
  supportEmailMessage,
  sendRequestACallEmail,
  sendCtaButtonEmail,
  sendCtaConversionEmail,
};
