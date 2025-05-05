import express from 'express';
import { logException } from '../../controllers/logException/';

const exceptionLogRoutes = express.Router();

exceptionLogRoutes.post('/', logException);

export default exceptionLogRoutes;
