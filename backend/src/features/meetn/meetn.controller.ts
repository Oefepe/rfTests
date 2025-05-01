import { Request, Response } from 'express';
import {
  checkRoomAvailabilityService,
  createContactService,
} from './meetn.service';
import { GroupCodes, MeetnContact } from './meetn.entities';
import { getUserData } from '../../controllers/user/userController';
import { ResponseCode, UserJwtPayload } from '../../entities';
import { getUserById } from '../../services/userService';
import { RFNGError } from '../../utils/error';
import { getUserGroups } from '../legacyApi';
import { logErrorType } from '../../utils/commonErrorLogging';
import HttpCode from '../../config/httpCode';
import config from '../../config/config';

export const createContact = async (req: Request, res: Response) => {
  try {
    const { room } = req.body;
    const { id, accountId } = req.user as UserJwtPayload;
    const roomAvailability = await checkRoomAvailabilityService(room);

    if (!roomAvailability) {
      return res
        .status(HttpCode.OK)
        .json({ status: ResponseCode.meetnRoomExist });
    }

    const dbUser = await getUserById(id);

    if (!dbUser) {
      throw new RFNGError(5013, `Can't get user`, { userId: id });
    }

    const { accountData } = getUserData(dbUser, accountId);

    if (!accountData) {
      throw new RFNGError(1009, `Can't receive accountData`, { userId: id });
    }

    const groupCodes: GroupCodes = await getUserGroups(accountData.userId);

    const groupCode = Object.values(Object.entries(groupCodes)[0][1])[0];

    const meetnContact: MeetnContact = {
      CompanyName: accountData.companyName ?? 'RapidFunnel',
      CompanySupportEmail: config.mail.supportAddress,
      AffiliateID: '',
      Name: dbUser.displayName,
      EmailAddress: dbUser.email ?? '',
      Plan: 'Free',
      Room: room,
      BundleID: '',
      SubstitutionKey: '',
      SubstitutionVal: '',
      FID: groupCode,
      PartnerGUID: config.meetn.meetnPartnerGUID,
    };

    const result = await createContactService(meetnContact);
    if (result?.error) {
      const message = result.message.msg[0].msg;
      if (message === 'An account with this email already exists.') {
        return res
          .status(HttpCode.OK)
          .json({ status: ResponseCode.meetnEmailExist });
      } else if (message === 'Room name is already taken.') {
        return res
          .status(HttpCode.OK)
          .json({ status: ResponseCode.meetnRoomExist });
      }
    }

    return res.status(HttpCode.OK).json({ status: ResponseCode.success });
  } catch (error) {
    logErrorType(error, 2020, {
      action: 'Failed to create meetn contact',
    });
    return res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
};
