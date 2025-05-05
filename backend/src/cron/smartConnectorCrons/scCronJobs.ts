import { logErrorType } from '../../utils/commonErrorLogging';
import { logInfo } from '../../services/log';
import { Agenda } from 'agenda';
import {
  getIncompleteScDelayLogs,
  chunkArray,
  processDelayLog,
} from './scHelper';

const BATCH_SIZE = 10;

/* Definition of a CRON which will process delays for smart connectors.
   We make use of Batch Processing for more efficient processing
*/
export function proccessIncompleteDelayLogJob(agenda: Agenda) {
  agenda.define('processIncompleteDelayLogs', async (job, done) => {
    try {
      logInfo({ message: 'Checking and processing incomplete delay logs' });

      // Find incomplete delay logs
      const incompleteDelayLogs = await getIncompleteScDelayLogs();

      if (incompleteDelayLogs.length === 0) {
        logInfo({ message: 'No incomplete delay logs to process' });
        done(); // Mark the job as done if there are no logs to process
        return;
      }

      // Process delay logs in batches
      const delayLogsBatches = chunkArray(incompleteDelayLogs, BATCH_SIZE);

      for (const batch of delayLogsBatches) {
        // Process each batch of incomplete delay logs
        const batchPromises = batch.map(async (delayLog) => {
          // Make API calls and update the status as needed
          const success = await processDelayLog(delayLog);
          return success;
        });

        // Wait for all promises in the batch to resolve
        await Promise.all(batchPromises);
      }

      logInfo({ message: 'Processed incomplete delay logs' });
      done();
    } catch (error) {
      logErrorType(error, 1054);
      done();
    }
  });
}
