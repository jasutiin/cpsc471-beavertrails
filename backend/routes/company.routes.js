/* 
for all company related routes such as finding all companies, 
company bookings of a specific user, etc.
*/

import { Router } from 'express';
import { getCompanyDetails } from '../controllers/company.controller.js';

const companyRouter = Router();

companyRouter.get('/companies/:company_id', getCompanyDetails);

export default companyRouter;
