/**
 * DTO stands for data transfer object which is meant by defining a
 * container that contains group of values or field
 * The Data Transfer Objects are objects which bridge the domain, business
 *  and application layer. DTOs are basically “dumb” objects holding key-value
 * pairs.
 * o keep it simpler, domain is the database, business is our logic in handler function and
 * application means our web service API.
 */
import { elementStatus, IScContactLog } from '../db/mongo/models/scContactLog';
import { nodeTypes } from '../db/mongo/models/stageElements';
import { getCurrentUtcTime } from '../utils/DateHelper';

class ScContactLogDTO {
  contactId: string | number;
  userId: string | number;
  smartConnectorId: string;
  stageId: string | '';
  elementId: string | '';
  elementType: number;
  assignTime: Date;
  delayEndTime: Date | '';
  status: number;

  constructor(data: IScContactLog) {
    this.contactId = data.contactId;
    this.userId = data.userId;
    this.smartConnectorId = data.smartConnectorId;
    this.stageId = data.stageId;
    this.elementId = data.elementId;
    this.elementType = data.elementType || nodeTypes.Action; //For Action Type
    this.assignTime = getCurrentUtcTime();
    this.delayEndTime = data.delayEndTime;
    this.status = data.status || elementStatus.Assigned; //Initial assign
  }
}

export default ScContactLogDTO;
