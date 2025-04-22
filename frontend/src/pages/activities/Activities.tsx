import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Searchbar from '@/components/main/Searchbar';
import ActivityCard from '@/components/main/activities/ActivityCard';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);

      const searchParams = new URLSearchParams(window.location.search);
      const city = searchParams.get('location');
      const date = searchParams.get('date');

      if (city && date) {
        try {
          const res = await fetch(
            `http://localhost:8080/api/activities?city=${city}&date=${date}`
          );
          const data = await res.json();
          setActivities(data);
        } catch (err) {
          console.error('Error fetching activities:', err);
        }
      } else {
        console.log('Missing required query parameters');
      }

      setLoading(false);
    };

    fetchActivities();
  }, []);

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-50">
      <Searchbar selectedTab="activities" />

      <main className="p-6 flex justify-center">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition mb-4"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-semibold mb-6">Available Activities</h2>

          {loading ? (
            <p className="text-gray-500">Loading activities...</p>
          ) : activities.length === 0 ? (
            <p className="text-gray-500">
              No activities available for the selected criteria.
            </p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <ActivityCard
                  key={index}
                  title={activity.activity_name}
                  city={activity.city}
                  price={activity.price}
                  servicetype_id={activity.servicetype_id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
