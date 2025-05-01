export interface IScStageActions {
  id: string;
  smartConnectorid: string;
  stageId: string;
  name: string;
  nodeType: number;
  parentId: string;
}

export interface IStageElements {
  id: string;
  name: string;
  nodeType: number;
  delayTime: number;
  delayTimeUnit: number;
  parentId: string | null;
  smartConnectorId: string;
  stageId: string;
  children: IStageElements[];
}

export interface ActionDetails {
  id: string;
  name: string;
  resourceId: number;
  resourceName: string;
  taskMessage: string;
}
