import BusCard from '@/components/main/buses/BusCard';
import Navbar from '@/components/main/Navbar';

export default function Buses() {
  const buses = [
    {
      company: 'Greyhound',
      departTime: '9:00 AM',
      arrivalTime: '12:30 PM',
      price: 45,
    },
    {
      company: 'Red Arrow',
      departTime: '1:00 PM',
      arrivalTime: '4:15 PM',
      price: 55,
    },
    {
      company: 'Ebus',
      departTime: '6:00 PM',
      arrivalTime: '9:00 PM',
      price: 50,
    },
  ];

  return (
    <div className="p-6">
      <Navbar selectedTab="buses" />
      <h2 className="text-2xl font-semibold mb-4">Available Buses</h2>
      <div className="space-y-4">
        {buses.map((bus, index) => (
          <BusCard
            key={index}
            company={bus.company}
            departTime={bus.departTime}
            arrivalTime={bus.arrivalTime}
            price={bus.price}
          />
        ))}
      </div>
    </div>
  );
}
