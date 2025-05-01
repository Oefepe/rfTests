import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SmartConnectorIcon from '../../components/smartconnector/SmartConnectorIcon';
import './ContactList.css';
import { IContactList } from './Contacts';
import { useTranslation } from 'react-i18next';

export interface IProps extends React.HTMLProps<HTMLDivElement> {
  contacts: IContactList[];
  isLoading: boolean;
  error: string | null;
}

const ContactList: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const contacts = props.contacts;
  const isLoading = props.isLoading;
  const error = props.error;

  const columns: GridColDef[] = [
    {
      field: 'scIcon',
      headerName: '',
      flex: 0.01,
      renderCell: (params: GridRenderCellParams<IContactList>) => {
        return (
          <>
            <div>
              <span className='smartIcon'>
                <SmartConnectorIcon
                  smartConnectorId={params.row.smartConnectorId}
                  smartConnectorStatus={params.row.smartConnectorStatus}
                />
              </span>
            </div>
          </>
        );
      },
    },
    {
      field: 'fullName',
      headerName: '',
      flex: 1,
      renderCell: (params: GridRenderCellParams<IContactList>) => {
        return (
          <>
            <div>
              <span className='contact-name-container'>
                <span className='contact-name'>
                  {params.row.firstName || ''} {params.row.lastName || ''}
                </span>
              </span>
            </div>
          </>
        );
      },
    },
  ];

  const customLocaleText = {
    noRowsLabel: t('noContactToDisplay'),
  };

  return (
    <div className='contact-list-container'>
      <h4>Contact List</h4>
      {error && error.length > 0 && <h1>{error}</h1>}
      <DataGrid
        sx={{ borderLeft: 'none', borderRight: 'none' }}
        autoHeight
        rows={contacts}
        columns={columns}
        loading={isLoading}
        hideFooter={true}
        localeText={customLocaleText}
      />
    </div>
  );
};
export default ContactList;
