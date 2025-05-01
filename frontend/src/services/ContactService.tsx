import Repository from '../repositories/Repository';
import { IContactList } from '../page/contact/Contacts';
import { RFNGApiError } from '../utils/errors/ApiError';
import { ApiErrorMessages } from '../utils/errors/ApiErrorMessages';
import { logErrorType } from '../utils/errors/commonErrorLogging';

export interface IContactListResponse {
  status: number;
  contacts: IContactList[];
}

export interface IContactAPI {
  getContacts(): Promise<IContactListResponse>;
}

class ContactAPIImpl implements IContactAPI {
  _dataUrl = 'contacts';

  getContacts(): Promise<IContactListResponse> {
    return Repository.get<IContactListResponse>(`${this._dataUrl}`)
      .then((response) => {
        if (response.data !== null) {
          if (response.data.status !== null && response.data.status === 9001) {
            throw new RFNGApiError(
              9001,
              response.data.status,
              ApiErrorMessages.STATUS_9001
            );
          }
          return response.data;
        } else {
          throw new RFNGApiError(
            9012,
            response.status,
            ApiErrorMessages.STATUS_OTHER
          );
        }
      })
      .catch((e) => {
        logErrorType(e, 1, { url: `${this._dataUrl}` });
        throw e;
      });
  }
}

const ContactService: IContactAPI = new ContactAPIImpl();

export default ContactService;
