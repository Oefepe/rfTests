import { useState } from 'react';
import apis from '../repositories/api';
import { logErrorType } from '../utils/errors/commonErrorLogging';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SpinLoader } from '../components';
import { ResponseCode } from '../config';
import { ErrorType, RFNGApiError } from '../utils';

export type LicenseType = 'terms' | 'privacy';

export const useLicense = () => {
  const [license, setLicense] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>();

  const handleLicenseLink = async (type?: LicenseType) => {
    const context = { licenseType: type };
    try {
      if (type) {
        setIsLoading(true);
        const { data } = await apis.getLicense(type);
        if (data.status !== ResponseCode.success) {
          throw new RFNGApiError(
            2017,
            data.status,
            'Can\'t load license',
            ErrorType.Warning,
            context,
          );
        }
        setLicense(data.text);
      } else {
        setLicense(undefined);
      }
    } catch (error) {
      logErrorType(error, 2017, context);
    } finally {
      setIsLoading(false);
    }
  };

  const LicenseModalWindow = () => isLoading
    ? (<SpinLoader />)
    : (
      <Dialog
        open={!!license}
        onClose={handleLicenseLink.bind(this, undefined)}
        scroll='body'
        maxWidth='lg'
        transitionDuration={0}
        PaperProps={{ sx: { borderRadius: 5, p: 2, pt: 5 } }}
      >
        <DialogTitle>
          <IconButton
            aria-label='close'
            onClick={handleLicenseLink.bind(this, undefined)}
            sx={{
              position: 'absolute',
              right: 10,
              top: 10,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography
            variant='bodyLarge'
            dangerouslySetInnerHTML={{ __html: license ?? '' }}
          />
        </DialogContent>
      </Dialog>
    );

  return { handleLicenseLink, LicenseModalWindow };
};
