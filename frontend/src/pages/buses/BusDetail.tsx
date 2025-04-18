import { useParams } from 'react-router-dom';

export default function BusDetail() {
  const { servicetype_id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Bus Detail</h1>
      <p>
        Bus ID: <span className="font-mono">{servicetype_id}</span>
      </p>
    </div>
  );
}
