import { useState, useEffect } from 'react';
import Loader from '../UI/loader/Loader';
import apis from '../../repositories/api';
import { defaultPalette } from '../../styles/defaultPalette';
import { logErrorType } from '../../utils/errors/commonErrorLogging';

type QRCodeProps = {
  url: string;
  size?: string;
  color?: string;
  bgColor?: string;
};

export const QRCode = ({
  url,
  size,
  color = defaultPalette.text?.neutral700?.slice(1),
  bgColor = defaultPalette.text?.neutral100?.slice(1),
}: QRCodeProps) => {
  const [imgSrc, setImgSrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchQRCodeUrl = async () => {
      try {
        setIsLoading(true);

        const response = await apis.getQRCode({
          url,
          size,
          color,
          bgColor,
        });

        setImgSrc(response.data.qrCodeUrl);
      } catch (error) {
        logErrorType(error, 9022, { url });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQRCodeUrl();
  }, []);

  return isLoading ? <Loader /> : <img src={imgSrc} alt="QRCode" />;
};
