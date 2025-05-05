import StatisticService, {
  IStatisticListResponse,
  IStatisticTransitionListResponse,
  IStatisticTimeSpentInStageResponse,
  IStatisticContactStageTransitionResponse,
  IStatisticTransitionActionInStageResponse,
  IStatisticContactTransitionTimeResponse,
} from '../services/StatisticService';

interface IStatisticRepository {
  getContactStageTransitions(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticContactStageTransitionResponse>;
  getTransitionedContacts(
    startDate: string,
    endDate: string
  ): Promise<IStatisticTransitionListResponse>;
  getStatistics(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticListResponse>;
  getTimeInStage(
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

class StatisticRepositoryImpl implements IStatisticRepository {
  statisticService: typeof StatisticService;

  constructor(statisticService: typeof StatisticService) {
    this.statisticService = statisticService;
  }

  getStatistics(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticListResponse> {
    return this.statisticService.getStatistics(fromDate, toDate);
  }

  getTransitionedContacts(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticTransitionListResponse> {
    return this.statisticService.getTransitionedContacts(fromDate, toDate);
  }

  getTimeInStage(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticTimeSpentInStageResponse> {
    return this.statisticService.getContactsTimeSpentInStage(fromDate, toDate);
  }

  getContactStageTransitions(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticContactStageTransitionResponse> {
    return this.statisticService.getContactStageTransitions(fromDate, toDate);
  }

  getTransitionActionInStage(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticTransitionActionInStageResponse> {
    return this.statisticService.getTransitionActionInStage(fromDate, toDate);
  }

  getContactTransitionTime(
    fromDate: string,
    toDate: string
  ): Promise<IStatisticContactTransitionTimeResponse> {
    return this.statisticService.getContactTransitionTime(fromDate, toDate);
  }
}

const StatisticRepository: IStatisticRepository = new StatisticRepositoryImpl(
  StatisticService
);

export default StatisticRepository;
