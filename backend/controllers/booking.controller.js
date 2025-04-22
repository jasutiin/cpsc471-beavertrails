/*
this is where all the booking related functions are. some of the functions
include getting all bookings of a specific user, etc. these functions are called
by the endpoints defined in booking.routes.js
*/

import { client } from '../server.js';

export async function getUserFlightBookings(req, res) {
  const { user_id } = req.params;

  try {
    const query = `
      SELECT F.*, 'flight' AS service_type, C.Company_Name
      FROM Users U
      JOIN User_Makes_Payment UMP ON U.User_Id = UMP.User_Id
      JOIN Payment P ON UMP.Payment_Id = P.Payment_Id
      JOIN Flight F ON P.ServiceType_Id = F.ServiceType_Id
      JOIN FlightCompany_Offers_Flight FC ON F.ServiceType_Id = FC.ServiceType_Id
      JOIN Company C ON FC.Company_Id = C.Company_Id
      WHERE U.User_Id = $1;
    `;

    const result = await client.query(query, [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching flight bookings:', err);
    res.status(500).json({ error: 'Failed to fetch flight bookings' });
  }
}

export async function getUserBusBookings(req, res) {
  const { user_id } = req.params;

  try {
    const query = `
      SELECT B.*, 'bus' AS service_type, C.Company_Name
      FROM Users U
      JOIN User_Makes_Payment UMP ON U.User_Id = UMP.User_Id
      JOIN Payment P ON UMP.Payment_Id = P.Payment_Id
      JOIN Bus B ON P.ServiceType_Id = B.ServiceType_Id
      JOIN BusCompany_Offers_Bus BC ON B.ServiceType_Id = BC.ServiceType_Id
      JOIN Company C ON BC.Company_Id = C.Company_Id
      WHERE U.User_Id = $1;
    `;

    const result = await client.query(query, [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching bus bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bus bookings' });
  }
}

export async function getUserHotelBookings(req, res) {
  const { user_id } = req.params;

  try {
    const query = `
      SELECT HR.*, 'hotel' AS service_type, C.Company_Name
      FROM Users AS U
      JOIN User_Makes_Payment AS UMP ON U.User_Id = UMP.User_Id
      JOIN Payment AS P ON UMP.Payment_Id = P.Payment_Id
      JOIN HotelRoom AS HR ON P.ServiceType_Id = HR.ServiceType_Id
      JOIN HotelCompany_Offers_HotelRoom AS HC ON HR.ServiceType_Id = HC.ServiceType_Id
      JOIN Company AS C ON HC.Company_Id = C.Company_Id
      WHERE U.User_Id = $1;
    `;

    const result = await client.query(query, [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching hotel bookings:', err);
    res.status(500).json({ error: 'Failed to fetch hotel bookings' });
  }
}

export async function getUserActivityBookings(req, res) {
  const { user_id } = req.params;

  try {
    const query = `
      SELECT A.*, 'activity' AS service_type
      FROM Users AS U
      JOIN User_Makes_Payment AS UMP ON U.User_Id = UMP.User_Id
      JOIN Payment AS P ON UMP.Payment_Id = P.Payment_Id
      JOIN Activity AS A ON P.ServiceType_Id = A.ServiceType_Id
      WHERE U.User_Id = $1;
    `;

    const result = await client.query(query, [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching activity bookings:', err);
    res.status(500).json({ error: 'Failed to fetch activity bookings' });
  }
}
