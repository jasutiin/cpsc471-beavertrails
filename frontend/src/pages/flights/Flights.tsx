import { useEffect, useState } from 'react';
import FlightCard from '@/components/main/flights/FlightCard';
import Navbar from '@/components/main/Navbar';

export default function Flights() {
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);

      const searchParams = new URLSearchParams(window.location.search);
      const departureCity = searchParams.get('from');
      const arrivalCity = searchParams.get('to');
      const departureDate = searchParams.get('departureDate');

      if (departureCity && arrivalCity && departureDate) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/flights?departure_city=${departureCity}&arrival_city=${arrivalCity}&departure_date=${departureDate}`
          );
          const data = await response.json();
          setFlights(data);
        } catch (error) {
          console.error('Error fetching flights:', error);
        }
      } else {
        console.log('Missing required query parameters');
      }

      setLoading(false);
    };

    fetchFlights();
  }, []);

  return (
    <div className="p-6">
      <Navbar selectedTab="flights" />
      <h2 className="text-2xl font-semibold mb-4">Available Flights</h2>

      {loading ? (
        <p>Loading flights...</p>
      ) : flights.length === 0 ? (
        <p>No flights available for the selected criteria.</p>
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
  );
}
