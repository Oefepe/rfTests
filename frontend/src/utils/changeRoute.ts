import { NavigateFunction, matchPath } from 'react-router';
import { frontendRoutes } from '../config';

const signupExceptionRoutes = [
  frontendRoutes.signupName,
  frontendRoutes.signupPassword,
  frontendRoutes.signupAdditionalInfo,
  frontendRoutes.signupSummary,
  frontendRoutes.signupEmail,
];

export const changeRoute = (
  navigate: NavigateFunction,
  currentPath: string
): void => {
  if (matchPath({ path: frontendRoutes.login, end: false }, currentPath)) {
    navigate(frontendRoutes.home);
    return;
  }

  if (
    matchPath({ path: frontendRoutes.signup, end: false }, currentPath) &&
    !signupExceptionRoutes.some((route) =>
      matchPath({ path: route, end: false }, currentPath)
    )
  ) {
    navigate(frontendRoutes.home);
    return;
  }

  if (matchPath(frontendRoutes.resetPasswordRequest, currentPath)) {
    navigate(frontendRoutes.login);
    return;
  }

  navigate(-1);
};
