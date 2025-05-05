import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

type TimeframeSelectorProps = {
  selectedTimeframe: string;
  onTimeframeChange: (selectedTimeframe: string) => void;
};

const TimeframeSelector = ({
  selectedTimeframe,
  onTimeframeChange,
}: TimeframeSelectorProps) => {
  const { t } = useTranslation();
  const handleTimeframeChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    onTimeframeChange(selectedValue);
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
          labelId='timeframe-select-label'
          id='timeframe-select'
          value={selectedTimeframe}
          onChange={handleTimeframeChange}
          sx={{ minWidth: 100 }}
        >
          <MenuItem value='last24Hours'>
            {t('last24Hours')}
          </MenuItem>
          <MenuItem value='lastWeek'>{t('lastWeek')}</MenuItem>
          <MenuItem value='lastMonth'>{t('lastMonth')}</MenuItem>
        </Select>
      </Box>
    </div>
  );
};

export default TimeframeSelector;
