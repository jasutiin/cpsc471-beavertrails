/*
this is where all the flight related functions are. some of the functions
include getting all flights, flights of a specific user, etc. these functions are called
by the endpoints defined in flight.routes.js
*/

import { client } from '../server.js';

export async function getFlightBookingsOfUser(req, res) {
  const query = {
    text: `
      SELECT f.*
      FROM Flight f
      JOIN Payment_Books_Service pbs ON f.ServiceType_Id = pbs.ServiceType_Id
      JOIN Payment p ON pbs.Payment_Id = p.Payment_Id
      JOIN User_Makes_Payment ump ON p.Payment_Id = ump.Payment_Id
      JOIN Users u ON ump.User_Id = u.User_Id
      WHERE u.User_Id = $1;`,
    values: [req.params.user_id],
  };

  const result = await client.query(query);
  res.send(result.rows);
}

export async function getFlights(req, res) {
  const { departure_date, departure_city, arrival_city } = req.query;

  let query_text = `SELECT * FROM Flight`;
  const query_values = [];
  const conditions = [];

  if (departure_city) {
    conditions.push(`departure_city = $${query_values.length + 1}`);
    query_values.push(departure_city);
  }

  if (arrival_city) {
    conditions.push(`arrival_city = $${query_values.length + 1}`);
    query_values.push(arrival_city);
  }

  if (departure_date) {
    conditions.push(`DATE(departure_time) = $${query_values.length + 1}`);
    query_values.push(departure_date);
  }

  if (conditions.length > 0) {
    query_text += ` WHERE ` + conditions.join(' AND ');
  }

  query_text += ';';

  const result = await client.query({
    text: query_text,
    values: query_values,
  });
  res.send(result.rows);
}

export async function getFlightById(req, res) {
  const query = {
    text: `
      SELECT f.*
      FROM Flight f
      WHERE f.ServiceType_Id = $1;`,
    values: [req.params.flight_id],
  };

  const result = await client.query(query);
  res.send(result.rows);
}

export async function getSeatsOfFlight(req, res) {
  const { flightclass } = req.query;
  const { flight_id } = req.params;

  let query_text = `
    SELECT fs.*
    FROM FlightSeat fs
    WHERE fs.ServiceType_Id = $1
    AND fs.Is_Taken = FALSE`;

  const query_values = [flight_id];

  if (flightclass) {
    query_text += ` AND fs.Class = $2`;
    query_values.push(flightclass);
  }

  query_text += ';';

  const result = await client.query({
    text: query_text,
    values: query_values,
  });
  res.send(result.rows);
}
