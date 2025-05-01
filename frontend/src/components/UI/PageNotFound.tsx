import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PageNotFound = () => {
  const { t } = useTranslation();
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Card
          sx={{
            width: '100vh',
            height: '50vh',
          }}
          variant='outlined'
        >
          <CardContent
            sx={{
              textAlign: 'center',
              pt: 10,
            }}
          >
            <Typography component='h1' variant='h1regular' color='text.primary'>
              404
            </Typography>
            <Typography component='h3' variant='h3regular'
                        color='text.secondary'>
              {t('common.notice.page_not_found')}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default PageNotFound;
