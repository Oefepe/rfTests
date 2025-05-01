import { Typography } from '@mui/material';
import { ReactNode } from 'react';

export const RfLink = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <Typography
      variant='bodyLarge'
      align='center'
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        '&:hover': { color: 'tertiary.light' },
        color: 'tertiary.main',
      }}
    >
      {children}
    </Typography>
  );
};
