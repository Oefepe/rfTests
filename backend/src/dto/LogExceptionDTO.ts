import {
  ILogException,
  sourceType,
} from '../db/mongo/models/logExceptionModel';
import { getCurrentUtcTime } from '../utils/DateHelper';

class LogExceptionDTO {
  userId: string | number | null;
  title: string | '';
  message: string | '';
  source: sourceType;
  createdAt: Date;

  constructor(data: ILogException) {
    this.userId = data.userId;
    this.title = data.title || '';
    this.message = data.message || '';
    this.source = data.source || sourceType.Web;
    this.createdAt = data.createdAt || getCurrentUtcTime();
  }
}

export default LogExceptionDTO;
