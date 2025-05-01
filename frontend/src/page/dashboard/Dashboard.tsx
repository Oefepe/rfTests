import { useAuth } from '../../hooks';
import { Avatar, Box, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { frontendRoutes } from '../../config';
import { useTranslation } from 'react-i18next';

export const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return <Navigate to={frontendRoutes.home} />;
  }

  return (
    <Box
      sx={{
        width: 1,
        flexDirection: 'row',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{ width: 128, height: 128 }}
          src={user?.photo}
          alt={user?.displayName}
        />
        <Box>
          <Typography variant='bodySmall'>{t('firstName')}:</Typography>
          <Typography variant='bodyLarge'>{user?.firstName}</Typography>
          <Typography variant='bodySmall'>{t('lastName')}:</Typography>
          <Typography variant='bodyLarge'>{user?.lastName}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          margin: 5,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant='bodyLarge'>{t('email')}: {user?.email}</Typography>
        <Typography variant='bodyLarge'>Pro user: {user?.proUser ?
          t('yes') :
          t('no')}</Typography>
        {
          user?.phone &&
          <Typography variant='bodyLarge'>{t(
            'phone')}: {user?.phone}</Typography>
        }
        <Typography variant='bodyLarge'>IDP: {user?.provider}</Typography>
      </Box>
    </Box>
  );
};
