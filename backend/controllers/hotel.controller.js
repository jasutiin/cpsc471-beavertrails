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
  const query = {
    text: `SELECT * FROM Hotel;`,
  };

  const result = await client.query(query);
  res.send(result.rows);
}
