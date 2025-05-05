import StatisticRepository from '../../../repositories/StatisticRepoitory';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import moment from 'moment';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

type GraphData = {
  stageName: string;
  totalActiveContact: number;
  totalInactiveContact: number;
  amt: number;
};

const selectDateRange = (selectedValue: string) => {
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

const BarGraph = () => {
  const { t } = useTranslation();
  const [subLabelValue, setSubLabelValue] = useState<
    'last24Hours' | 'lastWeek' | 'lastMonth'
  >('last24Hours');

  const [data, setData] = useState<GraphData[]>();

  useEffect(() => {
    const getDateRange = selectDateRange('last24Hours');

    StatisticRepository.getStatistics(
      getDateRange.startDate,
      getDateRange.endDate,
    )
      .then((responseData) => {
        setData(responseData.data);
      })
      .catch((e) => {
        logErrorType(e, 1039, { getDateRange });
      });
  }, []);

  const handleSubLabelChange = (
    event: SelectChangeEvent<'last24Hours' | 'lastWeek' | 'lastMonth'>,
  ) => {
    const selectedValue = event.target.value as
      | 'last24Hours'
      | 'lastWeek'
      | 'lastMonth';
    setSubLabelValue(selectedValue);

    const getDateRange = selectDateRange(selectedValue);

    StatisticRepository.getStatistics(
      getDateRange.startDate,
      getDateRange.endDate,
    )
      .then((responseData) => {
        setData(responseData.data);
      })
      .catch((e) => {
        logErrorType(e, 1040, { getDateRange });
      });
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          maxWidth: 300,
          margin: '0 auto',
          mt: 5,
          color: 'black',
        }}
      >
        <Typography sx={{ mt: 2, mr: 2 }}>
          {t('selectTimeframe')}
        </Typography>
        <Select
          labelId='sub-label-value-select-label'
          id='sub-label-value-select'
          value={subLabelValue}
          onChange={handleSubLabelChange}
          sx={{ minWidth: 100 }}
        >
          <MenuItem value='last24Hours'>
            {t('last24Hours')}
          </MenuItem>
          <MenuItem value='lastWeek'>{t('lastWeek')}</MenuItem>
          <MenuItem value='lastMonth'>{t('lastMonth')}</MenuItem>
        </Select>
      </Box>
      <Card
        sx={{
          maxWidth: 650,
          margin: '0 auto',
          mt: 2,
          p: 5,
          background: '#393961',
          color: 'white',
        }}
      >
        <h5 style={{ textAlign: 'center' }}>
          {t('activeInactiveGraphTitle')}
        </h5>
        <BarChart
          width={550}
          height={300}
          data={data}
          margin={{
            top: 50,
            right: 0,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis dataKey='stageName' tick={{ fill: 'white' }} />
          <YAxis tick={{ fill: 'white' }} />
          <Tooltip />
          <Legend />

          <Bar
            name={t('totalInactiveContacts')}
            dataKey='totalInactiveContacts'
            stackId='a'
            fill='#8884d8'
            label={{ position: 'top', fill: 'white' }}
          />
          <Bar
            name={t('totalActiveContacts')}
            dataKey='totalActiveContacts'
            stackId='a'
            fill='#82ca9d'
            label={{ position: 'top', fill: 'white' }}
          />
        </BarChart>
      </Card>
    </div>
  );
};

export default BarGraph;
