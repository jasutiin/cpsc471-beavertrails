import { useParams, useNavigate } from 'react-router-dom';

export default function FlightDetail() {
  const { servicetype_id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold mb-2">Flight Detail</h1>
      <p>
        Flight ID: <span className="font-mono">{servicetype_id}</span>
      </p>
    </div>
  );
}
