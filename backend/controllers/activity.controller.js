import { client } from '../server.js';

export async function getActivityById(req, res) {
  const { servicetype_id } = req.params;

  try {
    const result = await client.query(
      `SELECT * FROM Activity WHERE servicetype_id = $1`,
      [servicetype_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching activity by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function incrementActivitySignups(req, res) {
  const { servicetype_id } = req.params;
  const { user_id } = req.body;
  console.log(servicetype_id, user_id);

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'SELECT signups, capacity FROM Activity WHERE servicetype_id = $1',
      [servicetype_id]
    );

    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Activity not found' });
    }

    const { signups, capacity } = rows[0];

    if (signups >= capacity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Activity is fully booked' });
    }

    const paymentResult = await client.query(
      `INSERT INTO Payment (ServiceType_Id) VALUES ($1) RETURNING Payment_Id`,
      [servicetype_id]
    );

    const payment_id = paymentResult.rows[0]?.payment_id;
    if (!payment_id) {
      throw new Error('Failed to generate payment_id');
    }

    await client.query(
      `INSERT INTO Payment_Books_Service (Payment_Id, ServiceType_Id) VALUES ($1, $2)`,
      [payment_id, servicetype_id]
    );

    await client.query(
      `INSERT INTO User_Makes_Payment (User_Id, Payment_Id) VALUES ($1, $2)`,
      [user_id, payment_id]
    );

    await client.query(
      'UPDATE Activity SET signups = signups + 1 WHERE servicetype_id = $1',
      [servicetype_id]
    );

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Activity booked and payment processed successfully.',
      payment_id,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error booking activity:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function getActivities(req, res) {
  const { city, date } = req.query;
  console.log(city, date);

  let query_text = `SELECT * FROM Activity`;
  const query_values = [];
  const conditions = [];

  if (city) {
    conditions.push(`city = $${query_values.length + 1}`);
    query_values.push(city);
  }

  if (date) {
    conditions.push(`DATE(start_time) = DATE($${query_values.length + 1})`);
    query_values.push(date);
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
    console.error('Error fetching activities:', err);
    res.status(500).send('Server error');
  }
}
