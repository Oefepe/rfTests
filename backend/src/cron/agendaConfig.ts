import { Agenda } from 'agenda';
import config from '../config/config';

const agendaInstance = new Agenda({ db: { address: config.mongo.url } });

export default agendaInstance;
