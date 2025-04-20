import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Booking {
  user_id: number;
  payment_id: number;
  servicetype_id: number;
  service_type: string;
  departure_city: string | null;
  arrival_city: string | null;
  departure_time: string | null;
  arrival_time: string | null;
  flightclassoptions: string | null;
  flight_price: number | null;
  bus_price: number | null;
  bus_amenities: string | null;
  room_number: string | null;
  room_type: string | null;
  check_in_time: string | null;
  check_out_time: string | null;
  hotel_price: number | null;
  bed_type: string | null;
  hotel_city: string | null;
  hotel_capacity: number | null;
  floor_number: number | null;
  room_status: string | null;
  activity_description: string | null;
  activity_price: number | null;
  activity_capacity: number | null;
  age_restriction: boolean | null;
  activity_start: string | null;
  activity_end: string | null;
  company_name: string | null;
  company_id: number | null;
}

export default function User() {
  const { user_id } = useParams<{ user_id: string }>();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/bookings/${user_id}`
        );
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

  const formatDateTime = (datetime: string | null) =>
    datetime ? new Date(datetime).toLocaleString() : 'N/A';

  const renderBookingDetails = (b: Booking) => {
    switch (b.service_type) {
      case 'flight':
        return (
          <>
            <div className="flex gap-4">
              <p>
                <strong>Departure:</strong> {b.departure_city}
              </p>
              <p>
                <strong>Arrival:</strong> {b.arrival_city}
              </p>
            </div>
            <div className="flex gap-4">
              <p>
                <strong>Departure Time:</strong>{' '}
                {formatDateTime(b.departure_time)}
              </p>
              <p>
                <strong>Arrival Time:</strong> {formatDateTime(b.arrival_time)}
              </p>
            </div>
            <p>
              <strong>Class:</strong> {b.flightclassoptions}
            </p>
            <p>
              <strong>Price:</strong> ${b.flight_price}
            </p>
          </>
        );
      case 'bus':
        return (
          <>
            <div className="flex gap-4">
              <p>
                <strong>Departure:</strong> {b.departure_city}
              </p>
              <p>
                <strong>Arrival:</strong> {b.arrival_city}
              </p>
            </div>
            <div className="flex gap-4">
              <p>
                <strong>Departure Time:</strong>{' '}
                {formatDateTime(b.departure_time)}
              </p>
              <p>
                <strong>Arrival Time:</strong> {formatDateTime(b.arrival_time)}
              </p>
            </div>
            <p>
              <strong>Price:</strong> ${b.bus_price}
            </p>
            <p>
              <strong>Amenities:</strong> {b.bus_amenities}
            </p>
          </>
        );
      case 'hotel':
        return (
          <>
            <div className="flex gap-4">
              <p>
                <strong>Room Number:</strong> {b.room_number}
              </p>
              <p>
                <strong>Type:</strong> {b.room_type}
              </p>
              <p>
                <strong>Bed:</strong> {b.bed_type}
              </p>
            </div>
            <div className="flex gap-4">
              <p>
                <strong>Check-In:</strong> {formatDateTime(b.check_in_time)}
              </p>
              <p>
                <strong>Check-Out:</strong> {formatDateTime(b.check_out_time)}
              </p>
            </div>
            <div className="flex gap-4">
              <p>
                <strong>City:</strong> {b.hotel_city}
              </p>
              <p>
                <strong>Capacity:</strong> {b.hotel_capacity}
              </p>
              <p>
                <strong>Floor:</strong> {b.floor_number}
              </p>
            </div>
            <p>
              <strong>Status:</strong> {b.room_status}
            </p>
            <p>
              <strong>Price:</strong> ${b.hotel_price}
            </p>
          </>
        );
      case 'activity':
        return (
          <>
            <p>
              <strong>Description:</strong> {b.activity_description}
            </p>
            <div className="flex gap-4">
              <p>
                <strong>Start:</strong> {formatDateTime(b.activity_start)}
              </p>
              <p>
                <strong>End:</strong> {formatDateTime(b.activity_end)}
              </p>
            </div>
            <div className="flex gap-4">
              <p>
                <strong>Price:</strong> ${b.activity_price}
              </p>
              <p>
                <strong>Capacity:</strong> {b.activity_capacity}
              </p>
              <p>
                <strong>Age Restriction:</strong>{' '}
                {b.age_restriction ? 'Yes' : 'No'}
              </p>
            </div>
          </>
        );
      default:
        return <p>No details available for this service type.</p>;
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Your Bookings</h1>
      {loading ? (
        <Skeleton className="w-full h-24 rounded-xl" />
      ) : bookings && bookings.length > 0 ? (
        bookings.map((b) => (
          <Card key={b.payment_id}>
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center gap-2 text-xl font-semibold">
                {b.company_id ? (
                  <Link
                    to={`/companies/${b.company_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {b.company_name ?? 'Unknown Company'}
                  </Link>
                ) : (
                  <span>{b.company_name ?? 'Unknown Company'}</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                <strong>Service Type:</strong> {b.service_type}
              </p>
              {renderBookingDetails(b)}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No bookings found.</p>
      )}
    </div>
  );
}
