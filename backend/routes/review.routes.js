/* 
for all flight related routes such as finding all flights, 
flight bookings of a specific user, etc.
*/

import { Router } from 'express';
import {
  getReviewsOfCompany,
  postReviewForCompany,
  updateReview,
  deleteReview,
} from '../controllers/review.controller.js';

const reviewRouter = Router();

reviewRouter.get('/companies/:company_id/reviews', getReviewsOfCompany);
reviewRouter.post('/companies/:company_id/reviews', postReviewForCompany);
reviewRouter.put('/reviews/:review_id', updateReview);
reviewRouter.delete('/reviews/:review_id', deleteReview);

export default reviewRouter;
