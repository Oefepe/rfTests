import { logError } from '../../services';
import { useTranslation } from 'react-i18next';

type Props = {
  error: Error;
};

export const ErrorMessage = ({ error }: Props) => {
  const { t } = useTranslation();
  logError({
    errorCode: 4000,
    message: error?.message,
    stacktrace: error?.stack,
  });
  return (
    <div>
      <h2>{t('common.notice.default_error_msg')}</h2>
    </div>
  );
};
