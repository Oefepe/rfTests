const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'rfng-mysql-service',
  user: 'root',
  password: 'root',
  database: 'devRfng',
});

var createTableQuery = `CREATE TABLE if not exists 1_4_23_active_inactive (
    id int NOT NULL AUTO_INCREMENT,
    stageName VARCHAR(255),
    date DATE,
    timeRange TIME,
    totalContact int,
    totalActiveContact int,
    totalInactiveContact int,
    transitionedContacts int,
    primary key (id))`;

var createTISTableQuery = `CREATE TABLE if not exists 1_4_23_contact_time_in_stage (
    id int NOT NULL AUTO_INCREMENT,
    contactId int,
    stageName VARCHAR(255),
    dateEntered TIMESTAMP,
    dateExited TIMESTAMP,
    primary key (id))`;

const createConTransActCount = `CREATE TABLE if not exists 1_4_23_contact_transition_action (
  id int NOT NULL AUTO_INCREMENT,
  stageName VARCHAR(255),
  date DATE,
  transitionCount int,
  primary key (id))`;

con.query(createTableQuery, function (err, result) {
  if (err) throw err;
});

con.query(createTISTableQuery, function (err, result) {
  if (err) throw err;
});

con.query(createConTransActCount, function (err, result) {
  if (err) throw err;
});

var stageArray = ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'];
var randomNumArray = [7300, 6200, 5100, 4050, 3010];
var values = '';
stageArray.forEach(function (stage, index) {
  for (var dateLoop = 1; dateLoop < 32; dateLoop++) {
    for (var timeLoop = 0; timeLoop < 24; timeLoop++) {
      const activeContact = Math.floor(
        Math.random() *
          (randomNumArray[index] - (randomNumArray[index] - 2000) + 1) +
          1000
      );
      const inActiveContact = randomNumArray[index] - activeContact;

      const transitionedContacts = Math.floor(
        Math.random() * (Math.floor(randomNumArray[index] / (30 * 24)) - 0 + 1)
      );
      var temp = '("'
        .concat(stage, '", "2023-05-')
        .concat(dateLoop, '", "')
        .concat(timeLoop, ':00", ')
        .concat(randomNumArray[index], ', ')
        .concat(activeContact, ', ')
        .concat(inActiveContact, ', ')
        .concat(transitionedContacts, '),');
      values += temp;
    }
  }
});

var timeInStageValues = '';
var timeInStageValuesNotExited = '';

stageArray.forEach(function (stage, index, array) {
  for (var contacts = 1; contacts <= randomNumArray[index]; contacts++) {
    let hour = Math.floor(Math.random() * 23) + 1;
    let min = Math.floor(Math.random() * 59) + 1;
    let sec = Math.floor(Math.random() * 59) + 1;
    let time = hour + ':' + min + ':' + sec;

    const day = Math.floor(Math.random() * 30) + 1;
    const dateEntered = '2023-05' + '-' + day + ' ' + time;

    hour = Math.floor(Math.random() * 23) + 1;
    min = Math.floor(Math.random() * 59) + 1;
    sec = Math.floor(Math.random() * 59) + 1;
    time = hour + ':' + min + ':' + sec;

    const exitDay = Math.floor(Math.random() * 30);
    let dayExit = '';
    if (day + exitDay < 31) {
      dayExit = day + exitDay;
    } else if (day + 1 < 31) {
      dayExit = day + 1;
    } else {
      dayExit = day;
    }

    const dateExit = '2023-05' + '-' + dayExit + ' ' + time;

    let temp;

    if (contacts % 5 === 0 || index === array.length - 1) {
      temp = '('
        .concat(contacts, ', "')
        .concat(stage, '", "')
        .concat(dateEntered, '"),');
      timeInStageValuesNotExited += temp;
    } else {
      temp = '('
        .concat(contacts, ', "')
        .concat(stage, '", "')
        .concat(dateEntered, '", "')
        .concat(dateExit, '"),');
      timeInStageValues += temp;
    }
  }
});

var actionTransitionedInStageValues = '';
stageArray.forEach(function (stage, index) {
  for (var dateLoop = 1; dateLoop < 32; dateLoop++) {
    const counter = Math.floor(Math.random() * 30);
    const dateEntered = `2023-05-${dateLoop}`;

    const temp = '("'
      .concat(stage, '", "')
      .concat(dateEntered, '", ')
      .concat(counter, '),');
    actionTransitionedInStageValues += temp;
  }
});

//create dummy data
var insertQuery =
  'INSERT into 1_4_23_active_inactive(stageName, date, timeRange, totalContact, totalActiveContact,totalInactiveContact, transitionedContacts ) VALUES '.concat(
    values.substring(0, values.length - 1)
  );

var insertTISQuery =
  'INSERT into 1_4_23_contact_time_in_stage(contactId, stageName, dateEntered, dateExited) VALUES '.concat(
    timeInStageValues.substring(0, timeInStageValues.length - 1)
  );

const insertTACQuery =
  'INSERT into 1_4_23_contact_transition_action(stageName, date, transitionCount) VALUES '.concat(
    actionTransitionedInStageValues.substring(
      0,
      actionTransitionedInStageValues.length - 1
    )
  );

con.query(insertQuery, function (err, result) {
  if (err) throw err;
});

con.query(insertTISQuery, function (err, result) {
  if (err) throw err;
});

con.query(insertTACQuery, function (err, result) {
  if (err) throw err;
});
