import StatisticRepository from '../../../repositories/StatisticRepoitory';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { ResponsiveBar } from '@nivo/bar';
import { selectDateRange } from '../../../utils';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

type GraphData = {
  stageName: string;
  totalContact: number;
  transitionedContacts: number;
  transitionedPercentage: number;
};

const TransitionedBarGraph = ({
  selectedTimeframe,
}: {
  selectedTimeframe: string;
}) => {
  const { t } = useTranslation();
  const [graphData, setData] = useState<GraphData[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const getDateRange = selectDateRange(selectedTimeframe);

    StatisticRepository.getTransitionedContacts(
      getDateRange.startDate,
      getDateRange.endDate,
    ).then((responseData) => {
      setData(responseData.data);
      setIsDataLoaded(true);
    }).catch((e) => {
      logErrorType(e, 1050, { getDateRange });
      setIsDataLoaded(false);
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
          fontWeight: 'bold',
        },
      },
      legend: {
        text: {
          fill: 'white',
          fontWeight: 'bold',
        },
        onClick: {
          fill: 'white',
          color: 'white',
        },
        itemTextColor: 'white',
      },
    },
  };

  const formattedData = graphData.map((item) => ({
    stageName: item.stageName,
    transitionedContacts: item.transitionedContacts,
    transitionedPercentage: item.transitionedPercentage,
  }));

  formattedData.reverse();

  return (
    <div>
      <Card
        sx={{
          maxWidth: 650,
          margin: '0 auto',
          mt: 7,
          p: 5,
          background: '#222222',
          color: 'white',
        }}
      >
        <h5 style={{ textAlign: 'center' }}>
          {t('perentageTransitioned')}
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
            graphData?.length > 0 ? (
              <ResponsiveBar
                data={formattedData}
                keys={['transitionedContacts']}
                indexBy='stageName'
                margin={{ top: 50, right: 60, bottom: 60, left: 60 }}
                padding={0.3}
                layout='horizontal'
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={'#76d6b3'}
                enableGridY={false}
                axisTop={null}
                axisRight={null}
                theme={theme}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: t('numberOfContactsTransitioning'),
                  legendPosition: 'middle',
                  legendOffset: 50,
                }}
                tooltip={({ data }) => (
                  <strong
                    style={{
                      background: 'white',
                      padding: '10px',
                      borderRadius: '5px',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {`Contacts Transitioned: ${data.transitionedPercentage}%`}
                  </strong>
                )}
                enableLabel={false}
                label={(data) => `${data.data.transitionedContacts} Contacts`}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor='black'
                animate={true}
                layers={[
                  'grid',
                  'axes',
                  'bars',
                  'markers',
                  'legends',
                  'annotations',
                  ({ bars }) => {
                    return (
                      <g>
                        {bars.map((bar) => {
                          const { x, y, width } = bar;
                          return (
                            <text
                              key={bar.data.data.stageName}
                              x={x + width - 5}
                              y={y + bar.height / 2}
                              dominantBaseline='middle'
                              textAnchor='end'
                              fill='black'
                              fontWeight='bold'
                            >
                              {`${bar.data.data.transitionedContacts} Contacts`}
                            </text>
                          );
                        })}
                      </g>
                    );
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

export default TransitionedBarGraph;
