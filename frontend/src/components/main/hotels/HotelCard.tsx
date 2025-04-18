type HotelCardProps = {
  name: string;
  location: string;
  pricePerNight: number;
};

export default function HotelCard({
  name,
  location,
  pricePerNight,
}: HotelCardProps) {
  return (
    <div className="border p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p>{location}</p>
      <p className="text-blue-600 font-medium">${pricePerNight}/night</p>
    </div>
  );
}
