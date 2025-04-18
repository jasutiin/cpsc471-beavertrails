type FlightCardProps = {
  airline: string;
  departTime: string;
  arrivalTime: string;
  price: number | string;
};

export default function FlightCard({
  airline,
  departTime,
  arrivalTime,
  price,
}: FlightCardProps) {
  return (
    <div className="border rounded-2xl p-4 shadow-md max-w-md mx-auto bg-white space-y-2">
      <div className="text-xl font-semibold">{airline}</div>
      <div className="flex justify-between text-sm text-gray-600">
        <div>
          <div className="font-medium">Departure</div>
          <div>{departTime}</div>
        </div>
        <div>
          <div className="font-medium">Arrival</div>
          <div>{arrivalTime}</div>
        </div>
      </div>
      <div className="text-right text-lg font-bold text-blue-600">${price}</div>
    </div>
  );
}
