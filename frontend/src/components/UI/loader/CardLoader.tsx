import { Grid, Skeleton } from '@mui/material';

const CardLoader = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Skeleton variant="rectangular" animation="wave" height={150} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Skeleton variant="rectangular" animation="wave" height={150} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Skeleton variant="rectangular" animation="wave" height={150} />
      </Grid>
    </Grid>
  );
};

export default CardLoader;
