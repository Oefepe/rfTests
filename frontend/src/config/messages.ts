import { ResponseCode } from './constants';

export const commonMessage = {
  defaultErrorMessage: 'Something went wrong. Please try again',
  saveButton: 'Save',
  backButton: 'Back',
  nextButton: 'Next',
  loading: 'Loading...',
  helpLink: 'Help',
  noToken: 'No token',
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  groupCode: 'Group code',
  createAccount: 'Create Account',
  signUpNameHeader: 'Let\'s personalize your pages! Enter your contact information.',
  signUpPageHeader: 'Create Account',
  signUpSummary: 'Summary',
  additionalSignUpMethod: 'Or',
  emailOrPhone: 'Email',
  passwordRequirements: 'Password should be at least 6 characters long',
  passwordDoNotMatch: 'Passwords do not match',
  signUpPasswordHeader: 'Create password for',
  proceedToLogin: 'Proceed to Login',
  getStarted: 'Get Started Now:',
  invalidCredentials: 'Wrong login or password',
  contactSupport: 'Contact Support',
};

export const smartConnectorsMsgs = {
  stageNameValidation: 'Please enter the stage name',
  addStageLabel: 'Add Stage',
  addStageLabelInModal: 'Add New Stage',
  addStagePlaceHolder: 'Stage Name',
  editStageLabel: 'Edit Stage',
  editStageLabelInModal: 'Edit Stage',
  smartConnector: 'Smart Connector ',
  stages: 'Stages',
  noStageFound: 'No Stages Found For this smart connector',
  addAction: 'Add Action',
  addActionLabelInModal: 'Add New Action',
  editAction: 'Edit Action',
  editActionLabelInModal: 'Edit Action',
  addActionPlaceHolder: 'Action Name',
  taskMessageForUser: 'Task Message for User',
  addTaskMessage: 'Add message here...',
  taskTooltipMessage:
    'This is the message the user will see in their task description',
  actionNameValidation: 'Please enter the action name',
  addDelay: 'Add Delay',
  addDelayLabelInModal: 'Add New Delay',
  addDelayPlaceHolder: 'Delay Name',
  delayNameValidation: 'Please enter the delay name',
  addDelayTimePlaceHolder: 'Delay Time',
  delayTimeValidation: 'Please enter the valid delay time',
  addDelayTimeUnitLabel: 'Delay Time Unit',
  delayTimeUnitValidation: 'Please enter the delay time unit',
  addResponse: 'Add Response',
  addResponseLabelInModal: 'Add New response',
  addResponsePlaceHolder: 'Response Name',
  responseNameValidation: 'Please enter the response name',
};

export const errorMessages: Record<number, string> = {
  [ResponseCode.success]: 'Success',
  [ResponseCode.error]: 'Something went wrong. Please try again',
  [ResponseCode.userExist]: 'User with this email/phone already exists',
  [ResponseCode.invalidPhone]: 'Invalid phone number',
  [ResponseCode.invalidEmail]: 'Invalid email',
};

export const loginPageMessages = {
  header: 'Sign in',
  newUser: 'New user?',
  createAnAccount: 'Create an account',
  invalidEmail:
    'No user found with that email. Please try another email address or contact support',
  invalidPhone:
    'No user found with that phone number. Please try another phone number or contact support',
};

export const signUpPageMessages = {
  preHeader: 'Get Started Now:',
  header: 'Create Account',
  localSignup: 'Sign up with email or phone',
  hasAccount: 'Already created an account?',
  signIn: 'Log in',
  agree: 'I agree to the ',
  privacy: 'Privacy Policy',
  privacyURL: 'https://www.rapidfunnel.com/privacy_policy_terms/',
  terms: 'Terms and Conditions',
  termsURL: 'https://www.rapidfunnel.com/terms-conditions',
  supportURL: 'https://support.rapidfunnel.com',
};
