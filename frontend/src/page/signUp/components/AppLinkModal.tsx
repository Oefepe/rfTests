import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Box, Typography } from '@mui/material';
import { ResponseCode } from '../../../config';
import { Button, PlatformSelect, CountryCode } from '../../../components';
import { MessageIcon, CloseIcon } from '../../../assets/icons';

type AppLinkModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
  onSelectPlatform: (platform: 'Android' | 'iOS') => void;
  onChangePhoneNumber: (number: string) => void;
  onSubmit: () => Promise<number>;
  platform: 'Android' | 'iOS' | null;
  phoneNumber: string;
};

export const AppLinkModal = ({
  isModalOpen,
  onClose,
  onSelectPlatform,
  onChangePhoneNumber,
  onSubmit,
  platform,
  phoneNumber,
}: AppLinkModalProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const { t } = useTranslation();

  const handleClickSubmit = async () => {
    const status = await onSubmit();

    if (status === ResponseCode.success) {
      setMessage(t('common.notice.success'));
    } else if (status === ResponseCode.error) {
      setMessage(t('common.notice.invalid_phone_number'));
    }

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setMessage('');
    onClose();
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
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
          width: isSubmitted ? '584px' : '794px',
          borderRadius: '12px',
          backgroundColor: 'text.neutral100',
          display: 'flex',
          flexDirection: 'column',
          paddingX: '20px',
          paddingTop: '16px',
          textAlign: 'center',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={handleClose}>
          <CloseIcon />
        </Box>
        {isSubmitted ? (
          <Box
            sx={{
              marginTop: '24px',
            }}
          >
            <Typography component="h3" variant="h3regular" color="text.neutral900" marginBottom="32px">
              {message}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography component="h2" variant="h2regular">
              {t('login_signup.send_app_modal.header')}
            </Typography>
            <Typography component="h3" variant="h3regular" sx={{ marginY: '40px' }}>
              {t('login_signup.send_app_modal.sub_head')}
            </Typography>
            <Box sx={{ marginBottom: '40px' }}>
              <PlatformSelect onChange={onSelectPlatform} />
            </Box>
            <CountryCode onChange={onChangePhoneNumber} />
            <Box sx={{ marginTop: '35px', marginBottom: '32px' }}>
              <Button
                startIcon={<MessageIcon />}
                text={t('login_signup.send_app_modal.send_me_the_app')}
                onClick={handleClickSubmit}
                disabled={!platform || !phoneNumber.trim()}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
