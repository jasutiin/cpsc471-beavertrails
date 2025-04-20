import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlightCard from '@/components/main/flights/FlightCard';
import Searchbar from '@/components/main/Searchbar';

export default function Flights() {
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);

      const searchParams = new URLSearchParams(window.location.search);
      const departureCity = searchParams.get('from');
      const arrivalCity = searchParams.get('to');
      const departureDate = searchParams.get('departureDate');

      if (departureCity && arrivalCity && departureDate) {
        try {
          const res = await fetch(
            `http://localhost:8080/api/flights?departure_city=${departureCity}&arrival_city=${arrivalCity}&departure_date=${departureDate}`
          );
          const data = await res.json();
          setFlights(data);
        } catch (err) {
          console.error('Error fetching flights:', err);
        }
      } else {
        console.log('Missing required query parameters');
      }

      setLoading(false);
    };

    fetchFlights();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Searchbar selectedTab="flights" />

      <main className="p-6 flex justify-center">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition mb-4"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-semibold mb-6">Available Flights</h2>

          {loading ? (
            <p className="text-gray-500">Loading flights...</p>
          ) : flights.length === 0 ? (
            <p className="text-gray-500">
              No flights available for the selected criteria.
            </p>
          ) : (
            <div className="space-y-4">
              {flights.map((flight) => (
                <FlightCard
                  key={flight.servicetype_id}
                  departTime={flight.departure_time}
                  arrivalTime={flight.arrival_time}
                  price={flight.flight_price}
                  departCity={flight.departure_city}
                  arrivalCity={flight.arrival_city}
                  servicetype_id={flight.servicetype_id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
