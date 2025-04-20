/*
this is where all the company related functions are. some of the functions
include getting all companies, companies of a specific user, etc. these functions are called
by the endpoints defined in company.routes.js
*/

import { client } from '../server.js';

export async function getCompanyDetails(req, res) {
  const query = {
    text: `
      SELECT c.company_id, c.company_name, c.phone_number, c.email, c.description
      FROM Company c
      WHERE c.Company_Id = $1
    `,
    values: [req.params.company_id],
  };

  try {
    const result = await client.query(query);
    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Company not found' });
    }
    res.send(result.rows[0]);
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}
