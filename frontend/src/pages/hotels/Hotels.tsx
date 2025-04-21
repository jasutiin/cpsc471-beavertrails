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
      const searchParams = new URLSearchParams(window.location.search);
      const location = searchParams.get('location');
      const checkInDate = searchParams.get('checkInDate');
      const checkOutDate = searchParams.get('checkOutDate');

      if (location && checkInDate && checkOutDate) {
        try {
          const res = await fetch(
            `http://localhost:8080/api/hotels?location=${location}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
          );
          const data = await res.json();
          setHotels(data);
        } catch (err) {
          console.error('Error fetching hotels:', err);
        }
      }

      setLoading(false);
    };

    fetchHotels();
  }, []);

  return (
    <div className="p-6 h-[calc(100vh-80px)]">
      <Searchbar selectedTab="hotels" />
      <h2 className="text-2xl font-semibold mb-4">Available Hotels</h2>

      {loading ? (
        <p>Loading hotels...</p>
      ) : hotels.length === 0 ? (
        <p>No hotels found.</p>
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
  );
}
