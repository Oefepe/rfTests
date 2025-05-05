import { Box, Modal, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { QRCode } from '../../../components';
import { CloseIcon } from '../../../assets/icons';

type PlatformModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
  platform: 'Android' | 'iOS';
  url: string;
  icon: JSX.Element;
};

export const PlatformModal = ({ isModalOpen, platform, url, icon, onClose }: PlatformModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={isModalOpen}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'text.neutral700',
          },
        },
      }}
    >
      <Box
        sx={{
          width: '540px',
          height: '636px',
          borderRadius: '12px',
          backgroundColor: 'text.neutral100',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={onClose}>
          <CloseIcon />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            justifyContent: 'center',
            marginBottom: '42px',
          }}
        >
          <Typography component="h3" variant={'h3semiBold'}>
            {platform === 'Android' ? t('common.text.android') : t('common.text.ios')}
          </Typography>
          {icon}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <QRCode url={url} size="446x446" />
        </Box>
      </Box>
    </Modal>
  );
};
