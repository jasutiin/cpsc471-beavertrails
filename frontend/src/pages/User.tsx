import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Booking {
  user_id: number;
  service_type: string;
  date: string;
  status: string;
}

export default function User() {
  const { user_id } = useParams<{ user_id: string }>();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/users/${user_id}/bookings`);
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user_id]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Your Bookings</h1>
      {loading ? (
        <Skeleton className="w-full h-24 rounded-xl" />
      ) : bookings && bookings.length > 0 ? (
        bookings.map((booking) => (
          <Card key={booking.user_id}>
            <CardContent className="p-4">
              <p>
                <strong>Service:</strong> {booking.service_type}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(booking.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No bookings found.</p>
      )}
    </div>
  );
}
