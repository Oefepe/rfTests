import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

export const HorizontalLinedText = styled(Typography)`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 1rem;
  color: ${(props) => props.theme.palette.text.secondary};
  &:before {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${(props) => props.theme.palette.grey[300]};
  }
  &:after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${(props) => props.theme.palette.grey[300]};
  }
`;
