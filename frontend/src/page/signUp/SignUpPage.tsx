import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import { COOKIE_GROUP_ID, COOKIE_VALID_GROUP_ID, frontendRoutes, ResponseCode } from '../../config';
import apis from '../../repositories/api';
import { useBranding } from '../../hooks';
import { SignupState } from './types';
import { useGroupCodeValidity } from './hooks/useGroupCodeValidity';
import { InputField, SpinLoader, Button } from '../../components';

export const SignUpPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const state = location.state as SignupState;
  const { groupCode } = useParams();
  const { fetchThemeByGroup } = useBranding();
  const [groupCodeInput, setGroupCodeInput] = useState<string>(groupCode ?? '');
  const [loginError, setLoginError] = useState('');
  const [, , removeCookie] = useCookies([COOKIE_VALID_GROUP_ID, COOKIE_GROUP_ID]);
  const navigate = useNavigate();
  const { loginError: groupCodeError } = useGroupCodeValidity(state);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // if group code already defined in the URL
    if (groupCodeInput.trim()) groupCodeHandler();
  }, []);

  useEffect(() => {
    // RFNG-921: if user back to signup page from the next signup pages, we need to clear the signup method.
    localStorage.removeItem('rfToken');
    removeCookie(COOKIE_GROUP_ID, { path: '/' });
    removeCookie(COOKIE_VALID_GROUP_ID, { path: '/' });
  }, []);

  useEffect(() => {
    setLoginError(groupCodeError);
  }, [groupCodeError]);

  const handleGroupCode = (value: string) => {
    setGroupCodeInput(value);
    setLoginError('');
  };

  const groupCodeHandler = async () => {
    setIsLoading(true);
    if (!groupCodeInput.trim()) {
      setLoginError(t('common.notice.required'));
      return;
    }

    const { data: groupData } = await apis.checkCode({ code: groupCodeInput });

    if (groupData.status === ResponseCode.success && groupData.signUpAllowed) {
      await fetchThemeByGroup(groupCodeInput);
      navigate(frontendRoutes.signupEmail, {
        state: { ...state, groupCode: groupCodeInput, groupCodeValid: true },
      });
    } else {
      setLoginError(t('login_signup.notice.restricted_group_code'));
    }
    setIsLoading(false);
  };

  const onNext = async () => {
    groupCodeHandler();
  };

  if (isLoading) {
    return <SpinLoader />;
  }

  return (
    <>
      <Stack width="100%" spacing={2}>
        <Typography component="h2" variant="h2regular" sx={{ color: 'primary.main' }} textAlign="center">
          {t('login_signup.group_code.header_msg_desktop')}
        </Typography>
      </Stack>
      <Stack width="100%" spacing={8}>
        <Stack spacing={6} mt={3}>
          <InputField
            type={'groupCode'}
            label={t('common.field_label.group_code')}
            value={groupCodeInput}
            onChange={handleGroupCode}
            error={!!loginError}
            helperText={loginError}
          />
          <Typography variant="bodyLarge" color="text.primary" align="center">
            {t('login_signup.group_code.sub_header_msg')}
          </Typography>
        </Stack>
        <Button disabled={!groupCodeInput?.trim()} text={t('common.button.next')} onClick={onNext} />
      </Stack>
    </>
  );
};
