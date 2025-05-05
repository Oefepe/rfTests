import { Request, Response } from 'express';
import { ResponseCode, UserJwtPayload, UserOnboarding } from '../../entities';
import wrapAsync from '../../utils/asyncErrorHandle';
import * as onboardingService from './onboarding.service';
import httpCode from '../../config/httpCode';
import { RFNGApiError } from '../../utils/error';

export const getOnboardingSteps = wrapAsync(
  async (req: Request, res: Response) => {
    const user = req.user as UserJwtPayload;
    if (!user.id) {
      throw new RFNGApiError(2, ResponseCode.absentValue, 'User not found');
    }
    const accountId =
      typeof user.accountId === 'string'
        ? parseInt(user.accountId, 10)
        : user.accountId;
    const onboardingSteps = await onboardingService.getOnboardingSteps(
      user.id,
      accountId
    );

    res.status(httpCode.OK).json({
      status: ResponseCode.success,
      data: { onboardingSteps },
    });
  }
);

export const updateOnboardingStep = wrapAsync(
  async (req: Request, res: Response) => {
    const user = req.user as UserJwtPayload;
    if (!user.id || !user.accountId) {
      throw new RFNGApiError(2, ResponseCode.absentValue, 'User not found');
    }
    const step = req.params.step as keyof UserOnboarding;
    const accountId =
      typeof user.accountId === 'string'
        ? parseInt(user.accountId, 10)
        : user.accountId;

    await onboardingService.updateOnboardingStep(user.id, accountId, step);

    res.status(httpCode.OK).json({
      status: ResponseCode.success,
    });
  }
);
