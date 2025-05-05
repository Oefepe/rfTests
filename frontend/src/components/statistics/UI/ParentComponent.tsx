import { useState } from 'react';
import BarGraphNivo from './BarGraphNivo';
import ContactStageTransitionFunnelGraph from './ContactStageTransitionFunnel';
import TimeframeSelector from './TimeframeSelector';
import TimeInStageGraph from './TimeInStageGraph';
import TotalContactsCard from './TotalContactsCard';
import TransitionActionLineGraph from './TransitionedActionLineGraph';
import TransitionedBarGraph from './TransitionedBarGraph';
import TransitionTimeInStageGraph from './TransitionTimeInStageGraph';

const ParentComponent = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('last24Hours');

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  return (
    <div>
      <TimeframeSelector
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={handleTimeframeChange}
      />
      <TotalContactsCard selectedTimeframe={selectedTimeframe} />
      <BarGraphNivo selectedTimeframe={selectedTimeframe} />
      <TransitionedBarGraph selectedTimeframe={selectedTimeframe} />
      <ContactStageTransitionFunnelGraph
        selectedTimeframe={selectedTimeframe}
      />
      <TimeInStageGraph selectedTimeframe={selectedTimeframe} />
      <TransitionActionLineGraph selectedTimeframe={selectedTimeframe} />
      <TransitionTimeInStageGraph selectedTimeframe={selectedTimeframe} />
    </div>
  );
};

export default ParentComponent;
