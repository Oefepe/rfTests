/**
 * Contains function common for all accounts, tht use NetReady IDP
 */
import Joi from 'joi';
import { AccountUserData, IUser, Providers } from '../../entities';

interface NetReadyUser {
  userId: number;
  profilePictureMediaSourceId: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  accessCard: boolean;
  proCard: boolean;
  code: string;
}

/**
 * Generates object that contains user {IUser} field and
 * extra field with additional user data
 * @param user NetReady user object from the IDP response
 * @param provider Provider name
 * @param groupCode RapidFunnel group code
 * @param account {AccountUserData}
 */
export const netReadyUserNormalize = (
  user: NetReadyUser,
  provider: Providers,
  groupCode: string,
  account?: AccountUserData
): {
  user: IUser;
  extra: {
    userId: number;
    username: string;
    accessCard: boolean;
    proCard: boolean;
    code: string;
  };
} => {
  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      photo: user.profilePictureMediaSourceId,
      phone: user.telephone,
      proUser: user.proCard,
      groupCode, // todo: move it to the accounts
      accounts: account ? [account] : [],
    },
    extra: {
      userId: user.userId,
      username: `${provider}-${user.userId}`,
      accessCard: user.accessCard,
      proCard: user.proCard,
      code: user.code,
    },
  };
};

export const netReadyUserValidate = (user: unknown) => {
  const validateSchema = Joi.object({
    userId: Joi.number().required(),
    accessCard: Joi.boolean().required(),
  });

  return validateSchema.validate(user, { allowUnknown: true });
};
