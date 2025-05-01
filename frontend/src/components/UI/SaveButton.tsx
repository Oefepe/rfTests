import { Button, CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';

type PropTypes = {
  loading: boolean;
  id: string;
};

const SaveButton = ({ loading, id }: PropTypes) => {
  const { t } = useTranslation();
  return (
    <>
      <Button
        id={id}
        variant='outlined'
        color='primary'
        type='submit'
        disabled={loading}
      >
        {t('common.button.save')}
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color: green[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </>
  );
};
export default SaveButton;
