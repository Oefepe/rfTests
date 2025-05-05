import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import Flag from 'react-world-flags';
import countriesList from './countriesList.json';
import { CountriesList } from './CountriesList';
import { ArrowIcon } from '../../assets/icons';
import { PhoneNumberInput } from './PhoneNumberInput';

type CountryCodeProps = {
  onChange: (number: string) => void;
};

export type CountryProps = {
  name: string;
  dialCode: string;
  countryCode: string;
};

const DEFAULT_COUNTRY_CODE = 'US';
const defaultCountry = countriesList.find((country) => country.countryCode === DEFAULT_COUNTRY_CODE);

export const CountryCode = ({ onChange }: CountryCodeProps) => {
  const [country, setCountry] = useState(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCountriesListOpen, setIsCountriesListOpen] = useState(false);

  const { t } = useTranslation();
  const theme = useTheme();

  const handleCountriesList = () => {
    setIsCountriesListOpen(!isCountriesListOpen);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericPhoneNumber = event.target.value.replace(/\D/g, '');

    setPhoneNumber(numericPhoneNumber);
    onChange(numericPhoneNumber ? `${country?.dialCode}${numericPhoneNumber}` : numericPhoneNumber);
  };

  const handleClear = () => {
    setPhoneNumber('');
    onChange('');
  };

  const handleSelectCountry = (selectedCountry: CountryProps) => {
    setCountry(selectedCountry);
    setIsCountriesListOpen(false);
  };

  return (
    <Stack sx={{ width: '548px', position: 'relative' }}>
      <Typography
        sx={{ textAlign: 'left', paddingBottom: '4px', height: '27px' }}
        variant="bodySmall"
        color="text.neutral500"
      >
        {phoneNumber.trim() && `${t('common.field_label.phone')} *`}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box onClick={handleCountriesList} sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}>
          <Flag code={country?.countryCode} width={'58px'} />
          <Typography component="h3" variant="h3regular" color="text.neutral900" paddingX="4px">
            {country?.dialCode}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              transform: isCountriesListOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ArrowIcon color={theme.palette.text.neutral500} rotation="-90" width="14" />
          </Box>
        </Box>
        <PhoneNumberInput value={phoneNumber} onChange={handleChange} onClear={handleClear} />
      </Box>
      <CountriesList
        isCountriesListOpen={isCountriesListOpen}
        selectedCountry={country}
        onSelectCountry={handleSelectCountry}
      />
    </Stack>
  );
};
