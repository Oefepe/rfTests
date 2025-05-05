import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';

type PropTypes = {
  switchChecked: boolean;
  setSwitchChecked: (switchChecked: boolean) => void;
};

const SwitchItem = ({ switchChecked, setSwitchChecked }: PropTypes) => {
  const { t } = useTranslation();
  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={switchChecked}
              onChange={() => {
                setSwitchChecked(!switchChecked);
              }}
            />
          }
          label={t('edit')}
        />
      </FormGroup>
    </>
  );
};

export default SwitchItem;
