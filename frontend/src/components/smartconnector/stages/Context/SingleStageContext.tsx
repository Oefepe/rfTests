import { createContext } from 'react';

type ContextType = {
  stageId: string;
  onElementAdded: () => void;
};

const SingleStageContext = createContext<ContextType>({
  stageId: '',
  onElementAdded: () => {},
});

export default SingleStageContext;
