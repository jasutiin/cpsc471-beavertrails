import { Router } from 'express';
import {
  getBusBookingsOfUser,
  getBuses,
  getBusByServiceId,
  getSeatsOfBus,
  bookSeatInBus,
} from '../controllers/bus.controller.js';

const busRouter = Router();

busRouter
  .get('/users/:user_id/buses', getBusBookingsOfUser)
  .get('/buses', getBuses)
  .get('/buses/:servicetype_id', getBusByServiceId) 
  .get('/buses/:servicetype_id/seats', getSeatsOfBus)
  .post('/bookings/buses', bookSeatInBus);

export default busRouter;
