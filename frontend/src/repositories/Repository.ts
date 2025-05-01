import axios, { AxiosError } from 'axios';
import { ResponseCode, TOKEN } from '../config';
import { config as appConfig } from '../config/config';
import { logError, logWarning } from '../services';

const axiosInstance = axios.create({
  baseURL: appConfig.server_url,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const configuration = config;

    const token = localStorage.getItem(TOKEN);
    if (token) {
      configuration.headers.Authorization = `Bearer ${token}`;
    }

    return configuration;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const defaultContext = {
      responseUrl: error.request.responseURL,
      headers: error.request.headers,
    };

    switch (error.code) {
      case AxiosError.ERR_NETWORK:
        logWarning({
          errorCode: 4019,
          message: 'Server is not reachable',
          context: defaultContext,
        });
        return Promise.resolve({ data: { status: ResponseCode.networkError } });
      case AxiosError.ERR_BAD_RESPONSE: // 500, 400
      case AxiosError.ERR_BAD_REQUEST: // 404, 412
        logError({
          errorCode: 4029,
          message: 'Wrong response from the backend',
          context: { ...defaultContext, responseData: error?.response?.data },
          stacktrace: error.stack,
        });
        // assume that app uses correct urls and sends correct data,
        // therefore, handles errors with http statuses 400, 404, 412 and 500
        // as a temporary network issues, until backend doesn't response correctly
        return Promise.resolve({ data: { status: ResponseCode.networkError } });
      default:
        logError({
          errorCode: 4030,
          message: 'Axios unhandled error',
          context: {
            ...defaultContext,
            requestData: error.request.data,
            responseData: error?.response?.data,
          },
          stacktrace: error.stack,
        });
        return Promise.reject(error);
    }
  },
);

export default axiosInstance;
