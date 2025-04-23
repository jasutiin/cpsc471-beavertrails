import { client } from '../server.js';

/*
This file handles all bus-related functionality.
*/

export async function getBusBookingsOfUser(req, res) {
  const query = {
    text: `
      SELECT b.*
      FROM Bus b
      JOIN Payment_Books_Service pbs ON b.ServiceType_Id = pbs.ServiceType_Id
      JOIN Payment p ON pbs.Payment_Id = p.Payment_Id
      JOIN User_Makes_Payment ump ON p.Payment_Id = ump.Payment_Id
      JOIN Users u ON ump.User_Id = u.User_Id
      WHERE u.User_Id = $1;
    `,
    values: [req.params.user_id],
  };

  try {
    const result = await client.query(query);
    res.send(result.rows);
  } catch (err) {
    console.error('Error fetching user bus bookings:', err);
    res.status(500).send('Server error');
  }
}

export async function getBuses(req, res) {
  const { departure_date, departure_city, arrival_city } = req.query;

  let query_text = `SELECT * FROM Bus`;
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
    conditions.push(`DATE(departure_time) = DATE($${query_values.length + 1})`);
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
    console.error('Error fetching buses:', err);
    res.status(500).send('Server error');
  }
}

export async function getBusByServiceId(req, res) {
  const { servicetype_id } = req.params;

  try {
    const result = await client.query(
      `
      SELECT b.*, c.company_name
      FROM Bus b
      JOIN BusCompany_Offers_Bus bc ON b.ServiceType_Id = bc.ServiceType_Id
      JOIN Company c ON bc.Company_Id = c.Company_Id
      WHERE b.ServiceType_Id = $1;
      `,
      [servicetype_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching bus by service ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getSeatsOfBus(req, res) {
  const { servicetype_id } = req.params;

  try {
    const result = await client.query(
      `
      SELECT bs.*
      FROM BusSeat bs
      WHERE bs.ServiceType_Id = $1 AND bs.Is_Taken = FALSE;
      `,
      [servicetype_id]
    );

    res.send(result.rows);
  } catch (err) {
    console.error('Error fetching seats:', err);
    res.status(500).send('Server error');
  }
}

export async function bookSeatInBus(req, res) {
  const { user_id, servicetype_id, seat_number } = req.body;

  if (!user_id || !servicetype_id) {
    return res.status(400).json({ message: 'Missing booking data' });
  }

  try {
    await client.query('BEGIN');

    const paymentResult = await client.query(
      `INSERT INTO Payment (ServiceType_Id) VALUES ($1) RETURNING Payment_Id`,
      [servicetype_id]
    );

    const payment_id = paymentResult.rows[0]?.payment_id;
    if (!payment_id) throw new Error('Failed to create payment record');

    await client.query(
      `INSERT INTO Payment_Books_Service (Payment_Id, ServiceType_Id) VALUES ($1, $2)`,
      [payment_id, servicetype_id]
    );

    await client.query(
      `INSERT INTO User_Makes_Payment (User_Id, Payment_Id) VALUES ($1, $2)`,
      [user_id, payment_id]
    );

    if (seat_number) {
      const updateResult = await client.query(
        `
        UPDATE BusSeat
        SET Is_Taken = TRUE
        WHERE ServiceType_Id = $1 AND Seat_Number = $2 AND Is_Taken = FALSE;
        `,
        [servicetype_id, seat_number]
      );

      if (updateResult.rowCount === 0) {
        throw new Error('Seat is already taken or does not exist');
      }
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Seat successfully booked and payment processed',
      payment_id,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error booking seat:', err);
    res.status(500).json({ message: err.message || 'Booking failed' });
  }
}
