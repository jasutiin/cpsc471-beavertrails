import { client } from '../server.js';

export async function getCompanyFlights(req, res) {
  const { company_id } = req.params;

  try {
    const query = {
      text: `
        SELECT f.*, c.company_name
        FROM Flight f
        JOIN FlightCompany_Offers_Flight fcof ON f.ServiceType_Id = fcof.ServiceType_Id
        JOIN Company c ON fcof.Company_Id = c.Company_Id
        WHERE c.Company_Id = $1
      `,
      values: [company_id],
    };

    const result = await client.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching company flights:', err);
    res.status(500).json({ error: 'Failed to fetch company flights' });
  }
}

export async function getCompanyBuses(req, res) {
  const { company_id } = req.params;

  try {
    const query = {
      text: `
        SELECT b.*, c.company_name
        FROM Bus b
        JOIN BusCompany_Offers_Bus bcob ON b.ServiceType_Id = bcob.ServiceType_Id
        JOIN Company c ON bcob.Company_Id = c.Company_Id
        WHERE c.Company_Id = $1
      `,
      values: [company_id],
    };

    const result = await client.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching company buses:', err);
    res.status(500).json({ error: 'Failed to fetch company buses' });
  }
}

export async function getCompanyHotelRooms(req, res) {
  const { company_id } = req.params;

  try {
    const query = {
      text: `
        SELECT h.*, c.company_name
        FROM HotelRoom h
        JOIN HotelCompany_Offers_HotelRoom hcoh ON h.ServiceType_Id = hcoh.ServiceType_Id
        JOIN Company c ON hcoh.Company_Id = c.Company_Id
        WHERE c.Company_Id = $1
      `,
      values: [company_id],
    };

    const result = await client.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching company hotel rooms:', err);
    res.status(500).json({ error: 'Failed to fetch company hotel rooms' });
  }
}

export async function getCompanyActivities(req, res) {
  const { company_id } = req.params;

  try {
    const query = {
      text: `
        SELECT a.*, c.company_name
        FROM Activity a
        JOIN ActivityCompany_Offers_Activity acoa ON a.ServiceType_Id = acoa.ServiceType_Id
        JOIN Company c ON acoa.Company_Id = c.Company_Id
        WHERE c.Company_Id = $1
      `,
      values: [company_id],
    };

    const result = await client.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching company activities:', err);
    res.status(500).json({ error: 'Failed to fetch company activities' });
  }
}
