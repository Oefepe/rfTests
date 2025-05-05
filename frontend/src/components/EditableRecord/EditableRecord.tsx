import { Box, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { InputField } from '../InputField';

export const EditableRecord = ({
  title,
  name,
  value,
  onChange,
  editable,
  toggleEditable,
  error,
  errorText,
  hideButton = false,
}: {
  title: string;
  name: string;
  value?: string;
  onChange: (value: string) => void;
  editable?: boolean;
  toggleEditable: (name: string) => void;
  error?: boolean;
  errorText?: string;
  hideButton?: boolean;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <Typography
        variant='inputLabel'
        color={(theme) =>
          error ? theme.palette.error.main : theme.palette.text.neutral500
        }
        sx={{ alignSelf: 'flex-start' }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {editable ? (
          <InputField
            id={name}
            label=''
            value={value ?? ''}
            error={error}
            onChange={onChange}
            />
        ) : (
          <>
            <Typography
              variant='inputField'
              noWrap={true}
              display={'inline-block'}
              flexGrow={1}
              sx={{ padding: '3px 0' }}
            >
              {value}
            </Typography>
            {error && (
              <Typography
                variant='bodyLarge'
                color={(theme) => theme.palette.error.main}
                sx={{width: '100%'}}
              >
                {errorText}
              </Typography>
            )}
          </>
        )}
        {!hideButton && (
          <Button
            variant='text'
            onClick={toggleEditable.bind(this, name)}
            sx={{ color: 'text.secondary' }}
          >
            {editable ? <SaveIcon /> : <EditIcon />}
          </Button>
        )}
      </Box>
    </Box>
  );
};
