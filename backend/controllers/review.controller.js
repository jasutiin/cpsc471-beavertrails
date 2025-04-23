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
        u.User_Id,
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

export async function postReviewForCompany(req, res) {
  const companyId = req.params.company_id;
  const { text, rating, user_name, user_email } = req.body;

  try {
    let userResult = await client.query(
      'SELECT User_Id FROM Users WHERE Email = $1',
      [user_email]
    );

    let userId;
    if (userResult.rows.length === 0) {
      const insertUserResult = await client.query(
        'INSERT INTO Users (Name, Email) VALUES ($1, $2) RETURNING User_Id',
        [user_name, user_email]
      );
      userId = insertUserResult.rows[0].user_id;
    } else {
      userId = userResult.rows[0].user_id;
    }

    const insertReviewResult = await client.query(
      'INSERT INTO Review (Text, Rating) VALUES ($1, $2) RETURNING Review_Id',
      [text, rating]
    );
    const reviewId = insertReviewResult.rows[0].review_id;

    await client.query(
      'INSERT INTO Review_Rates_Company (Review_Id, Company_Id) VALUES ($1, $2)',
      [reviewId, companyId]
    );

    await client.query(
      'INSERT INTO User_Writes_Review (User_Id, Review_Id) VALUES ($1, $2)',
      [userId, reviewId]
    );

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error posting review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function updateReview(req, res) {
  const reviewId = req.params.review_id;
  const { text, rating } = req.body;
  console.log(reviewId);
  console.log(text);
  console.log(rating);

  try {
    const query = {
      text: `
        UPDATE Review
        SET Text = $1,
            Rating = $2
        WHERE Review_Id = $3
        RETURNING *
      `,
      values: [text, rating, reviewId],
    };

    const result = await client.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res
      .status(200)
      .json({ message: 'Review updated successfully', review: result.rows[0] });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function deleteReview(req, res) {
  const reviewId = req.params.review_id;

  try {
    await client.query(
      'DELETE FROM Review_Rates_Company WHERE Review_Id = $1',
      [reviewId]
    );
    await client.query('DELETE FROM User_Writes_Review WHERE Review_Id = $1', [
      reviewId,
    ]);

    const result = await client.query(
      'DELETE FROM Review WHERE Review_Id = $1 RETURNING *',
      [reviewId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
