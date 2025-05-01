import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { languages } from '../../config/i18n.languages';
import { useState } from 'react';
import i18n from '../../config/i18n';

export const LanguageSelect = () => {
  const [language, setLanguage] = useState<string>();
  const toggleLanguage = (selected: SelectChangeEvent) => {
    const { value } = selected.target;
    if (value) {
      setLanguage(value);
      i18n.changeLanguage(value);
    }

  };

  return (
    <FormControl>
      <Select
        labelId='language-select-label'
        id='language-select'
        value={language || 'en'}
        onChange={toggleLanguage}
        sx={{
          '& .MuiSelect-select': {
            paddingRight: 4,
            paddingLeft: 2,
            paddingTop: 1,
            paddingBottom: 1,
            minWidth: '14ch',
          },
          boxShadow: 3,
          typography: 'bodySmall',
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        {languages.map(({ name, code }) => (
          <MenuItem
            key={code}
            value={code}
            sx={{ typography: 'bodySmall' }}
          >
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
