import { useEffect, useState } from 'react';
import { isApiError } from '../utility/CustomError';
import { logErrorType } from '../utils/errors/commonErrorLogging';
import { useTranslation } from 'react-i18next';

type CustomPromise<T, F = unknown> = {
  catch<TResult = never>(
    onrejected?:
      | ((reason: F) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ): Promise<T | TResult>;
} & Promise<T>;

const useFetch = <Payload>(apiMethod: CustomPromise<Payload>) => {
  const { t } = useTranslation();
  const [data, setData] = useState<Payload | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const response = await apiMethod;
        setData(response);
      } catch (err) {
        let errMsg = t('defaultErrorMessage');
        if (isApiError(err)) {
          errMsg = err.response.message;
        }
        logErrorType(err, 1035, { errMsg });
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { data, error, isLoading };
};

export default useFetch;
