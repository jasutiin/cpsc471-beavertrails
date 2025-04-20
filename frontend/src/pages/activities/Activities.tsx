import ActivityCard from '@/components/main/activities/ActivityCard';
import Searchbar from '@/components/main/Searchbar';

export default function Activities() {
  const activities = [
    { name: 'Banff Gondola Ride', city: 'Banff', date: 'May 3', price: 35 },
    { name: 'Calgary Zoo', city: 'Calgary', date: 'April 25', price: 20 },
    { name: 'Museum Tour', city: 'Edmonton', date: 'May 10', price: 18 },
  ];

  return (
    <div className="h-[calc(100vh-80px)] p-6">
      <Searchbar selectedTab="activities" />
      <h2 className="text-2xl font-semibold mb-4">Available Activities</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <ActivityCard
            key={index}
            name={activity.name}
            city={activity.city}
            date={activity.date}
            price={activity.price}
          />
        ))}
      </div>
    </div>
  );
}
