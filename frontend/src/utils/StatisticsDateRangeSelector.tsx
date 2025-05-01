import moment from 'moment';

export const selectDateRange = (selectedValue: string) => {
  let startDate = '2023-05-01';
  let endDate = '2023-05-31';

  const date = new Date();
  const oldOneDate = moment(date).subtract(1, 'day').toDate();
  const oldOneWeekDate = moment(date).subtract(7, 'day').toDate();

  const newOld30Date = moment(date).format('YYYY-MM-DD');
  const newOldOneDate = moment(oldOneDate).format('YYYY-MM-DD');
  const newOldOneWeekDate = moment(oldOneWeekDate).format('YYYY-MM-DD');

  switch (selectedValue) {
    case 'last24Hours':
      startDate = newOldOneDate;
      endDate = newOld30Date;
      break;
    case 'lastWeek':
      startDate = newOldOneWeekDate;
      endDate = newOld30Date;
      break;
  }

  return { startDate, endDate };
};
