import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusCard from '@/components/main/buses/BusCard';
import Searchbar from '@/components/main/Searchbar';

export default function Buses() {
  const [buses, setBuses] = useState<any[]>([]);
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
            `http://localhost:8080/api/buses?departure_city=${departureCity}&arrival_city=${arrivalCity}&departure_date=${departureDate}`
          );
          const data = await res.json();
          setBuses(data);
        } catch (err) {
          console.error('Error fetching buses:', err);
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
      <Searchbar selectedTab="buses" />

      <main className="p-6 flex justify-center">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition mb-4"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-semibold mb-6">Available Buses</h2>

          {loading ? (
            <p className="text-gray-500">Loading buses...</p>
          ) : buses.length === 0 ? (
            <p className="text-gray-500">
              No buses available for the selected criteria.
            </p>
          ) : (
            <div className="space-y-4">
              {buses.map((bus) => (
                <BusCard
                  key={bus.servicetype_id}
                  departTime={bus.departure_time}
                  arrivalTime={bus.arrival_time}
                  bus_price={bus.bus_price}
                  departCity={bus.departure_city}
                  arrivalCity={bus.arrival_city}
                  servicetype_id={bus.servicetype_id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
