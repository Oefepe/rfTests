import { Box } from '@mui/material';
import { RfPoweredIcon } from '../../assets/icons/RfPoweredIcon';
import { useTranslation } from 'react-i18next';

export const RfPowered = () => {
  const { t } = useTranslation();
  const onLink = () => {
    window.open(t('common.support_url'), '_blank');
  };
  return (
    <Box
      sx={{ cursor: 'pointer' }}
      onClick={onLink}>
      <RfPoweredIcon />
    </Box>
  );
};
