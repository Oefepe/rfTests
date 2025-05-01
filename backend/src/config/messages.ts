export const commonErrorMessage = {
  dbConnectionError: 'DB Connection error.',
  unexpectedError: 'Unexpected error.',
  validationError: 'Validation failed.',
};

export const smartConnectorMsg = {
  noSmartConnectorFound: 'No SmartConnector Found With this Id.',
  noScOrStageFound: 'No smart connector or stage found.',
  noStageFound: 'No stage found with this Smart connector Id.',
  noStageFoundWithId: 'No stage found with this Stage Id.',
  noActionFound: 'No action found with this Stage Id.',
  noElementFound: 'There is no next action or delay found in this stage.',
  noElementFoundWithId: 'No element found with this Stage Id.',
  notAllowedToAddDelayAfterDelay:
    'You are not allowed to add delay element after delay.',
  notAllowedToAddDelayAsFirstElement:
    'You are not allowed to add delay element first element with the stage.',
  noActiveElementFound:
    'There is no active assigned action or delay found in this stage.',
  noActionWithContact: 'Invalid actionId to execute for this contact.',
  invalidDelayId: 'Invalid delay Id.',
};

export const taskMessages = {
  noTaskMessage: 'No task message found for user.',
  defaultTaskTitle: 'Send "[resourceName]" to [contactFirstName]',
};

export const customValidationMsg = (fieldName: string) => {
  return {
    'string.base': `${fieldName} should be a type of 'string'`,
    'string.empty': `${fieldName} cannot be an empty field`,
    'any.required': `${fieldName} is a required field`,
  };
};
