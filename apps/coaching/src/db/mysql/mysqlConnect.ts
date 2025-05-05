import { PrismaClient } from '@prisma/client';
import config from '../../config/config';
import { logInfo, logError } from '../../services/log/backendLogger';

logInfo({ message: 'Initializing Prisma Client' });
const prisma: PrismaClient = new PrismaClient({
  log: config.prisma.logLevel,
});

/**
 * Connects to the mysql database.
 * @returns {Promise<void>}
 */
async function connectDB(): Promise<void> {
  logInfo({ message: 'Attempting to connect to the database...' });
  try {
    await prisma.$connect();
    logInfo({ message: 'Database connected successfully.' });
  } catch (error) {
    logError({
      errorCode: 5000,
      message: 'Failed to connect to the database on startup',
      context: { error },
    });
    console.error(`Failed to connect to the database on startup: ${error}`);
  }
}

/**
 * Disconnects from the mysql database.
 * @returns {Promise<void>}
 */
async function disconnectDB(): Promise<void> {
  logInfo({ message: 'Attempting to disconnect from the database...' });
  try {
    await prisma.$disconnect();
    logInfo({ message: 'Database disconnected successfully.' });
  } catch (error) {
    logError({
      errorCode: 5002,
      message: 'Failed to disconnect from the database',
      context: { error },
    });
  }
}

export { prisma, connectDB, disconnectDB };
