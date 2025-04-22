import { Router } from 'express';
import { getCompanyFlights } from '../controllers/bus.controller.js';

const dashboardRouter = Router();

dashboardRouter.get(
  '/company/dashboard/flights/:company_id',
  getCompanyFlights
);

export default dashboardRouter;
