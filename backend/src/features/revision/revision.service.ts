/**
 * MongoDB authids collection documents have revision
 * field. Function bellow need to handle backend behavior
 * based on this revision field value.
 */

import { AuthIdType, updateAuthId } from '../../services/authService';
import { getUserById } from '../../services/userService';
import { RevisionCode } from './revision.entities';
import { pwdHash, pwdMatch } from '../../utils';
import { logWarning } from '../../services/log';

export const checkMultiAccountPassword = async (
  authUser: AuthIdType | null,
  password: string
): Promise<boolean> => {
  if (
    authUser?._id &&
    authUser.userId &&
    authUser.revision === RevisionCode.pwdUnify
  ) {
    const userData = await getUserById(authUser.userId);
    if (!userData) {
      logWarning({
        errorCode: 5013,
        message: 'No user found by userId',
        context: { userId: authUser.userId },
      });
      return false;
    }
    if (userData.accounts?.length === 1) {
      // checkpassword for the 1st member from the account list
      const checkResult = await pwdMatch(
        password,
        userData.accounts[0].password,
        userData.accounts[0].salt
      );
      // if password correct update revision and password
      // in the authids collection
      if (checkResult) {
        const hashedPassword = await pwdHash(password);
        await updateAuthId(authUser._id, {
          password: hashedPassword,
          salt: '',
          pwdResetDate: new Date(0),
          pwdResetCode: '',
          revision: RevisionCode.default,
        });
      }

      return checkResult;
    } else if (userData.accounts?.length) {
      const checkList = userData.accounts?.map(({ password: hash, salt }) => {
        return pwdMatch(password, hash, salt);
      });
      const checkResponse = await Promise.allSettled(checkList);
      return checkResponse.some((el) => el.status === 'fulfilled' && el.value);
    } else {
      logWarning({
        errorCode: 6001,
        message: 'Account list is empty',
        context: { authId: authUser._id },
      });
      return false;
    }
  } else {
    logWarning({
      errorCode: 1059,
      message: 'No user found',
      context: { username: authUser?.userName },
    });
    return false;
  }
};
