import { DelayTimeUnitStatus } from '../db/mongo/models/stageElements';

//Get the UTC Date Object
export const getCurrentUtcTime = () => {
  return new Date(new Date().toUTCString());
};

//Add Days to a  date
export const addDays = (date: Date, days: number): Date => {
  date.setDate(date.getDate() + days);
  return date;
};

// Add Hours to a time
export const addHours = (date: Date, hours: number): Date => {
  date.setDate(date.getHours() + hours);
  return date;
};

// Add Minutes to a time
export const addMinutes = (date: Date, minutes: number): Date => {
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

//Calculate the delay time
export const getDelayEndTime = (
  delayTime: number,
  delayTimeUnit: DelayTimeUnitStatus | null
): Date => {
  let delayEndTime = getCurrentUtcTime();
  if (delayTimeUnit === DelayTimeUnitStatus.Minutes) {
    // Add Minutes
    delayEndTime = addMinutes(delayEndTime, delayTime);
  } else if (delayTimeUnit === DelayTimeUnitStatus.Hours) {
    //Add Hour
    delayEndTime = addHours(delayEndTime, delayTime);
  } else if (delayTimeUnit === DelayTimeUnitStatus.Days) {
    //Add Day
    delayEndTime = addDays(delayEndTime, delayTime);
  } else {
    //Add Week
    delayEndTime = addDays(delayEndTime, delayTime * 7);
  }

  return delayEndTime;
};

export const dateStringParse = (dateString?: string) => {
  if (!dateString) return;

  if (dateString === '0000-00-00 00:00:00') {
    return new Date(0);
  }

  return new Date(dateString);
};
