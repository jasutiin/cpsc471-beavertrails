import { useNavigate } from 'react-router-dom';

type ActivityCardProps = {
  title: string;
  city: string;
  price: number;
  servicetype_id: number;
};

export default function ActivityCard({ title, city, price, servicetype_id }: ActivityCardProps) {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/activities/${servicetype_id}`, {
      state: { title, city, price },
    });
  };

  return (
    <div
      onClick={goToDetails}
      className="border p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p>{city}</p>
      <p className="text-blue-600 font-medium">${price}</p>
    </div>
  );
}
