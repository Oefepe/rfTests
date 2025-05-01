export const emailFontSize = ({
  fontSize,
  sizeMeasure = 'rem',
  email,
  lengthLimit,
}: {
  fontSize: number;
  sizeMeasure?: string;
  email: string;
  lengthLimit: number;
}) => {
  const emailLength = email.length;

  if (emailLength <= lengthLimit) {
    return `${fontSize}${sizeMeasure}`;
  }

  const lengthDiff = emailLength - lengthLimit;
  const symbolLength = (1 / emailLength) + 0.01;
  return `${fontSize - lengthDiff * symbolLength}${sizeMeasure}`;
};
