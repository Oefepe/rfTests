import query from '../../../db/mysqlConnect';
import { logErrorType } from '../../../utils/commonErrorLogging';

const StatisticsModel = {
  getInactiveContacts: (fromDate: string, toDate: string) => {
    return new Promise((resolve, reject) => {
      const sql = ` SELECT stageName,
                           CAST(ROUND(AVG(totalContact), 0) AS UNSIGNED)                                  AS totalContacts,
                           CAST(ROUND(AVG(totalActiveContact), 0) AS UNSIGNED)                            AS totalActiveContacts,
                           CAST(ROUND(AVG(totalInactiveContact), 0) AS UNSIGNED)                          AS totalInactiveContacts,
                           CAST(ROUND((SUM(totalInactiveContact) / SUM(totalContact)) * 100, 2) AS FLOAT) AS InactivePercentage
                    FROM 1_4_23_active_inactive
                    WHERE date BETWEEN ? AND ?
                    GROUP BY stageName;
      `;

      try {
        query(sql, [fromDate, toDate], (error, results) => {
          if (error) {
            reject(error);
          }

          resolve(results);
        });
      } catch (exception) {
        logErrorType(exception, 5012, { sql, fromDate, toDate });
        reject(exception);
      }
    });
  },

  getContactsTransition: (fromDate: string, toDate: string) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT stageName,
                          MAX(totalContact)                                                              AS totalContacts,
                          CAST(SUM(transitionedContacts) AS UNSIGNED)                                    AS transitionedContacts,
                          CAST(ROUND((SUM(transitionedContacts) / MAX(totalContact)) * 100, 2) AS FLOAT) AS transitionedPercentage
                   FROM 1_4_23_active_inactive
                   WHERE date BETWEEN ? AND ?
                   GROUP BY stageName;
      `;

      try {
        query(sql, [fromDate, toDate], (error, results) => {
          if (error) {
            reject(error);
          }

          resolve(results);
        });
      } catch (exception) {
        logErrorType(exception, 5012, { sql, fromDate, toDate });
        reject(exception);
      }
    });
  },

  getContactsTimeInStage: (fromDate: string, toDate: string) => {
    return new Promise((resolve, reject) => {
      const sql = ` SELECT stageName,
                           CAST(ROUND(
                                   AVG(TIMESTAMPDIFF(MINUTE, dateEntered, IFNULL(dateExited, CURDATE()))),
                                   0) AS UNSIGNED) AS timeInMinutes
                    FROM 1_4_23_contact_time_in_stage
                    WHERE dateEntered BETWEEN ? AND ?
                    GROUP BY stageName;
      `;

      try {
        query(sql, [fromDate, toDate], (error, results) => {
          if (error) {
            reject(error);
          }

          resolve(results);
        });
      } catch (exception) {
        logErrorType(exception, 5012, { sql, fromDate, toDate });
        reject(exception);
      }
    });
  },

  getContactStageTransition: (fromDate: string, toDate: string) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT stageName, count(contactId) as totalContacts
                   FROM 1_4_23_contact_time_in_stage
                   where contactId IN
                         (SELECT contactId
                          FROM 1_4_23_contact_time_in_stage
                          WHERE dateEntered BETWEEN ? AND ?
                            AND stageName = 'Stage 1')
                   GROUP BY stageName;`;

      try {
        query(sql, [fromDate, toDate], (error, results) => {
          if (error) {
            reject(error);
          }

          resolve(results);
        });
      } catch (exception) {
        logErrorType(exception, 5012, { sql, fromDate, toDate });
        reject(exception);
      }
    });
  },

  getTransitionActionCount: (fromDate: string, toDate: string) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT stageName,
                          CAST(ROUND(AVG(transitionCount), 0) AS UNSIGNED) AS transitionCount
                   FROM 1_4_23_contact_transition_action
                   WHERE date BETWEEN ? AND ?
                   GROUP BY stageName;`;

      try {
        query(sql, [fromDate, toDate], (error, results) => {
          if (error) {
            reject(error);
          }

          resolve(results);
        });
      } catch (exception) {
        logErrorType(exception, 5012, { sql, fromDate, toDate });
        reject(exception);
      }
    });
  },

  getContactsTransitionTime: (fromDate: string, toDate: string) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT stageName,
                          CAST(ROUND(AVG(TIMESTAMPDIFF(MINUTE, dateEntered, dateExited)), 0) AS UNSIGNED) AS transitionTimeInMinutes
                   FROM 1_4_23_contact_time_in_stage
                   WHERE dateExited IS NOT NULL
                     AND dateEntered BETWEEN ? AND ?
                   GROUP BY stageName;
      `;

      try {
        query(sql, [fromDate, toDate], (error, results) => {
          if (error) {
            reject(error);
          }

          resolve(results);
        });
      } catch (exception) {
        logErrorType(exception, 5012, { sql, fromDate, toDate });
        reject(exception);
      }
    });
  },
};

export default StatisticsModel;
