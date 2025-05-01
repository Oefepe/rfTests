import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { frontendRoutes } from '../../config';
import { Button } from '../../components';
import { useTranslation } from 'react-i18next';

export const ResetPasswordComplete = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const onNext = () => {
    navigate(frontendRoutes.login);
  };

  return (
    <>
      <Typography component='h3' variant='h3regular' textAlign='center'>
        {t('login_signup.reset_password.success_msg')}
      </Typography>
      <Button text={t('login_signup.button.log_in')} onClick={onNext} />
    </>
  );
};
