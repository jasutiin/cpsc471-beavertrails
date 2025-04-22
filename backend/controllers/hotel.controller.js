/*
this is where all the hotel related functions are. some of the functions
include getting all hotel rooms, hotel rooms of a specific user, etc.
these functions are called by the endpoints defined in hotel.routes.js
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
      WHERE u.User_Id = $1
    `,
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
    conditions.push(`DATE(check_in_time) = $${query_values.length + 1}`);
    query_values.push(check_in_time);
  }

  if (check_out_time) {
    conditions.push(`DATE(check_out_time) = $${query_values.length + 1}`);
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

export async function getHotelById(req, res) {
  const { servicetype_id } = req.params;

  try {
    const result = await client.query(
      'SELECT * FROM HotelRoom WHERE servicetype_id = $1',
      [servicetype_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching hotel by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function bookHotel(req, res) {
  const { servicetype_id, user_id } = req.body;

  if (!servicetype_id || !user_id) {
    return res
      .status(400)
      .json({ message: 'Missing servicetype_id or user_id' });
  }

  try {
    await client.query('BEGIN');

    const paymentResult = await client.query(
      'INSERT INTO Payment (ServiceType_Id) VALUES ($1) RETURNING Payment_Id',
      [servicetype_id]
    );
    const payment_id = paymentResult.rows[0].payment_id;

    await client.query(
      'INSERT INTO User_Makes_Payment (User_Id, Payment_Id) VALUES ($1, $2)',
      [user_id, payment_id]
    );

    await client.query(
      'INSERT INTO Payment_Books_Service (Payment_Id, ServiceType_Id) VALUES ($1, $2)',
      [payment_id, servicetype_id]
    );

    await client.query(
      'UPDATE HotelRoom SET Status = $1 WHERE ServiceType_Id = $2',
      ['Booked', servicetype_id]
    );

    await client.query('COMMIT');
    res.status(200).json({ message: 'Hotel booked successfully!' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error booking hotel:', err);
    res.status(500).json({ message: 'Booking failed due to server error' });
  }
}
