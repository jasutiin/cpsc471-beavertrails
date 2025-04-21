import { config } from 'dotenv';
import cors from 'cors';
import express from 'express';
import pg from 'pg';

import userRouter from './routes/user.routes.js';
import flightRouter from './routes/flight.routes.js';
import busRouter from './routes/bus.routes.js';
import hotelRouter from './routes/hotel.routes.js';
import bookingRouter from './routes/booking.routes.js';
import companyRouter from './routes/company.routes.js';

config();
const { Client } = pg;
const app = express();
const port = 8080;

// enable cors for all routes
app.use(cors());

// this is so that express can properly parse req.body into some readable format
app.use(express.json());

// create a new supabase client
const client = new Client({
  connectionString: process.env.DB_CONNECTION_STRING,
});

await client.connect(); // connect to client

// reset hotel statuses on server start
async function resetHotelRoomStatus() {
  try {
    const result = await client.query(`UPDATE HotelRoom SET status = 'Available'`);
    console.log(`Reset success: ${result.rowCount} rooms updated to 'Available'`);
  } catch (err) {
    console.error(' Failed to reset hotel statuses:', err);
  }
}


resetHotelRoomStatus(); // run the reset

// API routes
app.use(
  '/api',
  userRouter,
  flightRouter,
  hotelRouter,
  busRouter,
  bookingRouter,
  companyRouter
);

// start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { app, client };

