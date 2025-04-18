import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('hotels');
  const [tripType, setTripType] = useState('roundtrip');
  const [flightClass, setFlightClass] = useState('');

  const [location, setLocation] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    undefined
  );
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(undefined);

  const navigate = useNavigate();

  const handleSearch = () => {
    let path = `/${selectedTab}`;
    const params = new URLSearchParams();

    if (selectedTab === 'hotels') {
      if (location) params.append('location', location);
      if (departureDate)
        params.append('departureDate', departureDate.toISOString());
      if (arrivalDate) params.append('arrivalDate', arrivalDate.toISOString());
    }

    if (selectedTab === 'flights' || selectedTab === 'buses') {
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (departureDate)
        params.append('departureDate', departureDate.toISOString());
      if (arrivalDate && tripType === 'roundtrip') {
        params.append('arrivalDate', arrivalDate.toISOString());
      }
      params.append('tripType', tripType);
    }

    if (selectedTab === 'activities') {
      if (location) params.append('city', location);
      if (departureDate) params.append('date', departureDate.toISOString());
    }

    navigate(`${path}?${params.toString()}`);
  };

  const renderDateRangePickers = () => (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-[200px] justify-start text-left font-normal',
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

      {selectedTab !== 'activities' &&
        (tripType === 'roundtrip' || selectedTab === 'hotels') && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[200px] justify-start text-left font-normal',
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

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-6">
        {/* Tab bar */}
        <div className="flex space-x-6 text-lg font-medium border-b pb-4">
          {['hotels', 'flights', 'buses', 'activities'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`capitalize ${
                selectedTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {(selectedTab === 'flights' || selectedTab === 'buses') && (
          <div className="flex flex-wrap items-center gap-4">
            <ToggleGroup
              type="single"
              value={tripType}
              onValueChange={(value) => value && setTripType(value)}
              className="flex space-x-2"
            >
              <ToggleGroupItem value="roundtrip">Roundtrip</ToggleGroupItem>
              <ToggleGroupItem value="oneway">One-way</ToggleGroupItem>
            </ToggleGroup>

            {selectedTab === 'flights' && (
              <Select onValueChange={(value) => setFlightClass(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {selectedTab === 'hotels' && (
          <div className="flex flex-wrap gap-4 items-end">
            <Input
              placeholder="Where to?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 min-w-[150px]"
            />
            {renderDateRangePickers()}
            <Button onClick={handleSearch}>Search</Button>
          </div>
        )}

        {selectedTab === 'flights' && (
          <div className="flex flex-wrap gap-4 items-end">
            <Input
              placeholder="Leaving from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="flex-1 min-w-[150px]"
            />
            <Input
              placeholder="Going to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 min-w-[150px]"
            />
            {renderDateRangePickers()}
            <Button onClick={handleSearch}>Search</Button>
          </div>
        )}

        {selectedTab === 'buses' && (
          <div className="flex flex-wrap gap-4 items-end">
            <Input
              placeholder="Leaving from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="flex-1 min-w-[150px]"
            />
            <Input
              placeholder="Going to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 min-w-[150px]"
            />
            {renderDateRangePickers()}
            <Button onClick={handleSearch}>Search</Button>
          </div>
        )}

        {selectedTab === 'activities' && (
          <div className="flex flex-wrap gap-4 items-end">
            <Input
              placeholder="City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 min-w-[150px]"
            />
            {renderDateRangePickers()}
            <Button onClick={handleSearch}>Search</Button>
          </div>
        )}
      </div>
    </div>
  );
}
