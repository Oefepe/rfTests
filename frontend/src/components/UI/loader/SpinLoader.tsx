import { Grid, CircularProgress, Box } from '@mui/material';

const SpinLoader = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: (theme) => theme.palette.primary.translucent,
        }}>
          <CircularProgress />
        </Box>
      </Grid>
    </Grid>
  );
};

export default SpinLoader;
