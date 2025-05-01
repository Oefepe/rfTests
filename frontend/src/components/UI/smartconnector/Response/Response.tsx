import { useState } from 'react';

import AddTooltip from '../AddTooltip';
import './Response.scss';
import OverflowTip from '../../OverflowTip';

type PropTypes = {
  name: string;
  responseId: string;
};

const Response = ({ name, responseId }: PropTypes) => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };
  return (
    <>
      <AddTooltip
        elementId={responseId}
        elementType={2}
        open={open}
        handleTooltipClose={handleTooltipClose}
      >
        <div
          id={responseId}
          className="responseItem"
          onClick={() => setOpen(true)}
        >
          <OverflowTip content={name} />
        </div>
      </AddTooltip>
    </>
  );
};

export default Response;
