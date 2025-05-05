import path from 'path';
import fs from 'fs';
import process from 'node:process';
import { appendFile, readFile } from 'fs/promises';
import { User } from '../models/userModel';
import { Auth } from '../models/authModel';
import mongoose from 'mongoose';
import { logError, logInfo } from '../../../services/log/backendLogger';
import { logErrorType } from '../../../utils/commonErrorLogging';

const env = process.env?.NODE_ENV ?? 'development';

const mongoHost = env === 'development' ? 'rfng-mongodb-service' : 'mongodb';

const mongoUrl = `mongodb://${mongoHost}/devrfng`;

async function handleDeletedLegacyUserIds() {
  try {
    const inputFile = process.argv.slice(2)[0];

    if (!inputFile) {
      logError({
        errorCode: 1,
        message: 'Input file is required',
      });
      return;
    }

    const logPath = '/app/logs/migrations/';
    const logFile = path.join(logPath, `migration-${Date.now()}.jsonl`);
    const dataPath = path.join('/app', inputFile);

    const context = { inputFile, logFile, dataPath };

    logInfo({
      message: `Looking for migration data at ${dataPath}`,
      context,
    });

    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath, { recursive: true });
    }

    fs.access(dataPath, fs.constants.F_OK, (err) => {
      if (err) {
        logInfo({
          message: `'No migration data found`,
          context,
        });
        return;
      }
    });

    const data = await readFile(dataPath, 'utf-8');

    if (!data) {
      logError({
        errorCode: 1,
        message: 'Provided data file has wrong format',
      });
    }

    await mongoose.connect(mongoUrl, {
      retryWrites: true,
      w: 'majority',
    });

    for (const { legacyUserId, rfngUserId } of JSON.parse(data)) {
      const user = await User.findById(rfngUserId);

      if (user) {
        const filteredAccounts = user?.accounts?.filter(
          ({ userId }) => userId !== legacyUserId
        );

        if (filteredAccounts?.length) {
          if (filteredAccounts.length === user.accounts.length) {
            return;
          }

          const updatedUser = await User.findByIdAndUpdate(rfngUserId, {
            accounts: filteredAccounts,
          });

          if (!updatedUser) return;

          await appendFile(
            logFile,
            `${JSON.stringify({
              rfngUserId,
              type: 'delete',
              date: new Date().toISOString(),
              originalData: user,
            })},\n`,
            {
              flag: 'a+',
            }
          );

          logInfo({
            message: `User record updated`,
            context: { ...context, rfngUserId },
          });
        } else {
          const deletedUser = await User.findByIdAndDelete(rfngUserId);

          if (!deletedUser) return;

          const deletedAuth = await Auth.findOneAndDelete({
            userId: rfngUserId,
          });

          await appendFile(
            logFile,
            `${JSON.stringify({
              rfngUserId,
              type: 'delete',
              date: new Date().toISOString(),
              originalData: user,
            })},\n`,
            {
              flag: 'a+',
            }
          );

          logInfo({
            message: `User record deleted`,
            context: { ...context, rfngUserId, deletedAuth },
          });
        }
      } else {
        logError({
          errorCode: 1,
          message: `User with ${rfngUserId} not found`,
          context,
        });
      }
    }
  } catch (error) {
    logError({
      errorCode: 1,
      message: `Searching for deleted users failed with error: ${error}`,
    });
  }
}

handleDeletedLegacyUserIds()
  .then(() => {
    logInfo({
      message: `handleDeletedLegacyUserIds finished!`,
    });
    process.exit(0);
  })
  .catch((error) => {
    logErrorType(error, 1);
  });
