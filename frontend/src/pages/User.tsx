import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

  const renderBookingDetails = (booking: Booking) => {
    switch (booking.service_type) {
      case 'flight':
        return (
          <>
            <p>
              <strong>Departure City:</strong> {booking.departure_city}
            </p>
            <p>
              <strong>Arrival City:</strong> {booking.arrival_city}
            </p>
            <p>
              <strong>Departure Time:</strong>{' '}
              {new Date(booking.departure_time!).toLocaleString()}
            </p>
            <p>
              <strong>Arrival Time:</strong>{' '}
              {new Date(booking.arrival_time!).toLocaleString()}
            </p>
            <p>
              <strong>Flight Class Options:</strong>{' '}
              {booking.flightclassoptions}
            </p>
            <p>
              <strong>Flight Price:</strong> ${booking.flight_price}
            </p>
          </>
        );
      case 'bus':
        return (
          <>
            <p>
              <strong>Departure City:</strong> {booking.departure_city}
            </p>
            <p>
              <strong>Arrival City:</strong> {booking.arrival_city}
            </p>
            <p>
              <strong>Departure Time:</strong>{' '}
              {new Date(booking.departure_time!).toLocaleString()}
            </p>
            <p>
              <strong>Arrival Time:</strong>{' '}
              {new Date(booking.arrival_time!).toLocaleString()}
            </p>
            <p>
              <strong>Bus Price:</strong> ${booking.bus_price}
            </p>
            <p>
              <strong>Amenities:</strong> {booking.bus_amenities}
            </p>
          </>
        );
      case 'hotel':
        return (
          <>
            <p>
              <strong>Room Number:</strong> {booking.room_number}
            </p>
            <p>
              <strong>Room Type:</strong> {booking.room_type}
            </p>
            <p>
              <strong>Check-In Time:</strong>{' '}
              {new Date(booking.check_in_time!).toLocaleString()}
            </p>
            <p>
              <strong>Check-Out Time:</strong>{' '}
              {new Date(booking.check_out_time!).toLocaleString()}
            </p>
            <p>
              <strong>Hotel Price:</strong> ${booking.hotel_price}
            </p>
            <p>
              <strong>Bed Type:</strong> {booking.bed_type}
            </p>
            <p>
              <strong>City:</strong> {booking.hotel_city}
            </p>
            <p>
              <strong>Capacity:</strong> {booking.hotel_capacity}
            </p>
            <p>
              <strong>Floor Number:</strong> {booking.floor_number}
            </p>
            <p>
              <strong>Status:</strong> {booking.room_status}
            </p>
          </>
        );
      case 'activity':
        return (
          <>
            <p>
              <strong>Description:</strong> {booking.activity_description}
            </p>
            <p>
              <strong>Price:</strong> ${booking.activity_price}
            </p>
            <p>
              <strong>Capacity:</strong> {booking.activity_capacity}
            </p>
            <p>
              <strong>Age Restriction:</strong>{' '}
              {booking.age_restriction ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Start Time:</strong>{' '}
              {new Date(booking.activity_start!).toLocaleString()}
            </p>
            <p>
              <strong>End Time:</strong>{' '}
              {new Date(booking.activity_end!).toLocaleString()}
            </p>
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
        bookings.map((booking) => (
          <Card key={booking.payment_id}>
            <CardContent className="p-4">
              <p>
                <strong>Service Type:</strong> {booking.service_type}
              </p>
              {renderBookingDetails(booking)}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No bookings found.</p>
      )}
    </div>
  );
}
