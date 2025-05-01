import StatisticRepository from '../../../repositories/StatisticRepoitory';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { selectDateRange } from '../../../utils';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

const TotalContactsCard = ({
  selectedTimeframe,
}: {
  selectedTimeframe: string;
}) => {
  const { t } = useTranslation();
  const [totalContacts, setTotalContacts] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const getDateRange = selectDateRange(selectedTimeframe);
    let totalNumContacts = 0;
    StatisticRepository.getStatistics(
      getDateRange.startDate,
      getDateRange.endDate,
    ).then((responseData) => {
      responseData.data.forEach((element) => {
        totalNumContacts += +element.totalContacts;
      });
      setTotalContacts(totalNumContacts);
      setIsDataLoaded(true);
    }).catch((e) => {
      logErrorType(e, 1046, { getDateRange });
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
        {isDataLoaded ? (
          <div>
            <h3 style={{ textAlign: 'center' }}>
              {t('totalContactsInSmartConnector')}
            </h3>
            <h4 style={{ textAlign: 'center' }}>{totalContacts}</h4>
          </div>
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
    </div>
  );
};

export default TotalContactsCard;
