import { Box, Typography } from '@mui/material';
import Flag from 'react-world-flags';
import countriesList from './countriesList.json';

type CountryProps = {
  name: string;
  countryCode: string;
  dialCode: string;
};

type CountriesListProps = {
  isCountriesListOpen: boolean;
  selectedCountry: CountryProps | undefined;
  onSelectCountry: (country: CountryProps) => void;
};

export const CountriesList = ({ isCountriesListOpen, selectedCountry, onSelectCountry }: CountriesListProps) => {
  if (!isCountriesListOpen) return null;

  return (
    <Box
      sx={{
        left: 0,
        zIndex: 1,
        top: '100%',
        width: '100%',
        padding: '16px',
        marginTop: '8px',
        overflowY: 'auto',
        cursor: 'pointer',
        maxHeight: '260px',
        borderRadius: '8px',
        overflowX: 'hidden',
        whiteSpace: 'nowrap',
        position: 'absolute',
        backgroundColor: 'text.neutral100',
        boxShadow: '0px 4px 15px 0px rgba(0, 0, 0, 0.15)',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'text.neutral500',
          borderRadius: '8px',
          height: '20%',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'text.neutral300',
          borderRadius: '8px',
        },
      }}
    >
      {countriesList.map((country) => (
        <Box
          key={`${country.countryCode}${country.dialCode}`}
          sx={{
            display: 'flex',
            paddingY: '20px',
            alignItems: 'center',
            justifyContent: 'left',
            '&:first-of-type': {
              paddingTop: 0,
            },
            '&:last-of-type': {
              paddingBottom: 0,
              borderBottom: 'none',
            },
            borderBottom: '1px solid',
            borderBottomColor: 'text.neutral300',
          }}
          onClick={() => onSelectCountry(country)}
        >
          <Flag code={country.countryCode} width={'44px'} />
          <Typography
            variant="bodySmall"
            sx={{ marginLeft: '12px', marginRight: '8px' }}
            color={country.name === selectedCountry?.name ? 'tertiary.main' : 'text.neutral900'}
          >
            {country.name}
          </Typography>
          <Typography color={country.name === selectedCountry?.name ? 'tertiary.light' : 'text.neutral600'}>
            {country.dialCode}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
