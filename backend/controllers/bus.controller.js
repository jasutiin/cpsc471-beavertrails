/*
this is where all the bus related functions are. some of the functions
include getting all buses, buses of a specific user, etc. these functions are called
by the endpoints defined in bus.routes.js
*/

import { client } from '../server.js';

export async function getBusBookingsOfUser(req, res) {
  const query = {
    text: `
    SELECT b.*
    FROM Bus b
    JOIN Payment_Books_Service pbs ON b.ServiceType_Id = pbs.ServiceType_Id
    JOIN Payment p ON pbs.Payment_Id = p.Payment_Id
    JOIN User_Makes_Payment ump ON p.Payment_Id = ump.Payment_Id
    JOIN Users u ON ump.User_Id = u.User_Id
    WHERE u.User_Id = $1`,
    values: [req.params.user_id],
  };

  const result = await client.query(query);
  res.send(result.rows);
}

export async function getBuses(req, res) {
  const { date } = req.query;
  let query_text = `SELECT * FROM Bus`;
  const query_values = [];

  if (date) {
    query_text += ` WHERE DATE(departure_time) = $1`;
    query_values.push(date);
  }

  query_text += ';';
  const query = {
    text: query_text,
    values: query_values,
  };

  const result = await client.query(query);
  res.send(result.rows);
}
