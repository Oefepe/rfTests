import mongoose, { Document, model, Schema } from 'mongoose';
import CryptoJS from 'crypto-js';

export enum elementStatus {
  Assigned = 1,
  Executed = 2,
}

export interface IScContactLog extends Document {
  id: string;
  contactId: string | number;
  userId: string | number;
  smartConnectorId: string;
  stageId: string;
  elementId: string;
  elementType: number;
  assignTime: Date;
  delayEndTime: Date;
  status: elementStatus;
}

const IScContactLogSchema: Schema = new Schema({
  id: { type: String },
  contactId: { type: String, required: true },
  userId: { type: String, required: true },
  smartConnectorId: { type: String, required: true },
  stageId: { type: String, required: true },
  elementId: { type: String, required: true },
  elementType: { type: Number, required: true },
  assignTime: { type: Date, required: true },
  delayEndTime: { type: Date },
  status: { type: Number, required: true },
});

IScContactLogSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret._id;
  },
  versionKey: false,
});

IScContactLogSchema.pre('save', function (next) {
  mongoose
    .model('smConnectContactLog', IScContactLogSchema)
    .countDocuments((error: Error, counter: number) => {
      if (error) return next(error);
      const id = 'scSE' + new Date().getTime() + (counter + 1);

      //hash the id and store it in the database
      this.id = CryptoJS.SHA256(id).toString();
      next();
    });
});

const smConnectContactLog = model<IScContactLog>(
  'smConnectContactLog',
  IScContactLogSchema
);

export default smConnectContactLog;
