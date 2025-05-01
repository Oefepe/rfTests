import { Stack } from '@mui/material';
import { useAuth } from '../../hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import {frontendRoutes, TOKEN} from '../../config';
import { useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { GoToSignup } from './GoToSignup';
import { GoToLogin } from './GoToLogin';

export const AuthPage = () => {
  const params = useLocation();
  const { login } = useAuth();
  const [_, , removeCookie] = useCookies(['groupId']);
  const navigate = useNavigate();

  const searchParams = useMemo(() => {
    const parsedValue = new URLSearchParams(params.search);
    return {
      accounts: parsedValue.get('accounts'),
      sessionUser: parsedValue.get('sessionUser'),
      token: parsedValue.get('token') as string,
      vacant: parsedValue.has('vacant'),
      exist: parsedValue.has('exist'),
      created: parsedValue.has('created'),
    };
  }, [params.search]);

  useEffect(() => {
    removeCookie('groupId');
  }, []);

  useEffect(() => {
    if (searchParams.exist || searchParams.created) {
      const accounts = JSON.parse(searchParams.accounts || '[]');
      const sessionUser = JSON.parse(searchParams.sessionUser || '{}');
      const token = searchParams.token || '';
      localStorage.setItem(TOKEN, token);

      if (accounts?.length && accounts?.length > 1) {
        navigate(frontendRoutes.accountSelection, {
          state: { accounts, token },
        });
        return;
      } else if (accounts?.length && accounts?.length === 1) {
        localStorage.setItem('accountToken', accounts[0].token);
        navigate(frontendRoutes.home);
        return;
      } else {
        navigate(frontendRoutes.signupSummary, {
          replace: true,
          state: { ...sessionUser, token },
        });
      }
    }
  }, [searchParams, login]);

  return <Stack>{searchParams.vacant ? <GoToSignup /> : <GoToLogin />}</Stack>;
};
