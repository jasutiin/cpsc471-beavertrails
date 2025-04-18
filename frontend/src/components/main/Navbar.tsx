import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';

type NavbarProps = {
  selectedTab: 'flights' | 'buses' | 'hotels' | 'activities';
};

export default function Navbar({ selectedTab }: NavbarProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [tripType, setTripType] = useState('roundtrip');
  const [flightClass, setFlightClass] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    undefined
  );
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(undefined);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location) params.append('location', location);
    if (date) params.append('date', date.toISOString());

    if (selectedTab === 'flights') {
      if (tripType) params.append('tripType', tripType);
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (departureDate)
        params.append('departureDate', departureDate.toISOString());
      if (arrivalDate) params.append('arrivalDate', arrivalDate.toISOString());
      if (tripType) params.append('tripType', tripType);
      if (flightClass) params.append('flightClass', flightClass);
    } else if (selectedTab === 'buses') {
      if (tripType) params.append('tripType', tripType);
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (departureDate)
        params.append('departureDate', departureDate.toISOString());
      if (arrivalDate) params.append('arrivalDate', arrivalDate.toISOString());
      if (tripType) params.append('tripType', tripType);
    } else if (selectedTab === 'hotels') {
      if (arrivalDate) params.append('arrivalDate', arrivalDate.toISOString());
      if (departureDate)
        params.append('departureDate', departureDate.toISOString());
    }

    navigate(`/${selectedTab}?${params.toString()}`);
  };

  useEffect(() => {
    if (selectedTab === 'activities') {
      const locationParam = searchParams.get('location');
      const dateParam = searchParams.get('date');

      if (locationParam) setLocation(locationParam);
      if (dateParam) setDate(new Date(dateParam));
    }

    if (selectedTab === 'flights' || selectedTab === 'buses') {
      const fromParam = searchParams.get('from');
      const toParam = searchParams.get('to');
      const departureParam = searchParams.get('departureDate');
      const arrivalParam = searchParams.get('arrivalDate');
      const tripTypeParam = searchParams.get('tripType');

      if (fromParam) setFrom(fromParam);
      if (toParam) setTo(toParam);
      if (departureParam) setDepartureDate(new Date(departureParam));
      if (arrivalParam) setArrivalDate(new Date(arrivalParam));
      if (tripTypeParam) setTripType(tripTypeParam);
    }

    if (selectedTab === 'flights') {
      const classParam = searchParams.get('flightClass');
      if (classParam) setFlightClass(classParam);
    }

    if (selectedTab === 'hotels') {
      const arrivalParam = searchParams.get('arrivalDate');
      const departureParam = searchParams.get('departureDate');
      if (arrivalParam) setArrivalDate(new Date(arrivalParam));
      if (departureParam) setDepartureDate(new Date(departureParam));
    }
  }, [selectedTab, searchParams]);

  const renderDateRangePickers = () => (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-[200px] justify-start text-left font-normal border-gray-600 text-gray-700',
              !departureDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {departureDate ? format(departureDate, 'PPP') : 'Departure date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={departureDate}
            onSelect={setDepartureDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {(selectedTab === 'hotels' ||
        (tripType === 'roundtrip' &&
          (selectedTab === 'flights' || selectedTab === 'buses'))) && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[200px] justify-start text-left font-normal border-gray-600 text-gray-700',
                !arrivalDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {arrivalDate ? format(arrivalDate, 'PPP') : 'Arrival date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={arrivalDate}
              onSelect={setArrivalDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </>
  );

  const renderTripTypeSelector = () => (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setTripType('roundtrip')}
        className={cn(
          'px-3 py-1 text-sm rounded',
          tripType === 'roundtrip'
            ? 'font-semibold text-blue-600'
            : 'text-gray-500'
        )}
      >
        Roundtrip
      </button>
      <button
        type="button"
        onClick={() => setTripType('oneway')}
        className={cn(
          'px-3 py-1 text-sm rounded',
          tripType === 'oneway'
            ? 'font-semibold text-blue-600'
            : 'text-gray-500'
        )}
      >
        One-way
      </button>
    </div>
  );

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-[900px] mx-auto">
        {selectedTab === 'hotels' && (
          <div className="flex flex-wrap gap-4 items-end">
            <Input
              placeholder="Where to?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 min-w-[150px] border-gray-600 text-gray-700"
            />
            {renderDateRangePickers()}
            <Button onClick={handleSearch}>Search</Button>
          </div>
        )}

        {selectedTab === 'flights' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 items-center">
              {renderTripTypeSelector()}

              <select
                value={flightClass}
                onChange={(e) => setFlightClass(e.target.value)}
                className="min-w-[120px] border rounded px-2 py-1 text-sm text-gray-700 border-gray-600"
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-4 items-end">
              <Input
                placeholder="Leaving from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="flex-1 min-w-[150px] border-gray-600 text-gray-700"
              />
              <Input
                placeholder="Going to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1 min-w-[150px] border-gray-600 text-gray-700"
              />
              {renderDateRangePickers()}
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
        )}

        {selectedTab === 'buses' && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              {renderTripTypeSelector()}
            </div>

            <div className="flex flex-wrap gap-4 items-end">
              <Input
                placeholder="Leaving from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="flex-1 min-w-[150px] border-gray-600 text-gray-700"
              />
              <Input
                placeholder="Going to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1 min-w-[150px] border-gray-600 text-gray-700"
              />
              {renderDateRangePickers()}
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
        )}

        {selectedTab === 'activities' && (
          <div className="flex flex-wrap gap-4 items-end">
            <Input
              placeholder="City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 min-w-[150px] border-gray-600 text-gray-700"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[200px] justify-start text-left font-normal border-gray-600 text-gray-700',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        )}
      </div>
    </div>
  );
}
