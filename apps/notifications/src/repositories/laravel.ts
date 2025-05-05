import config from '../config/config';

const getUserToken = async (userId: number) => {
  const response = await fetch(`${config.laravelUrl}/jwt/users/${userId}`);

  if (response.status === 200) {
    const result = await response.json();

    if (result?.token && typeof result.token === 'string') {
      return result.token as string;
    }
  }

  throw new Error(`Can't get post-token:  ${userId}`);
};

export const getNotifications = async (userId: string) => {
  const token = await getUserToken(Number(userId));
  const response = await fetch(`${config.laravelUrl}/user-fcm-logs/${userId}`, {
    headers: {
      Authorization: `"${token}"`,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to retrieve notifications');
  }

  return await response.json();
};

export const getUnreadNotificationsCount = async (userId: string) => {
  const token = await getUserToken(Number(userId));
  const response = await fetch(`${config.laravelUrl}/v2/users/${userId}/get-unread-fcm-count`, {
    headers: {
      Authorization: `"${token}"`,
    },
    signal: AbortSignal.timeout(config.timeout),
  });

  if (response.status !== 200) {
    throw new Error('Failed to retrieve unread notifications count');
  }

  return await response.json();
};

export const markNotificationAsRead = async (notificationIds: string) => {
  const response = await fetch(`${config.laravelUrl}user-fcm-logs/${notificationIds}`, {
    method: 'POST',
  });

  if (response.status !== 200) {
    throw new Error('Failed to mark notification as read');
  }

  return await response.json();
};
