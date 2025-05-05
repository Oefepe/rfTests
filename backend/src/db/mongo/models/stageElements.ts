import mongoose, { Document, model, Schema } from 'mongoose';
import CryptoJS from 'crypto-js';

export enum DelayTimeUnitStatus {
  Hours = 1,
  Days = 2,
  Weeks = 3,
  Minutes = 4,
}

export enum nodeTypes {
  Action = 1,
  Response = 2,
  Delay = 3,
}

export enum apiUrls {
  tasksUrl = 'v3/tasks/follow-up',
}

export type IStageElementPostBody = {
  name: string;
  nodeType: number;
  parentId: string;
  delayTime: number | null;
  delayTimeUnit: DelayTimeUnitStatus | null;
  resourceId: number | null;
  resourceName: string | null;
  taskMessage: string | null;
};

export interface IStageElement extends Document {
  id: string;
  smartConnectorId: string;
  stageId: string;
  name: string;
  nodeType: number;
  parentId: string;
  delayTime: number | null;
  delayTimeUnit: DelayTimeUnitStatus | null;
  resourceId: number | null;
  resourceName: string | null;
  taskMessage: string | null;
}

const IStageElementSchema: Schema = new Schema({
  id: { type: String },
  smartConnectorId: { type: String, required: true },
  stageId: { type: String, required: true },
  name: { type: String, require: true },
  nodeType: { type: Number, require: true },
  delayTime: {
    type: Number,
  },
  delayTimeUnit: {
    type: Number,
    enum: DelayTimeUnitStatus,
  },
  parentId: { type: String },
  resourceId: {
    type: Number,
    require: false,
    default: null,
  },
  resourceName: {
    type: String,
    require: false,
    default: null,
  },
  taskMessage: {
    type: String,
    require: false,
    default: null,
  },
});

IStageElementSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret._id;
  },
  versionKey: false,
});

IStageElementSchema.pre('save', function (next) {
  mongoose
    .model('stageelements', IStageElementSchema)
    .countDocuments((error: Error, counter: number) => {
      if (error) return next(error);
      const id = 'scSE' + new Date().getTime() + (counter + 1);

      //hash the id and store it in the database
      this.id = CryptoJS.SHA256(id).toString();
      next();
    });
});

const stageElements = model<IStageElement>(
  'stageelements',
  IStageElementSchema
);

export default stageElements;
