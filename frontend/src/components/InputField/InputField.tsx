import { TextField } from '@mui/material';
import { useState } from 'react';
import warningIcon from '../../assets/icons/warning.svg';

export type InputFieldProps = {
  id?: string;
  label: string;
  value: string;
  type?: string;
  error?: boolean;
  errorOnBlurred?: boolean;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  InputProps?: object;
};

export const InputField = ({
  id,
  label,
  value,
  type = 'text',
  error,
  errorOnBlurred = false,
  required,
  helperText,
  placeholder,
  onChange,
  disabled,
  InputProps,
}: InputFieldProps) => {
  const [blurred, setBlurred] = useState<boolean>(false);
  const errorState = errorOnBlurred ? blurred && error : error;

  return (
    <TextField
      id={id}
      variant='standard'
      label={label}
      type={type}
      fullWidth
      value={value}
      onBlur={setBlurred.bind(this, true)}
      error={errorState}
      required={required}
      helperText={errorState && helperText}
      placeholder={placeholder}
      onChange={(input) => onChange(input.target.value)}
      disabled={disabled}
      InputProps={InputProps}
      sx={{
        '& .MuiInputLabel-root': {
          typography: 'inputField',
          color: 'text.neutral400',
          transform: 'translate(0, 20px) scale(1)',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -6px) scale(0.75)',
            typography: 'inputLabel',
            color: 'text.neutral500',
          },
        },
        '& .MuiInputBase-input': { typography: 'inputField' },
        '& .MuiFormHelperText-root': {
          typography: 'bodyLarge',
          '&.Mui-error': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            '&::after': {
              content: '""',
              display: 'block',
              width: '26px',
              height: '26px',
              backgroundImage: `url(${warningIcon})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }
          }
        },
      }}
    />
  );
};
