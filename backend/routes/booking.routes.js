/* 
for all bus related routes such as finding all buses, 
bus bookings of a specific user, etc.
*/

import { Router } from 'express';
import {
  getUserFlightBookings,
  getUserBusBookings,
  getUserHotelBookings,
} from '../controllers/booking.controller.js';

const bookingRouter = Router();

bookingRouter
  .get('/bookings/flights/:user_id', getUserFlightBookings)
  .get('/bookings/buses/:user_id', getUserBusBookings)
  .get('/bookings/hotels/:user_id', getUserHotelBookings);

export default bookingRouter;
