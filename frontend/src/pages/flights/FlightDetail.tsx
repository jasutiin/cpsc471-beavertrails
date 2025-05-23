import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function FlightDetail() {
  const { servicetype_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [seats, setSeats] = useState([]);
  const [flight, setFlight] = useState<any>(null);
  const [discount, setDiscount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const [flightRes, seatsRes, couponRes] = await Promise.all([
          fetch(`http://localhost:8080/api/flights/${servicetype_id}`),
          fetch(`http://localhost:8080/api/flights/${servicetype_id}/seats`),
          fetch(`http://localhost:8080/api/coupons/${servicetype_id}`),
        ]);

        const flightData = await flightRes.json();
        const seatsData = await seatsRes.json();
        setFlight(flightData);
        setSeats(seatsData);

        if (couponRes.ok) {
          const couponData = await couponRes.json();
          setDiscount(Number(couponData.discount));
        } else {
          console.log('No coupon found for this flight');
        }
      } catch (err) {
        console.error('Error fetching flight info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [servicetype_id]);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setShowModal(true);
  };

  const confirmBooking = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/flights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.user_id,
          servicetype_id,
          seat_number: selectedSeat?.seat_number,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setBookingConfirmed(true);
      } else {
        const errorData = await res.json();
        alert(`Booking failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error booking seat:', error);
      alert('Something went wrong during booking.');
    }
  };

  const goToHomepage = () => {
    setBookingConfirmed(false);
    navigate('/');
  };

  const rawPrice = Number(flight?.flight_price);
  const finalPrice =
    discount && !isNaN(rawPrice) ? rawPrice - discount : rawPrice;

  if (loading) return <p className="p-6">Loading flight details...</p>;
  if (!flight) return <p className="p-6 text-red-500">Flight not found.</p>;

  return (
    <div className="h-[calc(100vh-80px)] p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
        >
          ← Back
        </button>

        <h2 className="text-xl font-semibold text-gray-800">
          Flight Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded shadow">
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">From:</span>{' '}
                {flight.departure_city}
              </p>
              <p>
                <span className="font-medium">To:</span> {flight.arrival_city}
              </p>
              <p>
                <span className="font-medium">Departure:</span>{' '}
                {new Date(flight.departure_time).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Arrival:</span>{' '}
                {new Date(flight.arrival_time).toLocaleString()}
              </p>
              <p className="text-blue-600 font-semibold text-lg">
                {typeof rawPrice === 'number' && !isNaN(rawPrice) ? (
                  discount ? (
                    <>
                      <span className="line-through text-gray-500 mr-2">
                        ${rawPrice.toFixed(2)}
                      </span>
                      ${finalPrice.toFixed(2)}{' '}
                      {typeof discount === 'number' && !isNaN(discount) && (
                        <span className="text-green-600 text-sm">
                          (You save ${discount.toFixed(2)}!)
                        </span>
                      )}
                    </>
                  ) : (
                    `$${rawPrice.toFixed(2)}`
                  )
                ) : (
                  <span className="text-red-500">Price unavailable</span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Available Seats</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {seats.map((seat, idx) => (
                <button
                  key={idx}
                  disabled={seat.is_taken}
                  onClick={() => handleSeatClick(seat)}
                  className={`px-3 py-2 text-sm rounded font-medium border ${
                    seat.is_taken
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {seat.seat_number}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-sm text-center space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Confirm Booking
              </h2>
              <p className="text-gray-700">
                Would you like to book this flight with seat{' '}
                <span className="font-bold">{selectedSeat?.seat_number}</span>?
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {bookingConfirmed && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-sm text-center space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Booking Confirmed
              </h2>
              <p className="text-gray-700">
                You have successfully booked seat{' '}
                <span className="font-bold">{selectedSeat?.seat_number}</span>.
              </p>
              <div className="flex justify-center pt-4">
                <button
                  onClick={goToHomepage}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
