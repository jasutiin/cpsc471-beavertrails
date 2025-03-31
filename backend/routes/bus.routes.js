/* 
for all bus related routes such as finding all buses, 
bus bookings of a specific user, etc.
*/

import { Router } from 'express';
import {
  getBusBookingsOfUser,
  getBuses,
  getBusById,
  getSeatsOfBus,
} from '../controllers/bus.controller.js';

const busRouter = Router();

busRouter
  .get('/users/:user_id/buses', getBusBookingsOfUser)
  .get('/buses', getBuses)
  .get('/buses/:bus_id', getBusById)
  .get('/buses/:bus_id/seats', getSeatsOfBus);

export default busRouter;
