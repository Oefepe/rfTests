import passport from 'passport';
import { IStrategyOptionsWithRequest, Strategy } from 'passport-local';
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from '../../services/userService';
import { AuthCheck, Providers, ResponseCode } from '../../entities';
import { pwdHash, pwdMatch, verifyEmail } from '../../utils';
import {
  getAccountIdByCode,
  getLegacyLoginToken,
  SignUpPayload,
  updateLegacyUser,
} from '../../features/legacyApi';
import {
  createAuthId,
  getAuthIdByUserId,
  getAuthIdByUserName,
} from '../../services/authService';
import {
  getUserData,
  updateAccountData,
} from '../../controllers/user/userController';
import { checkMultiAccountPassword } from '../../features/revision';
import { RevisionCode } from '../../features/revision/revision.entities';
import {
  AuthErrorCode,
  AuthLogMessages,
  LogContextType,
  logError,
  logInfo,
  logWarning,
} from '../../services/log';
import { defaultContext, getGroupCodeFromCookie } from './utils';
import { defaultAuthErrorHandler } from './authErrors';
import { initialOnboardingSteps } from '../../features/onboarding/onboarding.const';

const provider = Providers.email;

const strategyOptions: IStrategyOptionsWithRequest = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
};

// If we have a loginToken and userId, then user already exists in the legacy system
// otherwise we need to sign up in the legacy system first
const getLegacyData = async (
  signUpData: SignUpPayload,
  loginToken?: string,
  userId?: number
) => {
  if (loginToken && userId) {
    return { token: loginToken, userId };
  } else {
    const { token, userId } = await getLegacyLoginToken(signUpData);
    return { token, userId };
  }
};

passport.use(
  'email-login',
  new Strategy(strategyOptions, async (req, email, password, done) => {
    const context = defaultContext(email, provider, req);
    email = email.toLowerCase();
    try {
      const authUser = await getAuthIdByUserName(`${provider}-${email}`);

      let validPassword: boolean;

      if (authUser?.revision === RevisionCode.pwdUnify) {
        validPassword = await checkMultiAccountPassword(authUser, password);
      } else {
        validPassword = await pwdMatch(
          password,
          authUser?.password,
          authUser?.salt
        );
      }

      if (authUser?._id && validPassword) {
        logInfo({ message: AuthLogMessages.login, context });
        req.params.checkResult = AuthCheck.exist;
        return done(null, {
          id: authUser._id,
          revision: authUser.revision,
        });
      } else {
        logInfo({
          message: AuthLogMessages.invalidCredentials,
          context,
        });
        req.params.checkResult = AuthCheck.invalid;
        return done(null, {});
      }
    } catch (error) {
      defaultAuthErrorHandler({
        error,
        context,
        req,
        done,
      });
    }
  })
);

interface ISignUpResult {
  user: undefined | object;
  checkResult: AuthCheck;
  accountId?: number;
  userId?: number;
}

const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  loginToken: string,
  legacyUserId: number,
  groupCode: string
) => {
  const result: ISignUpResult = {
    user: {},
    checkResult: AuthCheck.invalid,
  };

  const context: LogContextType = { username: email, provider };

  const userAccountData = await getAccountIdByCode(groupCode);

  const signUpData = {
    email,
    firstName,
    lastName,
    groupCode,
  };

  if (userAccountData.status !== ResponseCode.success) {
    logError({
      errorCode: AuthErrorCode.invalidData,
      message: AuthLogMessages.invalidData,
      context: {
        ...context,
        userValidation: 'accountId undefined',
        userAccountData,
      },
    });

    return result;
  }

  // Add accountId to the context
  context.acountId = userAccountData.accountId;
  result.accountId = userAccountData.accountId;

  // Check if a user exists in an authids collection
  const authUser = await getAuthIdByUserName(`${provider}-${email}`);

  const emailOwner = await getUserByEmail(email);

  // Validate login/password
  const validPassword =
    authUser?.revision === RevisionCode.pwdUnify
      ? await checkMultiAccountPassword(authUser, password)
      : await pwdMatch(password, authUser?.password);

  if (authUser?._id && !validPassword) {
    logInfo({
      message: AuthLogMessages.invalidCredentials,
      context,
    });
    return result;
  }

  // If a user exists in this account -> authenticate
  if (emailOwner?._id) {
    if (authUser?.userId && validPassword) {
      const user = await getUserById(authUser.userId);
      if (!user) {
        logError({
          errorCode: AuthErrorCode.invalidData,
          message: AuthLogMessages.invalidData,
          context: { ...context, userValidation: 'getUserById failed' },
        });
        return result;
      }
      const { accountData } = getUserData(user, userAccountData.accountId);

      if (accountData?.token) {
        logInfo({ message: AuthLogMessages.login, context });

        result.checkResult = AuthCheck.exist;
        result.user = { id: authUser._id };

        return result;
      }
      // If this user doesn't exist in this account,
      // Sign up in a legacy system with a new account and get loginToken

      const { userId, token } = await getLegacyData(
        signUpData,
        loginToken,
        legacyUserId
      );

      result.userId = userId;

      // Update exist user accounts array
      const updatedAccountData = updateAccountData(user, authUser.userId, {
        accountId: userAccountData.accountId,
        accountName: userAccountData.accountName,
        token,
        userId,
      });

      await updateUser(authUser.userId, {
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        email,
        accounts: updatedAccountData,
        proUser: false,
      });

      logInfo({ message: AuthLogMessages.created, context });
      result.checkResult = AuthCheck.created;
      result.user = { id: authUser._id };

      return result;
    }
    // If email already in use with another IDP
    const idpAuthId = await getAuthIdByUserId(emailOwner._id);
    if (!idpAuthId) {
      logError({
        errorCode: AuthErrorCode.invalidData,
        message: AuthLogMessages.invalidData,
        context: { ...context, userValidation: 'getAuthIdByUserId failed' },
      });
      return result;
    }
    const { accountData } = getUserData(emailOwner, userAccountData.accountId);

    if (accountData?.token) {
      // If this accountId already used
      logInfo({ message: AuthLogMessages.login, context });
      result.checkResult = AuthCheck.exist;
      result.user = { id: idpAuthId._id };
      return result;
    }

    const { userId, token } = await getLegacyData(
      signUpData,
      loginToken,
      legacyUserId
    );

    result.userId = userId;

    // Update exist user accounts array
    const updatedAccountData = updateAccountData(emailOwner, emailOwner._id, {
      accountId: userAccountData.accountId,
      accountName: userAccountData.accountName,
      token,
      userId,
    });

    await updateUser(emailOwner._id, {
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      email,
      accounts: updatedAccountData,
      proUser: false,
    });

    const hashedPassword = await pwdHash(password);

    const newAuthData = await createAuthId({
      userId: emailOwner._id,
      userName: `${provider}-${email}`,
      password: hashedPassword,
      provider,
    });

    logInfo({ message: AuthLogMessages.created, context });
    result.checkResult = AuthCheck.created;
    result.user = { id: newAuthData._id };

    return result;
  }

  // If a user doesn't exist - create new
  const hashedPassword = await pwdHash(password);

  // Sign up in a legacy system and get loginToken
  const { userId, token } = await getLegacyData(
    signUpData,
    loginToken,
    legacyUserId
  );

  result.userId = userId;

  // Create a new document in the users collection
  const newUserData = await createUser({
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
    email,
    groupCode, // todo: move to the account specific data as array
    accounts: [
      {
        accountId: userAccountData.accountId,
        accountName: userAccountData.accountName,
        token,
        userId,
        onboarding: initialOnboardingSteps,
      },
    ],
    proUser: false,
  });

  // Create a new document in the authids collection
  const newAuthData = await createAuthId({
    userId: newUserData._id.toHexString(),
    userName: `${provider}-${email}`,
    password: hashedPassword,
    provider,
  });

  logInfo({ message: AuthLogMessages.created, context });
  result.checkResult = AuthCheck.created;
  result.user = { id: newAuthData._id };
  return result;
};

passport.use(
  'email-signup',
  new Strategy(strategyOptions, async (req, email, password, done) => {
    const context = defaultContext(email, provider, req);
    // Check user data
    const { firstName, lastName, loginToken, userId, additionalData } =
      req.body;

    let { groupCode } = req.body;

    if (!groupCode) {
      groupCode = getGroupCodeFromCookie(req.cookies);
    }

    try {
      const checkGroupCode = await getAccountIdByCode(groupCode);

      if (checkGroupCode.status !== ResponseCode.success) {
        logWarning({
          errorCode: 9003,
          message: "Signup can't be finished due the invalid group code",
          context: { ...context, groupCode },
        });
        req.params.checkResult = AuthCheck.error;
        return done(null, {});
      }

      const verifiedEmail = await verifyEmail(email.toLowerCase());
      if (!verifiedEmail.valid || !verifiedEmail.email) {
        logInfo({
          message: AuthLogMessages.invalidCredentials,
          context: { email, provider },
        });

        req.params.checkResult = AuthCheck.invalid;
        return done(null, {});
      }
      const {
        checkResult,
        user,
        accountId,
        userId: legacyUserId,
      } = await signUp(
        verifiedEmail.email,
        password,
        firstName,
        lastName,
        loginToken,
        userId,
        groupCode
      );

      // Update user data in the legacy system
      if (
        checkResult === AuthCheck.created &&
        additionalData &&
        accountId &&
        legacyUserId
      ) {
        const body = {
          email: verifiedEmail.email,
          firstName,
          lastName,
          groupCode,
          ...additionalData,
          accountId,
        };
        const res = await updateLegacyUser({
          accountId,
          userId: legacyUserId,
          body,
        });
        if (!res) {
          logError({
            errorCode: AuthErrorCode.invalidData,
            message: AuthLogMessages.invalidData,
            context: { ...context, userValidation: 'updateLegacyUser failed' },
          });
        }
      }

      req.params.checkResult = checkResult;
      done(null, user);
    } catch (error) {
      defaultAuthErrorHandler({
        error,
        context,
        req,
        done,
      });
    }
  })
);

passport.serializeUser((user, cb) => cb(null, user));

passport.deserializeUser((user, cb) => cb(null, user as Express.User));

export default passport;
