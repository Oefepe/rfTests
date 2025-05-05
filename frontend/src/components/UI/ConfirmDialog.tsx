import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

type PropType = {
  handleClickOpen: () => void;
  open: boolean;
  handleDelete: (id: string) => void;
  id: string;
  handleClose: (event: React.MouseEvent<HTMLElement>) => void;
};
function ConfirmDialog({
  handleClickOpen,
  open,
  handleDelete,
  id,
  handleClose,
}: PropType) {
  const {t} = useTranslation()
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        {t('delete')}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('deleteSC')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('confirmDeleteSC')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('cancel')}</Button>
          <Button
            onClick={() => {
              handleDelete(id);
            }}
            autoFocus
          >
            {t('yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmDialog;
