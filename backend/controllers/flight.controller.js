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
  const { departure_date } = req.query;
  let query_text = `SELECT * FROM Flight`;
  const query_values = [];

  if (departure_date) {
    query_text += ` WHERE DATE(departure_time) = $1`;
    query_values.push(departure_date);
  }

  query_text += ';';
  const query = {
    text: query_text,
    values: query_values,
  };

  const result = await client.query(query);
  res.send(result.rows);
}

export async function getFlightById(req, res) {
  const query = {
    text: `SELECT * FROM Flight WHERE ServiceType_Id = $1;`,
    values: [req.params.flight_id],
  };

  const result = await client.query(query);
  res.send(result.rows[0]);
}

export async function getSeatsOfFlight(req, res) {
  const { flightclass } = req.query;
  let query_text = `
    SELECT Seat_Number, Is_Taken, Class, Seat_Price
    FROM FlightSeat
    WHERE ServiceType_Id = $1
    AND Is_Taken = FALSE`;
  const query_values = [];
  query_values.push(req.params.flight_id);

  if (flightclass) {
    query_text += ` AND class = $2`;
    query_values.push(flightclass);
  }

  query_text += ';';
  const query = {
    text: query_text,
    values: query_values,
  };

  const result = await client.query(query);
  res.send(result.rows);
}
