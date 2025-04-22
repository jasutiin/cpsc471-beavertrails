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
      const searchParams = new URLSearchParams(window.location.search);
      const city = searchParams.get('location');
      const date = searchParams.get('activityDate');

      if (city && date) {
        try {
          const res = await fetch(`http://localhost:8080/api/activities?city=${city}&date=${date}`);
          const data = await res.json();
          setActivities(data);
        } catch (err) {
          console.error('Error fetching activities:', err);
        }
      }

      setLoading(false);
    };

    fetchActivities();
  }, []);

  return (
    <div className="p-6 h-[calc(100vh-80px)]">
      <Searchbar selectedTab="activities" />
      <h2 className="text-2xl font-semibold mb-4">Available Activities</h2>

      {loading ? (
        <p>Loading activities...</p>
      ) : activities.length === 0 ? (
        <p>No activities found.</p>
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
  );
}

