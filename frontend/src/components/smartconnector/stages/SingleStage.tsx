import { useContext, useEffect, useState } from 'react';

import { Alert, Box, Grid, Paper, Tooltip } from '@mui/material';

import { IStage } from '../../../models/IScStages';
import { IStageElements } from '../../../models/IScStageActions';
import AddAction from './AddAction';
import truncateString from '../../../utility/stringHelper';
import smConnectorAPIs, { IActionRepo } from '../../../repositories/smConnectorRepo';

import { isApiError } from '../../../utility/CustomError';

import { SpinLoader } from '../../UI/loader/Index';

import RecursiveElement from './RecursiveElement';

import StageContext from './Context/StageContext';
import SingleStageContext from './Context/SingleStageContext';
import EditStage from './EditStage';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

type PropTypes = {
  stage: IStage;
  editSubmitHandler: (stages: IStage[]) => void;
  switchChecked: boolean;
};

const SingleStage = ({
  stage,
  editSubmitHandler,
  switchChecked,
}: PropTypes) => {
  const { t } = useTranslation();
  const [scStageEle, setScStageEle] = useState<IStageElements[]>([]);

  const { connectorId } = useContext(StageContext);

  const [loading, setLoading] = useState(false);
  const [fetchStageEle, setFetchStageEle] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (smartId: string, stageId: string) => {
    setLoading(true);
    try {
      const response: IActionRepo = await smConnectorAPIs.getActionForStage(
        stageId,
        smartId,
      );
      setScStageEle(response.data.stageElements);
      setFetchStageEle(true);
    } catch (err) {
      let errMsg = t('defaultErrorMessage');
      if (isApiError(err)) {
        errMsg = err.response.message;
      }
      logErrorType(err, 3009, {
        errMsg,
        smartId,
        stageId,
      });
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const onElementAdded = () => {
    window.location.reload();
  };

  useEffect(() => {
    setLoading(true);
    fetchData(connectorId, stage.id);
  }, []);

  return (
    <SingleStageContext.Provider
      value={{ stageId: stage.id, onElementAdded: onElementAdded }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Box display={'flex'} alignItems={'center'}>
            <Tooltip title={stage.name} placement='top-start'>
              <p>{truncateString(stage.name, 30)}</p>
              {/*  fixme: textOverFlow: https://mui.com/system/display/#text-overflow */}
            </Tooltip>
            <Box width={8} />
            <EditStage
              submitHandler={editSubmitHandler}
              stageId={stage.id}
              connectorId={connectorId}
              switchChecked={switchChecked}
              existingStageName={stage.name}
            />
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: '25vh',
              background: '#E8E8E8',
              position: 'sticky',
              overflow: 'auto',
              zIndex: 0,
              justifyContent: 'center',
            }}
          >
            {/* To display the Loader */}
            {loading && <SpinLoader />}

            {/* To display the Error Message if any */}
            {error && <Alert severity='error'>{error}</Alert>}

            <RecursiveElement stageElements={scStageEle} />
            {fetchStageEle && scStageEle.length == 0 && (
              <div style={{ marginTop: '4em' }}>
                <AddAction
                  actionId=''
                  toggleToolTip={() => {
                    // fixme: what is this?
                  }}
                  handleTooltipClose={() => {
                  }}
                />
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </SingleStageContext.Provider>
  );
};

export default SingleStage;
