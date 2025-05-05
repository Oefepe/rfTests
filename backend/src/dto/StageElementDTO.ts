import {
  DelayTimeUnitStatus,
  IStageElementPostBody,
} from '../db/mongo/models/stageElements';

class StageElementDTO {
  name: string;
  smartConnectorId: string;
  stageId: string;
  nodeType: number;
  parentId: string;
  delayTime: number | null;
  delayTimeUnit: DelayTimeUnitStatus | null;
  resourceId: number | null;
  resourceName: string | null;
  taskMessage: string | null;

  constructor(
    smartConnectorId: string,
    stageId: string,
    data: IStageElementPostBody
  ) {
    this.smartConnectorId = smartConnectorId;
    this.stageId = stageId;
    this.name = data.name;
    if (data.nodeType.toString() === '3') {
      this.delayTime = data.delayTime;
      this.delayTimeUnit = data.delayTimeUnit;
    } else {
      this.delayTime = null;
      this.delayTimeUnit = null;
    }

    this.nodeType = data.nodeType;
    this.parentId = data.parentId;

    this.resourceId = data.resourceId;
    this.resourceName = data.resourceName;
    this.taskMessage = data.taskMessage;
  }
}

export default StageElementDTO;
