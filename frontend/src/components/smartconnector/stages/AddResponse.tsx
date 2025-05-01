import { useContext, useState } from 'react';

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
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { isApiError } from '../../../utility/CustomError';
import SaveButton from '../../UI/SaveButton';
import smConnectorAPIs from '../../../repositories/smConnectorRepo';

import StageContext from './Context/StageContext';
import SingleStageContext from './Context/SingleStageContext';

import '../../../App.css';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

type PropTypes = {
  responseId: string;
  toggleToolTip: (arg0: boolean) => void;
  handleTooltipClose: () => void;
};

const AddResponse = ({
  responseId,
  toggleToolTip,
  handleTooltipClose,
}: PropTypes) => {
  const { t } = useTranslation();
  const [formError, setFormError] = useState('');
  const [errorText, setErrorText] = useState(false);

  const { connectorId, editMode } = useContext(StageContext);
  const { stageId, onElementAdded } = useContext(SingleStageContext);

  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    //Show/Hide the tooltip and show the add modal
    toggleToolTip(false);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setFormError('');
    toggleToolTip(true);
    handleTooltipClose();
  };

  const submitForm = async (stageName: string) => {
    const scResponseDetails = {
      name: stageName,
      smartConnectorId: connectorId,
      stageId: stageId,
      nodeType: 2,
      parentId: responseId || '',
    };
    try {
      const response = await smConnectorAPIs.addActionToConnector(
        stageId,
        connectorId,
        scResponseDetails,
      );

      if (response) {
        handleClose();
        onElementAdded();
      }
    } catch (err) {
      let errMsg = t('defaultErrorMessage');
      if (isApiError(err)) {
        errMsg = err.message ? err.message : t('defaultErrorMessage');
      }
      logErrorType(err, 3007, {
        errMsg,
        stageName,
        stageId,
        connectorId,
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
      return false;
    } else {
      setLoading(true);
      submitForm(name);
    }
  };

  return (
    <span>
      <Button
        variant='outlined'
        size='small'
        id='addNewResponse'
        aria-label={t('addResponse')}
        onClick={handleOpen}
        disabled={!editMode}
        startIcon={<ControlPointIcon />}
      >
        {t('addResponse')}
      </Button>
      <Container maxWidth='lg' sx={{ pt: 2 }}>
        <Grid container>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby={t('addResponseLabelInModal')}
            aria-describedby={t('addResponseLabelInModal')}
            disableRestoreFocus={true}
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
                  title={t('addResponseLabelInModal')}
                  id='scStageTitle'
                />
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <Grid item sx={{ mb: 2 }}>
                      <TextField
                        margin='normal'
                        fullWidth
                        placeholder={t('addResponsePlaceHolder')}
                        id='name'
                        autoComplete='off'
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrorText(false);
                        }}
                        value={name}
                        helperText={
                          errorText
                            ? t('responseNameValidation')
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
    </span>
  );
};

export default AddResponse;
