import mongoose, { Document, model, Schema } from 'mongoose';
import CryptoJS from 'crypto-js';

export enum delayStatus {
  Incomplete = 0,
  Completed = 1,
}

export interface IScDelayLog extends Document {
  id: string;
  userId: string | number;
  contactId: string | number;
  smartConnectorId: string;
  delayEndTime: Date;
  elementId: string;
  status: delayStatus;
}

const IScDelayLogSchema: Schema = new Schema({
  id: { type: String },
  userId: { type: String, required: true },
  contactId: { type: String, required: true },
  smartConnectorId: { type: String, required: true },
  delayEndTime: { type: Date },
  elementId: { type: String, required: true },
  status: { type: Number, required: true, default: delayStatus.Incomplete },
});

IScDelayLogSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret._id;
  },
  versionKey: false,
});

IScDelayLogSchema.pre('save', function (next) {
  mongoose
    .model('smDelayLog', IScDelayLogSchema)
    .countDocuments((error: Error, counter: number) => {
      if (error) return next(error);

      // Generating unique ID - SCDL stands for Smart Connector Delay Log
      const id = 'SCDL' + new Date().getTime() + (counter + 1);

      // Hash the id and store it in the database
      this.id = CryptoJS.SHA256(id).toString();
      next();
    });
});

const smDelayLog = model<IScDelayLog>('smDelayLog', IScDelayLogSchema);

export default smDelayLog;
