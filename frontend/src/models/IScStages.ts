export interface IScStages {
  id: string;
  accountId: number;
  name: string;
  description: string;
  isPublished: boolean;
  stages: IStage[];
}

export interface IStage {
  id: string;
  name: string;
  sequenceNumber: number;
}

export enum NodeTypes {
  Action = 1,
  Response = 2,
  Delay = 3,
}

//export default IScStages;
