import { Container, Typography } from '@mui/material';

export const AuthErrorMessage = ({ message, visible }: {
  message: string,
  visible: boolean
}) => {
  if (visible) {
    return (
      <Container
        sx={{ bgcolor: 'black', borderRadius: '10px', padding: '10px' }}
      >
        <Typography variant='bodyLarge' color='white' align='center'>
          {message}
        </Typography>
      </Container>
    );
  } else {
    return <></>;
  }
};
