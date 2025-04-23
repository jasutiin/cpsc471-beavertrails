import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  servicetype_id: number;
  company_id: number;
  company_name?: string;
  service_type: 'flight' | 'bus' | 'hotel' | 'activity';
  departure_city?: string;
  arrival_city?: string;
  departure_time?: string | null;
  arrival_time?: string | null;
  flightclassoptions?: string;
  flight_price?: number;
  bus_price?: number;
  amenities?: string;
  room_number?: string;
  room_type?: string;
  bed_type?: string;
  check_in_time?: string | null;
  check_out_time?: string | null;
  city?: string;
  price?: number;
  description?: string;
  start_time?: string | null;
  end_time?: string | null;
  capacity?: number;
  age_restriction?: boolean;
}

export default function User() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  console.log(user);

  const [loading, setLoading] = useState(true);
  const [flightBookings, setFlightBookings] = useState<Booking[]>([]);
  const [busBookings, setBusBookings] = useState<Booking[]>([]);
  const [hotelBookings, setHotelBookings] = useState<Booking[]>([]);
  const [activityBookings, setActivityBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user?.user_id) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const [flightsRes, busesRes, hotelsRes, activitiesRes] =
          await Promise.all([
            fetch(`http://localhost:8080/api/bookings/flights/${user.user_id}`),
            fetch(`http://localhost:8080/api/bookings/buses/${user.user_id}`),
            fetch(`http://localhost:8080/api/bookings/hotels/${user.user_id}`),
            fetch(
              `http://localhost:8080/api/bookings/activities/${user.user_id}`
            ),
          ]);

        const [flights, buses, hotels, activities] = await Promise.all([
          flightsRes.json(),
          busesRes.json(),
          hotelsRes.json(),
          activitiesRes.json(),
        ]);

        setFlightBookings(Array.isArray(flights) ? flights : []);
        setBusBookings(Array.isArray(buses) ? buses : []);
        setHotelBookings(Array.isArray(hotels) ? hotels : []);
        setActivityBookings(Array.isArray(activities) ? activities : []);
      } catch (err) {
        console.error('Failed to fetch one or more booking types:', err);
        setFlightBookings([]);
        setBusBookings([]);
        setHotelBookings([]);
        setActivityBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.user_id]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const formatDateTime = (datetime: string | null | undefined) =>
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
              <strong>Amenities:</strong> {b.amenities}
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
                <strong>City:</strong> {b.city}
              </p>
            </div>
            <p>
              <strong>Price:</strong> ${b.price}
            </p>
          </>
        );
      case 'activity':
        return (
          <>
            <p>
              <strong>Description:</strong> {b.description}
            </p>
            <p>
              <strong>City:</strong> {b.city}
            </p>
            <div className="flex gap-4">
              <p>
                <strong>Start:</strong> {formatDateTime(b.start_time)}
              </p>
              <p>
                <strong>End:</strong> {formatDateTime(b.end_time)}
              </p>
            </div>
            <div className="flex gap-4">
              <p>
                <strong>Price:</strong> ${b.price}
              </p>
              <p>
                <strong>Capacity:</strong> {b.capacity}
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

  const renderSection = (title: string, bookings: Booking[]) => {
    if (!Array.isArray(bookings) || bookings.length === 0) return null;
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-bold">{title}</h2>
        {bookings.map((b) => (
          <Card key={b.servicetype_id}>
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Link
                  to={`/companies/${b.company_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {b.company_name ?? 'Unknown Company'}
                </Link>
              </div>
              {renderBookingDetails(b)}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-80px)] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Bookings</h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="text-red-600 border-red-600 hover:bg-red-100"
        >
          Logout
        </Button>
      </div>

      {loading ? (
        <Skeleton className="w-full h-24 rounded-xl" />
      ) : (
        <>
          {renderSection('Flights', flightBookings)}
          {renderSection('Buses', busBookings)}
          {renderSection('Hotels', hotelBookings)}
          {renderSection('Activities', activityBookings)}
        </>
      )}
    </div>
  );
}
