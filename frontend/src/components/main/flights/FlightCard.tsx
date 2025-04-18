type FlightCardProps = {
  departTime: string;
  arrivalTime: string;
  arrivalCity: string;
  departCity: string;
  price: number | string;
};

export default function FlightCard({
  departTime,
  arrivalTime,
  price,
  arrivalCity,
  departCity,
}: FlightCardProps) {
  const depart = new Date(departTime);
  const arrival = new Date(arrivalTime);

  const formattedDepart = depart.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedArrival = arrival.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const durationMs = arrival.getTime() - depart.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
  );
  const formattedDuration = `${durationHours}h ${durationMinutes}m`;

  return (
    <div className="border rounded-2xl p-4 shadow-md max-w-md mx-auto bg-white">
      <div className="flex items-center justify-between text-sm text-gray-700">
        <div className="text-left">
          <div className="text-lg font-semibold">
            {formattedDepart} — {formattedArrival}
          </div>
          <div className="text-gray-500">
            {departCity} → {arrivalCity}
          </div>
        </div>

        <div className="text-center text-gray-600 text-sm whitespace-nowrap">
          {formattedDuration}
        </div>

        <div className="text-right text-blue-600 font-bold text-lg">
          ${price}
        </div>
      </div>
    </div>
  );
}
