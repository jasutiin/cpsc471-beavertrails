import pg from 'pg';
import express from 'express';
import router from './routes.js';

const { Client } = pg;
const app = express();
const port = 8080;

// create a new supabase client
const client = new Client({
  user: process.env.USER,
  connectionString: process.env.CONNECTION_STRING,
});

await client.connect(); // connect to client

app.use('/hello', router);

// set up express server to listen on api endpoints
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { app, client };
