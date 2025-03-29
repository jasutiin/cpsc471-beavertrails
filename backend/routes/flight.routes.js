/* 
for all flight related routes such as finding all flights, 
flight bookings of a specific user, etc.
*/

import { Router } from 'express';
import {
  getFlightBookingsOfUser,
  getFlights,
} from '../controllers/flight.controller.js';

const flightRouter = Router();

flightRouter
  .get('/users/:user_id/flights', getFlightBookingsOfUser)
  .get('/flights', getFlights);

export default flightRouter;
