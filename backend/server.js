import pg from 'pg';
import express from 'express';
import userRouter from './routes/user.routes.js';
import flightRouter from './routes/flight.routes.js';
import busRouter from './routes/bus.routes.js';
import hotelRouter from './routes/hotel.routes.js';
import { config } from 'dotenv';
import cors from 'cors';

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
  user: process.env.DB_USER,
  connectionString: process.env.DB_CONNECTION_STRING,
});

await client.connect(); // connect to client

app.use('/api', userRouter, flightRouter, hotelRouter, busRouter);

// set up express server to listen on API endpoints
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { app, client };
