import { model, Schema } from 'mongoose';

enum SmartConnectorStatus {
  isActionDue = 1,
  isWaitingForResponse,
  isWaitingForDelay,
}

const contactSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
  },
  smartConnectorId: {
    type: String,
  },
  smartConnectorStatus: {
    type: Number,
    enum: SmartConnectorStatus, // 1-isActionDue, 2-isWaitingForResponse, 3-isWaitingForDelay
  },
  contactId: {
    type: Number,
  },
});

const Contact = model('Contact', contactSchema);
export default Contact;
