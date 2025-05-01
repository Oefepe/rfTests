import { smartConnectorStatus as smartConnectorStatusConfig } from '../../config/config';
import './SmartConnectorIcon.css';

type AppProps = {
  smartConnectorId: null | string;
  smartConnectorStatus: null | number;
};

const SmartConnectorIcon = (props: AppProps) => {
  // When Contact not connected to any Smartconnector
  let activeInActiveClass = 'in-active';

  // Check only when a Contact is connected to the Smartconnector
  if (!!props.smartConnectorId && props.smartConnectorId.trim().length > 0) {
    // Assign the css classes based on the smartConnectorStatus
    switch (props.smartConnectorStatus) {
      case smartConnectorStatusConfig.isActionDue:
        activeInActiveClass = 'action-due';
        break;
      case smartConnectorStatusConfig.isWaitingForResponse:
        activeInActiveClass = 'waiting-for-response';
        break;
      case smartConnectorStatusConfig.isWaitingForDelay:
        activeInActiveClass = 'waiting-for-delay';
        break;
      default:
        activeInActiveClass = 'no-action-due';
        break;
    }
  }
  return (
    <>
      <i
        className={`fa-kit fa-smartconnector ${activeInActiveClass}`}
        style={{ fontSize: '1.2rem' }}
      ></i>
    </>
  );
};

export default SmartConnectorIcon;
