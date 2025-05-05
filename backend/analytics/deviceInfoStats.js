const readline = require('readline');
const fs = require('fs');
const minimist = require('minimist');

const DEVICE_INFO_MESSAGE_NAME = 'device-info';

const showHelp = () => {
  console.log(
    '\nUsage:\n',
    'node ./backend/analytics/deviceInfoStats.js --file logfilename [--start startDate] [--finish finishDate]'
  );
  console.log('Params:');
  console.log(
    '\t[--file logfilename] filename with logs to parse, jsonl-format'
  );
  console.log(
    '\t--start [startDate] start date for filtering (no records before the date).'
  );
  console.log(
    '\t--fiinsh [finishDate] finish date for filtering (no records before the date).'
  );
  console.log(
    '\t--only-report no extra information in the result, only report json or error message.'
  );
  console.log(
    '\tDate formats are acceptable as Y-M-D; other formats are on your risk (milliseconds unix time should be accepted).'
  );
};

/**
 * Convert from minimist to validated internal options.
 * @param argv parsed by minimist cmd args.
 * @throws Error with error description if some of argv is invalid.
 */
const checkAndParseArgs = async (argv) => {
  const options = {};

  // file

  if (!argv?.file) throw new Error(`'file' parameter is mandatory.`);
  options.file = argv?.file;

  if (!fs.existsSync(argv?.file)) {
    throw new Error(`File '${options.file}' not found`);
  }

  // dates

  if (argv?.start) {
    options.startDate = new Date(argv?.start);
    if (options.startDate.getFullYear() === 1970)
      throw new Error(
        `'start' date looks invalid (parsed as ${options.startDate})`
      );
  }

  if (argv?.finish) {
    options.finishDate = new Date(argv?.finish);
    if (options.finishDate.getFullYear() === 1970)
      throw new Error(
        `'finish' date looks invalid (parsed as ${options.finishDate})`
      );
  }

  if (argv['only-report']) {
    options.onlyReport = true;
  }

  return options;
};

/**
 * Filter one jsonl by options (e.g. dates).
 * @param json on json record.
 * @param options ready-to-use options (parsed, validated).
 * @returns true if json should be filtered.
 */
const optionsFilter = (json, options) => {
  if (
    options.startDate &&
    json['timestamp'] &&
    new Date(json['timestamp']) < new Date(options.startDate)
  )
    return true;
  if (
    options.finishDate &&
    json['timestamp'] &&
    new Date(json['timestamp']) > new Date(options.finishDate)
  )
    return true;
  return false;
};

/**
 * Add info of one log-line to the report (record already unique and filtered).
 * @param report info is added into this report.
 * @param info info as context part of the message (as object of params).
 */
const addToReport = (report, info) => {
  for (const [key, value] of Object.entries(info)) {
    if (!report[key]) report[key] = {};
    report[key][value] = report[key][value] ? report[key][value] + 1 : 1;
  }
};

/**
 * Prepare the report.
 * @param options ready-to-use options (parsed, validated).
 * @returns generated report as a structure.
 */
const generateReport = async (options) => {
  if (!options.onlyReport)
    console.log('Start generation with options:', options);

  return new Promise((resolve, reject) => {
    // Already processed deviceIds.
    const deviceIds = new Set();

    const report = {};

    readline
      .createInterface({
        input: fs.createReadStream(options.file),
      })
      .on('line', (line) => {
        const json = JSON.parse(line);
        if (json['message'] !== DEVICE_INFO_MESSAGE_NAME) return;

        // Only unique device id.

        const deviceId = json['deviceId'];
        if (deviceIds.has(deviceId)) return;
        deviceIds.add(deviceId);

        if (optionsFilter(json, options)) return;

        addToReport(report, json['context']);
      })
      .on('close', () => resolve(report))
      .on('error', reject);
  });
};

const start = async () => {
  try {
    const argv = minimist(process.argv.slice(2));
    const options = await checkAndParseArgs(argv);
    const report = await generateReport(options);

    if (!options.onlyReport) {
      console.log('Report:');
    }

    console.log(report);

    if (!options.onlyReport) {
      console.log('Done');
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error('Error:', e.message);
    } else {
      console.error('Error:', e);
    }

    showHelp();
  }
};

start().catch((e) => console.error('Error:', e.message));
