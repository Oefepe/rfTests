import mongoose, { Document, model, Schema } from 'mongoose';
import CryptoJS from 'crypto-js';

export type IStage = {
  id: string;
  name: string;
  sequenceNumber: number;
};

export interface ISConnectors extends Document {
  id: string;
  accountId: number;
  name: string;
  description: string;
  stages: Array<IStage>;
}

const stagesSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, require: true },
  sequenceNumber: { type: Number, required: true },
});

const ISConnectorsSchema: Schema = new Schema({
  id: { type: String },
  accountId: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  stages: {
    type: [stagesSchema],
    required: false,
    _id: false,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
});
ISConnectorsSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret._id;
  },
  versionKey: false,
});
ISConnectorsSchema.pre('save', function (next) {
  mongoose
    .model('smartconnectors', ISConnectorsSchema)
    .countDocuments((error: Error, counter: number) => {
      if (error) return next(error);
      const id = 'sc' + new Date().getTime() + (counter + 1);

      //hash the id and store it in the database
      this.id = CryptoJS.SHA256(id).toString();
      next();
    });
});

const smartConnectors = model<ISConnectors>(
  'smartconnectors',
  ISConnectorsSchema
);

export default smartConnectors;
