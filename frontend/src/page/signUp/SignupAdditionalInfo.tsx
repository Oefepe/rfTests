import { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { frontendRoutes } from '../../config';
import { SignupState } from './types';
import { AlertIcons } from '../../assets/icons';
import { isEmail, trimObjectValues } from '../../utils';
import { InputField, SpinLoader, Button } from '../../components';
import { useBranding } from '../../hooks';

export const SignupAdditionalInfo = () => {
  const { t } = useTranslation();
  const location = useLocation();
  // Typing the state as SignupState
  const state = location.state as SignupState;
  const [missedDetails, setMissedDetails] = useState<Record<string, string>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [commonError, setCommonError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const { brandingLoaded } = useBranding();

  useEffect(() => {
    if (!state) {
      navigate(frontendRoutes.signup, { replace: true });
    }
  }, [state]);

  const array = useMemo(() => {
    const additionalFields = theme.extra.additionalFields;
    if (!additionalFields) {
      return [];
    }
    return Object.keys(additionalFields)
      .filter((key) => additionalFields[key].showDuringSignup === 1)
      .map((field) => ({
        name: field,
        ...additionalFields[field],
      }));
  }, [theme.extra.additionalFields]);

  if (array.length === 0 && brandingLoaded) {
    return (
      <Navigate
        to={frontendRoutes.signupSummary}
        state={{ ...state, additionalData: {}, additionalDataProvided: true }}
        replace
      />
    );
  }

  const handleMissedDetails = (fieldName: string, value: string) => {
      setMissedDetails({ ...missedDetails, [fieldName]: value });
      setErrors({ ...errors, [fieldName]: '' });
    };

  const onNext = async () => {
    let hasErrors = false;
    const errors: Record<string, string> = {};
    array.forEach((field) => {
      if (field.isRequired === 1 && !missedDetails[field.name]) {
        errors[field.name] = t('common.notice.required');
        hasErrors = true;
      }
    });
    if (
      missedDetails['additionalEmailNotification'] &&
      !(await isEmail(missedDetails['additionalEmailNotification']))
    ) {
      errors['additionalEmailNotification'] = t(
        'common.notice.invalid_email_msg'
      );
      hasErrors = true;
    }
    if (hasErrors) {
      setErrors(errors);
      return;
    }
    try {
      const newState: SignupState = {
        ...state,
        additionalData: missedDetails,
        additionalDataProvided: true,
      };
      navigate(frontendRoutes.signupSummary, {
        state: trimObjectValues(newState),
      });
    } catch (error) {
      setCommonError(t('common.notice.default_error_msg'));
    }
  };

  if (!brandingLoaded) {
    return <SpinLoader />;
  }

  return (
    <>
      <Typography
        component="h2"
        variant="h2regular"
        color={'primary.main'}
        textAlign="center"
      >
        {t('login_signup.additional_fields.header')}
      </Typography>
      <Typography
        variant="bodyLarge"
        textAlign="center"
        color={'primary.secondary'}
        mb={-1}
      >
        {t('login_signup.additional_fields.sub_header_msg')}
      </Typography>
      <Stack width='100%' spacing={3}>
        {array.map((field) => (
          <InputField
            key={field.name}
            id={field.name}
            label={field.reBrandName}
            type="text"
            required={field.isRequired === 1}
            value={missedDetails[field.name] || ''}
            onChange={handleMissedDetails.bind(this, field.name)}
            InputProps={{
              endAdornment: field.reBrandToolTip ? (
                <InputAdornment position="end">
                  <Tooltip title={field.reBrandToolTip}>
                    <IconButton>
                      <AlertIcons.InfoSvg />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ) : null,
            }}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
          />
        ))}
        {commonError && (
          <Typography
            component="h3"
            variant="h3regular"
            sx={{ color: 'error' }}
          >
            {commonError}
          </Typography>
        )}
      </Stack>
      <Button text={t('common.button.continue')} onClick={onNext} />
    </>
  );
};
