import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { frontendRoutes } from '../../config';
import { SignupState } from './types';
import { useTranslation } from 'react-i18next';
import { InputField, Button } from '../../components';
import { trimObjectValues } from '../../utils';

export const SignUpName = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCreateAccount = async () => {
    const data: Required<SignupState> = {
      ...location.state,
      firstName,
      lastName,
    };

    navigate(frontendRoutes.signupPassword, { state: trimObjectValues(data) });
  };

  return (
    <>
      <Typography
        component='h2'
        variant='h2regular'
        textAlign='center'
        sx={{ color: 'primary.main' }}
        mb={8}
      >
        {t('login_signup.personalize_app.header_msg')}
      </Typography>
      <Stack width='100%' spacing={7}>
        <InputField
          id='firstName'
          label={t('common.field_label.first_name')}
          value={firstName}
          error={!firstName.trim()}
          errorOnBlurred={true}
          helperText={!firstName.trim() ? t('common.notice.required') : ''}
          onChange={setFirstName}
        />
        <Stack width='100%' spacing={6}>
          <InputField
            id='lastName'
            label={t('common.field_label.last_name')}
            value={lastName}
            error={!lastName.trim()}
            errorOnBlurred={true}
            helperText={!lastName.trim() ? t('common.notice.required') : ''}
            onChange={setLastName}
          />
          <Button
            text={t('common.button.next')}
            onClick={handleCreateAccount}
            disabled={!firstName.trim() || !lastName.trim()}
          />
        </Stack>
      </Stack>
    </>
  );
};
