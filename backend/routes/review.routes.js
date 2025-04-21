/* 
for all flight related routes such as finding all flights, 
flight bookings of a specific user, etc.
*/

import { Router } from 'express';
import { getReviewsOfCompany } from '../controllers/review.controller.js';

const reviewRouter = Router();

reviewRouter.get('/companies/:company_id/reviews', getReviewsOfCompany);

export default reviewRouter;
