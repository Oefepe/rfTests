import { useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  Modal,
  TextField,
} from '@mui/material';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { getAccountId } from '../../services/ResourceService';

import { isApiError } from '../../utility/CustomError';
import smConnectorAPIs from '../../repositories/smConnectorRepo';
import ISmartConnector from '../../models/ISmartConnector';
import SaveButton from '../UI/SaveButton';
import '../../App.css';
import { logErrorType } from '../../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

type PropTypes = {
  submitHandler: (smartConnector: ISmartConnector) => void;
};
const defaultErrorMessage = 'Something went wrong. Please try again';

function AddItem({ submitHandler }: PropTypes) {
  const { t } = useTranslation();
  const [formError, setFormError] = useState('');
  const [errorText, setErrorText] = useState(false);
  const [descErr, setDescErrorText] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setName('');
    setDescription('');
    setFormError('');
  };

  const handleSubmit = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    if (name.trim() === '' && description.trim() === '') {
      setErrorText(true);
      setDescErrorText(true);
    } else if (name.trim() === '') {
      setErrorText(true);
    } else if (description.trim() === '') {
      setDescErrorText(true);
    } else {
      setLoading(true);
      (async () => {
        const scDetails = {
          name,
          description: description,
          accountId: String(
            getAccountId(String(localStorage.getItem('encodedUrl'))),
          ),
        };
        try {
          const response = await smConnectorAPIs.createSmConnectors(scDetails);
          if (response) {
            submitHandler(response.data);
            handleClose();
          }
        } catch (err) {
          let errMsg = defaultErrorMessage;
          if (isApiError(err)) {
            errMsg = err.message ? err.message : defaultErrorMessage;
          }
          logErrorType(err, 3003, { errMsg, name, description });
          setFormError(errMsg);
        } finally {
          setLoading(false);
        }
      })();
    }
  };
  return (
    <Container maxWidth='lg' sx={{ pt: 6 }}>
      <Grid container>
        <Grid container justifyContent='flex-end'>
          <Button variant='outlined' onClick={handleOpen} id='addNewSC'>
            {t('addNew')}
          </Button>
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box className='boxClass'>
            <Card variant='outlined'>
              <IconButton
                style={{ position: 'absolute', top: '0', right: '0' }}
                onClick={handleClose}
              >
                <CancelRoundedIcon />
              </IconButton>
              <CardHeader title={t('newSC')} id='formTitle' />
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Grid item sx={{ mb: 2 }}>
                    <TextField
                      margin='normal'
                      fullWidth
                      label={t('title')}
                      id='name'
                      autoComplete='off'
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrorText(false);
                      }}
                      value={name}
                      helperText={errorText ? t('requiredTitle') : ''}
                      error={errorText}
                    />
                    <TextField
                      id='description'
                      label={t('description')}
                      multiline
                      fullWidth
                      rows={4}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setDescErrorText(false);
                      }}
                      helperText={descErr ? t('descriptionRequired') : ''}
                      error={descErr}
                    />
                  </Grid>
                  {formError && <Alert severity='error'>{formError}</Alert>}
                  <Grid item>
                    <Grid container justifyContent='center'>
                      <SaveButton loading={loading} id='saveSC' />
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Box>
        </Modal>
      </Grid>
    </Container>
  );
}

export default AddItem;
