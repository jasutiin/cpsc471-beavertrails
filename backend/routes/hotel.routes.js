/*
  Handles all hotel-related routes such as:
  - Fetching all hotel rooms or filtered rooms
  - Getting a single hotel room by ServiceType_Id
  - Fetching hotel bookings for a user
  - Booking a hotel room
*/

import { Router } from 'express';
import {
  getHotelBookingsOfUser,
  getAllHotels,
  getHotelById,
  bookHotel,
} from '../controllers/hotel.controller.js';

const hotelRouter = Router();

hotelRouter
  .get('/users/:user_id/hotels', getHotelBookingsOfUser)
  .get('/hotels', getAllHotels)
  .get('/hotels/:servicetype_id', getHotelById)
  .post('/bookings/hotels', bookHotel);

export default hotelRouter;
