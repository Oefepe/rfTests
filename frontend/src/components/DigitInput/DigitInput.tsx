import { ChangeEvent, Ref } from 'react';
import { TextField } from '@mui/material';

type DigitInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputRef: Ref<HTMLInputElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const DigitInput = ({
  value,
  inputRef,
  onChange,
  onKeyDown,
}: DigitInputProps) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      inputRef={inputRef}
      onKeyDown={onKeyDown}
      InputProps={{
        style: {
          fontWeight: 600,
        },
      }}
      sx={{
        backgroundColor: (theme) => theme.palette.text.neutral200,
        boxShadow: (theme) => `0 3px 0 ${theme.palette.text.neutral300}`,
        borderRadius: '0.5rem',
        '& fieldset': { border: 'none' },
        input: {
          textAlign: 'center',
          fontSize: ['1.6rem', '2.5rem', '3.4rem'],
          height: ['1.2rem', '2rem', '3rem'],
          width: ['1.2rem', '2rem', '3rem'],
        },
      }}
    />
  );
};
