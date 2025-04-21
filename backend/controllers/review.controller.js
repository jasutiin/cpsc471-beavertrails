/*
this is where all the hotel related functions are. some of the functions
include getting all hotel rooms, hotel rooms of a specific user, etc.
these functions are called by the endpoints defined in hotel.routes.js
*/

import { client } from '../server.js';

export async function getReviewsOfCompany(req, res) {
  const companyId = req.params.company_id;

  const query = {
    text: `
      SELECT 
        r.Review_Id,
        r.Text,
        r.Rating,
        u.Name AS user_name,
        u.Email AS user_email
      FROM Review r
      JOIN Review_Rates_Company rrc ON r.Review_Id = rrc.Review_Id
      JOIN User_Writes_Review uwr ON r.Review_Id = uwr.Review_Id
      JOIN Users u ON uwr.User_Id = u.User_Id
      WHERE rrc.Company_Id = $1
    `,
    values: [companyId],
  };

  try {
    const result = await client.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching company reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
