import { Request, Response } from 'express';
import wrapAsync from '../../utils/asyncErrorHandle';
import { ClientLog } from '../../entities';
import { clientLogger, logError } from '../../services/log';
import HttpCode from '../../config/httpCode';
import { UserEventLog, logUserEvent } from '../../services/log/eventLogger';

export const parseClientLogs = wrapAsync(
  async (req: Request, res: Response) => {
    const { user } = req;
    let userId: string;

    if (user && 'id' in user && 'email' in user) {
      userId = String(user.id);
    }

    const { logs } = req.body as ClientLog;

    logs.forEach(
      ({
        level,
        message,
        timestamp,
        logger,
        stacktrace,
        context,
        deviceId,
        errorCode,
        appVersion,
      }) => {
        clientLogger(userId, logger).log(
          level,
          message,
          {
            errorCode,
            deviceId,
            logger,
            stacktrace,
            context,
            appVersion,
          },
          timestamp
        );
      }
    );

    res.status(HttpCode.OK).json('Logs sent');
  }
);

export const logUserEvents = wrapAsync(async (req: Request, res: Response) => {
  try {
    const eventLog: UserEventLog = req.body;

    if (
      !eventLog.eventType ||
      !eventLog.legacyUserId ||
      !eventLog.subscriptionStatus
    ) {
      logError({
        errorCode: 1075,
        message: 'Missing fields to log user event',
        context: { eventLog },
      });

      return res.status(HttpCode.OK).json('Missing fields to log user event');
    }

    // Log the user event
    logUserEvent(eventLog);

    return res.status(HttpCode.OK).json('User Event Logged');
  } catch (error) {
    logError({
      errorCode: 1075,
      message: 'Error logging user event',
      context: { error },
    });

    return res.status(HttpCode.OK).json({
      message: 'Something went wrong while trying to log user event',
      error: error,
    });
  }
});
