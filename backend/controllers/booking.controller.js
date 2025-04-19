/*
this is where all the booking related functions are. some of the functions
include getting all bookings of a specific user, etc. these functions are called
by the endpoints defined in booking.routes.js
*/

import { client } from '../server.js';

// not complete, this database schema sucks imma redesign it
export async function getUserBookings(req, res) {
  const { id } = req.params;

  try {
    const query = `
    SELECT 
      pbs.payment_id,
      CASE
        WHEN f.ServiceType_Id IS NOT NULL THEN 'Flight'
        WHEN b.ServiceType_Id IS NOT NULL THEN 'Bus'
        WHEN h.ServiceType_Id IS NOT NULL THEN 'HotelRoom'
        WHEN a.ServiceType_Id IS NOT NULL THEN 'Activity'
        ELSE 'Unknown'
      END AS service_type
    FROM user_makes_payment ump
    JOIN payment p ON ump.payment_id = p.payment_id
    JOIN payment_books_service pbs ON p.payment_id = pbs.payment_id
    LEFT JOIN flight f ON p.serviceType_id = f.serviceType_id
    LEFT JOIN bus b ON p.serviceType_id = b.serviceType_id
    LEFT JOIN hotelroom h ON p.serviceType_id = h.serviceType_id
    LEFT JOIN activity a ON p.serviceType_id = a.serviceType_id
    WHERE ump.user_id = $1;
  `;

    const result = await client.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}
