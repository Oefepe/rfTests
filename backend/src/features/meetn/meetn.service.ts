import config from '../../config/config';
import { MeetnContact } from './meetn.entities';
import { logErrorType } from '../../utils/commonErrorLogging';

export const checkRoomAvailabilityService = async (room: string) => {
  try {
    const response = await fetch(
      `${config.meetn.baseUrl}api/company/room/name/available`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Room: room,
          PartnerGUID: config.meetn.meetnPartnerGUID,
        }),
      }
    );

    const data = response.status === 200;

    return data;
  } catch (error) {
    logErrorType(error, 2020, {
      action: 'Failed to check room availability',
    });
  }
};

export const createContactService = async (contact: MeetnContact) => {
  try {
    const response = await fetch(
      `${config.meetn.baseUrl}api/company/contact/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      }
    );

    const status = response.status === 200;
    const data = await response.json();

    return {
      error: !status,
      message: data,
    };
  } catch (error) {
    logErrorType(error, 2020, {
      action: 'Failed to create meetn contact',
    });
    return {
      error: true,
      message: {
        msg: [{ msg: 'Failed to create meetn contact' }],
      },
    };
  }
};
