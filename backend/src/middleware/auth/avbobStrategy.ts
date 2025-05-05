import passport from 'passport';
import { IStrategyOptionsWithRequest, Strategy } from 'passport-local';
import {
  createUser,
  getUserById,
  updateUser,
} from '../../services/userService';
import { AuthCheck, Providers } from '../../entities';
import { getNetreadyUser, NetReadyConfig } from 'netready-idp';
import config from '../../config/config';
import { netReadyUserNormalize, netReadyUserValidate } from './netreadyCommon';
import {
  LegacyPaymentStatus,
  loginWithCredentials,
} from '../../features/legacyApi';
import { createAuthId, getAuthIdByUserName } from '../../services/authService';
import { defaultAuthErrorHandler } from './authErrors';
import {
  AuthErrorCode,
  AuthLogMessages,
  logError,
  logInfo,
  logWarning,
} from '../../services/log';
import { defaultContext } from './utils';
import { RFNGError } from '../../utils/error';

const provider = Providers.avbob;
const connectionConfig: NetReadyConfig = config.auth.providers.avbob;
const { groupCode, accountId } = config.auth.providers.avbob;

const strategyOptions: IStrategyOptionsWithRequest = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
};

passport.use(
  provider,
  new Strategy(strategyOptions, async (req, username, password, done) => {
    const context = defaultContext(username, provider, req);

    try {
      // get user data from IDP/DB
      const netReadyUser = await getNetreadyUser(connectionConfig, req, {
        username,
        password,
      });

      if (netReadyUser.error) {
        context.errorType = netReadyUser.errorType;
        switch (netReadyUser.errorType) {
          case 'credentials':
            logInfo({
              message: AuthLogMessages.invalidCredentials,
              context,
            });

            req.params.checkResult = AuthCheck.invalid;
            return done(null, {});
          case 'validation':
          default:
            logError({
              errorCode: AuthErrorCode.dataAccess,
              message: AuthLogMessages.dataAccess,
              context,
            });

            req.params.checkResult = AuthCheck.error;
            return done(null, {});
        }
      }

      const userValidation = netReadyUserValidate(netReadyUser);

      if (userValidation.error) {
        logError({
          errorCode: AuthErrorCode.invalidData,
          message: AuthLogMessages.invalidData,
          context: {
            ...context,
            userValidation: userValidation.error?.message,
          },
        });

        return done(null, {});
      }

      if (!netReadyUser.accessCard && !netReadyUser.proCard) {
        logWarning({
          errorCode: AuthErrorCode.accessRestricted,
          message: AuthLogMessages.accessRestricted,
          context,
        });

        req.params.checkResult = AuthCheck.restricted;
        return done(null, {});
      }

      // sync with legacy backend
      const legacyLogin = await loginWithCredentials(
        username,
        password,
        accountId
      );

      if (legacyLogin.error) {
        throw new RFNGError(1, AuthLogMessages.unprocessed, context);
      }

      const {
        profile: { realmToken: token, userId, status: paymentStatus },
      } = legacyLogin;

      const { user, extra } = netReadyUserNormalize(
        netReadyUser,
        provider,
        groupCode,
        { accountId: Number(accountId), token, userId: Number(userId) }
      );

      const authUser = await getAuthIdByUserName(extra.username);

      if (authUser?.userId) {
        const existUser = await getUserById(authUser.userId);

        if (existUser) {
          const updatedUser = {
            ...existUser,
            ...user,
            proUser: paymentStatus === LegacyPaymentStatus.pro,
          };

          await updateUser(authUser.userId, updatedUser);
        }

        req.params.checkResult = AuthCheck.exist;

        logInfo({ message: AuthLogMessages.login, context });

        return done(null, {
          id: authUser._id,
        });
      } else {
        const newUserData = await createUser(user);

        const newAuthData = await createAuthId({
          userId: newUserData._id.toHexString(),
          userName: extra.username,
          provider,
        });

        req.params.checkResult = AuthCheck.created;

        logInfo({ message: AuthLogMessages.created, context });

        return done(null, {
          id: newAuthData._id,
        });
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

passport.serializeUser((user, cb) => cb(null, user));

passport.deserializeUser((user, cb) => cb(null, <Express.User>user));

export default passport;
