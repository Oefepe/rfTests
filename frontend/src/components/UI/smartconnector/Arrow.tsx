import Xarrow, { Xwrapper } from 'react-xarrows';

type PropTypes = {
  startNode: string;
  endNode: string;
};

const Arrow = ({ startNode, endNode }: PropTypes) => {
  return (
    <Xwrapper>
      <Xarrow
        start={startNode}
        end={endNode}
        color="gray"
        strokeWidth={2}
        animateDrawing={0.2}
        startAnchor={'auto'}
        endAnchor={'left'}
      />
    </Xwrapper>
  );
};

export default Arrow;
