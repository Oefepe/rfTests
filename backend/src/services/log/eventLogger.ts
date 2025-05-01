import { logger } from './backendLogger';

// Interface for the user event log structure
export interface UserEventLog {
  eventType: string;
  legacyUserId: number;
  subscriptionStatus: string;
  timestamp: string;
  additionalInfo?: Record<string, unknown>;
}

// Function to log user events
export const logUserEvent = (eventLog: UserEventLog) => {
  const logEntry = {
    ...eventLog,
    timestamp: eventLog.timestamp || new Date().toISOString(),
  };

  // Log the event
  logger.log('user_event', 'User Event', logEntry);
};
