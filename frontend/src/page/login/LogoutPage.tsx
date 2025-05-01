import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_TOKEN, frontendRoutes } from '../../config';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const LogoutPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.removeItem(ACCOUNT_TOKEN);

    navigate(frontendRoutes.login);
  }, []);

  return <Typography component='h3' variant='h3regular'>{t(
    'common.button.log_out')}</Typography>;
};
