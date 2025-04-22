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
  bookHotel
} from '../controllers/hotel.controller.js';

const hotelRouter = Router();

hotelRouter
  .get('/users/:user_id/hotels', getHotelBookingsOfUser)  // User's hotel bookings
  .get('/hotels', getAllHotels)                            // All or filtered hotel listings
  .get('/hotels/:servicetype_id', getHotelById)            // Get one hotel room by ID
  .post('/bookings/hotels', bookHotel);                    // Book a hotel room

export default hotelRouter;
