/**
 * DTO stands for data transfer object which is meant by defining a
 * container that contains group of values or field
 * The Data Transfer Objects are objects which bridge the domain, business
 *  and application layer. DTOs are basically “dumb” objects holding key-value
 * pairs.
 * o keep it simpler, domain is the database, business is our logic in handler function and
 * application means our web service API.
 */
import { ContactLog } from '../db/mongo/models/ContactLog';
import { getCurrentUtcTime } from "../utils/DateHelper";

class ContactLogDTO {
    contactId: string | number;
    userId: string | number;
    domain: string;
    resourceId: string | number;
    logTime: Date;

    constructor(data: ContactLog) {
        this.contactId = data.contactId;
        this.userId = data.userId;
        this.domain = data.domain;
        this.resourceId = data.resourceId;
        this.logTime = getCurrentUtcTime();
    }
}

export default ContactLogDTO;
