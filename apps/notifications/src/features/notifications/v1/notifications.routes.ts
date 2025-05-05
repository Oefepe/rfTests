import express from 'express';
import { getNotifications, getUnreadNotificationsCount, markNotificationAsRead } from './notifications.controller';

const router = express.Router();

router.get('/list/:userId', getNotifications);
router.get('/unread-count/:userId', getUnreadNotificationsCount);
router.post('/viewed', markNotificationAsRead);

export default router;
