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
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
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
  delayId: string;
  toggleToolTip: (arg0: boolean) => void;
  handleTooltipClose: () => void;
};

const AddDelay = ({
  delayId,
  toggleToolTip,
  handleTooltipClose,
}: PropTypes) => {
  const { t } = useTranslation();
  const [formError, setFormError] = useState('');
  const [showFormError, setShowFormError] = useState(false);
  const { connectorId, editMode } = useContext(StageContext);
  const { stageId, onElementAdded } = useContext(SingleStageContext);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [inputValues, setInputValues] = useState({
    delayName: {
      value: '',
      isValid: false,
    },
    delayTime: {
      value: '',
      isValid: false,
    },
    delayTimeUnit: {
      value: '2',
      isValid: true,
    },
  });

  function inputChangeHandler(
    inputIdentifier: string,
    enteredValue: React.ChangeEvent<HTMLInputElement>,
  ) {
    let isValid = false;
    setInputValues((curInputValues) => {
      switch (inputIdentifier) {
        case 'delayTime':
          isValid = enteredValue.target.value.trim() !== '';
          if (isValid) {
            try {
              const value = Number(enteredValue.target.value.trim());
              // fixme: isValid = value > 0;
              if (value > 0) {
                isValid = true;
              } else {
                isValid = false;
              }
            } catch (e) {
              isValid = false;
            }
          }
          break;
        default:
          isValid = enteredValue.target.value.trim() !== ''; // fixme: !enteredValue.target.value.trim()
          break;
      }
      return {
        ...curInputValues,
        [inputIdentifier]: {
          value: enteredValue.target.value,
          isValid: isValid,
        },
      };
    });
  }

  function onTimeUnitChange(selectedValue: SelectChangeEvent) {
    setInputValues((curInputValues) => {
      return {
        ...curInputValues,
        ['delayTimeUnit']: {
          value: selectedValue.target.value,
          isValid: selectedValue.target.value !== '', // fixme: !selectedValue.target.value
        },
      };
    });
  }

  const delayTimeUnitArr = [
    { id: 4, value: 'Minutes' },
    { id: 1, value: 'Hours' },
    { id: 2, value: 'Days' },
    { id: 3, value: 'Weeks' },
  ];
  const handleOpen = () => {
    toggleToolTip(false);
    setOpen(true);

    //Show/Hide the tooltip and show the add modal
  };

  const handleClose = () => {
    setOpen(false);
    setInputValues({
      delayName: {
        value: '',
        isValid: false,
      },
      delayTime: {
        value: '',
        isValid: false,
      },
      delayTimeUnit: {
        value: '2',
        isValid: true,
      },
    });
    setFormError('');
    setShowFormError(false);
    setOpen(false);
    toggleToolTip(true);
    handleTooltipClose();
  };

  const submitForm = async (name: string, time: string, timeUnit: string) => {
    const scDelayDetails = {
      name: name,
      delayTime: time,
      delayTimeUnit: timeUnit,
      smartConnectorId: connectorId,
      stageId: stageId,
      nodeType: 3,
      parentId: delayId || '',
    };
    try {
      const response = await smConnectorAPIs.addActionToConnector(
        stageId,
        connectorId,
        scDelayDetails,
      );

      if (response.data.status !== undefined) { // fixme: !response.data.status
        setFormError(response.data.message);
      } else {
        handleClose();
        onElementAdded();
      }
    } catch (err) {
      let errMsg = t('defaultErrorMessage');
      if (isApiError(err)) {
        errMsg = err.message ? err.message : t('defaultErrorMessage');
      }
      logErrorType(err, 3006, {
        errMsg,
        name,
        time,
        timeUnit,
        stageId,
        connectorId,
      });
      setFormError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<EventTarget>) => { // fixme: import FormEvent from React
    event.preventDefault();
    setShowFormError(true);
    if (
      inputValues.delayName.isValid &&
      inputValues.delayTime.isValid &&
      inputValues.delayTimeUnit.isValid
    ) {
      setLoading(true);
      submitForm(
        inputValues.delayName.value,
        inputValues.delayTime.value,
        inputValues.delayTimeUnit.value,
      );
    } else {
      setLoading(false);
    }
  };

  return (
    // fixme: span should not contain block elements like div (Container)
    <span>
      <Button
        variant='outlined'
        size='small'
        id='addNewDelay'
        aria-label={t('addDelay')}
        onClick={handleOpen}
        disabled={!editMode}
        startIcon={<ControlPointIcon />}
      >
        {t('addDelay')}
      </Button>
      <Container maxWidth='lg' sx={{ pt: 2 }}>
        <Grid container>
          <Modal
            open={open}
            aria-labelledby={t('addDelayLabelInModal')}
            aria-describedby={t('addDelayLabelInModal')}
            onClose={handleClose}
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
                  title={t('addDelayLabelInModal')}
                  id='scStageTitle'
                />
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          margin='normal'
                          fullWidth
                          placeholder={t('addDelayPlaceHolder')}
                          id='name'
                          autoComplete='off'
                          onChange={inputChangeHandler.bind(this, 'delayName')}
                          value={inputValues.delayName.value}
                          helperText={
                            showFormError && !inputValues.delayName.isValid
                              ? t('delayNameValidation')
                              : ''
                          }
                          error={
                            showFormError && !inputValues.delayName.isValid
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          type='number'
                          fullWidth
                          placeholder={
                            t('addDelayTimePlaceHolder')
                          }
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                          }}
                          id='delayTime'
                          autoComplete='off'
                          onChange={inputChangeHandler.bind(this, 'delayTime')}
                          value={inputValues.delayTime.value}
                          helperText={
                            showFormError && !inputValues.delayTime.isValid
                              ? t('delayTimeValidation')
                              : ''
                          }
                          error={
                            showFormError && !inputValues.delayTime.isValid
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sx={{ mb: 2 }}>
                        <Select
                          fullWidth
                          id='delayTimeUnit'
                          defaultValue={inputValues.delayTimeUnit.value}
                          onChange={onTimeUnitChange}
                        >
                          {delayTimeUnitArr.map((item) => {
                            return (
                              <MenuItem key={item.id} value={item.id}>
                                {item.value}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </Grid>
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

export default AddDelay;
