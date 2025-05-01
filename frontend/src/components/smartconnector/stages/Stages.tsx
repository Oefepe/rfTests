import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import smConnectorAPIs, {
  IStageRepo,
} from '../../../repositories/smConnectorRepo';

import { IStage } from '../../../models/IScStages';
import { isApiError } from '../../../utility/CustomError';

import {
  AddStage,
  PublishSC,
  SingleStage,
  StageTitle,
  SwitchItem,
} from './Index';

import ErrorGrid from '../../UI/ErrorGrid';

import StageContext from './Context/StageContext';

import { SpinLoader } from '../../UI/loader/Index';
import BackButton from './BackButton';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

const Stages = () => {
  const { t } = useTranslation();
  const { id = '', start } = useParams();
  const [switchChecked, setSwitchChecked] = useState(
    localStorage.getItem('isStageEditable') === 'true',
  );
  const [scStages, setScStages] = useState<IStage[]>([]);
  const [connectorName, setConnectorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [publish, setPublish] = useState(false);

  const fetchData = async (stageId: string) => {
    setLoading(true);
    try {
      const response: IStageRepo = await smConnectorAPIs.getSmConnectorsStages(
        stageId,
      );
      setPublish(response.data.SmartConnectors.isPublished);
      setConnectorName(response.data.SmartConnectors.name);
      setScStages(response?.data?.SmartConnectors?.stages || []);
      setSwitchChecked(
        // fixme: typeof start !== 'undefined' || localStorage.getItem('isStageEditable') === 'true'
        typeof start !== 'undefined' ||
        localStorage.getItem('isStageEditable') === 'true'
          ? true
          : false,
      );
    } catch (err) {
      let errMsg = t('defaultErrorMessage');
      if (isApiError(err)) {
        errMsg = err.response.message;
      }
      logErrorType(error, 3005, { errMsg, stageId });
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData(id);
  }, []);

  const submitHandler = (stages: IStage[]) => {
    setScStages([...stages]);
  };

  const onEditModeChange = (value: boolean) => {
    setSwitchChecked(value);
    localStorage.setItem('isStageEditable', value.toString());
  };

  const publishSC = async (value: boolean) => {
    const scDetails = await smConnectorAPIs.publishSmConnectors(id, {
      isPublished: value,
    });
    setPublish(scDetails.data.isPublished);
  };

  return (
    <StageContext.Provider
      value={{
        connectorId: id,
        editMode: switchChecked,
      }}
    >
      <Container sx={{ pt: 6 }}>
        <Card style={{ minHeight: '90vh' }}>
          <CardContent>
            <Grid container sx={{ pb: 3 }}>
              <Grid item xs={3}>
                <BackButton />
              </Grid>
              <Grid item xs={6}>
                <Box display='flex' justifyContent='flex-end'>
                  <PublishSC
                    publish={publish}
                    setPublish={publishSC}
                    switchChecked={switchChecked}
                  />
                </Box>
              </Grid>
              <br />
              <Grid item xs={3}>
                <Box display='flex' justifyContent='flex-end'>
                  <SwitchItem
                    switchChecked={switchChecked}
                    setSwitchChecked={onEditModeChange}
                  />
                </Box>
              </Grid>
            </Grid>

            {/* To display the Loader */}
            {loading && <SpinLoader />}

            {/* To display the Error */}
            {error && <ErrorGrid error={error} />}

            <StageTitle connectorName={connectorName}></StageTitle>

            <Grid item xs={12} sx={{ mt: 3, pb: 1 }}>
              <Typography variant='caption'>{t('stages')}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={2}>
                {scStages.length > 0 &&
                  scStages.map((stage: IStage) => (
                    <SingleStage
                      stage={stage}
                      key={stage.id}
                      editSubmitHandler={submitHandler}
                      switchChecked={switchChecked}
                    />
                  ))}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <AddStage
                submitHandler={submitHandler}
                stageId={id}
                switchChecked={switchChecked}
              />
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </StageContext.Provider>
  );
};

export default Stages;
