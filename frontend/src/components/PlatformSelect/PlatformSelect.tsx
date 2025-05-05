import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, useTheme } from '@mui/material';
import { PlatformItemsList } from './PlatformItemsList';
import { ArrowIcon } from '../../assets/icons';

type PlatformSelectProps = {
  onChange: (platform: 'Android' | 'iOS') => void;
};

export const PlatformSelect = ({ onChange }: PlatformSelectProps) => {
  const [platform, setPlatform] = useState<'Android' | 'iOS' | null>(null);
  const [isPlatformsListOpen, setIsPlatformsListOpen] = useState(false);

  const { t } = useTranslation();
  const theme = useTheme();

  const handlePlatformsList = () => {
    setIsPlatformsListOpen(!isPlatformsListOpen);
  };

  const handleSelectPlatform = (platform: 'Android' | 'iOS') => {
    setPlatform(platform);
    onChange(platform);
    handlePlatformsList();
  };

  return (
    <Box sx={{ width: '548px', position: 'relative' }}>
      <Typography
        variant="inputLabel"
        color="text.neutral500"
        sx={{
          marginBottom: '4px',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        {t('common.field_label.platform')}
      </Typography>
      <Box
        sx={{
          borderBottom: '1px solid',
          borderBottomColor: 'text.neutral300',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          position: 'relative',
        }}
        onClick={handlePlatformsList}
      >
        <Typography variant="inputField">{platform ?? t('login_signup.send_app_modal.select_device')}</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            transform: isPlatformsListOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            marginRight: '16px',
          }}
        >
          <ArrowIcon color={theme.palette.text.neutral700} rotation="-90" width="29" />
        </Box>
      </Box>
      {isPlatformsListOpen && <PlatformItemsList platform={platform} handleSelectPlatform={handleSelectPlatform} />}
    </Box>
  );
};
