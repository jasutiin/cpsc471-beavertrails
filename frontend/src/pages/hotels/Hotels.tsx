import HotelCard from '@/components/main/hotels/HotelCard';
import Searchbar from '@/components/main/Searchbar';

export default function Hotels() {
  const hotels = [
    { name: 'Fairmont Banff Springs', location: 'Banff', pricePerNight: 220 },
    { name: 'Hyatt Regency', location: 'Calgary', pricePerNight: 180 },
    { name: 'JW Marriott', location: 'Edmonton', pricePerNight: 200 },
  ];

  return (
    <div className="p-6">
      <Searchbar selectedTab="hotels" />
      <h2 className="text-2xl font-semibold mb-4">Available Hotels</h2>
      <div className="space-y-4">
        {hotels.map((hotel, index) => (
          <HotelCard
            key={index}
            name={hotel.name}
            location={hotel.location}
            pricePerNight={hotel.pricePerNight}
          />
        ))}
      </div>
    </div>
  );
}
