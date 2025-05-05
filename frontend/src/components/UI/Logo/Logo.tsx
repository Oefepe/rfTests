import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Img = styled.img`
  width: 100%;
  height: auto;
`;

export const Logo = ({ width = '100%' }: { width: number | string }) => {
  const theme = useTheme();
  return (
    <Box sx={{ width }}>
      <Img src={theme.extra.logo} alt={theme.extra.name} />
    </Box>
  );
};
