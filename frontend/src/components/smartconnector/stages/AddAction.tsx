import { useContext, useEffect, useState } from 'react';

import {
  Alert,
  Autocomplete,
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
  Tooltip,
  Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { isApiError } from '../../../utility/CustomError';
import SaveButton from '../../UI/SaveButton';
import smConnectorAPIs from '../../../repositories/smConnectorRepo';

import StageContext from './Context/StageContext';
import SingleStageContext from './Context/SingleStageContext';

import '../../../App.css';
import {
  getAccountId,
  getResourceList,
} from '../../../services/ResourceService';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { useTranslation } from 'react-i18next';

type PropTypes = {
  actionId: string;
  toggleToolTip: (arg0: boolean) => void;
  handleTooltipClose: () => void;
};

interface Resource {
  id: number;
  name: string;
}

const AddAction = ({
  actionId,
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

  const [resourceList, setResourceList] = useState<Resource[]>([]);

  const [selectedResource, setSelectedResource] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [taskMessage, setTaskMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchResourceList = async () => {
      try {
        const res = await getResourceList(
          String(getAccountId(String(localStorage.getItem('encodedUrl')))),
        );

        // res has no 'data', because it returned from getResourceList:
        // response.data as Resource[];
        if (Array.isArray(res)) {
          setResourceList(res);
        }
      } catch (error) {
        let errMsg = t('defaultErrorMessage');
        if (isApiError(error)) {
          errMsg = error.message ? error.message : t('defaultErrorMessage');
        }
        logErrorType(error, 3004, { errMsg, name, actionId });
        setFormError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    if (resourceList.length < 1) {
      fetchResourceList();
    }
  }, []);

  const handleResourceChange = (
    event: React.SyntheticEvent,
    newValue: { id: number; name: string } | null,
  ) => {
    setSelectedResource(newValue);
  };

  const handleOpen = () => {
    //Show/Hide the tooltip and show the add modal
    toggleToolTip(false);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setTaskMessage(null);
    setFormError('');
    toggleToolTip(true);
    handleTooltipClose();
    setSelectedResource(null);
  };

  const submitForm = async (stageName: string) => {
    const scActionDetails = {
      name: stageName,
      smartConnectorId: connectorId,
      stageId: stageId,
      nodeType: 1,
      parentId: actionId || '',
      resourceId: selectedResource?.id || null,
      resourceName: selectedResource?.name || null,
      taskMessage: taskMessage || null,
    };
    try {
      const response = await smConnectorAPIs.addActionToConnector(
        stageId,
        connectorId,
        scActionDetails,
      );

      if (response) {
        handleClose();
        onElementAdded();
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
      return false;
    } else {
      setLoading(true);
      submitForm(name);
    }
  };

  return (
    // fixme: span should not contain block elements like div (Container)
    <span>
      <Button
        variant='outlined'
        size='small'
        id='addNewAction'
        aria-label={t('addAction')}
        onClick={handleOpen}
        disabled={!editMode}
        startIcon={<ControlPointIcon />}
      >
        {t('addAction')}
      </Button>
      <Container maxWidth='lg' sx={{ pt: 2 }}>
        <Grid container>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby={t('addActionLabelInModal')}
            aria-describedby={t('addActionLabelInModal')}
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
                  title={t('addActionLabelInModal')}
                  id='scStageTitle'
                />
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <Grid item sx={{ mb: 2 }}>
                      <TextField
                        margin='normal'
                        fullWidth
                        placeholder={t('addActionPlaceHolder')}
                        id='name'
                        autoComplete='off'
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrorText(false);
                        }}
                        value={name}
                        helperText={
                          errorText
                            ? t('actionNameValidation')
                            : ''
                        }
                        error={errorText}
                      />
                      <Autocomplete
                        options={resourceList}
                        getOptionLabel={(option) => option.name}
                        value={selectedResource}
                        onChange={handleResourceChange}
                        renderInput={(params) => (
                          <TextField
                            {...(params as TextFieldProps)}
                            label={t('selectResource')}
                            variant='outlined'
                          />
                        )}
                      />
                      <Box
                        sx={{ mt: 2, display: 'flex', alignItems: 'center' }}
                      >
                        <Typography component='h3' variant='h3regular'>
                          {t('taskMessageForUser')}
                        </Typography>
                        <Tooltip
                          title={t('taskTooltipMessage')}
                          arrow
                        >
                          <InfoIcon
                            color='primary'
                            style={{ cursor: 'pointer', marginLeft: '8px' }}
                          />
                        </Tooltip>
                      </Box>
                      <div className='taskMessageField'>
                        <TextField
                          margin='none'
                          fullWidth
                          id='taskMessage'
                          placeholder={t('addTaskMessage')}
                          multiline
                          rows={3}
                          autoComplete='off'
                          onChange={(e) => {
                            setTaskMessage(e.target.value);
                            setErrorText(false);
                          }}
                          value={taskMessage}
                        />
                      </div>
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

export default AddAction;
