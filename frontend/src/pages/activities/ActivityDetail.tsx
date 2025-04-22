import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ActivityDetail() {
  const { servicetype_id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/activities/${servicetype_id}`);
        const data = await res.json();
        setActivity(data);
      } catch (err) {
        console.error('Error fetching activity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [servicetype_id]);

  const confirmBooking = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/activities/${servicetype_id}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        setShowModal(false);
        setBookingConfirmed(true);
        setActivity((prev: any) => ({
          ...prev,
          signups: Number(prev.signups) + 1

        }));
      } else {
        const error = await res.json();
        alert(`Booking failed: ${error.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Something went wrong.');
    }
  };

  if (loading) return <p className="p-6">Loading activity details...</p>;
  if (!activity) return <p className="p-6 text-red-500">Activity not found.</p>;

  const spotsLeft = activity.capacity - activity.signups;

  return (
    <div className="p-6 h-[calc(100vh-80px)] max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-sm px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition mb-4"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-4">Activity Details</h1>

      <div className="space-y-2 text-gray-700 text-base">
        <p><strong>Description:</strong> {activity.description}</p>
        <p><strong>Capacity:</strong> {activity.capacity}</p>
        <p><strong>Spots Taken:</strong> {activity.signups}</p>
        <p><strong>Age Restriction:</strong> {activity.age_restriction ? 'Yes' : 'No'}</p>
        <p><strong>Start:</strong> {new Date(activity.start_time).toLocaleString()}</p>
        <p><strong>End:</strong> {new Date(activity.end_time).toLocaleString()}</p>
        <p
          className={`text-lg font-semibold ${
            spotsLeft <= 0 ? 'text-gray-400 line-through' : 'text-blue-600'
          }`}
        >
          ${activity.price}
        </p>

        {spotsLeft <= 10 && spotsLeft > 0 && (
          <p className="text-yellow-600 font-medium">
            {spotsLeft === 1 ? 'Only 1 spot left! 🔥' : `Only ${spotsLeft} spots left!`}
          </p>
        )}

        {spotsLeft <= 0 && (
          <p className="text-red-600 font-semibold">This activity is fully booked.</p>
        )}
      </div>

      {!bookingConfirmed && (
        <button
          disabled={spotsLeft <= 0}
          onClick={() => setShowModal(true)}
          className={`mt-6 px-6 py-2 rounded transition text-white ${
            spotsLeft <= 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {spotsLeft <= 0 ? 'Fully Booked' : 'Book Now'}
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-sm text-center space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Booking</h2>
            <p className="text-gray-700">Would you like to book this activity?</p>
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
            <p className="text-gray-700">You have successfully booked this activity.</p>
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
