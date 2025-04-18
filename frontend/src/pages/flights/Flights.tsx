import FlightCard from '@/components/main/flights/FlightCard';

export default function Flights() {
  const flights = [
    {
      airline: 'Delta Airlines',
      departTime: '10:30 AM',
      arrivalTime: '1:45 PM',
      price: 249,
    },
    {
      airline: 'Air Canada',
      departTime: '8:00 AM',
      arrivalTime: '11:15 AM',
      price: 199,
    },
    {
      airline: 'United Airlines',
      departTime: '2:00 PM',
      arrivalTime: '4:30 PM',
      price: 159,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Available Flights</h2>

      <div className="space-y-4">
        {flights.map((flight, index) => (
          <FlightCard
            key={index}
            airline={flight.airline}
            departTime={flight.departTime}
            arrivalTime={flight.arrivalTime}
            price={flight.price}
          />
        ))}
      </div>
    </div>
  );
}
