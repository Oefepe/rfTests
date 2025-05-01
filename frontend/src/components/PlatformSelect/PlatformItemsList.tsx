import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PlatformItem } from './PlatformItem';

type PlatformItemsListProps = {
  platform: 'Android' | 'iOS' | null;
  handleSelectPlatform: (platform: 'Android' | 'iOS') => void;
};

export const PlatformItemsList = ({ platform, handleSelectPlatform }: PlatformItemsListProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        position: 'absolute',
        marginTop: '8px',
        padding: '16px',
        whiteSpace: 'nowrap',
        width: '100%',
        borderRadius: '8px',
        backgroundColor: 'text.neutral100',
        boxShadow: '0px 4px 15px 0px rgba(0, 0, 0, 0.15)',
        maxHeight: '260px',
        cursor: 'pointer',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        onClick={() => handleSelectPlatform('Android')}
      >
        <Typography variant="h3regular" color="text.neutral900">
          {t('common.text.android')}
        </Typography>
        <PlatformItem isPlatformSelected={platform === 'Android'} />
      </Box>
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}
        onClick={() => handleSelectPlatform('iOS')}
      >
        <Typography variant="h3regular" color="text.neutral900">
          {t('common.text.ios')}
        </Typography>
        <PlatformItem isPlatformSelected={platform === 'iOS'} />
      </Box>
    </Box>
  );
};
