import StatisticRepository from '../../../repositories/StatisticRepoitory';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ResponsiveLine } from '@nivo/line';
import { selectDateRange } from '../../../utils';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

type GraphData = {
  id: string;
  data: { x: string; y: number }[];
};

const TransitionActionLineGraph = ({
  selectedTimeframe,
}: {
  selectedTimeframe: string;
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<GraphData[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const getDateRange = selectDateRange(selectedTimeframe);

    StatisticRepository.getTransitionActionInStage(
      getDateRange.startDate,
      getDateRange.endDate,
    ).then((responseData) => {
      const transformedData = [
        {
          id: 'Actions Needed To Transition',
          data: responseData.data.map(({ stageName, transitionCount }) => ({
            x: stageName,
            y: transitionCount,
          })),
        },
      ];
      setData(transformedData);
      setIsDataLoaded(true);
    }).catch((e) => {
      logErrorType(e, 1049, { getDateRange });
      setIsDataLoaded(false);
    });
  }, [selectedTimeframe]);

  const theme = {
    dots: {
      text: {
        fill: '#ffffff',
      },
    },
    axis: {
      ticks: {
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
          background: 'black',
          color: 'white',
        }}
      >
        <h5 style={{ textAlign: 'center' }}>
          {t('actionsNeededForTransition')}
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
          {isDataLoaded ? (
            data?.length > 0 ? (
              <ResponsiveLine
                data={data}
                margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
                colors='#00d1d2'
                lineWidth={4}
                enablePoints={true}
                enablePointLabel={true}
                pointColor='white'
                enableGridY={false}
                enableGridX={false}
                enableArea
                useMesh
                areaOpacity={1}
                theme={theme}
                tooltip={(input) => (
                  <div
                    style={{
                      background: 'white',
                      padding: '10px',
                      borderRadius: '5px',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                      {input.point.data.xFormatted}:{' '}
                      {input.point.data.yFormatted} Actions
                    </div>
                  </div>
                )}
                curve='monotoneX'
                defs={[
                  {
                    colors: [
                      {
                        color: 'inherit',
                        offset: 0,
                        opacity: 0.6,
                      },
                      {
                        color: 'inherit',
                        offset: 100,
                        opacity: 0,
                      },
                    ],
                    id: 'gradient',
                    type: 'linearGradient',
                  },
                ]}
                fill={[
                  {
                    id: 'gradient',
                    match: '*',
                  },
                ]}
                legends={[
                  {
                    anchor: 'bottom',
                    direction: 'column',
                    justify: false,
                    itemTextColor: 'white',
                    translateX: -50,
                    translateY: 54,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 1,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              />
            ) : (
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
            )
          ) : (
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
          )}
        </div>
      </Card>
    </div>
  );
};

export default TransitionActionLineGraph;
