import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  getCompanyFlights,
  getCompanyBuses,
  getCompanyHotelRooms,
  getCompanyActivities,
  Flight,
  Bus,
  HotelRoom,
  Activity,
} from '@/api/dashboard';
import { useAuth } from '@/contexts/AuthContext';

export const ServiceTabs = () => {
  const { company } = useAuth();
  const [activeTab, setActiveTab] = useState('flights');
  const [showModal, setShowModal] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [hotelRooms, setHotelRooms] = useState<HotelRoom[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    departureCity: '',
    arrivalCity: '',
    departureTime: new Date(),
    arrivalTime: new Date(),
    flightClass: '',
    price: '',
    seats: '',
    capacity: '',
    amenities: '',
    roomNumber: '',
    roomType: '',
    checkIn: new Date(),
    checkOut: new Date(),
    bedType: '',
    city: '',
    floor: '',
    status: '',
    name: '',
    description: '',
    ageRestriction: false,
    startTime: new Date(),
    endTime: new Date(),
    signups: '',
  });

  useEffect(() => {
    const loadData = async () => {
      if (!company?.company_id) return;

      try {
        setLoading(true);
        const [flightsData, busesData, hotelRoomsData, activitiesData] =
          await Promise.all([
            getCompanyFlights(company.company_id),
            getCompanyBuses(company.company_id),
            getCompanyHotelRooms(company.company_id),
            getCompanyActivities(company.company_id),
          ]);
        setFlights(flightsData);
        setBuses(busesData);
        setHotelRooms(hotelRoomsData);
        setActivities(activitiesData);
        setError(null);
      } catch (err) {
        setError('Failed to load services data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [company?.company_id]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleAddClick = () => {
    setShowModal(true);
  };

  const getAddButtonText = () => {
    switch (activeTab) {
      case 'hotelRooms':
        return 'Add Hotel Rooms';
      default:
        return `Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      departureCity: '',
      arrivalCity: '',
      departureTime: new Date(),
      arrivalTime: new Date(),
      flightClass: '',
      price: '',
      seats: '',
      capacity: '',
      amenities: '',
      roomNumber: '',
      roomType: '',
      checkIn: new Date(),
      checkOut: new Date(),
      bedType: '',
      city: '',
      floor: '',
      status: '',
      name: '',
      description: '',
      ageRestriction: false,
      startTime: new Date(),
      endTime: new Date(),
      signups: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    handleCloseModal();
  };

  const renderFormFields = () => {
    switch (activeTab) {
      case 'flights':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Departure City
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.departureCity}
                onChange={(e) =>
                  setFormData({ ...formData, departureCity: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Arrival City
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.arrivalCity}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalCity: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Departure Time
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.departureTime && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.departureTime
                      ? format(formData.departureTime, 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.departureTime}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, departureTime: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Arrival Time
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.arrivalTime && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.arrivalTime
                      ? format(formData.arrivalTime, 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.arrivalTime}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, arrivalTime: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Flight Class
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.flightClass}
                onChange={(e) =>
                  setFormData({ ...formData, flightClass: e.target.value })
                }
                placeholder="Enter flight class"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
          </>
        );
      case 'buses':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Departure City
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.departureCity}
                onChange={(e) =>
                  setFormData({ ...formData, departureCity: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Arrival City
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.arrivalCity}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalCity: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Departure Time
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.departureTime && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.departureTime
                      ? format(formData.departureTime, 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.departureTime}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, departureTime: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Arrival Time
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.arrivalTime && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.arrivalTime
                      ? format(formData.arrivalTime, 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.arrivalTime}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, arrivalTime: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Seats Available
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.seats}
                onChange={(e) =>
                  setFormData({ ...formData, seats: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Amenities
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.amenities}
                onChange={(e) =>
                  setFormData({ ...formData, amenities: e.target.value })
                }
              />
            </div>
          </>
        );
      case 'hotelRooms':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Room Number
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Room Type
              </label>
              <select
                className="w-full p-2 border rounded"
                value={formData.roomType}
                onChange={(e) =>
                  setFormData({ ...formData, roomType: e.target.value })
                }
              >
                <option value="">Select Type</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Check-in Time
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.checkIn && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.checkIn
                      ? format(formData.checkIn, 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.checkIn}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, checkIn: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Check-out Time
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.checkOut && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.checkOut
                      ? format(formData.checkOut, 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.checkOut}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, checkOut: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Bed Type</label>
              <select
                className="w-full p-2 border rounded"
                value={formData.bedType}
                onChange={(e) =>
                  setFormData({ ...formData, bedType: e.target.value })
                }
              >
                <option value="">Select Bed Type</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Queen">Queen</option>
                <option value="King">King</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Amenities
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.amenities}
                onChange={(e) =>
                  setFormData({ ...formData, amenities: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Floor Number
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.floor}
                onChange={(e) =>
                  setFormData({ ...formData, floor: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full p-2 border rounded"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </>
        );
      case 'activities':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Activity Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="w-full p-2 border rounded"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Age Restriction
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.ageRestriction}
                onChange={(e) =>
                  setFormData({ ...formData, ageRestriction: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Start Time
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.startTime && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startTime
                      ? format(formData.startTime, 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startTime}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, startTime: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">End Time</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.endTime && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endTime
                      ? format(formData.endTime, 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endTime}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, endTime: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Current Signups
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.signups}
                onChange={(e) =>
                  setFormData({ ...formData, signups: e.target.value })
                }
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Services</h2>
        <Button onClick={handleAddClick}>{getAddButtonText()}</Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Tabs
        defaultValue="flights"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="flights">Flights</TabsTrigger>
          <TabsTrigger value="buses">Buses</TabsTrigger>
          <TabsTrigger value="hotelRooms">Hotel Rooms</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="flights" className="mt-4">
          {loading ? (
            <div className="text-center py-4">Loading flights...</div>
          ) : (
            <div className="grid gap-4">
              {flights.map((flight) => (
                <div
                  key={flight.servicetype_id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">
                        {flight.departure_city} → {flight.arrival_city}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(flight.departure_time).toLocaleString()} -{' '}
                        {new Date(flight.arrival_time).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${flight.flight_price}</p>
                      <p className="text-sm text-gray-500">
                        {flight.flightclassoptions}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="buses" className="mt-4">
          {loading ? (
            <div className="text-center py-4">Loading buses...</div>
          ) : (
            <div className="grid gap-4">
              {buses.map((bus) => (
                <div key={bus.servicetype_id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">
                        {bus.departure_city} → {bus.arrival_city}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(bus.departure_time).toLocaleString()} -{' '}
                        {new Date(bus.arrival_time).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Seats: {bus.seats_available}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${bus.bus_price}</p>
                      <p className="text-sm text-gray-500">{bus.amenities}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="hotelRooms" className="mt-4">
          {loading ? (
            <div className="text-center py-4">Loading hotel rooms...</div>
          ) : (
            <div className="grid gap-4">
              {hotelRooms.map((room) => (
                <div
                  key={room.servicetype_id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">
                        Room {room.room_number} - {room.room_type}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Check-in:{' '}
                        {new Date(room.check_in_time).toLocaleString()}
                        <br />
                        Check-out:{' '}
                        {new Date(room.check_out_time).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {room.bed_type} bed • {room.capacity} guests • Floor{' '}
                        {room.floor_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${room.price}</p>
                      <p className="text-sm text-gray-500">{room.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activities" className="mt-4">
          {loading ? (
            <div className="text-center py-4">Loading activities...</div>
          ) : (
            <div className="grid gap-4">
              {activities.map((activity) => (
                <div
                  key={activity.servicetype_id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{activity.description}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.start_time).toLocaleString()} -{' '}
                        {new Date(activity.end_time).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Signups: {activity.signups} • Age Restriction:{' '}
                        {activity.age_restriction ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${activity.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {renderFormFields()}
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
