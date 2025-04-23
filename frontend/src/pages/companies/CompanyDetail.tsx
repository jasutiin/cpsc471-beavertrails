import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Company {
  name: string;
  phone: string;
  email: string;
  description: string;
}

interface Review {
  review_id: number;
  text: string;
  rating: number;
  user_id: number;
  user_name: string;
  user_email: string;
}

interface FormData {
  text: string;
  rating: string;
  user_name: string;
  user_email: string;
}

export default function CompanyDetail() {
  const [company, setCompany] = useState<Company | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formData, setFormData] = useState<FormData>({
    text: '',
    rating: '',
    user_name: '',
    user_email: '',
  });
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const companyId = useParams().company_id;

  useEffect(() => {
    async function fetchCompanyData() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/companies/${companyId}`
        );
        const data = await response.json();

        setCompany({
          name: data.company_name,
          phone: data.phone_number,
          email: data.email,
          description: data.description,
        });

        const reviewResponse = await fetch(
          `http://localhost:8080/api/companies/${companyId}/reviews`
        );
        const reviewData = await reviewResponse.json();
        setReviews(reviewData);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    }

    fetchCompanyData();
  }, [companyId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch(`http://localhost:8080/api/companies/${companyId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setFormData({ text: '', rating: '', user_name: '', user_email: '' });

      const reviewResponse = await fetch(
        `http://localhost:8080/api/companies/${companyId}/reviews`
      );
      const reviewData = await reviewResponse.json();
      setReviews(reviewData);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleEditReview = async (review: Review) => {
    if (user?.user_id?.toString() !== review.user_id.toString()) {
      return;
    }

    setEditingReview(review);
    setFormData({
      text: review.text,
      rating: review.rating.toString(),
      user_name: review.user_name,
      user_email: review.user_email,
    });
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      await fetch(
        `http://localhost:8080/api/reviews/${editingReview.review_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: formData.text,
            rating: parseInt(formData.rating),
          }),
        }
      );

      setEditingReview(null);
      setFormData({ text: '', rating: '', user_name: '', user_email: '' });

      const reviewResponse = await fetch(
        `http://localhost:8080/api/companies/${companyId}/reviews`
      );
      const reviewData = await reviewResponse.json();
      setReviews(reviewData);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setFormData({ text: '', rating: '', user_name: '', user_email: '' });
  };

  const handleDeleteReview = async (review: Review) => {
    if (user?.user_id?.toString() !== review.user_id.toString()) {
      return;
    }

    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await fetch(`http://localhost:8080/api/reviews/${review.review_id}`, {
        method: 'DELETE',
      });

      const reviewResponse = await fetch(
        `http://localhost:8080/api/companies/${companyId}/reviews`
      );
      const reviewData = await reviewResponse.json();
      setReviews(reviewData);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition mb-4"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{company.name}</h1>

      <div className="space-y-4 mb-12">
        <p className="text-gray-700">
          <span className="font-semibold">Phone:</span> {company.phone}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Email:</span> {company.email}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Description:</span>{' '}
          {company.description}
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.review_id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600">{review.text}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Rating: {review.rating}/5
                  </p>
                  <p className="text-sm text-gray-500">
                    By: {review.user_name} ({review.user_email})
                  </p>
                </div>
                {user?.user_id?.toString() === review.user_id.toString() && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {editingReview ? 'Edit Review' : 'Write a review'}
        </h2>
        <form
          onSubmit={editingReview ? handleUpdateReview : handleSubmit}
          className="space-y-4"
        >
          <textarea
            name="text"
            placeholder="Write your review..."
            value={formData.text}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="number"
            name="rating"
            placeholder="Rating (1–5)"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            className="w-full border border-gray-300 p-2 rounded"
          />
          {!editingReview && (
            <>
              <input
                type="text"
                name="user_name"
                placeholder="Your name"
                value={formData.user_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
              <input
                type="email"
                name="user_email"
                placeholder="Your email"
                value={formData.user_email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </>
          )}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {editingReview ? 'Update Review' : 'Submit Review'}
            </button>
            {editingReview && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
