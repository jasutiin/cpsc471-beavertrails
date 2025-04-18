import { useParams } from 'react-router-dom';

export default function HotelDetail() {
  const { servicetype_id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Hotel Detail</h1>
      <p>
        Hotel ID: <span className="font-mono">{servicetype_id}</span>
      </p>
    </div>
  );
}
