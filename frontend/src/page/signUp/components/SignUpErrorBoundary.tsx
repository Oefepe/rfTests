import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, Outlet } from 'react-router';
import { frontendRoutes } from '../../../config';
import { logError } from '../../../services';

function fallbackRender({ error }: { error: Error }) {
  logError({
    errorCode: 4011,
    message: error?.message,
    stacktrace: error?.stack,
  });

  return <Navigate to={frontendRoutes.signup} />;
}

export const SignUpErrorBoundary = () => {
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <Outlet />
    </ErrorBoundary>
  );
};
