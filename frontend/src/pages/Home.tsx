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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('hotels');
  const [tripType, setTripType] = useState('roundtrip');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex space-x-6 text-lg font-medium mb-6 border-b pb-4">
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

      <div className="space-y-4">
        {(selectedTab === 'flights' || selectedTab === 'buses') && (
          <ToggleGroup
            type="single"
            value={tripType}
            onValueChange={setTripType}
            className="flex space-x-4"
          >
            <ToggleGroupItem value="roundtrip">Roundtrip</ToggleGroupItem>
            <ToggleGroupItem value="oneway">One-way</ToggleGroupItem>
          </ToggleGroup>
        )}

        {selectedTab === 'flights' && (
          <Select>
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

        {selectedTab === 'hotels' && (
          <div className="space-y-4">
            <Input placeholder="Where to?" />
            <Input placeholder="Select dates" />
            <Button>Search</Button>
          </div>
        )}

        {selectedTab === 'flights' && (
          <div className="space-y-4">
            <Input placeholder="Leaving from" />
            <Input placeholder="Going to" />
            <Input placeholder="Select dates" />
            <Button>Search</Button>
          </div>
        )}

        {selectedTab === 'buses' && (
          <div className="space-y-4">
            <Input placeholder="Leaving from" />
            <Input placeholder="Going to" />
            <Input placeholder="Select dates" />
            <Button>Search</Button>
          </div>
        )}

        {selectedTab === 'activities' && (
          <div className="space-y-4">
            <Input placeholder="City" />
            <Input placeholder="Select date" />
            <Button>Search</Button>
          </div>
        )}
      </div>
    </div>
  );
}
