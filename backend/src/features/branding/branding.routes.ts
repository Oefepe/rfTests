import express from 'express';
import {
  getBrandingByLegacyUserId,
  getBrandingData,
  getTerms,
} from './branding.controller';
import { ValidateParams } from '../../middleware/validation';
import { brandingValidation } from './branding.validation';

const router = express.Router();

router.get(
  '/branding/:accountId',
  ValidateParams(brandingValidation.get),
  getBrandingData
);

router.get(
  '/license/:type',
  ValidateParams(brandingValidation.license),
  getTerms
);

router.get(
  '/branding/user/:userId',
  ValidateParams(brandingValidation.getByUserId),
  getBrandingByLegacyUserId
);

export default router;
