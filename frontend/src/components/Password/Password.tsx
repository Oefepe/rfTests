import { useTranslation } from 'react-i18next';
import { PasswordInput } from './PasswordInput';

type PasswordProps = {
  password?: string;
  onChange: (value: string) => void;
  loginError?: string;
}

export const Password = ({
  password,
  onChange,
  loginError,
}: PasswordProps) => {

  const { t } = useTranslation();

  return (
    <PasswordInput
      label={t('common.field_label.password')}
      value={password || ''}
      error={!!loginError}
      helperText={loginError}
      onChange={onChange}
    />
  );
};
