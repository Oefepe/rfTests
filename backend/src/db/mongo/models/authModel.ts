import { model, Schema } from 'mongoose';

const authSchema = new Schema({
  userId: String, // not required for better social media support
  userName: {
    type: String,
    required: true,
  },
  salt: String,
  password: String,
  provider: {
    type: String,
    required: true,
  },
  pwdResetDate: Date,
  pwdResetCode: String,
  revision: {
    type: Number,
    default: 0,
  },
});

authSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

authSchema.set('toJSON', {
  virtuals: true,
});

const Auth = model('AuthId', authSchema);

export { Auth };
