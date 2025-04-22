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
import activityRouter from './routes/activity.routes.js'; // ✅ NEW

config();
const { Client } = pg;
const app = express();
const port = 8080;

// Enable CORS for all routes
app.use(cors());

// Allow Express to parse JSON
app.use(express.json());

// Create a new PostgreSQL client
const client = new Client({
  connectionString: process.env.DB_CONNECTION_STRING,
});

await client.connect(); // Connect to DB

// Reset hotel room status
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

// Reset activity status
async function resetActivityStatus() {
  try {
    const result = await client.query(
      `UPDATE Activity SET status = 'Available'`
    );
    console.log(`Reset success: ${result.rowCount} activities set to 'Available'`);
  } catch (err) {
    console.error('Failed to reset activity statuses:', err);
  }
}

// Run both resets
await resetHotelRoomStatus();
await resetActivityStatus();

// API routes
app.use(
  '/api',
  userRouter,
  flightRouter,
  hotelRouter,
  busRouter,
  bookingRouter,
  companyRouter,
  reviewRouter,
  activityRouter
);

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { app, client };
