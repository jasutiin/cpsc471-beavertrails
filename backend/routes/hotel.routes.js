/*
for all hotel related routes such as finding all hotel rooms, 
hotel room bookings of a specific user, etc.
*/

import { Router } from 'express';
import {
  getHotelBookingsOfUser,
  getAllHotels,
  getHotelById,
  bookHotel 
} from '../controllers/hotel.controller.js';

const hotelRouter = Router();

hotelRouter
  .get('/users/:user_id/hotels', getHotelBookingsOfUser)
  .get('/hotels', getAllHotels)
  .get('/hotels/:servicetype_id', getHotelById)
  .post('/bookings/hotels', bookHotel); 

export default hotelRouter;

