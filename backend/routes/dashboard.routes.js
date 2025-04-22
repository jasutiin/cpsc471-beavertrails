import { Router } from 'express';
import {
  getCompanyFlights,
  getCompanyBuses,
  getCompanyHotelRooms,
  getCompanyActivities,
} from '../controllers/dashboard.controller.js';

const dashboardRouter = Router();

dashboardRouter.get(
  '/dashboard/company/:company_id/flights',
  getCompanyFlights
);

dashboardRouter.get('/dashboard/company/:company_id/buses', getCompanyBuses);

dashboardRouter.get(
  '/dashboard/company/:company_id/hotel-rooms',
  getCompanyHotelRooms
);

dashboardRouter.get(
  '/dashboard/company/:company_id/activities',
  getCompanyActivities
);

export default dashboardRouter;
