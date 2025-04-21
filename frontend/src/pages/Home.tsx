import { useState } from 'react';
import Searchbar from '@/components/main/Searchbar';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<
    'flights' | 'buses' | 'hotels' | 'activities'
  >('hotels');

  return (
    <div className="h-auto flex flex-col items-center justify-center p-6 space-y-16">
      <h1 className="mt-16 text-5xl text-center font-bold">
        Discover Canada, one trail at a time.
      </h1>

      <div className="w-full max-w-[1000px] space-y-6 border-2 border-gray-300 p-4 md:p-6 rounded-xl">
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

      <div className="text-center text-lg text-gray-700 max-w-[700px] mt-4">
        Whether you’re booking a hotel, catching a flight, hopping on a bus, or
        planning fun activities—our platform helps you do it all in one place.
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 max-w-[900px] mt-4 px-4">
        <img
          src="/public/ai_art_lmao.png"
          alt="Travel"
          className="rounded-lg shadow-md w-full md:w-1/2"
        />
        <p className="text-xl italic text-gray-600 text-center md:text-left">
          "This app made planning my trip across Canada so much easier!
          Everything I needed was just a few clicks away."
        </p>
      </div>
    </div>
  );
}
