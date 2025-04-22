import { Router } from 'express';
import { getCompanyFlights } from '../controllers/dashboard.controller.js';

const dashboardRouter = Router();

dashboardRouter.get(
  '/company/dashboard/flights/:company_id',
  getCompanyFlights
);

export default dashboardRouter;
