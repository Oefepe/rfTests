import { Auth } from '../db/mongo/models/authModel';
import { pwdHash } from '../utils';
import config from '../config/config';
import { Providers } from '../entities';
import { RevisionCode } from '../features/revision/revision.entities';
import CryptoJs from 'crypto-js';
import { logInfo } from './log';

export type AuthIdType = {
  _id?: string;
  userId?: string | null;
  userName: string;
  salt?: string | null;
  password?: string | null;
  provider: string;
  pwdResetDate?: Date | null;
  pwdResetCode?: string | null;
  revision: number;
};

const createAuthId = async (
  authId: Omit<AuthIdType, 'revision'>
): Promise<AuthIdType> => {
  const newAuthId = await new Auth(authId).save();
  const document = newAuthId.toObject();
  return { ...document, _id: newAuthId._id.toHexString() };
};

const getUserIdByAuthId = async (
  authId: string
): Promise<AuthIdType | null> => {
  return Auth.findById(authId).lean();
};

const getAuthIdByUserName = async (
  userName: string
): Promise<AuthIdType | null> => {
  return Auth.findOne({ userName }).lean();
};

const getAuthIdByPwdResetToken = async (
  pwdResetCode: string
): Promise<AuthIdType | null> => {
  return Auth.findOne({ pwdResetCode }).lean();
};

const getAuthIdByUserId = async (
  userId: string
): Promise<AuthIdType | null> => {
  return Auth.findOne({ userId }).lean();
};

const getAuthIdsByUserId = async (userId: string): Promise<AuthIdType[]> => {
  return Auth.find({ userId }).lean();
};

const getAuthIdByProvider = async (userId: string, provider: Providers) => {
  return Auth.findOne({ userId, provider }).lean();
};

const updateAuthId = async (id: string, authIdData: Partial<AuthIdType>) => {
  return Auth.findByIdAndUpdate(id, authIdData);
};

const genPwdResetCode = async (id: string) => {
  const code = Math.floor(Math.random() * 9e5) + 1e5;

  await updateAuthId(id, {
    pwdResetCode: code.toString(),
    pwdResetDate: new Date(),
  });

  return { code };
};

const genPwdResetToken = async (id: string, userEmail: string) => {
  const payload = {
    id,
    email: userEmail,
    exp: Date.now() + config.auth.pwdLinkExpiration,
  };

  // Encrypt the payload
  const encryptedToken = encryptToken(JSON.stringify(payload));
  const expires = new Date(Date.now() + config.auth.pwdLinkExpiration);

  await updateAuthId(id, {
    pwdResetCode: encryptedToken,
    pwdResetDate: expires,
  });

  const resetLink = `${
    config.auth.webClient
  }/password-reset?token=${encodeURIComponent(encryptedToken)}`;

  return { resetLink };
};

export const encryptToken = (data: string): string => {
  return CryptoJs.AES.encrypt(data, config.auth.resetPwdSecretKey).toString();
};

const changePassword = async (id: string, password: string) => {
  const hashedPassword = await pwdHash(password);
  return updateAuthId(id, {
    password: hashedPassword,
    salt: '',
    pwdResetDate: new Date(0),
    pwdResetCode: '',
    revision: RevisionCode.default,
  });
};

const processPwdResetWithToken = async ({
  token,
  password,
}: {
  token: string;
  password?: string;
}) => {
  const authData = await getAuthIdByPwdResetToken(token);
  const context: Record<string, unknown> = { token };

  if (!authData?._id) {
    logInfo({
      message: 'Error fetching authId by using password reset token',
      context,
    });
    return false;
  }

  const { _id, pwdResetDate, pwdResetCode, provider } = authData;

  if (_id && pwdResetDate && provider === Providers.email) {
    const currentDate = new Date();
    const resetThreshold = new Date(pwdResetDate);

    if (pwdResetCode === token && currentDate < resetThreshold) {
      if (password?.trim()) {
        await changePassword(_id, password);
        return true;
      } else {
        logInfo({
          message: 'Password cannot be empty or whitespace only',
          context,
        });
        return false;
      }
    } else {
      logInfo({
        message: 'Invalid token or expired password reset link',
        context,
      });
    }
  }

  return false;
};

const userIsLocal = async (email: string) => {
  const user = await getAuthIdByUserName(`${Providers.email}-${email}`);

  return Boolean(user);
};

const deleteAuthIdById = async (id: string) => {
  return Auth.findByIdAndDelete(id);
};

const deleteAuthIdByIds = async (
  ids: (string | undefined)[]
): Promise<{
  acknowledged: boolean;
  deletedCount: number;
}> => {
  return Auth.deleteMany({ _id: { $in: ids } });
};

export {
  createAuthId,
  getUserIdByAuthId,
  getAuthIdByUserName,
  getAuthIdByUserId,
  getAuthIdsByUserId,
  updateAuthId,
  genPwdResetCode,
  changePassword,
  getAuthIdByProvider,
  userIsLocal,
  deleteAuthIdById,
  deleteAuthIdByIds,
  genPwdResetToken,
  processPwdResetWithToken,
};
