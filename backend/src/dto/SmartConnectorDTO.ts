/**
 * DTO stands for data transfer object which is meant by defining a
 * container that contains group of values or field
 * The Data Transfer Objects are objects which bridge the domain, business
 *  and application layer. DTOs are basically “dumb” objects holding key-value
 * pairs.
 * o keep it simpler, domain is the database, business is our logic in handler function and
 * application means our web service API.
 */
import { ISConnectors } from '../db/mongo/models/smartConnectors';

class SmartConnectorDTO {
  name: string;
  description: string | null;
  accountId: number;

  constructor(data: ISConnectors) {
    this.name = data.name;
    this.description = data.description;
    this.accountId = data.accountId;
  }
}

export default SmartConnectorDTO;
