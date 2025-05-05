import express from 'express';
import { authenticateJwt } from '../../../middleware/auth/auth';
import {
  addAccount,
  getCurrentUser,
  removeAccount,
  updateCurrentUser,
} from '../../../controllers/user/userController';
import {
  UserSchemas,
  ValidateJoi,
  ValidateParams,
} from '../../../middleware/validation';
import {
  getOnboardingSteps,
  updateOnboardingStep,
} from '../../../features/onboarding/onboarding.controller';
import { OnboardingSchema } from '../../../features/onboarding/onboarding.validation';

const router = express.Router();

router.get('/', authenticateJwt, getCurrentUser);

router.patch(
  '/',
  authenticateJwt,
  ValidateJoi(UserSchemas.updateUser),
  updateCurrentUser
);

router.put(
  '/add-account',
  authenticateJwt,
  ValidateJoi(UserSchemas.accountAdd),
  addAccount
);

router.get(
  '/remove-account',
  authenticateJwt,
  ValidateJoi(UserSchemas.accountRemove),
  removeAccount
);

router.get('/onboarding', authenticateJwt, getOnboardingSteps);

router.post(
  '/onboarding/:step/complete',
  authenticateJwt,
  ValidateParams(OnboardingSchema.updateStep),
  updateOnboardingStep
);

export default router;
