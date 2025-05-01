import mysql from 'mysql2';
import config from '../config/config';
import { logError, logInfo } from '../services/log';
import { logErrorType } from '../utils/commonErrorLogging';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.mysql.host,
  user: config.mysql.username,
  password: config.mysql.password,
  database: config.mysql.db,
});

pool.on('error', (args: any[]) => {
  const error = args[0];
  logError({
    errorCode: 5002,
    message: 'MySQL connection pool error',
    stacktrace: JSON.stringify(error),
  });
});

type QueryCallback = (
  error: NodeJS.ErrnoException | null,
  results: any | null
) => void;

const query = (
  sql: string,
  params: any[] | mysql.QueryOptions,
  callback: QueryCallback
) => {
  pool.getConnection((err, connection) => {
    if (err) {
      logErrorType(err, 5003, { sql, params });
      callback(err, null);
    } else {
      logInfo({ message: 'Successfully connected to MySql!' });
      connection.query(sql, params, (err, results) => {
        connection.release(); // Release the connection back to the pool

        if (err) {
          logErrorType(err, 5004, { sql, params });
          callback(err, null);
        } else {
          callback(null, results);
        }
      });
    }
  });
};

export default query;
