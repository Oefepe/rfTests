import express from 'express';
import { authenticateJwt } from '../../../middleware/auth/auth';
import {
  supportEmailMessage,
  sendRequestACallEmail,
  sendCtaButtonEmail,
  sendCtaConversionEmail,
} from '../../../controllers/mail/mailController';
import { MailSchemas, ValidateJoi } from '../../../middleware/validation';

const router = express.Router();

router.post(
  '/support',
  authenticateJwt,
  ValidateJoi(MailSchemas.supportMail),
  supportEmailMessage
);

router.post(
  '/send-request-call-email',
  ValidateJoi(MailSchemas.requestCallSchema),
  sendRequestACallEmail
);

router.post(
  '/send-cta-email',
  ValidateJoi(MailSchemas.ctaEmailSchema),
  sendCtaButtonEmail
);

router.post(
  '/send-cta-conversion-email',
  ValidateJoi(MailSchemas.ctaConversionSchema),
  sendCtaConversionEmail
);

export default router;
