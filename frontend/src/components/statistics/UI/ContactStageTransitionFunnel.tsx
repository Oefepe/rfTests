import StatisticRepository from '../../../repositories/StatisticRepoitory';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ResponsiveFunnel } from '@nivo/funnel';
import { selectDateRange } from '../../../utils';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

type GraphData = {
  id: string;
  value: number;
  label: string;
};

const ContactStageTransitionFunnelGraph = ({
  selectedTimeframe,
}: {
  selectedTimeframe: string;
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<GraphData[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const getDateRange = selectDateRange(selectedTimeframe);

    StatisticRepository.getContactStageTransitions(
      getDateRange.startDate,
      getDateRange.endDate,
    ).then((responseData) => {
      const formattedData = responseData.data.map((stage) => ({
        id: stage.stageName,
        value: stage.totalContacts,
        label: stage.stageName,
      }));
      setData(formattedData);
      setIsDataLoaded(true);
    }).catch((e) => {
      logErrorType(e, 1043, { getDateRange });
      setIsDataLoaded(false);
    });
  }, [selectedTimeframe]);

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
          {t('contactConversionFromFirstStage')}
        </h5>
        <div style={{ height: 400, width: 600, color: 'black' }}>
          {isDataLoaded ? (
            data?.length > 0 ? (
              <ResponsiveFunnel
                data={data}
                margin={{ top: 20, right: 35, bottom: 20, left: 15 }}
                colors={{ scheme: 'spectral' }}
                borderWidth={20}
                labelColor={{
                  from: 'color',
                  modifiers: [['darker', 3]],
                }}
                valueFormat='>-.4s'
                beforeSeparatorLength={100}
                beforeSeparatorOffset={20}
                afterSeparatorLength={100}
                afterSeparatorOffset={20}
                currentPartSizeExtension={10}
                currentBorderWidth={40}
                motionConfig='wobbly'
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
                <Typography variant='caption'>{t(
                  'noDataAvailable')}</Typography>
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
              <Typography variant='caption'>{t('loadingData')}</Typography>
            </Box>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ContactStageTransitionFunnelGraph;
