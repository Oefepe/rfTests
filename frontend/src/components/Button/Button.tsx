import { Button as MUIButton } from '@mui/material';

type ButtonType = {
  color?: string;
  variant?: 'contained' | 'outlined';
  text: string;
  onClick: () => void;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  fontSize?: string;
};

export const Button = ({
  text,
  onClick,
  variant = 'contained',
  disabled,
  startIcon,
  textTransform = 'none',
  color,
  fontSize,
}: ButtonType) => {
  return (
    <MUIButton
      sx={{
        typography: 'buttonRegular',
        textTransform,
        color,
        fontSize,
        border: variant === 'outlined' ? '1px solid' : 'none',
        '&.Mui-disabled': {
          color: 'primary.contrastText',
          opacity: 0.3,
          backgroundColor: 'primary.main',
        },
        '&:hover': {
          opacity: variant === 'contained' ? 0.7 : undefined,
          border: variant === 'outlined' ? '3px solid' : undefined,
        },
      }}
      disabled={disabled}
      variant={variant}
      size="large"
      fullWidth
      onClick={onClick}
      startIcon={startIcon}
    >
      {text}
    </MUIButton>
  );
};
