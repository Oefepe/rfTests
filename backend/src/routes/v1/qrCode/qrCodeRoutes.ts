import express from 'express';
import { Schemas, ValidateJoi } from '../../../middleware/validation';
import { getQRCode } from '../../../controllers/resource/resourceController';

const router = express.Router();

router.get('/qr-code', ValidateJoi(Schemas.qrCode), getQRCode);

export default router;

