import pg from 'pg';
const { Client } = pg;

const client = new Client({
  user: process.env.USER,
  connectionString: process.env.CONNECTION_STRING,
});

await client.connect();

const result = await client.query('SELECT * FROM "USERS" U WHERE U.id = 1;');
console.log(result.rows);

await client.end();
