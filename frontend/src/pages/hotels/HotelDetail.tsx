import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function HotelDetail() {
  const { servicetype_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/hotels/${servicetype_id}`
        );
        const data = await res.json();
        setHotel(data);
      } catch (err) {
        console.error('Error fetching hotel details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
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

  if (loading) return <p className="p-6">Loading hotel details...</p>;
  if (!hotel) return <p className="p-6 text-red-500">Hotel not found.</p>;

  return (
    <div className="p-6 h-[calc(100vh-80px)] max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition mb-4"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-4">{hotel.room_type}</h1>

      <div className="space-y-2 text-gray-700 text-base">
        <p>
          <strong>City:</strong> {hotel.city}
        </p>
        <p>
          <strong>Bed Type:</strong> {hotel.bed_type}
        </p>
        <p>
          <strong>Capacity:</strong> {hotel.capacity}
        </p>
        <p>
          <strong>Amenities:</strong> {hotel.amenities}
        </p>
        <p>
          <strong>Floor:</strong> {hotel.floor_number}
        </p>
        <p>
          <strong>Check-in:</strong>{' '}
          {new Date(hotel.check_in_time).toLocaleDateString()}
        </p>
        <p>
          <strong>Check-out:</strong>{' '}
          {new Date(hotel.check_out_time).toLocaleDateString()}
        </p>
        <p>
          <strong>Status:</strong>{' '}
          <span
            className={
              hotel.status === 'Booked' ? 'text-red-500' : 'text-green-600'
            }
          >
            {hotel.status}
          </span>
        </p>
        <p className="text-blue-600 font-semibold text-lg">
          ${hotel.price}/night
        </p>
      </div>

      {hotel.status === 'Available' && !bookingConfirmed && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Book Now
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-sm text-center space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Booking
            </h2>
            <p className="text-gray-700">
              Would you like to book this hotel room?
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
              You have successfully booked this hotel room.
            </p>
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
