import StatisticRepository from '../../../repositories/StatisticRepoitory';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { ResponsiveBar } from '@nivo/bar';
import { selectDateRange } from '../../../utils';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

type GraphData = {
  stageName: string;
  totalActiveContact: number;
  totalInactiveContact: number;
  amt: number;
};

const BarGraphNivo = ({ selectedTimeframe }: { selectedTimeframe: string }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<GraphData[]>();

  useEffect(() => {
    const getDateRange = selectDateRange(selectedTimeframe);

    StatisticRepository.getStatistics(
      getDateRange.startDate,
      getDateRange.endDate,
    )
      .then((responseData) => {
        setData(responseData.data);
      })
      .catch((e) => {
        logErrorType(e, 1041, { getDateRange });
      });
  }, [selectedTimeframe]);

  const theme = {
    axis: {
      ticks: {
        line: {
          stroke: 'gray',
        },
        text: {
          fill: '#ffffff',
        },
      },
      legend: {
        text: {
          fill: 'white',
        },
        onClick: {
          fill: 'white',
          color: 'white',
        },
        itemTextColor: 'white',
      },
    },
  };

  return (
    <div>
      <Card
        sx={{
          maxWidth: 650,
          margin: '0 auto',
          mt: 7,
          p: 5,
          alignContent: 'center',
          background: '#222222',
          color: 'white',
        }}
      >
        <h5 style={{ textAlign: 'center' }}>
          {t('activeInactiveGraphTitle')}
        </h5>
        <div
          style={{
            height: 400,
            width: 600,
            color: 'black',
            display: 'flex',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          {data && (
            <ResponsiveBar
              data={data}
              keys={['totalActiveContacts', 'totalInactiveContacts']}
              margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
              indexBy='stageName'
              padding={0.3}
              labelTextColor='black'
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={['#76d6b3', '#d43c3c']}
              theme={theme}
              layers={[
                'grid',
                'axes',
                'markers',
                'bars',
                'legends',
                'annotations',
              ]}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: t('numberOfContacts'),
                legendPosition: 'middle',
                legendOffset: -50,
              }}
              legends={[
                {
                  anchor: 'bottom',
                  dataFrom: 'keys',
                  direction: 'row',
                  itemHeight: 20,
                  itemWidth: 150,
                  toggleSerie: false,
                  translateY: 54,
                  itemTextColor: 'white',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1,
                        itemTextColor: 'white',
                      },
                    },
                  ],
                },
              ]}
              colorBy={'id'}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default BarGraphNivo;
