import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from '@/components/main/hotels/HotelCard';
import Searchbar from '@/components/main/Searchbar';

export default function Hotels() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);

      const searchParams = new URLSearchParams(window.location.search);
      const location = searchParams.get('location');
      const checkInDate = searchParams.get('departureDate');
      const checkOutDate = searchParams.get('arrivalDate');

      if (location && checkInDate && checkOutDate) {
        try {
          const res = await fetch(
            `http://localhost:8080/api/hotels?city=${location}&check_in_time=${checkInDate}&check_out_time=${checkOutDate}`
          );
          const data = await res.json();
          setHotels(data);
        } catch (err) {
          console.error('Error fetching hotels:', err);
        }
      } else {
        console.log('Missing required query parameters');
      }

      setLoading(false);
    };

    fetchHotels();
  }, []);

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-50">
      <Searchbar selectedTab="hotels" />

      <main className="p-6 flex justify-center">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition mb-4"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-semibold mb-6">Available Hotels</h2>

          {loading ? (
            <p className="text-gray-500">Loading hotels...</p>
          ) : hotels.length === 0 ? (
            <p className="text-gray-500">
              No hotels available for the selected criteria.
            </p>
          ) : (
            <div className="space-y-4">
              {hotels.map((hotel, index) => (
                <HotelCard
                  key={index}
                  name={hotel.room_type}
                  location={hotel.city}
                  pricePerNight={hotel.price}
                  servicetype_id={Number(hotel.servicetype_id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
