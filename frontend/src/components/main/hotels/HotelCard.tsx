import { useNavigate } from 'react-router-dom';

type HotelCardProps = {
  name: string;
  location: string;
  pricePerNight: number;
  servicetype_id: number;
};

export default function HotelCard({
  name,
  location,
  pricePerNight,
  servicetype_id,
}: HotelCardProps) {
  const navigate = useNavigate();

  const goToDetails = () => {
    console.log('HOTEL CARD CLICKED:', servicetype_id);
    navigate(`/hotels/${servicetype_id}`, {
      state: {
        hotelName: name,
        location,
        pricePerNight,
      },
    });
  };

  return (
    <div
      onClick={goToDetails}
      className="border p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold">{name}</h3>
      <p>{location}</p>
      <p className="text-blue-600 font-medium">${pricePerNight}/night</p>
    </div>
  );
}

