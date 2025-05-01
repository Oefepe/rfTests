import { useEffect, useState } from 'react';
import { Grid, Container, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Buffer } from 'buffer';

import smConnectorAPIs from '../../repositories/smConnectorRepo';
import ISmartConnector from '../../models/ISmartConnector';
import Item from './Item';
import AddItem from './AddItem';

import useFetch from '../../hooks/useFetch';
import { useNavigate } from 'react-router';

import { CardLoader } from '../UI/loader/Index';

/* Method to get the url param value*/
const FetchParamfromUrl = (urlParamKey: string) => {
  const decodefromUrl = (str?: string) =>
    Buffer.from(str as string, 'base64').toString('utf8');

  /* using static encoded account 1 if not provided for now */
  const encodedUrl = useParams()?.id || 'YWNjb3VudElkPTEmdXNlcklkPTU=';
  if (
    localStorage.getItem('encodedUrl') == '' ||
    localStorage.getItem('encodedUrl') != encodedUrl
  ) {
    localStorage.setItem('encodedUrl', encodedUrl);
  }
  const decodedString = decodefromUrl(encodedUrl);
  /*  fetching the param value from the url decoded string */
  const urlParamValue = new URLSearchParams(decodedString).get(urlParamKey);
  return urlParamValue;
};

function List() {
  /* Getting accountId from the url encoded param */
  const accountId = Number(FetchParamfromUrl('accountId'));
  const API_URL = smConnectorAPIs.getSmConnectors(accountId);
  const navigate = useNavigate();
  const { data, error, isLoading } = useFetch(API_URL);
  const [smartConnectors, setSmartConnectors] = useState<ISmartConnector[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean[]>(
    smartConnectors.map(() => false)
  );

  const handleOpenMenu = (index: number) => {
    const updatedIsMenuOpen = [...isMenuOpen];
    updatedIsMenuOpen[index] = true;
    setIsMenuOpen(updatedIsMenuOpen);
  };

  const handleCloseMenu = (index: number) => {
    const updatedIsMenuOpen = [...isMenuOpen];
    updatedIsMenuOpen[index] = false;
    setIsMenuOpen(updatedIsMenuOpen);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  useEffect(() => {
    setSmartConnectors(data?.data.SmartConnectors || []);
  }, [data]);

  useEffect(() => {
    localStorage.removeItem('isStageEditable');
  }, []);

  const submitHandler = (smartConnector: ISmartConnector) => {
    setSmartConnectors([...smartConnectors, smartConnector]);
    navigate(`/smart-connectors/${smartConnector.id}/stages/start`);
  };

  const handleDelete = (id: string) => {
    smConnectorAPIs.deleteSmConnectors(id);
    const updatedSmartConnectors = smartConnectors.filter(
      (item) => item.id != id
    );
    setSmartConnectors(updatedSmartConnectors);
    setOpenDialog(false);
  };

  return (
    <Container>
      <Grid container direction="row" spacing={2}>
        <Grid container spacing={2}>
          <AddItem submitHandler={submitHandler} />

          {/* To display the Loader */}
          {isLoading && <CardLoader />}

          {/* To display the Error Message if any */}
          {error && <Alert severity="error">{error}</Alert>}

          {smartConnectors.length > 0 &&
            smartConnectors.map((connector: ISmartConnector, index: number) => (
              <Item
                connector={connector}
                key={connector.id}
                handleDelete={handleDelete}
                open={isMenuOpen[index]}
                handleOpenMenu={() => handleOpenMenu(index)}
                handleCloseMenu={() => handleCloseMenu(index)}
                openDialog={openDialog}
                handleClickOpen={handleClickOpen}
              />
            ))}
        </Grid>
      </Grid>
    </Container>
  );
}

export default List;
