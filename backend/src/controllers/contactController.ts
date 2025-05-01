import { NextFunction, Request, Response } from 'express';
import contactService from '../services/contactService';
import ContactTransformer from '../transformers/ContactTransformer';
import wrapAsync from '../utils/asyncErrorHandle';
import ContactLogDTO from '../dto/ContactLogDTO';
import HttpCode from '../config/httpCode';

const getContacts = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const contacts = await contactService.getContacts();
    return res.json(new ContactTransformer(contacts).transform(200));
  }
);

const logContactData = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const contactLogObj = new ContactLogDTO(req.body);
    await contactService.logContactData(contactLogObj);
    return res.status(HttpCode.OK).json({ message: 'Data logged successfully' });
  }
);

export default { getContacts, logContactData };
