import { model, Schema } from 'mongoose';

const onboardingSchema = new Schema(
  {
    skipWelcomeVideo: Boolean,
    addProfilePicture: Boolean,
    addPhoneNumber: Boolean,
    addCalendar: Boolean,
    addSocialMedia: Boolean,
    setLinkPersonalization: Boolean,
    skipTrainingPartner: Boolean,
  },
  { _id: false }
);

const userAccountSchema = new Schema(
  {
    userId: { required: true, type: Number },
    accountId: { required: true, type: Number },
    token: { required: true, type: String },
    accountName: String,
    salt: String,
    password: String,
    userStatus: String,
    userRole: String,
    userAccessLevel: String,
    subscriptionStartedAt: Date,
    onboarding: onboardingSchema,
  },
  { _id: false }
);

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  displayName: {
    type: String,
    required: true,
  },
  email: String,
  phone: String,
  phoneCountryCode: String,
  photo: String,
  clientCode: String,
  groupCode: String,
  proUser: Boolean,
  accounts: [userAccountSchema],
  createdAt: Date,
  modifiedAt: Date,
  lastLogin: Date,
  calendarLink: String,
  virtualMeetingLink: String,
  facebookUrl: String,
  instagramUrl: String,
  linkedinUrl: String,
  telegramUrl: String,
  tikTokUrl: String,
  whatsAppUrl: String,
  twitterUrl: String,
});

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
});

const User = model('User', userSchema);

export { User };
