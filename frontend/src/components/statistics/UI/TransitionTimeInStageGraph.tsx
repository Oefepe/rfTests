import StatisticRepository from '../../../repositories/StatisticRepoitory';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';
import { selectDateRange } from '../../../utils';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

type GraphData = {
  stageName: string;
  timeInStage: number;
};

/* eslint-disable react/prop-types */
const TransitionTimeInStageGraph = ({
  selectedTimeframe,
}: {
  selectedTimeframe: string;
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<GraphData[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const getDateRange = selectDateRange(selectedTimeframe);

    StatisticRepository.getContactTransitionTime(
      getDateRange.startDate,
      getDateRange.endDate,
    ).then((responseData) => {
      setData(responseData.data);
      setIsDataLoaded(true);
    }).catch((e) => {
      logErrorType(e, 1053, { getDateRange });
      setIsDataLoaded(false);
    });
  }, [selectedTimeframe]);

  type Label = {
    x: number;
    y: number;
    fill: string;
    value: number;
    width: number;
  };

  /* eslint-disable react/prop-types */
  const CustomLabel = (props: Label) => {
    const { x, y, fill, value, width } = props;
    const valueInHours = value / 60;
    return (
      <text x={x + width / 2} y={y - 10} fill={fill} textAnchor='middle'>
        {valueInHours.toFixed(0)} hours
      </text>
    );
  };

  type TrainglePath = {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string | undefined;
  };

  const getPath = (props: TrainglePath) => {
    const { x, y, width, height } = props;
    return `M${x},${y + height}C${x + width / 3},${y + height} ${
      x + width / 2
    },${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
      x + width
    }, ${y + height}
    Z`;
  };

  const TriangleBar = (props: TrainglePath) => {
    return <path d={getPath(props)} stroke='none' fill={props.fill} />;
  };

  type CustomizedYAxisTickProps = {
    x: number;
    y: number;
    payload: {
      value: number;
      index: number;
      offset: number;
    };
  };

  const CustomYAxisTick = (props: CustomizedYAxisTickProps) => {
    const { x, y, payload } = props;
    const valueInMinutes = payload.value;
    const valueInHours = valueInMinutes / 60;
    return (
      <text x={x - x / 2 + 10} y={y + 5} fill='white' textAnchor='middle'>
        {valueInHours.toFixed(0)}
      </text>
    );
  };

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

  return (
    <div>
      <Card
        sx={{
          maxWidth: 650,
          margin: '0 auto',
          mt: 7,
          p: 5,
          background: '#393961',
          color: 'white',
        }}
      >
        <h5 style={{ textAlign: 'center' }}>
          {t('averageTrasitionTime')}
        </h5>
        {isDataLoaded ? (
          data?.length > 0 ? (
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
              <YAxis
                tick={
                  <CustomYAxisTick
                    x={0}
                    y={0}
                    payload={{
                      value: 0,
                      index: 0,
                      offset: 0,
                    }}
                  />
                }
              />
              <XAxis
                type='category'
                tick={{ fill: 'white' }}
                dataKey='stageName'
              />
              <Bar
                name={t('transitionTimeInStage')}
                dataKey='transitionTimeInMinutes'
                fill='#8884d8'
                shape={
                  <TriangleBar
                    x={0}
                    y={0}
                    width={0}
                    height={0}
                    fill='#8884d8'
                  />
                }
                label={
                  <CustomLabel x={0} y={0} fill={''} value={0} width={0} />
                }
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <div style={{ height: 400, width: 600, color: 'black' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: 'white',
                }}
              >
                <Typography variant='caption'>
                  {t('noDataAvailable')}
                </Typography>
              </Box>
            </div>
          )
        ) : (
          <div style={{ height: 400, width: 600, color: 'black' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                color: 'white',
              }}
            >
              <Typography variant='caption'>
                {t('loadingData')}
              </Typography>
            </Box>
          </div>
        )}
      </Card>
      <Box
        sx={{
          mt: 7,
        }}
      ></Box>
    </div>
  );
};

export default TransitionTimeInStageGraph;
