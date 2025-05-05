import Contact from '../db/mongo/models/contactModel';
import ContactLog, {ContactLog as ContactLogInterface} from '../db/mongo/models/ContactLog';
import { IContact } from '../transformers/ContactTransformer';
import ContactLogDTO from '../dto/ContactLogDTO';

//To Fetch all the Contacts
const getContacts = async (): Promise<IContact[]> => {
  return await Contact.find({});
};

export const logContactData = async (data: ContactLogDTO): Promise<Partial<ContactLogInterface>> => {
  const existingContactLog = await ContactLog.findOne({
    contactId: data.contactId,
    userId: data.userId,
    resourceId: data.resourceId
  });

  if (existingContactLog) {
    return existingContactLog;
  }

  const contact = new ContactLog({
    contactId: data.contactId,
    userId: data.userId,
    resourceId: data.resourceId,
    domain: data.domain,
    logTime: new Date()
  });

  return await contact.save();
};
export default { getContacts, logContactData };
