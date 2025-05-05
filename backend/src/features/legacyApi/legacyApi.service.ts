import Joi from 'joi';
import config from '../../config/config';
import HttpCode from '../../config/httpCode';
import { ResponseCode } from '../../entities';
import { logErrorType } from '../../utils/commonErrorLogging';
import { RFNGError } from '../../utils/error';
import {
  AccountIdByCode,
  LegacyPaymentStatus,
  LoginResponse,
  SignUpPayload,
  SignUpResponse,
  UserInternalUpdateRequest,
  UserContactsResponse,
} from './entities/types';
import { groupCodeResponseValidation } from './entities/validation';
import {
  AuthLogMessages,
  logInfo,
  logWarning,
  logError,
} from '../../services/log';

const responseParsing = async (response: Response, place: string) => {
  if (response.status !== HttpCode.OK)
    throw new RFNGError(9012, response?.statusText, {
      place,
      httpCode: response.status,
    });
  const result = await response.json();
  if ('errors' in result)
    throw new RFNGError(9012, result?.error?.message, {
      place,
      errors: result.errors,
    });

  return result;
};

const signUp = async (payload: SignUpPayload): Promise<SignUpResponse> => {
  const context = {
    email: payload.email,
    groupCode: payload.groupCode,
  };

  const body = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    body.set(key, value);
  });

  const response = await fetch(`${config.lumenUrl}v2/users/sign-up`, {
    method: 'POST',
    body,
  });

  if (response.status === HttpCode.UNPROCESSABLE_ENTITY) {
    logError({
      errorCode: 9024,
      message: 'A user with this email is already registered in this group.',
      context: {
        status: response.status,
      },
    });
  }

  if (
    response.status !== 201 &&
    response.headers.get('Content-Type') !== 'application/json'
  ) {
    throw new RFNGError(9012, 'Legacy signup API unexpected http status code', {
      responseStatus: response?.status,
      responseText: response?.statusText,
      ...context,
    });
  }

  const result = await response.json();

  if ('errors' in result) {
    throw new RFNGError(9012, 'Legacy signup API Error', {
      responseStatus: response?.status,
      responseText: response?.statusText,
      responseErrors: result?.errors,
      ...context,
    });
  }

  return result;
};

const getLegacyLoginToken = async (payload: SignUpPayload) => {
  const legacySignUp = await signUp(payload);
  return {
    token: legacySignUp.data[0].loginToken,
    userId: legacySignUp.data[0].id,
  };
};

const getAccountIdByCode = async (
  groupCode: string
): Promise<AccountIdByCode> => {
  try {
    if (!groupCode.trim()) {
      return { status: ResponseCode.absentValue };
    }

    const response = await fetch(
      `${config.lumenUrl}v2/groups/code/${encodeURIComponent(groupCode)}`
    );

    const result = await response.json();

    if ('errors' in result) {
      if (Array.isArray(result.errors) && result.errors[0].status === 422) {
        logInfo({
          message: result.errors[0].detail ?? 'Wrong group code',
          context: { groupCode, errors: result.errors },
        });
        return { status: ResponseCode.invalidGroupCode };
      }

      logWarning({
        errorCode: 9003,
        message: 'Error receiving group code validation',
        context: { groupCode, errors: result.errors },
      });
      return { status: ResponseCode.error };
    }

    // Check if the response is valid
    Joi.assert(result, groupCodeResponseValidation, { allowUnknown: true });

    return {
      status: ResponseCode.success,
      accountId: result.data[0].accountId,
      accountName: result.data[0].accountName,
      signUpAllowed: !result.data[0].isExternalBilling,
      isExternalBilling: result.data[0].isExternalBilling,
    };
  } catch (error) {
    let message = 'Error fetching group code';
    if (error instanceof Joi.ValidationError) {
      logErrorType(error, 9019, { groupCode, error: error.details });
      message = error.message;
    } else {
      logErrorType(error, 9003, { groupCode });
    }
    return { status: ResponseCode.error, message };
  }
};

const loginWithToken = async (loginToken: string): Promise<LoginResponse> => {
  const body = new FormData();
  body.set('loginToken', loginToken);

  const response = await fetch(`${config.lumenUrl}v2/user-login`, {
    method: 'POST',
    body,
  });

  return await responseParsing(response, 'loginWithToken');
};

const loginWithCredentials = async (
  login: string,
  password: string,
  accountId: string
): Promise<
  | {
      status: 'true' | 'false';
      profile: {
        userId: number;
        status: LegacyPaymentStatus;
        realmToken: string;
      };
      error: false;
    }
  | { error: true }
> => {
  const context = {
    username: login,
    accountId,
    legacyApi: 'v2/user-login',
  };
  const body = new FormData();
  body.set('username', login);
  body.set('password', password);
  body.set('accountId', accountId);

  const response = await fetch(`${config.lumenUrl}v2/user-login`, {
    method: 'POST',
    body,
  });

  if (response.status !== HttpCode.OK) {
    throw new RFNGError(9012, response?.statusText, {
      ...context,
      httpCode: response.status,
    });
  }

  const result = await response.json();

  if (result?.errors) {
    throw new RFNGError(9001, 'Login failed', {
      ...context,
      errorResponse: result?.errors,
    });
  }

  if (result?.error) {
    logInfo({
      message: AuthLogMessages.invalidCredentials,
      context: {
        ...context,
        errorResponse: result?.error,
      },
    });

    return { error: true };
  }

  if (result?.data?.[0]?.status === 'true') {
    return result.data[0];
  }

  throw new RFNGError(12, 'Laravel response invalid', {
    ...context,
    result,
  });
};

const accountListByEmail = async (email: string) => {
  try {
    const response = await fetch(`${config.lumenUrl}v2/users/email/${email}`);
    return response.json();
  } catch (error) {
    logErrorType(error, 9007, { email });
  }
};

const emailAvailability = async (email: string, accountId: number) => {
  try {
    const data = await accountListByEmail(email);

    switch (data.status) {
      case HttpCode.OK:
        if (
          data.content.some(
            (el: { accountId: number }) => el.accountId === accountId
          )
        ) {
          return { status: ResponseCode.userExist };
        }
        return { status: ResponseCode.vacantUser };
      case HttpCode.NOT_FOUND:
        return { status: ResponseCode.vacantUser };
      case HttpCode.UNPROCESSABLE_ENTITY:
        return { status: ResponseCode.invalidEmail };
      default:
        return { status: ResponseCode.error };
    }
  } catch (error) {
    logErrorType(error, 9004, { email });
  }
};

const getBrandingData = async (accountId: string) => {
  const postToken = await getPostToken(Number(accountId));
  if (!postToken) {
    throw new RFNGError(9008, "Can't get post-token", { accountId });
  }
  const headers = {
    Authorization: `"${postToken}"`,
    Accept: 'application/json',
  };
  const response = await fetch(`${config.lumenUrl}v2/branding/${accountId}`, {
    method: 'GET',
    headers,
  });
  const result = await responseParsing(response, 'getBrandingData');
  return result.data[0];
};

const getPostToken = async (accountId: number) => {
  try {
    const response = await fetch(
      `${config.lumenUrl}jwt/posting-keys/${accountId}`
    );

    if (response.status === HttpCode.OK) {
      const result = await response.json();

      if (result?.token && typeof result.token === 'string') {
        return result.token as string;
      }
    }

    throw new RFNGError(9008, "Can't get post-token", { accountId });
  } catch (error) {
    logErrorType(error, 9008, { accountId });
  }
};

const deleteLegacyUser = async (userId: number, accountId: number) => {
  try {
    const postToken = await getPostToken(accountId);

    if (postToken) {
      const response = await fetch(`${config.lumenUrl}v2/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `"${postToken}"`,
        },
      });

      if (response.status === HttpCode.OK) {
        const result = await response.json();

        if (Array.isArray(result.data) && result.data.length) {
          return result.data[0].id as number;
        }
      }
    }

    throw new RFNGError(9010, "Can't delete user", {
      legacyUserId: userId,
      accountId,
    });
  } catch (error) {
    logErrorType(error, 9010, { legacyUserId: userId, accountId });
  }
};

const getLegacyUser = async ({
  userId,
  accountId,
}: {
  userId: number;
  accountId: number;
}) => {
  const postToken = await getPostToken(accountId);
  const headers = {
    Authorization: `"${postToken}"`,
    Accept: 'application/json',
  };
  try {
    const response = await fetch(`${config.lumenUrl}v2/users/${userId}`, {
      headers,
    });

    if (response.status === HttpCode.OK) {
      const result = await response.json();

      if (Array.isArray(result.data) && result.data.length) {
        return result.data[0];
      }
    }

    throw new RFNGError(9011, "Can't get user", { legacyUserId: userId });
  } catch (error) {
    logErrorType(error, 9011, { legacyUserId: userId });
  }
};

const updateLegacyUser = async ({
  accountId,
  userId,
  body,
}: {
  accountId: number;
  userId: number;
  body: UserInternalUpdateRequest;
}) => {
  const postToken = await getPostToken(accountId);
  const headers = {
    Authorization: `"${postToken}"`,
    'Content-Type': 'application/json',
  };
  try {
    const payload = JSON.stringify(body);

    const response = await fetch(`${config.lumenUrl}v2/users/${userId}`, {
      method: 'PATCH',
      headers,
      body: payload,
    });

    return response.status === HttpCode.OK;
  } catch (error) {
    logErrorType(error, 9011, { legacyUserId: userId });
    return false;
  }
};

const sendSMSToUser = async ({
  accountId,
  body,
}: {
  accountId: number;
  body: { receiverPhoneNumber: string; messageToSend: string };
}) => {
  try {
    const postToken = await getPostToken(accountId);

    if (!postToken) {
      throw new RFNGError(9008, "Can't get post-token", { accountId });
    }

    const headers = {
      Authorization: `"${postToken}"`,
      Accept: 'application/json',
    };

    const formData = new FormData();

    formData.append('receiverPhoneNumber', body.receiverPhoneNumber);
    formData.append('messageToSend', body.messageToSend);

    const response = await fetch(`${config.lumenUrl}send/message`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return {
      status:
        response.status === HttpCode.OK || response.status === HttpCode.CREATED,
      message: response.statusText,
    };
  } catch (error) {
    logErrorType(error, 9021, { accountId });
  }
};

const getUserToken = async (userId: number) => {
  try {
    const response = await fetch(`${config.lumenUrl}jwt/users/${userId}`);

    if (response.status === HttpCode.OK) {
      const result = await response.json();

      if (result?.token && typeof result.token === 'string') {
        return result.token as string;
      }
    }

    throw new RFNGError(9008, "Can't get post-token", { userId });
  } catch (error) {
    logErrorType(error, 9008, { userId });
  }
};

const getUserGroups = async (userId: number) => {
  try {
    const userToken = await getUserToken(userId);

    const headers = {
      Authorization: `"${userToken}"`,
      Accept: 'application/json',
    };

    const response = await fetch(`${config.lumenUrl}v2/groups/users`, {
      headers,
    });

    return response.json();
  } catch (error) {
    logErrorType(error, 9023, {
      action: "Can't get user group codes",
    });
  }
};

const getResourceDetailsById = async (resourceId: string, userId: string) => {
  try {
    const userAuthToken = await getUserToken(Number(userId));

    if (!userAuthToken) {
      throw new Error('Could not get user jwt token');
    }

    const response = await fetch(`${config.lumenUrl}resources/${resourceId}`, {
      headers: {
        Authorization: `"${userAuthToken}"`,
        Accept: 'application/json',
      },
    });

    return response.json();
  } catch (error) {
    logErrorType(error, 1074, {
      action: "Can't get legacy resource details by id",
    });
  }
};

const getUserContacts = async (
  userId: number
): Promise<UserContactsResponse | undefined> => {
  try {
    const userToken = await getUserToken(userId);

    const headers = {
      Authorization: `"${userToken}"`,
      Accept: 'application/json',
    };

    const response = await fetch(
      `${config.lumenUrl}v2/users/${userId}/contacts`,
      {
        headers,
      }
    );

    return response.json();
  } catch (error) {
    logErrorType(error, 9025, {
      action: "Can't get user contacts",
    });
  }
};

export {
  signUp,
  getAccountIdByCode,
  loginWithCredentials,
  loginWithToken,
  accountListByEmail,
  emailAvailability,
  getBrandingData,
  getLegacyLoginToken,
  getPostToken,
  deleteLegacyUser,
  getLegacyUser,
  updateLegacyUser,
  sendSMSToUser,
  getUserGroups,
  getUserToken,
  getResourceDetailsById,
  getUserContacts,
};
