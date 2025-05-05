import Repository from './Repository';
import ISmartConnector from '../models/ISmartConnector';
import { IScStages } from '../models/IScStages';
import {
  IScStageActions,
  IStageElements,
  ActionDetails,
} from '../models/IScStageActions';
import { IBaseResponse } from '../models/IBaseResponse';

type ISmartRepo = {
  data: {
    SmartConnectors: ISmartConnector[];
  };
};

export type IStageRepo = {
  data: {
    SmartConnectors: IScStages;
  };
};

export type IActionRepo = {
  data: {
    stageElements: IStageElements[];
  };
};

export type IActionDetails = {
  data: {
    stageElements: ActionDetails;
  };
};

type IStageCreate = {
  data: IScStages;
};

type IActionCreate = {
  data: IScStageActions & IBaseResponse;
};

type ISmartCreate = {
  data: ISmartConnector;
};

const apiUrl = 'api/api/smart-connectors'; // fixme: common way to handle api/api

const smConnectorAPIs = {
  getSmConnectors(accountId: number): Promise<ISmartRepo> {
    return Repository.get(`${apiUrl}/${accountId}/all`);
  },
  createSmConnectors(payload: object): Promise<ISmartCreate> {
    return Repository.post(`${apiUrl}`, payload);
  },
  publishSmConnectors(
    connectorId: string,
    payload: object
  ): Promise<ISmartCreate> {
    return Repository.patch(`${apiUrl}/${connectorId}`, payload);
  },
  deleteSmConnectors(connectorId: string): Promise<ISmartCreate> {
    return Repository.delete(`${apiUrl}/${connectorId}`);
  },
  getSmConnectorsStages(connectorId: string): Promise<IStageRepo> {
    return Repository.get(`${apiUrl}/${connectorId}/stages`);
  },
  addStageToConnector(
    connectorId: string,
    payload: object
  ): Promise<IStageCreate> {
    return Repository.post(`${apiUrl}/${connectorId}/stages`, payload);
  },
  updateStageToConnector(
    connectorId: string,
    stageId: string,
    payload: object
  ): Promise<IStageCreate> {
    return Repository.patch(
      `${apiUrl}/${connectorId}/stages/${stageId}`,
      payload
    );
  },
  addActionToConnector(
    stageId: string,
    smartConnectorId: string,
    payload: object
  ): Promise<IActionCreate> {
    return Repository.post(
      `${apiUrl}/${smartConnectorId}/stages/${stageId}/actions`,
      payload
    );
  },
  updateActionToConnector(
    stageId: string,
    smartConnectorId: string,
    payload: object
  ): Promise<IActionCreate> {
    return Repository.post(
      `${apiUrl}/${smartConnectorId}/stages/${stageId}/actions`,
      payload
    );
  },
  getSingleActionDetails(actionId: string): Promise<IActionDetails> {
    return Repository.get(`${apiUrl}/${actionId}/action`);
  },
  getActionForStage(
    stageId: string,
    smartConnectorId: string
  ): Promise<IActionRepo> {
    return Repository.get(
      `${apiUrl}/${smartConnectorId}/stages/${stageId}/actions`
    );
  },
};

export default smConnectorAPIs;
