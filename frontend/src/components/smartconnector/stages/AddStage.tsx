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
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { isApiError } from '../../../utility/CustomError';
import SaveButton from '../../UI/SaveButton';
import smConnectorAPIs from '../../../repositories/smConnectorRepo';
import { IStage } from '../../../models/IScStages';

import '../../../App.css';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

type PropTypes = {
  submitHandler: (stages: IStage[]) => void;
  stageId: string;
  switchChecked: boolean;
};

const AddStage = ({ submitHandler, stageId, switchChecked }: PropTypes) => {
  const { t } = useTranslation();
  const [formError, setFormError] = useState('');
  const [errorText, setErrorText] = useState(false);

  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName('');
    setFormError('');
  };

  const submitForm = async (stageName: string) => {
    const scStageDetails = [{ name: stageName }];
    try {
      const response = await smConnectorAPIs.addStageToConnector(
        stageId,
        scStageDetails,
      );

      if (response.data.stages) {
        submitHandler(response.data.stages);
        handleClose();
      }
    } catch (err) {
      let errMsg = t('defaultErrorMessage');
      if (isApiError(err)) {
        errMsg = err.message ? err.message : t('defaultErrorMessage');
      }
      logErrorType(err, 3008, {
        errMsg,
        stageName,
        stageId,
        scStageDetails,
      });

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
    <Container maxWidth='lg' sx={{ pt: 2 }}>
      <Grid container>
        <Grid item xs={9}>
          <Stack direction='row' justifyContent='center' alignItems='center'>
            <Tooltip
              title={t('addStageLabel')}
              placement='bottom-start'
            >
              <span>
                <Button
                  variant='outlined'
                  size='small'
                  id='addNewStage'
                  aria-label={t('addStageLabel')}
                  onClick={handleOpen}
                  disabled={!switchChecked}
                  startIcon={<ControlPointIcon />}
                >
                  {t('addStageLabel')}
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
      <Grid container>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby={t('addStageLabelInModal')}
          aria-describedby={t('addStageLabelInModal')}
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
                title={t('addStageLabelInModal')}
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
                        errorText ? t('stageNameValidation') : ''
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
  );
};

export default AddStage;
