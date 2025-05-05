import { TextField, IconButton, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CloseIcon } from '../../assets/icons';

type PhoneNumberInputProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
};

export const PhoneNumberInput = ({ value, onChange, onClear }: PhoneNumberInputProps) => {
  const { t } = useTranslation();

  return (
    <TextField
      variant="standard"
      value={value}
      placeholder={`${t('common.field_label.phone')} *`}
      onChange={onChange}
      sx={{
        width: '100%',
        marginLeft: '12px',
        '& input': {
          color: 'text.neutral900',
        },
        '& input::placeholder': {
          color: 'text.neutral500',
        },
        '& .MuiInputBase-input': { typography: 'h3regular' },
      }}
      InputProps={{
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton onClick={onClear} edge="end" sx={{ marginRight: '-8px' }}>
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
