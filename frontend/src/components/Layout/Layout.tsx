import { ReactNode } from 'react';
import { Avatar, Badge, Box, Button, Typography } from '@mui/material';
import { useAuth } from '../../hooks';
import { UserActions } from '../../models/Logs';
import { logUserAction } from '../../services';
import { NavLink } from 'react-router-dom';
import { frontendRoutes } from '../../config';
import { useTranslation } from 'react-i18next';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logUserAction({
      message: UserActions.button,
      context: { button: 'logout' },
    });
    logout();
  };

  return (
    <Box
      component="main"
      sx={{
        height: '100dvh',
      }}
    >
      {user?.token && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            p: 2,
            gap: 2,
          }}
        >
          <NavLink
            to={frontendRoutes.dashboard}
            style={{ textDecoration: 'none' }}
          >
            {user.displayName}
          </NavLink>
          <Badge
            invisible={!user.proUser}
            color="success"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            badgeContent={<Typography variant="caption">Pro</Typography>}
          >
            <Avatar src={user.photo} alt={user.displayName} />
          </Badge>
          <Button variant="contained" onClick={handleLogout}>
            {t('common.button.log_out')}
          </Button>
        </Box>
      )}
      {children}
    </Box>
  );
};

export default Layout;
