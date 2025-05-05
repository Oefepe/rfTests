import { Typography } from '@mui/material';

type PlatformItemProps = {
  isPlatformSelected: boolean;
};

export const PlatformItem = ({ isPlatformSelected }: PlatformItemProps) => (
  <Typography
    sx={{
      height: '28px',
      width: '28px',
      backgroundColor: isPlatformSelected ? 'primary.main' : 'none',
      margin: 0,
      minWidth: 0,
      borderRadius: '50%',
      border: '4px solid',
      borderColor: 'text.neutral100',
      boxShadow: (theme) =>
        isPlatformSelected ? `0 0 0 1px ${theme.palette.primary.main}` : `0 0 0 1px ${theme.palette.text.neutral900}`,
    }}
  />
);
