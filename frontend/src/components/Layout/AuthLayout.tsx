import { Suspense, useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { AuthProvider } from '../../hooks';
import { UserActions } from '../../models/Logs';
import { logUserAction } from '../../services';

export const AuthLayout = () => {
  const outlet = useOutlet();
  const location = useLocation();

  useEffect(() => {
    logUserAction({
      message: UserActions.navigate,
      context: { to: location.pathname },
    });
  }, [location]);

  return (
    <Suspense fallback={<LinearProgress />}>
      <AuthProvider>{outlet}</AuthProvider>
    </Suspense>
  );
};
