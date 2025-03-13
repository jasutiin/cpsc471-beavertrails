import { client } from './server.js';

// this is where all the sql queries are located

export async function testEndpoint(req, res) {
  const result = await client.query('SELECT * FROM "USERS" U WHERE U.id = 1;');
  res.send(result.rows);
}
