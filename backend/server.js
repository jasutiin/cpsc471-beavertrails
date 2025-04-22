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
import reviewRouter from './routes/review.routes.js';
import activityRouter from './routes/activity.routes.js';
import couponRouter from './routes/coupon.routes.js';

config();
const { Client } = pg;
const app = express();
const port = 8080;

// Enable CORS + JSON parsing
app.use(cors());
app.use(express.json());

// DB connection
const client = new Client({
  connectionString: process.env.DB_CONNECTION_STRING,
});
await client.connect();

// Reset hotel room statuses
async function resetHotelRoomStatus() {
  try {
    const result = await client.query(
      `UPDATE HotelRoom SET status = 'Available'`
    );
    console.log(`Reset success: ${result.rowCount} hotel rooms set to 'Available'`);
  } catch (err) {
    console.error('Failed to reset hotel statuses:', err);
  }
}

// Reset activity statuses
async function resetActivityStatus() {
  try {
    const result = await client.query(
      `UPDATE Activity SET signups = 0`
    );
    console.log(`Reset success: ${result.rowCount} activities had signup_count reset`);
  } catch (err) {
    console.error('Failed to reset activity signups:', err);
  }
}

// Run resets
await resetHotelRoomStatus();
await resetActivityStatus();

// Mount API routes
app.use(
  '/api',
  userRouter,
  flightRouter,
  hotelRouter,
  busRouter,
  bookingRouter,
  companyRouter,
  reviewRouter,
  activityRouter,
  couponRouter 
);

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { app, client };
