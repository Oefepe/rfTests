import { useState } from 'react';

import {
  Alert,
  Box,
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
import EditIcon from '@mui/icons-material/Edit';

import { isApiError } from '../../../utility/CustomError';
import SaveButton from '../../UI/SaveButton';
import smConnectorAPIs from '../../../repositories/smConnectorRepo';
import { IStage } from '../../../models/IScStages';

import '../../../App.css';
import { useTranslation } from 'react-i18next';

type PropTypes = {
  submitHandler: (stages: IStage[]) => void;
  connectorId: string;
  switchChecked: boolean;
  stageId: string;
  existingStageName: string;
};

const EditStage = ({
  submitHandler,
  connectorId,
  switchChecked,
  stageId,
  existingStageName,
}: PropTypes) => {
  const { t } = useTranslation();
  const [formError, setFormError] = useState('');
  const [errorText, setErrorText] = useState(false);

  const [name, setName] = useState(existingStageName);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormError('');
  };

  const submitForm = async (stageName: string) => {
    const scStageDetails = [{ name: stageName }];
    try {
      const response = await smConnectorAPIs.updateStageToConnector(
        connectorId,
        stageId,
        scStageDetails,
      );

      if (response.data.stages) {
        submitHandler(response.data.stages);
        handleClose();
      }
    } catch (err) {
      // fixme: setFormError(err.message ?? t('defaultErrorMessage'));
      let errMsg = t('defaultErrorMessage');
      if (isApiError(err)) {
        errMsg = err.message ? err.message : t('defaultErrorMessage');
      }
      setFormError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    if (name.trim() === '') {
      setErrorText(true);
    } else {
      setLoading(true);
      submitForm(name);
    }
  };

  return (
    <Box>
      <IconButton
        id='editStage'
        color='primary'
        size='small'
        aria-label='edit'
        onClick={handleOpen}
        disabled={!switchChecked}
      >
        <EditIcon />
      </IconButton>
      <Container maxWidth='lg' sx={{ pt: 2 }}>
        <Grid container>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby={t('editStageLabel')}
            aria-describedby={t('editStageLabel')}
          >
            <Box className='boxClass'>
              <Card variant='outlined'>
                <IconButton
                  sx={{ position: 'absolute', top: '0', right: '0' }}
                  onClick={handleClose}
                >
                  <CancelRoundedIcon />
                </IconButton>
                <CardHeader
                  title={t('editStageLabel')}
                  id='scStageTitle'
                />
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <Grid item sx={{ mb: 2 }}>
                      <TextField
                        margin='normal'
                        fullWidth
                        placeholder={t('addStagePlaceHolder')}
                        id='name'
                        autoComplete='off'
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrorText(false);
                        }}
                        value={name}
                        helperText={
                          errorText
                            ? t('stageNameValidation')
                            : ''
                        }
                        error={errorText}
                      />
                    </Grid>
                    {formError && <Alert severity='error'>{formError}</Alert>}
                    <Grid item>
                      <Grid container justifyContent='center'>
                        <Box sx={{ m: 1, position: 'relative' }}>
                          <SaveButton loading={loading} id='saveSC' />
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Box>
          </Modal>
        </Grid>
      </Container>
    </Box>
  );
};

export default EditStage;
