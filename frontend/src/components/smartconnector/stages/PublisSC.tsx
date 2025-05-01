import { FormGroup } from '@mui/material';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

type PropTypes = {
  publish: boolean;
  setPublish: (publish: boolean) => void;
  switchChecked: boolean;
};

const PublicSC = ({ publish, setPublish, switchChecked }: PropTypes) => {
  const { t } = useTranslation();
  return (
    <>
      <FormGroup>
        <Button
          disabled={!switchChecked}
          variant='contained'
          onClick={() => {
            setPublish(!publish);
          }}
          id='publishButton'
        >
          {publish ? t('unpublish') : t('publish')}
        </Button>
      </FormGroup>
    </>
  );
};

export default PublicSC;
