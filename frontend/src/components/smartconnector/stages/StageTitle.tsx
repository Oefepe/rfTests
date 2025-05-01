import { Grid, Tooltip, Typography } from '@mui/material';
import truncateString from '../../../utility/stringHelper';
import { useTranslation } from 'react-i18next';

const StageTitle = ({ connectorName }: { connectorName: string }) => {
  const { t } = useTranslation();
  return (
    <Grid container sx={{ pt: 0.5 }}>
      <Grid container>
        <Grid item xs={6} md={2}>
          <Typography variant='caption'>
            {t('smartConnector')} :
          </Typography>
        </Grid>
        <Grid item xs={6} md={10} sx={{ pt: 0.5 }}>
          <Tooltip title={connectorName} placement='top-start'>
            <Typography variant='bodyLarge'>
              {truncateString(connectorName, 30)}
            </Typography>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default StageTitle;
