import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useTranslation } from 'react-i18next';

const BackButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const backButtonUrl =
    '/smart-connectors/' + String(localStorage.getItem('encodedUrl'));
  return (
    <Button
      variant='outlined'
      onClick={() => navigate(backButtonUrl)}
      sx={{
        border: '1px solid rgba(8, 8, 8, 0.5) !important',
        color: '#282829 !important',
      }}
      startIcon={<ArrowBackRoundedIcon />}
      id='backBtn'
    >
      {t('backButton')}
    </Button>
  );
};

export default BackButton;
