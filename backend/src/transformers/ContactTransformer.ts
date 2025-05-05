export interface IContact {
  id: string;
  firstName: string;
  lastName: string;
  smartConnectorId: null | string;
  smartConnectorStatus: null | number;
}

class ContactTransformer {
  contacts: IContact[];

  constructor(contacts: IContact[]) {
    this.contacts = contacts;
  }

  /**
   * Transform DB Model into required format
   * @param status null | number pass the status code to include it in the result
   * @returns array of contacts along with the status code if given
   */
  transform(status: null | number) {
    let contacts = {
      contacts: this.contacts.map((contact: IContact) => ({
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        smartConnectorId: contact.smartConnectorId,
        smartConnectorStatus: contact.smartConnectorStatus,
      })),
    };

    if (status) {
      return Object.assign({ status: status }, contacts);
    } else {
      return contacts;
    }
  }
}

export default ContactTransformer;
