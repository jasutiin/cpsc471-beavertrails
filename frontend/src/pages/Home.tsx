import { useState } from 'react';
import Searchbar from '@/components/main/Searchbar';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<
    'flights' | 'buses' | 'hotels' | 'activities'
  >('hotels');

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl mb-10">Beavertrails :)</h1>
      <div className="w-full max-w-[1000px] space-y-6 border-2 border-gray-300 p-2 rounded-xl">
        <div className="flex space-x-6 text-lg font-medium border-b border-gray-300 pb-4 justify-center">
          {(['hotels', 'flights', 'buses', 'activities'] as const).map(
            (tab) => (
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
            )
          )}
        </div>

        <Searchbar selectedTab={selectedTab} />
      </div>
    </div>
  );
}
