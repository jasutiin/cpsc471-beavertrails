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

  let query_text = `
    SELECT 
      f.*, 
      c.company_name,
      c.company_id
    FROM Flight f
    JOIN FlightCompany_Offers_Flight fc ON f.ServiceType_Id = fc.ServiceType_Id
    JOIN Company c ON fc.Company_Id = c.Company_Id
  `;

  const query_values = [];
  const conditions = [];

  if (departure_city) {
    conditions.push(`f.departure_city = $${query_values.length + 1}`);
    query_values.push(departure_city);
  }

  if (arrival_city) {
    conditions.push(`f.arrival_city = $${query_values.length + 1}`);
    query_values.push(arrival_city);
  }

  if (departure_date) {
    conditions.push(`DATE(f.departure_time) = $${query_values.length + 1}`);
    query_values.push(departure_date);
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
    console.error(err);
    res.status(500).send('Error fetching flights');
  }
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

export async function bookSeatInFlight(req, res) {
  const { user_id, servicetype_id, seat_number } = req.body;

  try {
    await client.query('BEGIN');

    const paymentQuery = `
      INSERT INTO Payment (ServiceType_Id)
      VALUES ($1)
      RETURNING Payment_Id;
    `;
    const paymentResult = await client.query(paymentQuery, [servicetype_id]);

    const payment_id = paymentResult.rows[0]?.payment_id;
    if (!payment_id) {
      throw new Error('Failed to generate payment_id');
    }

    const paymentBooksServiceQuery = `
      INSERT INTO Payment_Books_Service (Payment_Id, ServiceType_Id)
      VALUES ($1, $2);
    `;
    await client.query(paymentBooksServiceQuery, [payment_id, servicetype_id]);

    const userMakesPaymentQuery = `
      INSERT INTO User_Makes_Payment (User_Id, Payment_Id)
      VALUES ($1, $2);
    `;
    await client.query(userMakesPaymentQuery, [user_id, payment_id]);

    const updateSeatQuery = `
      UPDATE FlightSeat
      SET Is_Taken = TRUE
      WHERE ServiceType_Id = $1 AND Seat_Number = $2 AND Is_Taken = FALSE;
    `;
    const updateResult = await client.query(updateSeatQuery, [
      servicetype_id,
      seat_number,
    ]);

    if (updateResult.rowCount === 0) {
      throw new Error('Seat is already taken or does not exist.');
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Seat successfully booked and payment processed.',
      payment_id: payment_id,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
