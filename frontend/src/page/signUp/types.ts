import { Account } from '../../models/IUser';

export type SignupState = {
  login: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  clientId?: string;
  groupCode?: string;
  groupCodeValid?: boolean;
  accounts?: Account[];
  token?: string;
  loginError?: string;
  dataName?: string;
  dataTitle?: string;
  message?: string;
  id?: string;
  additionalData?: Record<string, string>;
  additionalDataProvided?: boolean;
  addAccount?: boolean;
};
