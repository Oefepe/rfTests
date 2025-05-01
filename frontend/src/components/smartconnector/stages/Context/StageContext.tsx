import { createContext } from 'react';

type ContextType = {
  connectorId: string;
  editMode: boolean;
};

const StageContext = createContext<ContextType>({
  connectorId: '',
  editMode: false,
});

export default StageContext;
