import { ReportHandler } from 'web-vitals';
import { logErrorType } from './utils/errors/commonErrorLogging';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      })
      .catch((e) => {
        logErrorType(1, e, { place: 'reportWebVitals' });
      });
  }
};

export default reportWebVitals;
