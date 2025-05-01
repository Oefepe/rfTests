import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

interface ResetLinkSentDialogProps {
  open: boolean;
  onClose: () => void;
}

const ResetLinkSentDialog: React.FC<ResetLinkSentDialogProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 5 } }}
    >
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography
          component="h3"
          variant="h3regular"
          sx={{ margin: 2, lineHeight: 'normal' }}>
          {t('login_signup.reset_pwd_link_sent_msg')}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ResetLinkSentDialog;
