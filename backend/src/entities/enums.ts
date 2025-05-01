export enum Providers {
  google = 'google',
  facebook = 'facebook',
  apple = 'apple',
  email = 'email',
  phone = 'phone',
  netready = 'netready',
  avbob = 'avbob',
}

export enum AuthCheck {
  exist = 'exist', // on login -> login, on signup -> has to be logged in
  vacant = 'vacant', // user doesn't exist, has to sign up
  created = 'created', // created and logged in
  invalid = 'invalid', // wrong name or password
  restricted = 'restricted', // name and password correct, but access denied
  error = 'error',
}

export enum ResponseCode {
  success = 0,
  error = 1,
  unexpectedValue = 10,
  absentValue = 11,
  validationError = 12,
  userExist = 1000,
  invalidEmail = 1001,
  invalidPhone = 1002,
  invalidCredentials = 1003,
  vacantUser = 1004,
  unfinishedSignup = 1005,
  authIdNotFound = 1059,
  userIdNotFound = 1066,
  authIdCreationError = 1073,
  meetnRoomExist = 2020, // if room with this name already exists
  meetnEmailExist = 2021, // if user already have meetn room
  restricted = 3018,
  invalidGroupCode = 9003,
  badRequest = 9004,
  notFound = 9005,
}

export enum Env {
  local = 'local',
  staging = 'staging',
  production = 'production',
}
