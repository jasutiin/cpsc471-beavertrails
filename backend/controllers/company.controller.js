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

export async function loginCompany(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const query = {
      text: `SELECT * FROM company WHERE email = $1;`,
      values: [email],
    };

    const result = await client.query(query);
    const company = result.rows[0];

    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    if (company.hashed_password !== password) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    const transformedCompany = {
      company_id: company.company_id,
      company_name: company.company_name,
      company_phone_number: company.phone_number,
      company_email: company.email,
    };

    console.log(transformedCompany);

    res.status(200).json(transformedCompany);
  } catch (error) {
    console.error('Company login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function signupCompany(req, res) {
  const { name, phone_number, email, password } = req.body;
  console.log(name, phone_number, email, password);

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: 'Name, email, and password are required.' });
  }

  try {
    const checkQuery = {
      text: 'SELECT * FROM company WHERE email = $1;',
      values: [email],
    };
    const existingCompany = await client.query(checkQuery);

    if (existingCompany.rows.length > 0) {
      return res.status(409).json({ error: 'Email already exists.' });
    }

    const insertQuery = {
      text: `
        INSERT INTO company (name, phone_number, email, hashed_password)
        VALUES ($1, $2, $3, $4)
        RETURNING company_id;
      `,
      values: [name, phone_number, email, password],
    };

    const result = await client.query(insertQuery);
    const newCompany = result.rows[0];

    const transformedCompany = {
      company_id: newCompany.company_id,
      company_name: name,
      company_phone_number: phone_number,
      company_email: email,
    };

    res.status(201).json(transformedCompany);
  } catch (err) {
    console.error('Company signup error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
