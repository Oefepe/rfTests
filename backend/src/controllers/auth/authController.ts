import { Request, Response } from 'express';
import wrapAsync from '../../utils/asyncErrorHandle';
import {
  accountsQueryParam,
  authToken,
  statusCode,
  tokenQueryParam,
  verifyEmail,
  verifyPhone,
} from '../../utils';
import HttpCode from '../../config/httpCode';
import {
  AccountJwtPayload,
  IUser,
  Providers,
  ResponseCode,
} from '../../entities';
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  updateUser,
} from '../../services/userService';
import {
  emailAvailability,
  getAccountIdByCode,
  getLegacyLoginToken,
  loginWithToken,
  LegacyPaymentStatus,
} from '../../features/legacyApi';
import { logErrorType } from '../../utils/commonErrorLogging';
import { getUserIdByAuthId, updateAuthId } from '../../services/authService';
import { getUserData, updateAccountData } from '../user/userController';
import { logError } from '../../services/log';
import { ErrorType, RFNGError } from '../../utils/error';
import { dateStringParse } from '../../utils/DateHelper';
import { initialOnboardingSteps } from '../../features/onboarding/onboarding.const';

const ssoRedirect = wrapAsync(async (req: Request, res: Response) => {
  const { redirectUrl, checkResult, provider } = req.params;
  const token = authToken('account', req.user);
  const sessionUser = req.user as AccountJwtPayload;
  const authId = await getUserIdByAuthId(sessionUser.id);
  // fb photo string parsing cause error on the web client
  delete sessionUser.user?.photo;
  // store user data for cases with an interrupted sign-up process
  const sessionUserString = JSON.stringify({
    ...sessionUser.user,
    id: sessionUser.id,
  });
  const commonUrl = `${redirectUrl}${checkResult}&provider=${provider}&sessionUser=${sessionUserString}`;

  try {
    if (authId?.userId) {
      const dbUser = await getUserById(authId.userId);
      if (!dbUser) {
        throw new RFNGError(5013, 'User not found by authId', {
          userId: authId.userId,
        });
      }

      res
        .status(HttpCode.PERMANENT_REDIRECT)
        .redirect(
          `${commonUrl}${accountsQueryParam(dbUser.accounts)}${tokenQueryParam(
            token
          )}`
        );

      return;
    }

    res
      .status(HttpCode.PERMANENT_REDIRECT)
      .redirect(
        `${commonUrl}${accountsQueryParam([])}${tokenQueryParam(token)}`
      );
  } catch (error) {
    logErrorType(error, 1, { authId, sessionUserString });

    return res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

const sendToken = wrapAsync(async (req: Request, res: Response) => {
  const sessionUser = req.user as AccountJwtPayload;
  try {
    const authId = await getUserIdByAuthId(sessionUser.id);

    if (authId?._id && !authId.userId) {
      return res.status(HttpCode.OK).json({
        status: statusCode(req.params.checkResult),
        token: authToken('account', req.user),
      });
    }

    if (authId?.userId) {
      const dbUser = await getUserById(authId.userId);
      if (!dbUser) {
        throw new RFNGError(5013, 'Wrong session user object');
      }

      return res.status(HttpCode.OK).json({
        status: statusCode(req.params.checkResult),
        token: authToken('account', req.user),
        accounts: dbUser.accounts,
        revision: authId.revision,
      });
    }

    return res.status(HttpCode.OK).json({
      status: statusCode(req.params.checkResult),
      token: authToken('account', req.user),
    });
  } catch (error) {
    logErrorType(error, 1, { sessionUser });

    return res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

const sendUser = wrapAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const { accountId } = req.query as Record<string, string>;

  const authData = user as AccountJwtPayload;

  try {
    if (!accountId) {
      return res.status(HttpCode.OK).json({
        status: ResponseCode.unfinishedSignup,
        token: authToken('account', {
          id: authData.id,
        }),
        user: authData.user,
      });
    }

    if (!authData?.id) {
      return res.status(HttpCode.OK).json({
        status: ResponseCode.error,
      });
    }

    const userData = await getUserIdByAuthId(authData.id);

    if (!userData?.userId) {
      logError({
        errorCode: 1009,
        message: 'Wrong session user object',
        context: { sessionUser: authData },
      });

      return res.status(HttpCode.OK).json({
        status: ResponseCode.error,
      });
    }

    const dbUser = await getUserById(userData?.userId);
    if (!dbUser) {
      throw new RFNGError(5013, 'User not found by userId', {
        userId: userData.userId,
      });
    }

    let updatedUser: IUser = dbUser;

    const { accountData, nonAccountData, commonData } = getUserData(
      dbUser,
      accountId
    );

    let userAccountData = accountData;

    if (accountData?.token) {
      const { response } = await loginWithToken(accountData.token);

      if (response?.status === 'true') {
        userAccountData = {
          ...accountData,
          userRole: response.profile.role,
          userAccessLevel: response.profile.userAccessLevel,
          userStatus: response.profile.status,
          subscriptionStartedAt: dateStringParse(
            response?.profile?.subscriptionStartedAt
          ),
          wcVideoShown: response.profile.wcVideoShown,
          welcomeVideo: response.profile.welcomeVideo,
          wcVideoMediaHash: response.profile.wcVideoMediaHash,
          accessToken: response.profile.accessToken,
        };
        const accounts = [userAccountData, ...nonAccountData];

        updatedUser = {
          ...dbUser,
          accounts,
          proUser: response?.profile?.status === LegacyPaymentStatus.pro,
          lastLogin: new Date(),
        };
        await updateUser(userData?.userId, updatedUser);
      }
    }

    res.status(HttpCode.OK).json({
      status: ResponseCode.success,
      user: { ...commonData, accounts: [userAccountData] },
      token: authToken('user', {
        id: updatedUser._id,
        email: updatedUser.email,
        accountId,
      }),
    });
  } catch (error) {
    logErrorType(error, 1, { user });

    return res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

const checkEmail = wrapAsync(async (req: Request, res: Response) => {
  const { email, valid } = await verifyEmail(req.query?.email as string);
  if (!valid || !email) {
    return res.status(HttpCode.OK).json({ status: ResponseCode.invalidEmail });
  }

  const existUser = await getUserByEmail(email);
  const status = existUser ? ResponseCode.userExist : ResponseCode.success;

  res.status(HttpCode.OK).json({ status });
});

const checkPhone = wrapAsync(async (req: Request, res: Response) => {
  const { phone, valid } = verifyPhone(req.query?.phone as string);
  if (!valid) {
    return res.status(HttpCode.OK).json({ status: ResponseCode.invalidPhone });
  }

  const existUser = await getUserByUsername(`${Providers.phone}-${phone}`);

  let status: ResponseCode;
  if (!existUser) status = ResponseCode.success;
  else status = ResponseCode.userExist;

  res.status(HttpCode.OK).json({ status });
});

const checkGroupCode = wrapAsync(async (req: Request, res: Response) => {
  const { code } = req.query;
  try {
    // We already verified the code in the middleware
    const data = await getAccountIdByCode(code as string);
    res.status(HttpCode.OK).json(data);
  } catch (e) {
    logErrorType(e, 1, { code }, ErrorType.Warning);
    res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

const logout = wrapAsync(async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(HttpCode.BAD_REQUEST).json({
        success: false,
        message: 'Unable to logout',
      });
    } else {
      res.status(HttpCode.OK).json({
        success: true,
        message: 'Logout successful',
      });
    }
  });
});

// deprecated
// we are not using external social media login
// TODO: remove this endpoint
const finishSignup = wrapAsync(async (req: Request, res: Response) => {
  let user = req.user as AccountJwtPayload;
  const { firstName, lastName, groupCode, email, id } = req.body;
  const context = { user: JSON.stringify(req.body) };

  try {
    if (!user && id) {
      // get user id from uri after interrupted session
      user = { id };
    }

    if (!user.id) {
      throw new RFNGError(2016, 'SSO unauthorized', context);
    }

    const { token, userId } = await getLegacyLoginToken({
      email,
      firstName,
      lastName,
      groupCode,
    });

    const accountData = await getAccountIdByCode(groupCode);

    if (
      accountData?.status !== ResponseCode.success ||
      !accountData?.accountId
    ) {
      throw new RFNGError(2016, 'Unfinished SSO signup', context);
    }

    const existUser = await getUserByEmail(email);

    if (existUser?._id) {
      const updatedUserAccountData = updateAccountData(
        existUser,
        accountData.accountId,
        {
          accountId: accountData.accountId,
          accountName: accountData.accountName,
          token,
          userId,
        }
      );

      await updateUser(existUser._id, {
        firstName: firstName || existUser.firstName,
        lastName: lastName || existUser.lastName,
        displayName: `${firstName || existUser.firstName} ${
          lastName || existUser.lastName
        }`.trim(),
        groupCode, // todo: move it to the account data
        email,
        accounts: updatedUserAccountData,
      });

      await updateAuthId(user.id, { userId: existUser._id });

      return res.status(HttpCode.OK).json({
        status: ResponseCode.success,
        accounts: updatedUserAccountData,
      });
    } else {
      const newUser = await createUser({
        ...existUser,
        firstName: firstName || '',
        lastName: lastName || '',
        displayName: `${firstName || ''} ${lastName || ''}`.trim(),
        groupCode, // todo: move it to the account data
        email,
        accounts: [
          {
            accountId: accountData.accountId,
            accountName: accountData.accountName,
            token,
            userId,
            onboarding: initialOnboardingSteps,
          },
        ],
      });

      await updateAuthId(user.id, { userId: newUser._id.toHexString() });

      return res.status(HttpCode.OK).json({
        status: ResponseCode.success,
        token,
        accounts: [
          {
            accountId: accountData.accountId,
            token,
            accountName: accountData.accountName,
          },
        ],
      });
    }
  } catch (error) {
    logErrorType(error, 2016, { user: JSON.stringify(req.body) });

    res.status(HttpCode.OK).json({
      status: ResponseCode.error,
    });
  }
});

const checkLegacyUser = wrapAsync(async (req: Request, res: Response) => {
  const { email, accountId } = req.body;
  try {
    const result = await emailAvailability(email, accountId);
    res.status(HttpCode.OK).json(result);
  } catch (error) {
    logErrorType(error, 9004, { email, accountId });
  }
});

const updateRevision = wrapAsync(async (req: Request, res: Response) => {
  const {
    user,
    body: { revision },
  } = req;
  try {
    const { id } = user as AccountJwtPayload;
    if (id && Number.isInteger(revision)) {
      const result = await updateAuthId(id, { revision });
      res.status(HttpCode.OK).json({
        status: result?._id ? ResponseCode.success : ResponseCode.error,
      });
    } else {
      throw new RFNGError(6000, "Can't update revision number", { user });
    }
  } catch (error) {
    logErrorType(error, 6000, { user });

    res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
});

export {
  ssoRedirect,
  sendToken,
  sendUser,
  checkEmail,
  checkPhone,
  checkGroupCode,
  logout,
  finishSignup,
  checkLegacyUser,
  updateRevision,
};
