import { client } from '../server.js';

// Get single activity by servicetype_id
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

// increment activity signups
export async function incrementActivitySignups(req, res) {
  const { servicetype_id } = req.params;

  try {
    const { rows } = await client.query(
      'SELECT signups, capacity FROM Activity WHERE servicetype_id = $1',
      [servicetype_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const { signups, capacity } = rows[0];

    if (signups >= capacity) {
      return res.status(400).json({ message: 'Activity is fully booked' });
    }

    await client.query(
      'UPDATE Activity SET signups = signups + 1 WHERE servicetype_id = $1',
      [servicetype_id]
    );

    res.status(200).json({ message: 'Signup recorded!' });
  } catch (err) {
    console.error('Error updating activity signups:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

