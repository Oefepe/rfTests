import { NextFunction, Request, Response } from 'express';
import * as service from './notifications.service';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await service.getNotifications(req.params.userId);
    res.json({ status: 0, data: { notifications } });
  } catch (error: unknown) {
    next(error);
  }
};

export const getUnreadNotificationsCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await service.getUnreadNotificationsCount(req.params.userId);
    res.json({ status: 0, data: { count } });
  } catch (error: unknown) {
    next(error);
  }
};

export const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.markNotificationAsRead(req.body);
    res.json({ status: 0, data: result });
  } catch (error: unknown) {
    next(error);
  }
};
