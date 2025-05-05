import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';
import config from '../../config/config';
import { logError } from '../../services/log';

passport.use(
  'jwt',
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.secretKey,
    },
    async (payload, done) => {
      try {
        const user = payload.user;
        done(null, user);
      } catch (err) {
        const { message, stack } = err as Error;
        logError({
          errorCode: 1002,
          message,
          stacktrace: stack,
          context: {
            user: payload?.user,
          },
        });
        done(err, false);
      }
    }
  )
);

export default passport;
