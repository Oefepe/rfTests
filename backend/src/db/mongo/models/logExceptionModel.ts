import { number } from 'joi';
import mongoose, { Document, model, Schema } from 'mongoose';
import CryptoJS from 'crypto-js';

export enum sourceType {
  Android = 1,
  IOS = 2,
  Web = 3,
}

export interface ILogException extends Document {
  id: string;
  userId: string | number | null;
  title: string | null;
  message: string | null;
  source: sourceType;
  createdAt: Date;
}

const ILogExceptionSchema: Schema = new Schema({
  id: { type: String },
  userId: { type: String || number || null },
  title: { type: String },
  message: { type: String },
  source: { type: Number, required: true },
  createdAt: { type: Date, required: true },
});

ILogExceptionSchema.pre('save', function (next) {
  mongoose
    .model('logExceptions', ILogExceptionSchema)
    .countDocuments((error: Error, counter: number) => {
      if (error) return next(error);
      const id = 'logException' + new Date().getTime() + (counter + 1);

      //hash the id and store it in the database
      this.id = CryptoJS.SHA256(id).toString();
      next();
    });
});

const logExceptionModel = model<ILogException>(
  'logExceptions',
  ILogExceptionSchema
);

export default logExceptionModel;
