import { Request } from 'express';
import { COOKIE_CLIENT_ID, COOKIE_GROUP_ID } from '../../config/constants';
import {
  getUserData,
  updateAccountData,
} from '../../controllers/user/userController';
import { AuthCheck, IUser, Providers, ResponseCode } from '../../entities';
import {
  getAccountIdByCode,
  getLegacyLoginToken,
} from '../../features/legacyApi/legacyApi.service';
import { createAuthId, getAuthIdByUserName } from '../../services/authService';
import { getUserById, updateUser } from '../../services/userService';
import { genRedirectBaseUrl } from '../../utils';
import { LogContextType } from '../../services/log';
import { RFNGError } from '../../utils/error';

type GroupCodeCookieType = {
  [COOKIE_CLIENT_ID]?: string;
  [COOKIE_GROUP_ID]?: string;
};

export const getGroupCodeFromCookie = (cookie: GroupCodeCookieType) => {
  return {
    groupCode: cookie?.[COOKIE_GROUP_ID] ?? '',
    clientCode: cookie?.[COOKIE_CLIENT_ID] ?? '',
  };
};

export const addGroupCodeFromCookie = (
  user: IUser,
  cookie?: GroupCodeCookieType
): IUser => {
  if (cookie) {
    const { groupCode, clientCode } = getGroupCodeFromCookie(cookie);
    return {
      ...user,
      groupCode,
      clientCode,
    };
  }
  return user;
};

export const defaultContext = (
  username: string,
  provider: Providers,
  req: Request
): LogContextType => {
  req.params.redirectUrl = genRedirectBaseUrl(req);
  req.params.provider = provider;
  return { username, provider };
};

export const handleSsoUserSignup = async (
  provider: Providers,
  user: IUser,
  req: Request,
  username: string,
  done: (err?: Error | null, user?: Express.User, info?: object) => void
) => {
  // Check user data
  const { groupCode } = getGroupCodeFromCookie(req.cookies);
  const userAccountData = await getAccountIdByCode(groupCode);

  // Check if a user exists in an authids collection
  const authUser = await getAuthIdByUserName(username);

  // If a user exists in this account -> authenticate
  if (authUser?.userName && !authUser.userId) {
    // unfinished sign-up
    req.params.checkResult = AuthCheck.exist;

    return done(null, {
      id: authUser._id,
      user, // to store sso user data until signup process finished
    });
  }

  if (authUser?.userId && userAccountData.status === ResponseCode.success) {
    // Update user common data with social media profile
    const existUser = await getUserById(authUser.userId);
    await updateUser(authUser.userId, { ...existUser, ...user });

    const { accountData } = getUserData(user, userAccountData.accountId);
    if (accountData?.accountId) {
      req.params.checkResult = AuthCheck.exist;

      return done(null, {
        id: authUser._id,
      });
    }

    if (!existUser?.email || !existUser.firstName || !existUser.lastName)
      throw new RFNGError(1, 'Incomplete db user data', {
        existUser,
        userId: authUser.userId,
        accountData,
      });

    // If this user doesn't exist in this account
    // Sign up in a legacy system with a new account and get loginToken
    const { token, userId } = await getLegacyLoginToken({
      email: existUser.email,
      firstName: existUser.firstName,
      lastName: existUser.lastName,
      groupCode,
    });

    // Update exist user accounts array
    const updatedAccountData = updateAccountData(user, authUser.userId, {
      accountId: userAccountData.accountId,
      accountName: userAccountData.accountName,
      token,
      userId,
    });

    await updateUser(authUser.userId, {
      accounts: updatedAccountData,
    });

    req.params.checkResult = AuthCheck.created;

    return done(null, {
      id: authUser._id,
    });
  }

  // Social media doesn't always return all necessary data,
  // so it is not possible to assign this user to a certain
  // user document in users' collection

  // Create a new document in the authids collection if it doesn't exist
  const newAuthData =
    authUser ??
    (await createAuthId({
      userName: username,
      provider,
    }));

  req.params.checkResult = AuthCheck.created;

  return done(null, {
    id: newAuthData._id,
    user, // keep sso data for next step
  });
};
