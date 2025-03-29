/* 
for all flight related routes such as finding all flights, 
flight bookings of a specific user, etc.
*/

import { Router } from 'express';
import {
  getFlightBookingsOfUser,
  getFlights,
  getFlightById,
  getSeatsOfFlight,
} from '../controllers/flight.controller.js';

const flightRouter = Router();

flightRouter
  .get('/users/:user_id/flights', getFlightBookingsOfUser)
  .get('/flights', getFlights)
  .get('/flights/:flight_id', getFlightById)
  .get('/flights/:flight_id/seats', getSeatsOfFlight);

export default flightRouter;
