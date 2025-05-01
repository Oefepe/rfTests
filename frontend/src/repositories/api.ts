import { IBrandingResponse } from '../models/IBranding';
import { IUser, IUserUpdate } from '../models/IUser';
import Repository from './Repository';
import { trimObjectValues } from '../utils';

const apiPrefix = 'api';
const dataUrl = `${apiPrefix}/data`;
const authUrl = `${apiPrefix}/auth`;
const userUrl = `${apiPrefix}/user`;
const notificationsUrl = `${apiPrefix}/notifications`;

interface StatusResponse {
  status: number;
}

interface FinishSsoSignupResponse extends StatusResponse {
  token: string;
  accounts?: Account[];
}

interface Account {
  accountId: number;
  token: string;
}

interface LeaderResponse extends StatusResponse {
  accountId?: number;
  accountName?: string;
  signUpAllowed?: boolean;
  isExternalBilling?: boolean;
}

interface UserAccountApiResponse {
  id: number;
  accountId: number;
  companyName: string;
  accountName: string;
  dashboardLogo: string;
}

export interface LoginResponse extends StatusResponse {
  token?: string;
  accounts?: UserAccountApiResponse[];
  revision?: number;
}

interface IAuthResponse extends StatusResponse {
  user?: IUser;
  token?: string;
}

export type ISignupRequest = {
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  clientId?: string;
  groupCode?: string;
  token?: string;
  additionalData?: Record<string, string>;
};

interface PasswordResetWithToken {
  token: string;
  password: string;
}

const apis = {
  loginByEmail(payload: { email: string; password: string }) {
    return Repository.post<LoginResponse>(
      `${authUrl}/email?type=login`,
      trimObjectValues(payload)
    );
  },
  loginByPhone(payload: { phone: string; password: string }) {
    return Repository.post<LoginResponse>(
      `${authUrl}/phone?type=login`,
      trimObjectValues(payload)
    );
  },
  signupByEmail(payload: ISignupRequest) {
    const { login, ...rest } = payload;
    const data = { ...rest, email: login };
    return Repository.post<LoginResponse>(
      `${authUrl}/email?type=signup`,
      trimObjectValues(data)
    );
  },
  signupByPhone(payload: ISignupRequest) {
    const { login, ...rest } = payload;
    const data = { ...rest, phone: login };
    return Repository.post<LoginResponse>(
      `${authUrl}/phone?type=signup`,
      trimObjectValues(data)
    );
  },
  getEvents() {
    return Repository.get(`${dataUrl}`);
  },
  getDataById(id: number) {
    return Repository.get(`${dataUrl}/${id}`);
  },
  putDataById(id: number, payload: { name: string }) {
    return Repository.put(`${dataUrl}/${id}`, payload);
  },
  deleteDataById(id: number) {
    return Repository.delete(`${dataUrl}/${id}`);
  },
  checkEmail(payload: { email: string }) {
    const searchParams = new URLSearchParams();
    searchParams.append('email', payload.email);
    return Repository.get<StatusResponse>(
      `${authUrl}/email/verify?${searchParams.toString()}`
    );
  },
  checkPhone(payload: { phone: string }) {
    const searchParams = new URLSearchParams();
    searchParams.append('phone', payload.phone);
    return Repository.get<StatusResponse>(
      `${authUrl}/phone/verify?${searchParams.toString()}`
    );
  },
  checkCode(payload: { code: string }) {
    const searchParams = new URLSearchParams();
    const { code } = trimObjectValues(payload);
    searchParams.append('code', String(code));
    return Repository.get<LeaderResponse>(
      `${authUrl}/code/verify?${searchParams.toString()}`
    );
  },
  checkLegacyUser(payload: { email: string; accountId: number }) {
    return Repository.post<StatusResponse>(`${authUrl}/email/verify`, payload);
  },
  getUserData(payload?: { accountId?: number }) {
    const queryString = payload?.accountId
      ? `${authUrl}/session?accountId=${payload?.accountId}`
      : `${authUrl}/session`;
    return Repository.get<IAuthResponse>(queryString);
  },
  getUser(token: string) {
    return Repository.get<{ status: number; user: IUser }>(userUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  changeUser(token: string, payload: Partial<IUserUpdate>) {
    return Repository.patch<{ status: number }>(userUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  finishSsoSignup(payload: {
    firstName: string;
    lastName?: string;
    groupCode: string;
    email: string;
    id?: string;
  }) {
    return Repository.put<FinishSsoSignupResponse>(
      `${authUrl}/finish-signup`,
      payload
    );
  },
  getBrandingData(accountId: string) {
    return Repository.get<IBrandingResponse>(
      `${apiPrefix}/branding/${accountId}`
    );
  },
  resetPasswordRequest(email: string) {
    return Repository.post<StatusResponse>(
      `${authUrl}/reset-pwd-request-link`,
      trimObjectValues({
        to: email,
      })
    );
  },
  resetPasswordWithToken(body: PasswordResetWithToken) {
    return Repository.post<StatusResponse>(
      `${authUrl}/reset-pwd-token`,
      trimObjectValues({ ...body })
    );
  },
  // Unify password for multi accounts
  updatePassword(token: string, payload: { email: string; password: string }) {
    return Repository.put<StatusResponse>(`${authUrl}/update-pwd`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  // Update revision
  updateRevision(token: string, payload: { revision: number }) {
    return Repository.put<StatusResponse>(
      `${authUrl}/update-revision`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  addAccount(token: string, payload: { groupCode: string }) {
    return Repository.put<{ status: number, accounts: UserAccountApiResponse[] }>(
      `${userUrl}/add-account`,
      trimObjectValues(payload),
      {
        headers: {
          Authorization: `Bearer ${token}`, // short-term token
        },
      }
    );
  },
  checkResetCode(payload: { email: string; code: string }) {
    return Repository.post<StatusResponse>(
      `${authUrl}/confirm-reset-code`,
      payload
    );
  },
  getLicense(type: 'terms' | 'privacy') {
    return Repository.get<{status: number, text: string}>(
      `${apiPrefix}/license/${type}`
    );
  },
  sendSMSToUser(payload: { receiverPhoneNumber: string; messageToSend: string; accountId: number }) {
    return Repository.post<{ status: number; message: string }>(`${notificationsUrl}/send-sms`, payload);
  },
  getQRCode(payload: { url: string; size?: string; color?: string; bgColor?: string }) {
    return Repository.get<{ qrCodeUrl: string }>(`${apiPrefix}/qr-code`, {
      params: payload,
    });
  },
};

export default apis;
