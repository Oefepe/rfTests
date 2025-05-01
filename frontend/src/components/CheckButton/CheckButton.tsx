import { Checkbox } from '@mui/material';

interface CheckButtonProps {
  checked: boolean;
  onChange: () => void;
}

export const CheckButton = ({ checked, onChange }: CheckButtonProps) => (
  <Checkbox
    sx={{
      paddingLeft: '0px',
      '& .MuiSvgIcon-root': {
        fontSize: 'bodyLarge',
      },
    }}
    checked={checked}
    onChange={onChange}
  />
);
