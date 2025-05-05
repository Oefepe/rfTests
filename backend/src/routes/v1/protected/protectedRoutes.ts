/**
 * Protected route example
 */

import express from 'express';
import passport from '../../../middleware/auth/jwtStrategy';
import { ResponseCode, UserJwtPayload } from '../../../entities';
import { getUserById } from '../../../services/userService';
import { getUserData } from '../../../controllers/user/userController';
import HttpCode from '../../../config/httpCode';

const router = express.Router();
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const user = req.user as UserJwtPayload;
    if (user.accountId) {
      const dbUser = await getUserById(user.id);
      if (!dbUser) {
        res.status(HttpCode.OK).json({
          status: ResponseCode.error,
        });
        return;
      }
      const { commonData, safeAccountData } = getUserData(
        dbUser,
        user.accountId
      );

      res.status(HttpCode.OK).json({
        status: ResponseCode.success,
        user: {
          ...commonData,
          accounts: [safeAccountData],
        },
      });
    } else {
      res.status(HttpCode.OK).json({
        status: ResponseCode.error,
      });
    }
  }
);

export default router;
