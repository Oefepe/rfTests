import * as fs from 'fs';
import * as path from 'path';
import config from '../../config/config';
import { logError, logInfo, logWarning } from './backendLogger';
import { expect } from 'chai';
import { Writable } from 'node:stream';

describe('backendLogger logError function', () => {
  const logRecord = {
    context: { field1: 'test1', field2: 'test2' },
    stacktrace: 'Test stacktrace',
  };

  const folderPath = config.logs.logFolder;

  const nLines = (filePath: string): number => {
    return fs.readFileSync(filePath).toString().split('\n').length;
  };

  const fileWriteDelay = 10;

  let write: any;
  let output = '';

  const storeWrite = new Writable({
    write(buffer, encoding, callback) {
      output += buffer.toString();
      callback(null);
    },
  });

  beforeEach(function () {
    write = process.stdout.write;
    process.stdout.write = storeWrite.write.bind(storeWrite) as any;
  });

  afterEach(function () {
    process.stdout.write = write; // restore original function
  });


  it('Error log data should be saved to the file', () => {
    const filePath = path.join(folderPath, config.logs.error);
    const nLinesBefore = nLines(filePath);
    const message = 'Cypress test error';

    logError({
      ...logRecord,
      errorCode: 7000,
      message
    });

    expect(output).include(message);

    setTimeout(() => {
      const nLinesAfter = nLines(filePath);
      expect(nLinesAfter).eq(nLinesBefore + 1);
    }, fileWriteDelay)

  });

  it('Warning log data should be saved to the file', () => {
    const filePath = path.join(folderPath, config.logs.warning);
    const nLinesBefore = nLines(filePath);
    const message = 'Cypress test warning';

    logWarning({
      ...logRecord,
      errorCode: 7001,
      message: 'Cypress test warning'
    });

    expect(output).include(message);

    setTimeout(() => {
      const nLinesAfter = nLines(filePath);
      expect(nLinesAfter).eq(nLinesBefore + 1);
    }, fileWriteDelay)
  });

  it('Info log data should be showed in the stdout', () => {
    const message = 'Cypress test warning';

    logInfo({ message });

    expect(output).include(message);
  });
});
