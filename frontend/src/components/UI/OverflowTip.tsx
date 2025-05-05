import { useRef, useState, useEffect } from 'react';
import { Tooltip } from '@mui/material';
type PropTypes = {
  content: string;
  tooltip?: string;
  alwaysShowTooltip?: boolean;
};

const OverflowTip: React.FC<PropTypes> = ({
  content,
  tooltip,
  alwaysShowTooltip,
}: PropTypes) => {
  const [isOverflowed, setIsOverflow] = useState(false);
  const textElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textElementRef.current) {
      setIsOverflow(
        textElementRef.current.scrollWidth > textElementRef.current.clientWidth
      );
    }
  }, []);
  return (
    <Tooltip
      title={tooltip ? tooltip : content}
      disableHoverListener={!alwaysShowTooltip && !isOverflowed}
    >
      <div
        ref={textElementRef}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {content}
      </div>
    </Tooltip>
  );
};

export default OverflowTip;
