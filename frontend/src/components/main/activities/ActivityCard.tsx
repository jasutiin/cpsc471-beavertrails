type ActivityCardProps = {
  name: string;
  city: string;
  date: string;
  price: number;
};

export default function ActivityCard({
  name,
  city,
  date,
  price,
}: ActivityCardProps) {
  return (
    <div className="border p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p>
        {city} – {date}
      </p>
      <p className="text-blue-600 font-medium">${price}</p>
    </div>
  );
}
