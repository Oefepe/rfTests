import { useTranslation } from 'react-i18next';
import { Box, Modal, Typography } from '@mui/material';
import { CloseIcon } from '../../assets/icons';

type ErrorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  errorCode?: number;
};

export const ErrorModal = ({ isOpen, onClose, errorMessage, errorCode }: ErrorModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal open={isOpen} onClose={onClose} sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          width: '584px',
          padding: '16px',
          borderRadius: '8px',
          paddingBottom: '32px',
          textAlign: 'center',
          backgroundColor: 'text.neutral100',
          boxShadow: '0px 4px 15px 0px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={onClose}>
          <CloseIcon />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h3regular" sx={{ marginTop: '24px', marginBottom: '16px' }}>
            {errorMessage}
          </Typography>
          <Typography variant="caption">
            {t('common.notice.error_code')}: {errorCode}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};
