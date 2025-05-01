import ContactService, {
  IContactListResponse,
} from '../services/ContactService';

interface IContactRepository {
  getContacts(): Promise<IContactListResponse>;
}

class ContactRepositoryImpl implements IContactRepository {
  contactService: typeof ContactService;

  constructor(contactService: typeof ContactService) {
    this.contactService = contactService;
  }

  getContacts(): Promise<IContactListResponse> {
    return this.contactService.getContacts();
  }
}

const ContactRepository: IContactRepository = new ContactRepositoryImpl(
  ContactService
);

export default ContactRepository;
