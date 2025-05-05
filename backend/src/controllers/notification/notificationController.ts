import { Request, Response } from 'express';
import { ResponseCode } from '../../entities';
import { sendSMSToUser } from '../../features/legacyApi';
import HttpCode from '../../config/httpCode';
import wrapAsync from '../../utils/asyncErrorHandle';
import { logErrorType } from '../../utils/commonErrorLogging';

const sendSMS = wrapAsync(async (req: Request, res: Response) => {
  const { accountId, receiverPhoneNumber, messageToSend } = req.body;

  try {
    const result = await sendSMSToUser({
      accountId,
      body: {
        receiverPhoneNumber,
        messageToSend,
      },
    });

    return res.status(HttpCode.OK).json({
      status: result?.status ? ResponseCode.success : ResponseCode.error,
      message: result?.message,
    });
  } catch (error) {
    logErrorType(error, 9021, {
      accountId,
      receiverPhoneNumber,
      messageToSend,
    });
  }
});

export { sendSMS };
