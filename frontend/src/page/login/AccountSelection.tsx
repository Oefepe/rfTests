import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
  frontendRoutes,
  COOKIE_GROUP_ID,
  COOKIE_VALID_GROUP_ID,
  ACCOUNT_TOKEN,
} from '../../config';
import { logUserAction } from '../../services';
import { UserActions } from '../../models/Logs';
import { AuthErrorMessage } from '../../components/AuthErrorMessage';
import { Button } from '../../components';
import { useAuth } from '../../hooks';
import { logErrorType } from '../../utils/errors/commonErrorLogging';
import { useCookies } from 'react-cookie';

export const AccountSelection = () => {
  const { user, login } = useAuth();
  const { t } = useTranslation();
  const { state } = useLocation();
  const [token, setToken] = useState<string>(state?.token);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<number | null>(
    state.accounts[0].accountId || null,
  );
  const [cookie, setCookie, removeCookie] = useCookies([
    COOKIE_VALID_GROUP_ID,
    COOKIE_GROUP_ID,
  ]);

  useEffect(() => {
    removeCookie(COOKIE_GROUP_ID, { path: '/' });
    removeCookie(COOKIE_VALID_GROUP_ID, { path: '/' });
    if (user?.accounts) {
      setAccounts(user.accounts);
      const account = user.accounts.find(
        (acc) => acc.accountId === selectedAccount,
      );

      if (account) {
        // User selected account, so we can fetch login token for account
        const selectedAccountToken = account.token;
        localStorage.setItem(ACCOUNT_TOKEN, selectedAccountToken);
        window.open(
          `${frontendRoutes.legacyDashboard}${selectedAccountToken}`,
          '_self',
        );
      }
    } else {
      const accounts = state?.accounts;
      const token = state?.token;
      const email = state?.phoneEmail;
      setAccounts(accounts);
      setToken(token);
      setUserEmail(email);
    }
  }, [user, selectedAccount]);

  const onSendRequest = async () => {
    logUserAction({
      message: UserActions.button,
      context: {
        button: 'login-next',
      },
    });

    if (selectedAccount !== null) {
      try {
        removeCookie(COOKIE_GROUP_ID, { path: '/' });
        removeCookie(COOKIE_VALID_GROUP_ID, { path: '/' });
        const account = accounts.find(
          (acc) => acc.accountId === selectedAccount,
        );

        if (account) {
          // User selected account, so we can fetch login token for account
          const selectedAccountToken = account.token;
          localStorage.setItem(ACCOUNT_TOKEN, selectedAccountToken);
          window.open(
            `${frontendRoutes.legacyDashboard}${selectedAccountToken}`,
            '_self',
          );
        }
        return;
      } catch (error) {
        logErrorType(error, 4010, { selectedAccount });
      }
    }
  };

  return (
    <>
      <Typography component='h2' variant='h2regular' textAlign='center'>
        {t('login_signup.choose_account')}
      </Typography>
      <FormControl>
        <Select
          labelId='account-select-label'
          id='account-select'
          value={selectedAccount || ''}
          onChange={(event: SelectChangeEvent<number>) =>
            setSelectedAccount(
              event.target.value as React.SetStateAction<number | null>,
            )
          }
          sx={{
            '& .MuiSelect-select': {
              paddingRight: 4,
              paddingLeft: 2,
              paddingTop: 1,
              paddingBottom: 1,
              minWidth: '25ch',
            },
            boxShadow: 3,
            typography: 'bodyLarge',
            color: (theme) => theme.palette.text.secondary,
            width: '100%',
          }}
        >
          {accounts &&
            accounts.map((account) => (
              <MenuItem
                key={account.accountId}
                value={account.accountId}
                sx={{ typography: 'bodyLarge' }}
              >
                {account.accountName}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <AuthErrorMessage
        message={errorMessage}
        visible={Boolean(errorMessage)}
      />
      <Stack flex={1} width='60%' gap={2}>
        <Button
          text={t('login_signup.button.log_in')}
          onClick={onSendRequest}
        />
      </Stack>
    </>
  );
};
