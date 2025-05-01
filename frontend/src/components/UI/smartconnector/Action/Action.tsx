import { useState } from 'react';
import { Grid, Box } from '@mui/material';
import AddTooltip from '../AddTooltip';
import EditAction from '../../../smartconnector/stages/EditAction';
import './Action.scss';
import OverflowTip from '../../OverflowTip';

type PropTypes = {
  name: string;
  actionId: string;
};

const Action = ({ name, actionId }: PropTypes) => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <AddTooltip
            elementId={actionId}
            elementType={1}
            open={open}
            handleTooltipClose={handleTooltipClose}
          >
            <div
              id={actionId}
              className="actionItem"
              onClick={() => setOpen(true)}
              style={{
                width: '150px',
                maxWidth: '200px',
              }}
            >
              <OverflowTip content={name} />
              <EditAction
                actionId={actionId}
                handleTooltipClose={handleTooltipClose}
                toggleToolTip={setOpen}
              />
            </div>
          </AddTooltip>
        </Grid>
      </Grid>
    </>
  );
};

export default Action;
