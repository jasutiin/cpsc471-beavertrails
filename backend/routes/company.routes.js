/* 
for all company related routes such as finding all companies, 
company bookings of a specific user, etc.
*/

import express from 'express';
import {
  getCompanyDetails,
  loginCompany,
  signupCompany,
} from '../controllers/company.controller.js';

const router = express.Router();

router.get('/:company_id', getCompanyDetails);
router.post('/auth/company/login', loginCompany);
router.post('/auth/company/signup', signupCompany);

export default router;
