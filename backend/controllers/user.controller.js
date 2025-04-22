/*
this is where all the user related functions are. some of the functions
include getting all users, a specific user's details, etc. these functions are called
by the endpoints defined in user.routes.js
*/

import { client } from '../server.js';

export async function getUsers(req, res) {
  const result = await client.query('SELECT * FROM "users";');
  res.send(result.rows);
}

export async function getUser(req, res) {
  const query = {
    text: `SELECT * FROM "users" WHERE user_id = $1;`,
    values: [req.params.user_id],
  };

  const result = await client.query(query);
  res.send(result.rows);
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const query = {
      text: `SELECT * FROM users WHERE email = $1;`,
      values: [email],
    };

    const result = await client.query(query);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.hashed_password !== password) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    const transformedUser = {
      user_id: user.user_id,
      user_name: user.name,
      user_phone_number: user.phone_number,
      user_email: user.email,
    };

    res.status(200).json(transformedUser);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function deleteUser(req, res) {
  const query = {
    text: `DELETE FROM "users" WHERE user_id = $1`,
    values: [req.params.user_id],
  };

  const result = await client.query(query);
  res.send(result.rows);
}

export async function updateUser(req, res) {
  query_text = '`UPDATE "users" SET';
  values_array = [];
  num = 0; // this is used for the parameter number

  if (req.params.email) {
    num += 1;
    query_text += ` email = $${num}`;
    values_array.push(req.params.email);
  }

  if (req.params.name) {
    num += 1;
    query_text += ` name = $${num}`;
    num > 1 ? (query_text += ',') : (query_text += '');
    values_array.push(req.params.name);
  }

  if (req.params.password) {
    num += 1;
    query_text += ` password = $${num}`;
    num > 1 ? (query_text += ',') : (query_text += '');
    values_array.push(req.params.password);
  }

  num += 1;
  values_array.push(req.params.user_id);
  query_text += ` WHERE user_id = $${num}`;

  const query = {
    text: query_text,
    values: values_array,
  };

  const result = await client.query(query);
  res.status(204).send();
}
