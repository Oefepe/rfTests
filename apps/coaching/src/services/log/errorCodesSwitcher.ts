export const errorCodesSwitcher = (error: Error) => {
  switch (error.constructor) {
    case SyntaxError:
      return 10001;
    default:
      return 10000;
  }
};
