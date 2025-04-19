/* 
for all bus related routes such as finding all buses, 
bus bookings of a specific user, etc.
*/

import { Router } from 'express';
import { getUserBookings } from '../controllers/booking.controller.js';

const bookingRouter = Router();

bookingRouter.get('/bookings/:user_id', getUserBookings);

export default bookingRouter;
