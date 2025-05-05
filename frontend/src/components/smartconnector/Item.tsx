import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Link,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import ISmartConnector from '../../models/ISmartConnector';
import truncateString from '../../utility/stringHelper';
import ConfirmDialog from '../UI/ConfirmDialog';
import { useTranslation } from 'react-i18next';

type PropType = {
  connector: ISmartConnector;
  handleDelete: (id: string) => void;
  open: boolean;
  handleOpenMenu: () => void;
  handleCloseMenu: () => void;
  openDialog: boolean;
  handleClickOpen: () => void;
};

function Item({
  connector,
  handleDelete,
  handleClickOpen,
  openDialog,
}: PropType) {
  const { t } = useTranslation();
  const renderUrl = `/smart-connectors/${connector.id}/stages`;
  const isPublished = connector.isPublished;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Card style={{ height: '100%' }}>
          <CardHeader
            action={
              <div>
                <Button
                  id='demo-positioned-button'
                  aria-controls={anchorEl ? 'demo-positioned-menu' : undefined}
                  aria-haspopup='true'
                  aria-expanded={anchorEl ? 'true' : undefined}
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </Button>
                <Menu
                  id='demo-positioned-menu'
                  aria-labelledby='demo-positioned-button'
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <MenuItem>
                    <ConfirmDialog
                      id={connector.id}
                      open={openDialog}
                      handleClickOpen={handleClickOpen}
                      handleDelete={handleDelete}
                      handleClose={handleClose}
                    />
                  </MenuItem>
                </Menu>
              </div>
            }
            title={
              <>
                <Link variant='bodySmall' underline='hover' href={renderUrl}>
                  {truncateString(connector.name, 30)}
                </Link>
                {isPublished ? (
                  <Link variant='bodySmall' underline='hover'>
                    <Tooltip title={t('published')}>
                      <PublishedWithChangesIcon />
                    </Tooltip>
                  </Link>
                ) : (
                  <Tooltip title={t('unpublish')}>
                    <UnpublishedIcon />
                  </Tooltip>
                )}
              </>
            }
          />
          <CardContent>
            <Typography variant='bodySmall' color='text.secondary'>
              {truncateString(connector.description, 500)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

export default Item;
