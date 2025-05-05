import { useContext, useEffect, useState } from 'react';

import {
  Alert,
  Autocomplete,
  Box,
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
import EditIcon from '@mui/icons-material/Edit';
import smConnectorAPIs, {
  IActionDetails,
} from '../../../repositories/smConnectorRepo';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { isApiError } from '../../../utility/CustomError';
import SaveButton from '../../UI/SaveButton';

import StageContext from './Context/StageContext';
import SingleStageContext from './Context/SingleStageContext';
import ErrorGrid from '../../UI/ErrorGrid';
import { SpinLoader } from '../../UI/loader/Index';

import '../../../App.css';
import {
  getAccountId,
  getResourceList,
} from '../../../services/ResourceService';
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

const EditAction = ({
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
  const [editOpen, setEditOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [resourceList, setResourceList] = useState<Resource[]>([]);

  const [selectedResource, setSelectedResource] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [taskMessage, setTaskMessage] = useState<string | null>(null);

  const fetchData = async (id: string) => {
    setLoading(true);
    try {
      const response: IActionDetails =
        await smConnectorAPIs.getSingleActionDetails(id);
      const actionData = response.data.stageElements;
      console.log(actionData);
      const taskMessageNew: string | null = actionData.taskMessage;
      setName(actionData.name);
      setTaskMessage(taskMessageNew);
      const resourceName = actionData.resourceName;
      const resourceId = actionData.resourceId;
      const resourcedata = { id: resourceId, name: resourceName };
      setSelectedResource(resourcedata);
    } catch (err) {
      let errMsg = t('defaultErrorMessage');
      if (isApiError(err)) {
        errMsg = err.response.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

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
      } catch (errorData) {
        let errMsg = t('defaultErrorMessage');
        if (isApiError(errorData)) {
          errMsg = errorData.message ?
            errorData.message :
            t('defaultErrorMessage');
        }
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

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    fetchData(actionId);
    //Show/Hide the tooltip and show the add modal
    toggleToolTip(false);
    setEditOpen(true);
    handleTooltipClose();
  };

  const handleClose = () => {
    setEditOpen(false);
    setName('');
    setTaskMessage(null);
    setFormError('');
    setSelectedResource(null);
    handleTooltipClose();
    toggleToolTip(false);
  };

  const submitForm = async (stageName: string) => {
    const scActionDetails = {
      name: stageName,
      smartConnectorId: connectorId,
      stageId: stageId,
      nodeType: 1,
      id: actionId || '',
      resourceId: selectedResource?.id || null,
      resourceName: selectedResource?.name || null,
      taskMessage: taskMessage || null,
    };
    try {
      const response = await smConnectorAPIs.updateActionToConnector(
        stageId,
        connectorId,
        scActionDetails,
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
    <span style={{ width: '20px', marginLeft: '5px' }}>
      {/* To display the Loader */}
      {loading && <SpinLoader />}

      {/* To display the Error */}
      {error && <ErrorGrid error={error} />}
      <IconButton
        id='EditAction'
        color='primary'
        size='small'
        aria-label='edit'
        onClick={handleOpen}
        disabled={!editMode}
        style={{
          width: '32px',
          height: '20px',
        }}
      >
        <EditIcon />
      </IconButton>
      <div
        className='EditActionContainer'
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Container maxWidth='lg' sx={{ pt: 2 }}>
          <Grid container>
            <Modal
              open={editOpen}
              onClose={handleClose}
              aria-labelledby={t('editAction')}
              aria-describedby={t('editAction')}
              disableRestoreFocus={true}
            >
              <Box className='boxClass'>
                <Card variant='outlined'>
                  <IconButton
                    sx={{ position: 'absolute', top: '0', right: '0' }}
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent event propagation
                      handleClose();
                    }}
                  >
                    <CancelRoundedIcon />
                  </IconButton>
                  <CardHeader
                    title={t('editAction')}
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
      </div>
    </span>
  );
};

export default EditAction;
