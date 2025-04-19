/*
this is where all the hotel related functions are. some of the functions
include getting all hotel rooms, hotel rooms of a specific user, etc. these functions are called
by the endpoints defined in hotel.routes.js
*/

import { client } from '../server.js';

export async function getHotelBookingsOfUser(req, res) {
  const query = {
    text: `
    SELECT h.*
    FROM HotelRoom h
    JOIN Payment_Books_Service pbs ON h.ServiceType_Id = pbs.ServiceType_Id
    JOIN Payment p ON pbs.Payment_Id = p.Payment_Id
    JOIN User_Makes_Payment ump ON p.Payment_Id = ump.Payment_Id
    JOIN Users u ON ump.User_Id = u.User_Id
    WHERE u.User_Id = $1`,
    values: [req.params.user_id],
  };

  const result = await client.query(query);
  res.send(result.rows);
}

export async function getAllHotels(req, res) {
  const { city, check_in_time, check_out_time } = req.query;

  let query_text = `SELECT * FROM HotelRoom`;
  const query_values = [];
  const conditions = [];

  if (city) {
    conditions.push(`city = $${query_values.length + 1}`);
    query_values.push(city);
  }

  if (check_in_time) {
    conditions.push(`check_in_time <= $${query_values.length + 1}`);
    query_values.push(check_in_time);
  }

  if (check_out_time) {
    conditions.push(`check_out_time >= $${query_values.length + 1}`);
    query_values.push(check_out_time);
  }

  if (conditions.length > 0) {
    query_text += ` WHERE ` + conditions.join(' AND ');
  }

  query_text += ';';

  try {
    const result = await client.query({
      text: query_text,
      values: query_values,
    });

    res.send(result.rows);
  } catch (err) {
    console.error('Error querying hotels:', err);
    res.status(500).send('Internal Server Error');
  }
}
