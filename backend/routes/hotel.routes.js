/* 
for all hotel related routes such as finding all hotel rooms, 
hotel room bookings of a specific user, etc.
*/

import { Router } from 'express';
import {
  getHotelBookingsOfUser,
  getAllHotels,
} from '../controllers/hotel.controller.js';

const hotelRouter = Router();

hotelRouter
  .get('/users/:user_id/hotels', getHotelBookingsOfUser)
  .get('/hotels', getAllHotels);

export default hotelRouter;
