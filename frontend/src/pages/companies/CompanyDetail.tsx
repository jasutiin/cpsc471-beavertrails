import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function CompanyDetail() {
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    text: '',
    rating: '',
    user_name: '',
    user_email: '',
  });
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
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

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 font-sans">
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
              className="bg-gray-100 p-4 rounded-lg shadow-sm"
            >
              <p className="text-gray-800 italic">"{review.text}"</p>
              <p className="text-gray-600">
                <span className="font-semibold">Rating:</span>{' '}
                {review.rating !== null ? `${review.rating}/5` : 'No rating'}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Reviewer:</span>{' '}
                {review.user_name}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span>{' '}
                {review.user_email}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Write a review
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
