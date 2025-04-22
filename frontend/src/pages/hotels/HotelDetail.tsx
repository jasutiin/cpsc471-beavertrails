import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function HotelDetail() {
  const { servicetype_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hotel, setHotel] = useState<any>(null);
  const [discount, setDiscount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelRes, couponRes] = await Promise.all([
          fetch(`http://localhost:8080/api/hotels/${servicetype_id}`),
          fetch(`http://localhost:8080/api/coupons/${servicetype_id}`),
        ]);

        const hotelData = await hotelRes.json();
        setHotel(hotelData);

        if (couponRes.ok) {
          const couponData = await couponRes.json();
          setDiscount(Number(couponData.discount));
        }
      } catch (err) {
        console.error('Error fetching hotel or coupon:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [servicetype_id]);

  const confirmBooking = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/bookings/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, servicetype_id }),
      });

      if (res.ok) {
        setShowModal(false);
        setBookingConfirmed(true);
        setHotel((prev: any) => ({ ...prev, status: 'Booked' }));
      } else {
        const errorData = await res.json();
        alert(`Booking failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Something went wrong.');
    }
  };

  const finalPrice = !isNaN(Number(hotel?.price))
    ? discount
      ? Number(hotel.price) - discount
      : Number(hotel.price)
    : null;

  const renderAmenities = (text: string) => {
    return text.split(',').map((item, idx) => {
      const trimmed = item.trim().toLowerCase();
      let emoji = '❓';

      if (trimmed.includes('mini bar')) emoji = '🍸';
      else if (trimmed.includes('ocean view')) emoji = '🌊';
      else if (trimmed.includes('free breakfast')) emoji = '🥐';
      else if (trimmed.includes('pool')) emoji = '🏊‍♂️';
      else if (trimmed.includes('lounge')) emoji = '🛋️';
      else if (trimmed.includes('city view')) emoji = '🌆';
      else if (trimmed.includes('kids play area')) emoji = '🧒';
      else if (trimmed.includes('wifi')) emoji = '📶';

      return (
        <p key={idx} className="flex items-center gap-2 text-sm text-gray-700">
          <span>{emoji}</span> {trimmed.charAt(0).toUpperCase() + trimmed.slice(1)}
        </p>
      );
    });
  };

  if (loading) return <p className="p-6">Loading hotel details...</p>;
  if (!hotel) return <p className="p-6 text-red-500">Hotel not found.</p>;

  return (
    <div className="p-6 h-[calc(100vh-80px)] max-w-5xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold text-gray-800">Hotel Room Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded shadow p-6 text-gray-700">
        <div className="space-y-2">
          <p><span className="font-medium">Company:</span> {hotel.company_name ?? 'Unknown'}</p>
          <p><span className="font-medium">Room Type:</span> {hotel.room_type}</p>
          <p><span className="font-medium">City:</span> {hotel.city}</p>
          <p><span className="font-medium">Bed Type:</span> {hotel.bed_type}</p>
          <p><span className="font-medium">Capacity:</span> {hotel.capacity} guests</p>
          <p><span className="font-medium">Floor:</span> {hotel.floor_number}</p>
          <p><span className="font-medium">Check-in:</span> {new Date(hotel.check_in_time).toLocaleString()}</p>
          <p><span className="font-medium">Check-out:</span> {new Date(hotel.check_out_time).toLocaleString()}</p>
          <p>
            <span className="font-medium">Status:</span>{' '}
            <span className={hotel.status === 'Booked' ? 'text-red-600' : 'text-green-600'}>
              {hotel.status}
            </span>
          </p>
          <p className="text-blue-600 font-medium">
            <span className="font-medium">Price:</span>{' '}
            {finalPrice !== null ? (
              discount ? (
                <>
                  <span className="line-through text-gray-500 mr-1">${Number(hotel.price).toFixed(2)}</span>
                  ${finalPrice.toFixed(2)}{' '}
                  <span className="text-green-600 text-sm">(You save ${discount.toFixed(2)}!)</span>
                </>
              ) : (
                `$${finalPrice.toFixed(2)}/night`
              )
            ) : (
              <span className="text-red-500">Price unavailable</span>
            )}
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-medium mb-1">Amenities:</p>
          {hotel.amenities ? (
            renderAmenities(hotel.amenities)
          ) : (
            <p className="text-gray-500">No amenities listed.</p>
          )}
        </div>
      </div>

      {hotel.status === 'Available' && !bookingConfirmed && (
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Book Now
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-sm text-center space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Booking</h2>
            <p className="text-gray-700">Would you like to book this hotel room?</p>
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
            <p className="text-gray-700">You have successfully booked this hotel room.</p>
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setBookingConfirmed(false)}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
