import { backendRoutes } from '../config/config';
import { IUser } from '../models/IUser';

export type IAuthResponse = {
  message: string;
  success: boolean;
  user?: IUser;
};

export const getUserData = async (token: string) => {
  const response = await fetch(backendRoutes.session, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data: IAuthResponse = await response.json();
  return data;
};

export const logoutUser = async () => {
  localStorage.removeItem('rfToken');
  await fetch(backendRoutes.logout);
};
