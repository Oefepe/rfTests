import { Grid, Alert, Box } from '@mui/material';
const ErrorGrid = ({ error }: { error: string }) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="flex-end">
          <Alert severity="error">{error}</Alert>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ErrorGrid;
