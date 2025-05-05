import express from 'express';
import {
  createResource,
  getResourceDetails,
  getResources,
} from '../../controllers/resource/resourceController';
import { Schemas, ValidateJoi } from '../../middleware/validation';

const resourceRoutes = express.Router();

resourceRoutes.post(
  '/',
  ValidateJoi(Schemas.resourceValidationByType),
  createResource
);

resourceRoutes.get(
  '/:accountId/:category/:type',
  ValidateJoi(Schemas.resourceAPI.get),
  getResources
);

resourceRoutes.get(
  '/resource-details',
  ValidateJoi(Schemas.resourceAPI.getById),
  getResourceDetails
);

export default resourceRoutes;
