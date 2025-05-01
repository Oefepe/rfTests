import { model, Schema, Document } from 'mongoose';

export interface ContactLog extends Document {
  id: string;
  domain: string,
  userId: string | number,
  resourceId: string | number,
  contactId: string | number,
  logTime: Date
}

const ContactLogSchema: Schema = new Schema({
  id: { type: String },
  domain: { type: String, required: true },
  resourceId: { type: String, required: true },
  contactId: { type: String, required: true },
  userId: { type: String, required: true },
  logTime: { type: Date }
});

ContactLogSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret._id;
  },
  versionKey: false,
});

const ContactLog = model<ContactLog>(
  'contactdatalog',
  ContactLogSchema
);

export default ContactLog;
