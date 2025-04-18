type BusCardProps = {
  company: string;
  departTime: string;
  arrivalTime: string;
  price: number;
};

export default function BusCard({
  company,
  departTime,
  arrivalTime,
  price,
}: BusCardProps) {
  return (
    <div className="border p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold">{company}</h3>
      <p>
        {departTime} → {arrivalTime}
      </p>
      <p className="text-blue-600 font-medium">${price}</p>
    </div>
  );
}
