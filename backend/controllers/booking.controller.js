/*
this is where all the booking related functions are. some of the functions
include getting all bookings of a specific user, etc. these functions are called
by the endpoints defined in booking.routes.js
*/

import { client } from '../server.js';

export async function getUserBookings(req, res) {
  const { user_id } = req.params;

  try {
    const query = `
    SELECT 
      ump.user_id,
      p.payment_id,
      pbs.servicetype_id,
      'flight' AS service_type,
      f.departure_city,
      f.arrival_city,
      f.departure_time,
      f.arrival_time,
      f.flightclassoptions,
      f.flight_price,
      c.company_id,
      c.company_name
    FROM user_makes_payment ump
    JOIN payment p ON ump.payment_id = p.payment_id
    JOIN payment_books_service pbs ON p.payment_id = pbs.payment_id
    JOIN flight f ON f.servicetype_id = pbs.servicetype_id
    JOIN flightcompany_offers_flight fc ON fc.servicetype_id = f.servicetype_id
    JOIN company c ON c.company_id = fc.company_id
    WHERE ump.user_id = $1
  
    UNION ALL
  
    SELECT 
      ump.user_id,
      p.payment_id,
      pbs.servicetype_id,
      'bus' AS service_type,
      b.departure_city,
      b.arrival_city,
      b.departure_time,
      b.arrival_time,
      NULL,
      b.bus_price,
      c.company_id,
      c.company_name
    FROM user_makes_payment ump
    JOIN payment p ON ump.payment_id = p.payment_id
    JOIN payment_books_service pbs ON p.payment_id = pbs.payment_id
    JOIN bus b ON b.servicetype_id = pbs.servicetype_id
    JOIN buscompany_offers_bus bc ON bc.servicetype_id = b.servicetype_id
    JOIN company c ON c.company_id = bc.company_id
    WHERE ump.user_id = $1
  
    UNION ALL
  
    SELECT 
      ump.user_id,
      p.payment_id,
      pbs.servicetype_id,
      'hotel' AS service_type,
      NULL,
      NULL,
      h.check_in_time,
      h.check_out_time,
      h.room_type,
      h.price,
      c.company_id,
      c.company_name
    FROM user_makes_payment ump
    JOIN payment p ON ump.payment_id = p.payment_id
    JOIN payment_books_service pbs ON p.payment_id = pbs.payment_id
    JOIN hotelroom h ON h.servicetype_id = pbs.servicetype_id
    JOIN hotelcompany_offers_hotelroom hc ON hc.servicetype_id = h.servicetype_id
    JOIN company c ON c.company_id = hc.company_id
    WHERE ump.user_id = $1
  
    UNION ALL
  
    SELECT 
      ump.user_id,
      p.payment_id,
      pbs.servicetype_id,
      'activity' AS service_type,
      NULL,
      NULL,
      a.start_time,
      a.end_time,
      a.description,
      a.price,
      c.company_id,
      c.company_name
    FROM user_makes_payment ump
    JOIN payment p ON ump.payment_id = p.payment_id
    JOIN payment_books_service pbs ON p.payment_id = pbs.payment_id
    JOIN activity a ON a.servicetype_id = pbs.servicetype_id
    JOIN activitycompany_offers_activity ac ON ac.servicetype_id = a.servicetype_id
    JOIN company c ON c.company_id = ac.company_id
    WHERE ump.user_id = $1;
  `;

    const result = await client.query(query, [user_id]);
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}
