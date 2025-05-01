import { useState } from 'react';

import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AddTooltip from '../AddTooltip';
import './Delay.scss';
import OverflowTip from '../../OverflowTip';
import { IStageElements } from '../../../../models/IScStageActions';

type PropTypes = {
  stageEle: IStageElements;
};

const getTimeUnitName = (delayTime: number, delayTimeUnit: number) => {
  switch (delayTimeUnit) {
    case 1:
      return delayTime > 1 ? 'Hours' : 'Hour';
    case 2:
      return delayTime > 1 ? 'Days' : 'Day';
    case 4:
      return delayTime > 1 ? 'Minutes' : 'Minute';
    default:
      return delayTime > 1 ? 'Weeks' : 'Week';
  }
};

const Delay = ({ stageEle }: PropTypes) => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };
  const displayTime = `${stageEle.delayTime} ${getTimeUnitName(
    stageEle.delayTime,
    stageEle.delayTimeUnit
  )}`;
  return (
    <>
      <AddTooltip
        elementId={stageEle.id}
        elementType={3}
        open={open}
        handleTooltipClose={handleTooltipClose}
      >
        <div
          className="delayItem"
          id={stageEle.id}
          onClick={() => setOpen(true)}
        >
          <AccessAlarmIcon sx={{ width: 'auto' }} />
          <OverflowTip
            content={displayTime}
            tooltip={stageEle.name}
            alwaysShowTooltip={true}
          />
        </div>
      </AddTooltip>
    </>
  );
};

export default Delay;
