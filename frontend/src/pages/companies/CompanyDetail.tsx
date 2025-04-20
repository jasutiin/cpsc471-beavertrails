import { useNavigate } from 'react-router-dom';

export default function CompanyDetail() {
  const company = {
    name: 'Tech Innovators Inc.',
    phone: '123-456-7890',
    email: 'info@techinnovators.com',
    description: 'A leading company in tech innovation and software solutions.',
  };

  const reviews = [
    {
      text: 'Great flight experience!',
      rating: null,
      reviewer: 'Alice Johnson',
    },
    {
      text: 'The bus ride was comfortable.',
      rating: 5,
      reviewer: 'Michael Lee',
    },
    {
      text: 'The hotel service was excellent.',
      rating: 4,
      reviewer: 'Sofia Martinez',
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="p-6 font-sans">
      <button
        onClick={() => navigate(-1)}
        className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition mb-4"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{company.name}</h1>

      <div className="space-y-4 mb-6">
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

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-gray-800 italic">"{review.text}"</p>
              <p className="text-gray-600">
                <span className="font-semibold">Rating:</span>{' '}
                {review.rating !== null ? `${review.rating}/5` : 'No rating'}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Reviewer:</span>{' '}
                {review.reviewer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
