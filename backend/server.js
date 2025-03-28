import pg from 'pg';
import express from 'express';
import userRouter from './routes/user.routes.js';
import serviceRouter from './routes/service.routes.js';
import { config } from 'dotenv';

config();
const { Client } = pg;
const app = express();
const port = 8080;

// create a new supabase client
const client = new Client({
  user: process.env.DB_USER,
  connectionString: process.env.DB_CONNECTION_STRING,
});

await client.connect(); // connect to client

app.use('/api', userRouter, serviceRouter);

// set up express server to listen on api endpoints
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { app, client };
