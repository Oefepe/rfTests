import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCookies } from 'react-cookie';
import {
  COOKIE_GROUP_ID,
  COOKIE_VALID_GROUP_ID,
  frontendRoutes,
} from '../../config';
import {
  AuthErrorMessage,
  EditableRecord,
  RfLink,
  SpinLoader,
  Button,
} from '../../components';
import { isEmail } from '../../utils';
import { logErrorType } from '../../utils/errors/commonErrorLogging';
import { SignupState } from './types';
import { useGroupCodeValidity } from './hooks/useGroupCodeValidity';
import { useCreateAccount } from './hooks/useCreateAccount';
import { CheckButton } from '../../components/CheckButton';
import { useLicense } from '../../hooks/useLicense';

export const SignUpSummary = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [editableField, setEditableField] = useState<Record<string, boolean>>();
  const [userData, setUserData] = useState<SignupState>(state);
  const { isGroupCodeValid, loading, loginError, checkGroupCodeValidity } =
    useGroupCodeValidity(userData);
  const { handleCreateAccount, confirm, error } = useCreateAccount(userData);
  const [privacyConfirm, setPrivacyConfirm] = useState<boolean>(false);
  const [termsConfirm, setTermsConfirm] = useState<boolean>(false);
  const [emailCheck, setEmailCheck] = useState<boolean>();
  const [cookie] = useCookies([COOKIE_VALID_GROUP_ID, COOKIE_GROUP_ID]);
  const { handleLicenseLink, LicenseModalWindow } = useLicense();

  useEffect(() => {
    if (!userData) {
      navigate(frontendRoutes.signup, { replace: true });
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.login) {
      isEmail(userData?.login)
        .then((res) => setEmailCheck(res))
        .catch((e) => {
          logErrorType(e, 1, { login: userData?.login });
        });
    }

    if (userData?.email) {
      isEmail(userData?.email)
        .then((res) => setEmailCheck(res))
        .catch((e) => {
          logErrorType(e, 1, { email: userData?.email });
        });
    }
  }, [userData?.login, userData?.email]);

  useEffect(() => {
    checkGroupCodeValidity();
  }, [
    userData?.groupCode,
    cookie[COOKIE_GROUP_ID],
    cookie[COOKIE_VALID_GROUP_ID],
  ]);

  const toggleEdit = (name: string) => {
    setEditableField({ ...editableField, [name]: !editableField?.[name] });
  };

  const onEdit = (name: string, value?: string) => {
    setUserData({ ...userData, [name]: value });
  };

  if (userData.groupCodeValid !== true && isGroupCodeValid !== true) {
    navigate(frontendRoutes.signup, {
      state: {
        ...userData,
        dataName: 'groupCode',
        dataTitle: t('login_signup.group_code.header_msg_desktop'),
        loginError,
      },
      replace: true,
    });
  } else if (!userData?.additionalDataProvided) {
    navigate(frontendRoutes.signupAdditionalInfo, {
      state: userData,
      replace: true,
    });
  }

  if (loading) {
    return <SpinLoader />;
  }

  return (
    <>
      <LicenseModalWindow/>
      <Typography
        component='h2'
        variant='h2regular'
        sx={{ color: 'primary.main', textAlign: 'center' }}
      >
        {t('login_signup.info_review.header_msg')}
      </Typography>
      <Stack width="100%" spacing={1}>
        <Box
          sx={{
            display: 'inline-flex',
            padding: '30px 20px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '20px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: 'text.neutral400',
          }}
        >
          <EditableRecord
            name="firstName"
            title={t('common.field_label.first_name')}
            value={userData.firstName || ''}
            error={!userData.firstName}
            errorText={t('common.notice.required')}
            editable={editableField?.firstName}
            toggleEditable={toggleEdit.bind(this, 'firstName')}
            onChange={onEdit.bind(this, 'firstName')}
          />
          <EditableRecord
            name="lastName"
            title={t('common.field_label.last_name')}
            value={userData.lastName || ''}
            error={!userData.lastName}
            errorText={t('common.notice.required')}
            editable={editableField?.lastName}
            toggleEditable={toggleEdit.bind(this, 'lastName')}
            onChange={onEdit.bind(this, 'lastName')}
          />
          <EditableRecord
            name="email"
            title={t('common.field_label.email')}
            value={userData.login || userData.email || ''}
            editable={editableField?.email}
            toggleEditable={toggleEdit.bind(this, 'email')}
            onChange={onEdit.bind(this, `${userData.login ? 'login' : 'email'}`)}
            error={!emailCheck}
            hideButton={true}
          />
        </Box>

        <Box sx={{ flexDirection: 'row' }} width="100%">
          <Typography
            variant='bodyLarge'
            noWrap={true}
            display={'inline-block'}
            width={'100%'}
            sx={{ marginTop: 2 }}
          >
            <CheckButton
              checked={privacyConfirm}
              onChange={setPrivacyConfirm.bind(this, !privacyConfirm)}
            />
            <Typography
              component="span"
              variant="bodyLarge"
              color={'text.neutral700'}
            >
              {t('login_signup.info_review.i_agree_to_the')}&nbsp;
            </Typography>
            <RfLink onClick={handleLicenseLink.bind(this, 'privacy')}>
              {t('common.button.privacy_policy')}
            </RfLink>
          </Typography>
          <Typography
            variant='bodyLarge'
            noWrap={true}
            display={'inline-block'}
            width={'100%'}
          >
            <CheckButton
              checked={termsConfirm}
              onChange={setTermsConfirm.bind(this, !termsConfirm)}
            />
            <Typography
              component="span"
              variant="bodyLarge"
              color={'text.neutral700'}
            >
              {t('login_signup.info_review.i_agree_to_the')}&nbsp;
            </Typography>
            <RfLink onClick={handleLicenseLink.bind(this, 'terms')}>
              {t('common.button.terms_and_conditions')}
            </RfLink>
          </Typography>
        </Box>

        <AuthErrorMessage message={error} visible={Boolean(error)} />

        <Button
          disabled={
            confirm ||
            !privacyConfirm ||
            !termsConfirm ||
            !userData.firstName ||
            !userData.lastName ||
            Object.values(editableField || {}).some((el) => el)
          }
          text={t('login_signup.button.get_started')}
          onClick={handleCreateAccount}
        />
      </Stack>
    </>
  );
};
