const QR_CODE_API_URL = 'https://api.qrserver.com/v1/create-qr-code/';

export const createQRCode = ({
  url,
  size,
  color,
  bgColor,
}: {
  url: string;
  size?: string;
  color?: string;
  bgColor?: string;
}) => {
  return `${QR_CODE_API_URL}?size=${size}&color=${color}&bgcolor=${bgColor}&data=${encodeURIComponent(
    url
  )}`;
};
