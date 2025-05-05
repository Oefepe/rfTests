import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { InputField, InputFieldProps } from '../InputField';

export const PasswordInput = ({ id, label, value, error, helperText, onChange }: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <InputField
      id={id}
      type={showPassword ? 'text' : 'password'}
      label={label}
      value={value}
      error={error}
      helperText={helperText}
      onChange={onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleTogglePasswordVisibility}>
              {showPassword ? (
                <VisibilityOutlinedIcon sx={{ color: 'text.neutral400' }} />
              ) : (
                <VisibilityOffOutlinedIcon sx={{ color: 'text.neutral400' }} />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
