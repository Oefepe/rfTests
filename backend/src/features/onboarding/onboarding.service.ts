import { ResponseCode, UserOnboarding } from '../../entities';
import { getUserById, updateUser } from '../../services/userService';
import { RFNGApiError } from '../../utils/error';
import { initialOnboardingSteps } from './onboarding.const';

export const getOnboardingSteps = async (userId: string, accountId: number) => {
  const dbUser = await getUserById(userId);
  if (!dbUser) {
    throw new RFNGApiError(2, ResponseCode.notFound, 'User not found');
  }
  if (!dbUser.accounts) {
    throw new RFNGApiError(2, ResponseCode.notFound, 'User account not found');
  }

  const account = dbUser.accounts.find((acc) => acc.accountId === accountId);
  if (!account) {
    throw new RFNGApiError(2, ResponseCode.notFound, 'Account not found');
  }

  if (account.onboarding) {
    return account.onboarding;
  } else {
    // For already existing users count steps as completed
    return Object.fromEntries(
      Object.entries(initialOnboardingSteps).map(([key]) => [key, true])
    );
  }
};

export const updateOnboardingStep = async (
  userId: string,
  accountId: number,
  step: keyof UserOnboarding
) => {
  const dbUser = await getUserById(userId);
  if (!dbUser) {
    throw new RFNGApiError(2, ResponseCode.notFound, 'User not found');
  }
  if (!dbUser.accounts) {
    throw new RFNGApiError(2, ResponseCode.notFound, 'User account not found');
  }

  const account = dbUser.accounts.find((acc) => acc.accountId === accountId);
  if (!account) {
    throw new RFNGApiError(2, ResponseCode.notFound, 'Account not found');
  }

  if (!account.onboarding) {
    account.onboarding = initialOnboardingSteps;
  }
  account.onboarding[step] = true;

  const updatedAccounts = dbUser.accounts.map((acc) =>
    acc.accountId === accountId ? account : acc
  );
  dbUser.accounts = updatedAccounts;

  const result = (await updateUser(userId, dbUser)) !== null;
  return result;
};
