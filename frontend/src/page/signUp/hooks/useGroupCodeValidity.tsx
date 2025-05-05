import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import apis from '../../../repositories/api';
import {
  COOKIE_GROUP_ID,
  COOKIE_VALID_GROUP_ID,
  ResponseCode,
} from '../../../config';
import { SignupState } from '../types';
import { logError, logInfo, logWarning } from '../../../services';

export const useGroupCodeValidity = (userData: SignupState) => {
  const { t } = useTranslation();
  const [loginError, setLoginError] = useState('');

  /**
   * Get legacyStatus from api, validate it and apply the result on UI.
   * @param code group code to check.
   * @returns true if user is vacant by legacy.
   * @returns false we can't signup with this user.
   */
  const getAndValidateLegacyStatus = async (
    email: string,
    accountId: number
  ) => {
    const legacyStatus = (
      await apis.checkLegacyUser({
        email: email,
        accountId: accountId,
      })
    ).data.status;

    const context = { email, accountId, legacyStatus };

    if (legacyStatus === ResponseCode.vacantUser) {
      return true;
    } else if (legacyStatus === ResponseCode.userExist) {
      setLoginError(t('user_settings.settings.group_codes.existing_group_msg'));
      logInfo({
        message: 'User already exist in this account',
        context,
      });
    } else {
      setLoginError(t('common.notice.default_error_msg'));
      logError({
        errorCode: 1,
        message: 'Unexpected response code (getAndValidateLegacyStatus)',
        context,
      });
    }
    return false;
  };

  /**
   * Get group code from api, validate it and apply the result on UI.
   * @param code group code to check.
   * @returns null if group code is incorrect.
   * @returns { signUpAllowed, accountId } if group code is correct.
   */
  const getAndValidateGroupCode = async (code: string) => {
    setLoginError('')
    const {
      data: { status: groupCodeStatus, signUpAllowed, accountId },
    } = await apis.checkCode({ code });

    switch (groupCodeStatus) {
      case ResponseCode.success:
        return { signUpAllowed, accountId };
      case ResponseCode.invalidGroupCode:
        setLoginError(t('common.notice.invalid'));
        logInfo({
          message: 'Leader code is unknown',
          context: { code, status: groupCodeStatus },
        });
        break;
      case ResponseCode.networkError:
        setLoginError(t('common.notice.servers_unavailable'));
        break;
      default:
        setLoginError(t('common.notice.default_error_msg'));
        break;
    }
    return null;
  };

  const [cookie] = useCookies([COOKIE_VALID_GROUP_ID, COOKIE_GROUP_ID]);
  const [isGroupCodeValid, setIsGroupCodeValid] = useState<boolean | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const checkGroupCode = async (code: string, email: string) => {
    try {
      if (!email) {
        setLoginError(t('common.notice.invalid_email_msg'));
        logError({
          errorCode: 1,
          message: 'email is not provided for checkGroupCode',
          context: { code, email },
        });
        return false;
      }

      const groupCodeValidation = await getAndValidateGroupCode(code);
      if (!groupCodeValidation) return false;
      const { signUpAllowed, accountId } = groupCodeValidation;

      const context = { code, email, accountId, signUpAllowed };
      if (!signUpAllowed) {
        setLoginError(t('login_signup.notice.restricted_group_code'));
        logWarning({
          errorCode: 4023,
          message: 'Sign up with this group code is not allowed.',
          context,
        });
        return false;
      }

      if (!accountId) {
        setLoginError(t('common.notice.default_error_msg'));
        logError({
          errorCode: 1,
          message: 'accountId is not found for a group code',
          context,
        });
        return false;
      }

      // Check if user with this email & leader code
      // exists in the legacy system
      return getAndValidateLegacyStatus(email, accountId);
    } catch (error) {
      setLoginError(t('common.notice.default_error_msg'));
    }
    return false;
  };

  const checkGroupCodeValidity = async () => {
    setLoading(true);
    setLoginError('');
    if (cookie[COOKIE_VALID_GROUP_ID] === 'true' || userData?.groupCodeValid) {
      setIsGroupCodeValid(true);
      setLoading(false);
    } else if (
      (userData?.groupCode || cookie[COOKIE_GROUP_ID]) &&
      userData?.email
    ) {
      try {
        const groupCode = userData?.groupCode || cookie[COOKIE_GROUP_ID];
        const check = await checkGroupCode(groupCode, userData.email);
        setIsGroupCodeValid(check);
        setLoading(false);
      } catch (error) {
        setIsGroupCodeValid(false);
        setLoading(false);
      }
    } else {
      setIsGroupCodeValid(false);
      setLoading(false);
    }
  };

  return {
    isGroupCodeValid,
    loading,
    loginError,
    checkGroupCode,
    checkGroupCodeValidity,
  };
};
