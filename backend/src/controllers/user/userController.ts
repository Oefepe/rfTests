import { Request, Response } from 'express';
import { sendResetCode, sendResetLink } from '../../services/mail/mailService';
import {
  AccountJwtPayload,
  AccountUserData,
  IUser,
  IUserUpdate,
  Providers,
  ResponseCode,
  UserJwtPayload,
} from '../../entities';
import {
  deleteUsersByAccountId,
  getUserByEmail,
  getUserById,
  getUserByLegacyId,
  removeUserByLegacyId,
  updateUser,
} from '../../services/userService';
import {
  changePassword,
  genPwdResetCode,
  getAuthIdByProvider,
  getAuthIdByUserName,
  getUserIdByAuthId,
  processPwdResetWithToken,
  updateAuthId,
  userIsLocal,
} from '../../services/authService';
import {
  deleteLegacyUser,
  getAccountIdByCode,
  getLegacyUser,
  signUp,
  updateLegacyUser,
  userUpdateToLegacy,
  userUpdateToUser,
} from '../../features/legacyApi';
import config from '../../config/config';
import HttpCode from '../../config/httpCode';
import wrapAsync from '../../utils/asyncErrorHandle';
import { ErrorType, RFNGApiError, RFNGError } from '../../utils/error';
import { logErrorType } from '../../utils/commonErrorLogging';
import { UserDTO } from '../../dto/UserDTO';
import { logInfo } from '../../services/log';
import { pwdHash } from '../../utils';
import { RevisionCode } from '../../features/revision/revision.entities';
import { initialOnboardingSteps } from '../../features/onboarding/onboarding.const';

const userPasswordResetRequest = wrapAsync(
  async (req: Request, res: Response) => {
    const {
      body: { to },
    } = req;
    try {
      const status = await sendResetCode(to.toLowerCase());
      res.status(HttpCode.OK).json({ status });
    } catch (e) {
      logErrorType(
        e,
        1,
        { to, action: 'Reset Password Request' },
        ErrorType.Warning
      );
      res.status(HttpCode.OK).json({ status: ResponseCode.error });
    }
  }
);

const userPasswordResetLinkRequest = wrapAsync(
  async (req: Request, res: Response) => {
    const {
      body: { to },
    } = req;
    try {
      const status = await sendResetLink(to.toLowerCase());
      res.status(HttpCode.OK).json({ status });
    } catch (e) {
      logErrorType(
        e,
        1,
        { to, action: 'Reset Password Link Request' },
        ErrorType.Warning
      );
      res.status(HttpCode.OK).json({ status: ResponseCode.error });
    }
  }
);

const userPasswordResetWithToken = wrapAsync(
  async (req: Request, res: Response) => {
    const {
      body: { token, password },
    } = req;

    try {
      const result = await processPwdResetWithToken({
        token,
        password,
      });
      res
        .status(HttpCode.OK)
        .json({ status: result ? ResponseCode.success : ResponseCode.error });
    } catch (e) {
      logErrorType(
        e,
        1,
        { token, action: 'User Reset Password' },
        ErrorType.Warning
      );
      res.status(HttpCode.OK).json({ status: ResponseCode.error });
    }
  }
);

const userPasswordUpdate = wrapAsync(async (req: Request, res: Response) => {
  const {
    body: { email, password },
  } = req;

  try {
    const authData = await getAuthIdByUserName(`email-${email}`);
    if (authData?._id) {
      const result = await changePassword(authData._id, password);
      res
        .status(HttpCode.OK)
        .json({ status: result ? ResponseCode.success : ResponseCode.error });
    } else {
      throw new RFNGError(1, "Password wasn't changed", { email });
    }
  } catch (error) {
    logErrorType(error, 4018, { email });
    res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

const userPasswordResetByAdmin = wrapAsync(
  async (req: Request, res: Response) => {
    let {
      query: { email },
    } = req;

    try {
      if (!email) {
        return res.status(HttpCode.OK).json({ status: ResponseCode.error });
      }

      email = email.toString().toLowerCase();

      // only allow password reset for non-sso users
      const authData = await getAuthIdByUserName(`email-${email}`);
      if (authData?._id) {
        const { code } = await genPwdResetCode(authData._id.toString());
        const url = `${config.auth.webClient}/reset-password-confirm?email=${email}&code=${code}`;
        return res
          .status(HttpCode.OK)
          .json({ status: ResponseCode.success, url });
      } else {
        throw new RFNGError(1, "Password can't be changed", { email });
      }
    } catch (e) {
      logErrorType(
        e,
        1,
        { email, action: 'Reset Password By Admin' },
        ErrorType.Warning
      );

      res.status(HttpCode.OK).json({ status: ResponseCode.error });
    }
  }
);

const userCanChangePassword = wrapAsync(async (req: Request, res: Response) => {
  const {
    query: { email },
  } = req;

  try {
    if (!email || typeof email !== 'string') {
      throw new RFNGApiError(
        9005,
        ResponseCode.error,
        'Invalid email input',
        ErrorType.Warning,
        { email }
      );
    }

    const isLocal = await userIsLocal(email);
    if (!isLocal) {
      return res.status(HttpCode.OK).json({ status: ResponseCode.error });
    }

    res.status(HttpCode.OK).json({ status: ResponseCode.success });
  } catch (e) {
    logErrorType(e, 9005, { email });

    if (e instanceof RFNGApiError) {
      return res
        .status(HttpCode.OK)
        .json({ status: e.status, message: e.message });
    }

    return res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

const internalChangeEmail = wrapAsync(async (req: Request, res: Response) => {
  const {
    body: { oldEmail, newEmail },
  } = req;

  let context: Record<string, unknown> = { oldEmail, newEmail };

  try {
    if (!oldEmail || !newEmail) {
      throw new RFNGApiError(
        9005,
        ResponseCode.invalidEmail,
        'Empty email or new email input',
        ErrorType.Warning,
        context
      );
    }

    const user = await getUserByEmail(oldEmail as string);
    context = { ...context, user };
    if (!user?._id) {
      throw new RFNGError(
        1070,
        'User with such email does not exist in rfng database',
        context,
        ErrorType.Info
      );
    }

    const updateUserResult = await updateUser(user._id, { email: newEmail });
    context = { ...context, updateUserResult };
    if (!updateUserResult) {
      throw new RFNGError(
        9005,
        'Failed to change email',
        context,
        ErrorType.Warning
      );
    }

    const authDataKey = `email-${oldEmail}`;
    const authData = await getAuthIdByUserName(authDataKey);
    context = { ...context, authDataKey, authData };
    if (!authData) throw new RFNGError(9005, 'Failed to get authData', context);

    const userName = `email-${oldEmail}`;
    const updateAuthResult = await updateAuthId(String(authData._id), {
      userName,
    });
    context = { ...context, updateAuthResult, userName };

    if (!updateAuthResult)
      throw new RFNGError(9005, 'Failed to update authData', context);

    logInfo({
      message: 'internalChangeEmail: email changed',
      context,
    });

    return res.status(HttpCode.OK).json({ status: ResponseCode.success });
  } catch (e) {
    logErrorType(e, 9005, { email: oldEmail, newEmail });

    if (e instanceof RFNGError) {
      return res
        .status(HttpCode.OK)
        .json({ status: e.errorCode, message: e.message });
    }

    return res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

const internalUpdateUserByLegacyId = wrapAsync(
  async (req: Request, res: Response) => {
    const { userId, email, password, firstName, lastName } = req.body;
    const normalizedEmail = email?.toLowerCase();

    try {
      const user = await getUserByLegacyId(
        typeof userId === 'string' ? Number(userId) : userId
      );
      if (!user?._id) {
        throw new RFNGError(
          1070,
          'user does not exist',
          { userId, user },
          ErrorType.Info
        );
      }

      const emailChanged = normalizedEmail !== user.email;
      // Check if this email is not present in the system
      if (emailChanged) {
        const authData = await getAuthIdByUserName(
          `${Providers.email}-${normalizedEmail}`
        );
        if (authData) {
          throw new RFNGError(
            1069,
            'Email already exists',
            { email: normalizedEmail },
            ErrorType.Info
          );
        }
      }

      // Update authorization collection if we have changes in email or password
      if (emailChanged || password) {
        const authData = await getAuthIdByProvider(user._id, Providers.email);
        if (!authData) {
          throw new RFNGError(
            1068,
            'Email can’t be changed for non-email users',
            { userId, user },
            ErrorType.Info
          );
        }

        const userName = `${Providers.email}-${normalizedEmail}`;
        const hashedPassword = password
          ? await pwdHash(password)
          : authData.password;

        let result;

        if (password) {
          result = await updateAuthId(String(authData._id), {
            userName,
            password: hashedPassword,
            revision: RevisionCode.default,
            salt: '',
          });
        } else {
          result = await updateAuthId(String(authData._id), {
            userName,
            password: hashedPassword,
          });
        }

        if (!result) {
          throw new RFNGError(
            1063,
            'Failed to update auth data',
            { userName },
            ErrorType.Error
          );
        }
      }

      if (
        emailChanged ||
        firstName !== user.firstName ||
        lastName !== user.lastName
      ) {
        const result = await updateUser(user._id, {
          email: normalizedEmail,
          firstName,
          lastName,
        });

        if (!result) {
          throw new RFNGError(
            1062,
            'Failed to update user',
            { userId: user._id, email: normalizedEmail, firstName, lastName },
            ErrorType.Error
          );
        }
      }

      return res.status(HttpCode.OK).json({ status: ResponseCode.success });
    } catch (e) {
      logErrorType(e, 1062, { userId, email });

      if (e instanceof RFNGError) {
        return res
          .status(HttpCode.OK)
          .json({ status: e.errorCode, message: e.message });
      }

      return res.status(HttpCode.OK).json({ status: ResponseCode.error });
    }
  }
);

const internalRemoveUserByLegacyId = wrapAsync(
  async (req: Request, res: Response) => {
    const userId = Number(req.query.userId);

    try {
      const result = await removeUserByLegacyId(userId);
      return res.status(HttpCode.OK).json({
        status: ResponseCode.success,
        ...result,
      });
    } catch (e) {
      logErrorType(e, 1065, { legacyUserId: userId });
      return res.status(HttpCode.OK).json({ status: ResponseCode.error });
    }
  }
);

const internalDeleteAccountByLegacyId = wrapAsync(
  async (req: Request, res: Response) => {
    const accountId = Number(req.query.accountId);

    try {
      const result = await deleteUsersByAccountId(accountId);
      return res.status(HttpCode.OK).json({
        status: ResponseCode.success,
        ...result,
      });
    } catch (e) {
      logErrorType(e, 1072, { legacyAccountId: accountId });
      return res.status(HttpCode.OK).json({ status: ResponseCode.error });
    }
  }
);

const getUserData = (user: IUser, accId: number | string) => {
  const { accounts, ...commonData } = user;
  const accData = accounts?.find(({ accountId }) => accountId == accId);
  const nonAccData = accounts?.filter(({ accountId }) => accountId != accId);
  const safeAccountData: Partial<AccountUserData> = {
    accountId: accData?.accountId,
    accountName: accData?.accountName,
    companyName: accData?.companyName,
  };
  return {
    commonData,
    accountData: accData,
    nonAccountData: nonAccData || [],
    safeAccountData,
  };
};

const getCurrentUser = wrapAsync(async (req: Request, res: Response) => {
  const { id, accountId } = req.user as UserJwtPayload;
  try {
    const user = await getUserById(id);
    if (!user) {
      throw new RFNGError(5013, `Can't get user`, { id });
    }

    const { accountData } = getUserData(user, accountId);
    const legacyData = accountData?.userId
      ? await getLegacyUser({
          userId: accountData.userId,
          accountId: Number(accountId),
        })
      : undefined;
    const userDTO = new UserDTO(user, legacyData);
    res.status(HttpCode.OK).json({ status: 0, user: userDTO });
  } catch (error) {
    logErrorType(error, 1009, { userId: id });
    res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

const updateCurrentUser = wrapAsync(async (req: Request, res: Response) => {
  const user = req.body as IUserUpdate;
  const { id, accountId } = req.user as UserJwtPayload;
  try {
    const dbUser = await getUserById(id);
    if (!dbUser) {
      throw new RFNGError(5013, `Can't get user`, { userId: id });
    }
    const { accountData } = getUserData(dbUser, accountId);
    if (!accountData) {
      throw new RFNGError(1009, `Can't update user`, { userId: id });
    }

    // Update user on legacy system
    // Laravel requires some fields to be present, so we need to merge user data with existing user data
    const legacyUser = userUpdateToLegacy({
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      email: dbUser.email,
      ...user,
    });

    if (
      await updateLegacyUser({
        accountId: accountData.accountId,
        userId: accountData.userId,
        body: legacyUser,
      })
    ) {
      await updateUser(id, userUpdateToUser(user));
    } else {
      throw new RFNGError(9015, `Can't update user on legacy system`, {
        userId: accountData.userId,
        accountId,
      });
    }

    res.status(HttpCode.OK).json({ status: 0, user });
  } catch (error) {
    logErrorType(error, 1009, { userId: id });
    res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

const updateAccountData = (
  user: IUser,
  accountId: number | string,
  data: AccountUserData
): AccountUserData[] => {
  const { accountData, nonAccountData } = getUserData(user, accountId);
  return [...nonAccountData, { ...accountData, ...data }];
};

const addAccount = wrapAsync(async (req: Request, res: Response) => {
  const { groupCode } = req.body;
  const { id } = req.user as AccountJwtPayload;
  try {
    const authData = await getUserIdByAuthId(id);

    if (!authData?.userId) {
      throw new RFNGError(
        1066,
        'Unable to find userId corresponding to the current authId',
        { authId: id, authData }
      );
    }

    const accountData = await getAccountIdByCode(groupCode);

    if (accountData.status !== ResponseCode.success) {
      throw new RFNGError(
        9003,
        'Unable to get account information by group code',
        { groupCode, accountData }
      );
    }

    const userData = await getUserById(authData.userId);
    if (!userData) {
      throw new RFNGError(5013, 'User not found by userId', {
        userId: authData.userId,
      });
    }
    const { firstName, lastName, email, accounts: existAccounts } = userData;

    if (!firstName || !lastName || !email) {
      throw new RFNGError(
        1009,
        `Can't update accounts list because of user data`,
        { authId: id, groupCode, firstName, lastName, email }
      );
    }

    const { data } = await signUp({
      firstName,
      lastName,
      email,
      groupCode,
    });

    const accounts = existAccounts || [];
    accounts.push({
      accountId: accountData.accountId,
      accountName: accountData.accountName,
      token: data[0].loginToken,
      userId: data[0].id,
      onboarding: initialOnboardingSteps,
    });
    await updateUser(authData.userId, { accounts });
    return res.status(HttpCode.OK).json({ status: 0, accounts });
  } catch (error) {
    logErrorType(error, 1009, { authId: id, groupCode });
    res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

const removeAccount = wrapAsync(async (req: Request, res: Response) => {
  const { accountId } = req.query;
  const { id } = req.user as AccountJwtPayload;

  try {
    const authData = await getUserIdByAuthId(id);

    if (!authData?.userId) {
      throw new RFNGError(
        1066,
        'Unable to find userId corresponding to the current authId',
        { authId: id, authData }
      );
    }

    const userData = await getUserById(authData.userId);
    if (!userData) {
      throw new RFNGError(1009, `User not found by userId`, {
        userId: authData.userId,
      });
    }

    const { accountData, nonAccountData } = getUserData(
      userData,
      Number(accountId)
    );

    if (!accountData) {
      logInfo({
        message: 'No account data found',
        context: { authId: authData._id, accountId: accountId },
      });
      return res.status(HttpCode.OK).json({ status: ResponseCode.error });
    }

    if (!accountData?.userId) {
      throw new RFNGError(
        1009,
        'Unable to find userId corresponding to the current account',
        { authId: authData._id, accountId: accountId, accountData }
      );
    }

    const legacyResponse = await deleteLegacyUser(
      accountData?.userId,
      Number(accountId)
    );

    const context = {
      rfngAuthId: id,
      accountId,
      accountData,
    };

    if (legacyResponse !== accountData.userId)
      throw new RFNGError(1009, 'Deleting legacy user failed', context);

    logInfo({
      message: 'removeAccount: Deleting legacy user succeed',
      context,
    });

    await updateUser(authData.userId, { accounts: nonAccountData });
    return res.status(HttpCode.OK).json({ status: ResponseCode.success });
  } catch (error) {
    logErrorType(error, 1009, { authId: id, accountId });
    res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

export {
  userPasswordResetRequest,
  userPasswordUpdate,
  userPasswordResetByAdmin,
  userCanChangePassword,
  getUserData,
  updateAccountData,
  getCurrentUser,
  updateCurrentUser,
  addAccount,
  removeAccount,
  internalChangeEmail,
  internalUpdateUserByLegacyId,
  internalRemoveUserByLegacyId,
  userPasswordResetWithToken,
  userPasswordResetLinkRequest,
  internalDeleteAccountByLegacyId,
};
