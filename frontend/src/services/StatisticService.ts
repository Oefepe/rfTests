import { RFNGApiError } from '../utils/errors/ApiError';
import Repository from '../repositories/Repository';
import { ApiErrorMessages } from '../utils/errors/ApiErrorMessages';
import { logErrorType } from '../utils/errors/commonErrorLogging';

export interface IStatisticContactStageTransitionResponse {
  data: {
    stageName: string;
    totalContacts: number;
  }[];
}

export interface IStatisticListResponse {
  data: {
    stageName: string;
    totalContacts: number;
    totalActiveContact: number;
    totalInactiveContact: number;
    amt: number;
  }[];
}

export interface IStatisticTimeSpentInStageResponse {
  data: {
    stageName: string;
    timeInStage: number;
  }[];
}

export interface IStatisticTransitionListResponse {
  data: {
    stageName: string;
    totalContact: number;
    transitionedContacts: number;
    transitionedPercentage: number;
  }[];
}

export interface IStatisticTransitionActionInStageResponse {
  data: {
    stageName: string;
    transitionCount: number;
  }[];
}

export interface IStatisticContactTransitionTimeResponse {
  data: {
    stageName: string;
    timeInStage: number;
  }[];
}

export interface IStatisticsAPI {
  getContactStageTransitions(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticContactStageTransitionResponse>;
  getTransitionedContacts(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticTransitionListResponse>;
  getStatistics(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticListResponse>;
  getContactsTimeSpentInStage(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticTimeSpentInStageResponse>;
  getTransitionActionInStage(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticTransitionActionInStageResponse>;
  getContactTransitionTime(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticContactTransitionTimeResponse>;
}

class StatisticAPIImpl implements IStatisticsAPI {
  url = 'statistics/inactive-contacts';

  getStatistics(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticListResponse> {
    return Repository.get<IStatisticListResponse>(`${this.url}`, {
      params: { fromDate: fromDate, toDate: toDate },
    })
      .then((response) => {
        if (response.data !== null) {
          return response.data;
        } else {
          throw new RFNGApiError(
            9012,
            response.status,
            ApiErrorMessages.STATUS_OTHER
          );
        }
      })
      .catch((e) => {
        logErrorType(e, 1, { url: `${this.url}` });
        throw e;
      });
  }

  transitionedContactsUrl = 'statistics/transitioned-contacts';

  getTransitionedContacts(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticTransitionListResponse> {
    return Repository.get<IStatisticTransitionListResponse>(
      `${this.transitionedContactsUrl}`,
      {
        params: { fromDate: fromDate, toDate: toDate },
      }
    )
      .then((response) => {
        if (response.data !== null) {
          return response.data;
        } else {
          throw new RFNGApiError(
            9012,
            response.status,
            ApiErrorMessages.STATUS_OTHER
          );
        }
      })
      .catch((e) => {
        logErrorType(e, 1, { url: `${this.url}` });
        throw e;
      });
  }

  timeInStageUrl = 'statistics/contacts-time-in-stage';

  getContactsTimeSpentInStage(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticTimeSpentInStageResponse> {
    return Repository.get<IStatisticTimeSpentInStageResponse>(
      `${this.timeInStageUrl}`,
      {
        params: { fromDate: fromDate, toDate: toDate },
      }
    )
      .then((response) => {
        if (response.data !== null) {
          return response.data;
        } else {
          throw new RFNGApiError(
            9012,
            response.status,
            ApiErrorMessages.STATUS_OTHER
          );
        }
      })
      .catch((e) => {
        logErrorType(e, 1, { url: `${this.url}` });
        throw e;
      });
  }

  contactStageTransitionURL = 'statistics/contact-stage-transition';

  getContactStageTransitions(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticContactStageTransitionResponse> {
    return Repository.get<IStatisticContactStageTransitionResponse>(
      `${this.contactStageTransitionURL}`,
      {
        params: { fromDate: fromDate, toDate: toDate },
      }
    )
      .then((response) => {
        if (response.data !== null) {
          return response.data;
        } else {
          throw new RFNGApiError(
            9012,
            response.status,
            ApiErrorMessages.STATUS_OTHER
          );
        }
      })
      .catch((e) => {
        logErrorType(e, 1, { url: `${this.url}` });
        throw e;
      });
  }

  transitionActionUrl = 'statistics/transition-action-count';

  getTransitionActionInStage(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticTransitionActionInStageResponse> {
    return Repository.get<IStatisticTransitionActionInStageResponse>(
      `${this.transitionActionUrl}`,
      {
        params: { fromDate: fromDate, toDate: toDate },
      }
    )
      .then((response) => {
        if (response.data !== null) {
          return response.data;
        } else {
          throw new RFNGApiError(
            9012,
            response.status,
            ApiErrorMessages.STATUS_OTHER
          );
        }
      })
      .catch((e) => {
        logErrorType(e, 1, { url: `${this.url}` });
        throw e;
      });
  }

  contactTransitionTimeURL = 'statistics/contacts-transition-time';

  getContactTransitionTime(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticContactTransitionTimeResponse> {
    return Repository.get<IStatisticContactTransitionTimeResponse>(
      `${this.contactTransitionTimeURL}`,
      {
        params: { fromDate: fromDate, toDate: toDate },
      }
    )
      .then((response) => {
        if (response.data !== null) {
          return response.data;
        } else {
          throw new RFNGApiError(
            9012,
            response.status,
            ApiErrorMessages.STATUS_OTHER
          );
        }
      })
      .catch((e) => {
        logErrorType(e, 1, { url: `${this.url}` });
        throw e;
      });
  }
}

const StatisticService: IStatisticsAPI = new StatisticAPIImpl();

export default StatisticService;
