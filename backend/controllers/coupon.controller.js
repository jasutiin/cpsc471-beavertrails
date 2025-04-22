import { client } from '../server.js';

// works for activities, flights, buses, hotels etc.
export async function getCouponByServiceId(req, res) {
  const { servicetype_id } = req.params;

  try {
    const result = await client.query(
      `
      SELECT c.discount
      FROM Coupon c
      JOIN coupon_applies_to_service cas ON c.coupon_id = cas.coupon_id
      WHERE cas.servicetype_id = $1
      `,
      [servicetype_id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ discount: null });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching coupon:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
