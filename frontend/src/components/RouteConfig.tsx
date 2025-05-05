import { createBrowserRouter } from 'react-router-dom';

import RootBoundary from './UI/RootBoundry';
import PageNotFound from './UI/PageNotFound';
import Layout from './Layout/Layout';
import List from './smartconnector/List';
import Contact from '../page/contact/Contacts';
import Stages from './smartconnector/stages/Stages';
import ParentComponent from './statistics/UI/ParentComponent';

import {
  AuthPage,
  Dashboard,
  LoginPage,
  SignUpCreatePassword,
  SignUpName,
  SignUpPage,
  WelcomePage,
  LogoutPage,
} from '../page';
import { AuthContainer, AuthLayout } from './Layout';
import {
  SignupAdditionalInfo,
  SignUpErrorBoundary,
  SignUpExistPassword,
  SignUpFinish,
  SignUpSummary,
  SignUpEmail,
} from '../page/signUp';
import {
  ResetPasswordComplete,
  ResetPasswordRequest,
  UpdatePasswordMultiAccount,
} from '../page/login';
import { AccountSelection } from '../page/login/AccountSelection';
import { ResetPasswordWithToken } from '../page/login/ResetPasswordWithToken';

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        element: <AuthContainer showTermsAndConditions showSupportButton />,
        children: [{ path: '/', element: <WelcomePage /> }],
      },
      {
        element: <AuthContainer showSupportButton />,
        children: [
          { path: '/login', element: <LoginPage /> },
          {
            path: '/reset-password-request',
            element: <ResetPasswordRequest />,
          },
          {
            path: '/password-reset',
            element: <ResetPasswordWithToken />,
          },
          {
            path: '/reset-password-complete',
            element: <ResetPasswordComplete />,
          },
          {
            path: '/update-password',
            element: <UpdatePasswordMultiAccount />,
          },
          {
            path: '/account-selection',
            element: <AccountSelection />,
          },
          { path: '/login', element: <LoginPage /> },
          { path: '/login/:groupCode', element: <LoginPage /> },
          { path: '/login/:groupCode/:clientId', element: <LoginPage /> },
          { path: '/logout', element: <LogoutPage /> },
          { path: '/auth/user', element: <AuthPage /> },
          { path: '/auth/dashboard', element: <Dashboard /> },
          // Sign up
          { path: '/signup', element: <SignUpPage /> },
          {
            element: <SignUpErrorBoundary />,
            children: [
              { path: '/signup/password', element: <SignUpCreatePassword /> },
              {
                path: '/signup/exist-password',
                element: <SignUpExistPassword />,
              },
              { path: '/signup/name', element: <SignUpName /> },
              { path: '/signup/email', element: <SignUpEmail /> },
              { path: '/signup/additional', element: <SignupAdditionalInfo /> },
              { path: '/signup/summary', element: <SignUpSummary /> },
              { path: '/signup/:groupCode', element: <SignUpPage /> },
              { path: '/signup/:groupCode/:clientId', element: <SignUpPage /> },
            ],
          },
        ],
      },
      {
        element: <AuthContainer />,
        children: [{ path: '/signup/finish', element: <SignUpFinish /> }],
      },
      {
        path: '/smart-connectors/:id/stages',
        element: (
          <Layout>
            <Stages />
          </Layout>
        ),
        errorElement: <RootBoundary />,
      },
      {
        path: '/smart-connectors/:id/stages/:start',
        element: (
          <Layout>
            <Stages />
          </Layout>
        ),
      },
      {
        path: '/smart-connectors/:id?',
        element: (
          <Layout>
            <List />
          </Layout>
        ),
      },
      {
        path: '/statistics',
        element: <ParentComponent />,
      },
      {
        path: '/contacts',
        element: <Contact />,
      },
      {
        path: '*',
        element: (
          <Layout>
            <PageNotFound />
          </Layout>
        ),
      },
    ],
  },
]);

export default router;
