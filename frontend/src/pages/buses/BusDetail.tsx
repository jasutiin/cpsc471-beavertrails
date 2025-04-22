import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function BusDetail() {
  const { servicetype_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bus, setBus] = useState<any>(null);
  const [seats, setSeats] = useState([]);
  const [discount, setDiscount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const [busRes, seatsRes, couponRes] = await Promise.all([
          fetch(`http://localhost:8080/api/buses/${servicetype_id}`),
          fetch(`http://localhost:8080/api/buses/${servicetype_id}/seats`),
          fetch(`http://localhost:8080/api/coupons/${servicetype_id}`),
        ]);

        const busData = await busRes.json();
        const seatData = await seatsRes.json();

        setBus(busData);
        setSeats(seatData);

        if (couponRes.ok) {
          const couponData = await couponRes.json();
          setDiscount(Number(couponData.discount));
        }
      } catch (err) {
        console.error('Error fetching bus details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [servicetype_id]);

  const confirmBooking = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/buses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          servicetype_id,
          seat_number: selectedSeat?.seat_number ?? null,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setBookingConfirmed(true);
      } else {
        const errorData = await res.json();
        alert(`Booking failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Something went wrong.');
    }
  };

  const goToHomepage = () => {
    setBookingConfirmed(false);
    navigate('/');
  };

  const parsedPrice = Number(bus?.bus_price);
  const finalPrice = !isNaN(parsedPrice)
    ? discount
      ? parsedPrice - discount
      : parsedPrice
    : null;

  const spotsLeft = bus?.seats_available ?? 0;
  const totalCapacity = bus?.capacity ?? 0;

  const renderAmenities = (text: string) => {
    return text.split(',').map((item, idx) => {
      const trimmed = item.trim().toLowerCase();
      let emoji = '❓';

      if (trimmed.includes('wifi')) emoji = '📶';
      else if (trimmed.includes('usb')) emoji = '🔌';
      else if (trimmed.includes('power')) emoji = '🔋';
      else if (trimmed.includes('seat')) emoji = '💺';
      else if (trimmed.includes('air')) emoji = '❄️';
      else if (trimmed.includes('window')) emoji = '🪟';
      else if (trimmed.includes('restroom')) emoji = '🚻';
      else if (trimmed.includes('extra legroom')) emoji = '🦵';

      return (
        <p key={idx} className="flex items-center gap-2 text-sm text-gray-700">
          <span>{emoji}</span> {trimmed.charAt(0).toUpperCase() + trimmed.slice(1)}
        </p>
      );
    });
  };

  if (loading) return <p className="p-6">Loading bus details...</p>;
  if (!bus) return <p className="p-6 text-red-500">Bus not found.</p>;

  return (
    <div className="h-[calc(100vh-80px)] p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
        >
          ← Back
        </button>

        <h2 className="text-xl font-semibold text-gray-800">Bus Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded shadow space-y-2 text-gray-700">
            <p><span className="font-medium">Company:</span> {bus.company_name ?? 'Unknown'}</p>
            <p><span className="font-medium">From:</span> {bus.departure_city}</p>
            <p><span className="font-medium">To:</span> {bus.arrival_city}</p>
            <p><span className="font-medium">Departure:</span> {new Date(bus.departure_time).toLocaleString()}</p>
            <p><span className="font-medium">Arrival:</span> {new Date(bus.arrival_time).toLocaleString()}</p>
            <p><span className="font-medium">Capacity:</span> {totalCapacity} seats</p>
            <p>
              <span className="font-medium">Spots left:</span>{' '}
              <span className={spotsLeft > 10 ? 'text-green-600' : spotsLeft > 0 ? 'text-yellow-600' : 'text-red-600'}>
                {spotsLeft} spots left
              </span>
            </p>
            <p className="text-blue-600 font-medium">
              <span className="font-medium">Price:</span>{' '}
              {finalPrice !== null ? (
                discount ? (
                  <>
                    <span className="line-through text-gray-500 mr-1">${parsedPrice.toFixed(2)}</span>
                    ${finalPrice.toFixed(2)}{' '}
                    <span className="text-green-600 text-sm">(You save ${discount.toFixed(2)}!)</span>
                  </>
                ) : (
                  `$${finalPrice.toFixed(2)}`
                )
              ) : (
                <span className="text-red-500">Price unavailable</span>
              )}
            </p>

            <div className="mt-4">
              <p className="font-medium mb-1">Amenities:</p>
              {bus.amenities ? renderAmenities(bus.amenities) : <p className="text-gray-500">No amenities listed.</p>}
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Available Seats</h2>
            {seats.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {seats.map((seat, idx) => (
                  <button
                    key={idx}
                    disabled={seat.is_taken}
                    onClick={() => {
                      setSelectedSeat(seat);
                      setShowModal(true);
                    }}
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
            ) : (
              <>
                <p className="text-gray-600 text-sm mb-4">
                  Seat selection not available for this bus ride. You will be assigned a random seat.
                </p>
                <button
                  onClick={confirmBooking}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Book Now
                </button>
              </>
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-sm text-center space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Confirm Booking</h2>
              <p className="text-gray-700">
                Would you like to book seat <span className="font-bold">{selectedSeat?.seat_number}</span>?
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
              <h2 className="text-lg font-semibold text-gray-800">Booking Confirmed</h2>
              <p className="text-gray-700">
                You have successfully booked your seat.
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
