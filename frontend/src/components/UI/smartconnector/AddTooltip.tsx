import { ReactElement, useState } from 'react';

import { Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import AddAction from '../../smartconnector/stages/AddAction';
import AddDelay from '../../smartconnector/stages/AddDelay';
import AddResponse from '../../smartconnector/stages/AddResponse';
import { NodeTypes } from '../../../models/IScStages';

const style = {
  width: '100%',
  bgcolor: 'background.paper',
  color: 'common.black',
  textAlign: 'center',
};

type PropTypes = {
  children: ReactElement;
  elementId: string;
  elementType: number;
  open: boolean | false;
  handleTooltipClose: () => void;
};

const AddTooltip = ({
  children,
  elementId,
  elementType,
  open,
  handleTooltipClose,
}: PropTypes): ReactElement => {
  const [showToolTip, setShowToolTip] = useState(true);

  const toggleToolTip = (flag: boolean) => {
    if (!flag) {
      document
        ?.querySelector('#openTooltip')
        ?.classList.add('add-tooltip-close');
    }
    setShowToolTip(flag);
  };

  const clickAwayEvent = () => {
    if (showToolTip) {
      handleTooltipClose();
      setShowToolTip(true);
    }
  };

  const toolTipContent = () => {
    return (
      <>
        <ClickAwayListener onClickAway={() => clickAwayEvent()}>
          <List
            sx={style}
            component="nav"
            aria-label="Action, Response, and Delay Button"
            className={showToolTip ? 'show' : 'hidden'}
          >
            <ListItem divider>
              <Typography component={'span'} color="common.black">
                <AddAction
                  actionId={elementId}
                  toggleToolTip={toggleToolTip}
                  handleTooltipClose={handleTooltipClose}
                />
              </Typography>
            </ListItem>
            <Divider />
            {[NodeTypes.Action, NodeTypes.Response].includes(elementType) && (
              <>
                <ListItem divider>
                  <Typography component={'span'} color="common.black">
                    <AddDelay
                      delayId={elementId}
                      toggleToolTip={toggleToolTip}
                      handleTooltipClose={handleTooltipClose}
                    />
                  </Typography>
                </ListItem>
                <Divider />
              </>
            )}
            {/* Commented this code as don't need responses for Smart Connector MVP
            {elementType != 2 && (
              <>
                <ListItem divider>
                  <Typography component={'span'} color="common.black">
                    <AddResponse
                      responseId={elementId}
                      toggleToolTip={toggleToolTip}
                      handleTooltipClose={handleTooltipClose}
                    />
                  </Typography>
                </ListItem>
                <Divider />
              </>
            )}
            */}
          </List>
        </ClickAwayListener>
      </>
    );
  };

  return (
    <Tooltip
      PopperProps={{
        disablePortal: true,
      }}
      title={toolTipContent()}
      placement="right"
      arrow
      onClose={handleTooltipClose}
      id="openTooltip"
      open={open}
      disableFocusListener
      disableHoverListener
      disableTouchListener
    >
      {children}
    </Tooltip>
  );
};

export default AddTooltip;
