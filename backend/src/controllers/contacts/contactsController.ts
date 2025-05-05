import { Request, Response } from 'express';
import { getUserContacts } from '../../features/legacyApi';
import { UserJwtPayload } from '../../entities';
import { logErrorType } from '../../utils/commonErrorLogging';
import { getUserById } from '../../services/userService';
import { RFNGError } from '../../utils/error';
import { getUserData } from '../user/userController';
import wrapAsync from '../../utils/asyncErrorHandle';
import HttpCode from '../../config/httpCode';

const MIN_HOT_CONTACT_POINTS = 50;

const getContactsCount = wrapAsync(async (req: Request, res: Response) => {
  const { id, accountId } = req.user as UserJwtPayload;
  const user = await getUserById(id);

  if (!user) {
    throw new RFNGError(5013, `Can't get user`, { id });
  }

  const { accountData } = getUserData(user, accountId);
  const userId = Number(accountData?.userId);

  try {
    const contacts = await getUserContacts(userId);

    const totalContactsCount = contacts?.data.length ?? 0;
    const hotContactsCount =
      contacts?.data.filter(
        (contact) => contact.points >= MIN_HOT_CONTACT_POINTS
      ).length ?? 0;

    return res
      .status(HttpCode.OK)
      .json({ totalContactsCount, hotContactsCount });
  } catch (error) {
    logErrorType(error, 9025, {
      action: "Can't get user contacts",
    });
  }
});

export { getContactsCount };
