import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { ErrorModal, InputField, Button } from '../../components';
import { isEmail } from '../../utils';
import { useLocation, useNavigate } from 'react-router-dom';
import apis from '../../repositories/api';
import { frontendRoutes, ResponseCode, SHOW_LINK_SENT_POPUP } from '../../config';
import { logUserAction } from '../../services';
import { UserActions } from '../../models/Logs';

export const ResetPasswordRequest = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const [email, setEmail] = useState<string>(state?.email);
  const [error, setError] = useState<{ message: string; code?: number }>({ message: '' });
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (email?.trim()) {
      setError({ message: '' });
    }
  }, [email]);

  const onSendRequest = async () => {
    logUserAction({
      message: UserActions.button,
      context: {
        button: 'change-password-request',
        email,
      },
    });

    const validEmail = await isEmail(email);

    if (!validEmail) {
      setError({ message: t('common.notice.invalid_email_msg'), code: ResponseCode.invalidEmail });
      setIsErrorModalVisible(true);
      return;
    }

    const {
      data: { status },
    } = await apis.resetPasswordRequest(email);
    if (status === ResponseCode.success) {
      localStorage.setItem(SHOW_LINK_SENT_POPUP, 'true');
      navigate(frontendRoutes.login, { state: { email } });
    } else if (
      [ResponseCode.userIdNotFound, ResponseCode.authIdNotFound, ResponseCode.authIdCreationError].includes(status)
    ) {
      setError({ message: t('login_signup.notice.no_matching_email'), code: status });
      setIsErrorModalVisible(true);
      return;
    } else if (status === ResponseCode.networkError) {
      setError({ message: t('common.notice.servers_unavailable'), code: ResponseCode.networkError });
      setIsErrorModalVisible(true);
      return;
    } else {
      setError({ message: t('common.notice.default_error_msg'), code: ResponseCode.error });
      setIsErrorModalVisible(true);
    }
  };

  const handleErrorModal = () => {
    setIsErrorModalVisible(false);
  };

  return (
    <>
      <Typography component='h3' variant='h3regular' textAlign='center'
                  paddingTop={5}>
        {t('login_signup.reset_password.header')}
      </Typography>
      <Stack width='100%' gap={3}>
        <InputField
          id='signup-email-phone'
          label={t('common.field_label.email')}
          value={email}
          error={Boolean(error.message)}
          onChange={setEmail}
        />
        <ErrorModal
          isOpen={isErrorModalVisible}
          onClose={handleErrorModal}
          errorMessage={error.message}
          errorCode={error.code}
        />
      </Stack>
      {/* <Typography variant="bodySmall" textAlign="center">
        {t('changePasswordRequest')}
      </Typography> */}
      <Stack flex={1} width='100%' gap={2}>
        <Button
          disabled={!email || Boolean(error.message)}
          text={t('common.button.submit')}
          onClick={onSendRequest}
        />
      </Stack>
    </>
  );
};
