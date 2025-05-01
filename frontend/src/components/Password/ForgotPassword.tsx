import { RfLink } from '../RfLink';
import { useTranslation } from 'react-i18next';

export const ForgotPassword = ({ onResetPassword }: {
  onResetPassword: () => void
}) => {
  const { t } = useTranslation();
  return (
    <RfLink onClick={onResetPassword}>
      {t('login_signup.button.forgot_password')}
    </RfLink>
  );
};
