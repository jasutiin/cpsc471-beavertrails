import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function BusDetail() {
  const { servicetype_id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state);

  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/buses/${servicetype_id}/seats`
        );
        const data = await res.json();
        setSeats(data);
      } catch (err) {
        console.error('Error fetching seats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [servicetype_id]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <p className="text-gray-500">Loading bus details...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
        >
          ← Back
        </button>

        <h2 className="text-xl font-semibold text-gray-800">Bus Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded shadow">
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">From:</span> {state?.departCity}
              </p>
              <p>
                <span className="font-medium">To:</span> {state?.arrivalCity}
              </p>
              <p>
                <span className="font-medium">Departure:</span>{' '}
                {new Date(state?.departTime).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Arrival:</span>{' '}
                {new Date(state?.arrivalTime).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Price:</span> ${state?.bus_price}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Available Seats</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {seats.map((seat, idx) => (
                <button
                  key={idx}
                  disabled={seat.is_taken}
                  className={`px-3 py-2 text-sm rounded font-medium border ${
                    seat.is_taken
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {seat.seat_number}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
