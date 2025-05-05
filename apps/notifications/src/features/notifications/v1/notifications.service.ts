import * as laravelRepository from '../../../repositories/laravel';

export const getNotifications = async (userId: string) => {
  const result = await laravelRepository.getNotifications(userId);
  return result;
};

export const getUnreadNotificationsCount = async (userId: string) => {
  const result = await laravelRepository.getUnreadNotificationsCount(userId);
  if (result && result.data && result.data[0]?.fcmUnreadCount !== undefined) {
    return result.data[0].fcmUnreadCount;
  } else {
    console.error('getUnreadNotificationsCount result', result);
    throw new Error('Wrong response of unread notifications count');
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  const result = await laravelRepository.markNotificationAsRead(notificationId);
  return result;
};
