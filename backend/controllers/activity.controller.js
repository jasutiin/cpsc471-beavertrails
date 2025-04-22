import { client } from '../server.js';

// get single activity by servicetype_id
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
