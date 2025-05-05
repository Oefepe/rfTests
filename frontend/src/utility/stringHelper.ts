//Function to truncate string with ellipsis
const truncateString = (inputString: string, inputLength: number) =>
  inputString.length > inputLength
    ? `${inputString.substring(0, inputLength)}...`
    : inputString;

export default truncateString;
