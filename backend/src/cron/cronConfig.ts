import agendaInstance from './agendaConfig';
import { logErrorType } from '../utils/commonErrorLogging';
import { proccessIncompleteDelayLogJob } from './smartConnectorCrons/scCronJobs';

// Start the cron jobs
export async function startCrons() {
  try {
    // Create the agenda instance using the MongoDB connection
    const agenda = agendaInstance;

    // Define CRON jobs - will need to execute it separately
    proccessIncompleteDelayLogJob(agenda);

    // Start Agenda
    await agenda.start();

    // Schedule and execute the jobs
    await agenda.every('1 minute', 'processIncompleteDelayLogs');
  } catch (error) {
    logErrorType(error, 1006);
  }
}
