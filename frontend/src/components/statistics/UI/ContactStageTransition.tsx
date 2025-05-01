import StatisticRepository from '../../../repositories/StatisticRepoitory';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Bar, BarChart, LabelList, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import moment from 'moment';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

type GraphData = {
  stageName: string;
  totalContacts: number;
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

const ContactStageTransitionGraph = () => {
  const { t } = useTranslation();
  const [subLabelValue, setSubLabelValue] = useState<
    'last24Hours' | 'lastWeek' | 'lastMonth'
  >('last24Hours');

  const [data, setData] = useState<GraphData[]>();
  const [contactsInFirstStage, setContactsInFirstStage] = useState<number>();

  useEffect(() => {
    const getDateRange = selectDateRange('last24Hours');

    StatisticRepository.getContactStageTransitions(
      getDateRange.startDate,
      getDateRange.endDate,
    )
      .then((responseData) => {
        setContactsInFirstStage(responseData.data[0].totalContacts);
        setData(responseData.data);
      })
      .catch((e) => {
        logErrorType(e, 1042, { getDateRange });
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

    StatisticRepository.getContactStageTransitions(
      getDateRange.startDate,
      getDateRange.endDate,
    )
      .then((responseData) => {
        setContactsInFirstStage(responseData.data[0].totalContacts);
        setData(responseData.data);
      })
      .catch((e) => {
        logErrorType(e, 1044, { getDateRange, selectedValue });
      });
  };

  type Label = {
    x: number;
    y: number;
    fill: string;
    value: number;
    width: number;
    height: number;
  };

  /* eslint-disable react/prop-types */
  const CustomLabel = (props: Label) => {
    const { x, y, fill, value } = props;
    return (
      <text x={x - 5} y={y - 10} fill={fill} textAnchor='top'>
        {value} Contacts
      </text>
    );
  };

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: { stageName: string; totalContacts: number };
    }>;
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length && contactsInFirstStage) {
      const transitionedPercentage =
        (payload[0].payload.totalContacts / contactsInFirstStage) * 100;
      return (
        <div className='custom-tooltip'>
          <p className='label'>{`Percentage Transitioned: ${transitionedPercentage.toFixed(
            2,
          )}%`}</p>
        </div>
      );
    }

    return null;
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
          {t('contactConversionFromFirstStage')}
        </h5>
        <BarChart
          width={550}
          height={300}
          data={data}
          layout='horizontal'
          margin={{
            top: 50,
            right: 0,
            left: 10,
            bottom: 0,
          }}
        >
          <YAxis type='number' tick={{ fill: 'white' }} />
          <XAxis type='category' tick={{ fill: 'white' }} dataKey='stageName' />
          <Tooltip
            content={<CustomTooltip />}
            wrapperStyle={{
              backgroundColor: 'white',
              color: 'black',
              display: 'flex',
              alignItems: 'center',
            }}
          />
          <Legend />
          <Bar
            name={t('contactsTransitioning')}
            dataKey='totalContacts'
            stackId='a'
            fill='#8884d8'
          >
            <LabelList
              dataKey='totalContacts'
              fill='white'
              position='insideRight'
              content={
                <CustomLabel
                  x={0}
                  y={0}
                  fill={'white'}
                  value={0}
                  width={0}
                  height={0}
                />
              }
            />
          </Bar>
        </BarChart>
      </Card>
    </div>
  );
};

export default ContactStageTransitionGraph;
