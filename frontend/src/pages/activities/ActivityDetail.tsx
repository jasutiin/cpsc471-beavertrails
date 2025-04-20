import { useParams } from 'react-router-dom';

export default function ActivityDetail() {
  const { servicetype_id } = useParams();

  return (
    <div className="h-[calc(100vh-80px)] p-6">
      <h1 className="text-2xl font-semibold mb-2">Activity Detail</h1>
      <p>
        Activity ID: <span className="font-mono">{servicetype_id}</span>
      </p>
    </div>
  );
}
