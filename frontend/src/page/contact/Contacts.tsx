import { useEffect, useState } from 'react';
import ContactRepository from '../../repositories/ContactRepository';
import ContactList from './ContactList';
import { RFNGApiError } from '../../utils';

export interface IContactList {
  id: string;
  firstName: string;
  lastName: string;
  description: string;
  isActive: number;
  smartConnectorId: null | string;
  smartConnectorStatus: null | number;
  action: string;
}

export default function Contact() {
  const [contacts, setContacts] = useState<IContactList[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>('');

  useEffect(() => {
    ContactRepository.getContacts()
      .then((data) => {
        setLoading(false);
        setContacts(data.contacts);
        setError(null);
      })
      .catch((e) => {
        if (e instanceof RFNGApiError) {
          setError(`${e.status}: ${e.message}`);
        } else {
          setError(`${e.message}`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <ContactList contacts={contacts} isLoading={isLoading} error={error} />
  );
}
