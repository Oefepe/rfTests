import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../models/IUser';
import { ACCOUNT_TOKEN, frontendRoutes, ResponseCode, TOKEN } from '../config';
import apis from '../repositories/api';
import { mixpanel } from '../services/MixPanel';

type Props = {
  children: React.ReactNode;
};

type AuthContextType = {
  user?: IUser;
  login: (token: string, accountId?: number) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  login: async () => { /* template */ },
  logout: () => { /* template */},
});

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<IUser | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN);
    if (!token || user) {
      return;
    }
  }, []);

  // call this function when you want to authenticate the user
  const login = async (token: string, accountId?: number) => {
    // Store short term token for getting user data
    localStorage.setItem(TOKEN, token);
    apis.getUserData({ accountId }).then(({ data }) => {
      if (!data?.user) {
        return;
      }

      // Replace short term token with long term token for
      // future API calls
      if (data?.token) {
        localStorage.setItem(TOKEN, data.token);
      }

      setUser(data.user);

      mixpanel.identify(data.user.id);

      if (data.status === ResponseCode.unfinishedSignup) {
        navigate(frontendRoutes.signupSummary, {
          replace: true,
          // TODO: remove token from state
          state: { ...data.user, token },
        });
      }
    });
  };

  // call this function to sign out logged in user
  const logout = () => {
    mixpanel.reset();
    setUser(undefined);
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(ACCOUNT_TOKEN);
    navigate(frontendRoutes.home, { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
