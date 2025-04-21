import Navbar from '@/components/main/Navbar.tsx';
import Home from '@/pages/Home.tsx';
import Flights from '@/pages/flights/Flights';
import FlightDetail from '@/pages/flights/FlightDetail';
import Buses from '@/pages/buses/Buses';
import BusDetail from '@/pages/buses/BusDetail';
import Hotels from '@/pages/hotels/Hotels';
import HotelDetail from '@/pages/hotels/HotelDetail';
import Activities from '@/pages/activities/Activities';
import ActivityDetail from '@/pages/activities/ActivityDetail';
import CompanyDetail from './pages/companies/CompanyDetail';
import Authentication from './pages/Authentication';
import User from './pages/User';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/flights/:servicetype_id" element={<FlightDetail />} />
        <Route path="/buses" element={<Buses />} />
        <Route path="/buses/:servicetype_id" element={<BusDetail />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:servicetype_id" element={<HotelDetail />} />
        <Route path="/activities" element={<Activities />} />
        <Route
          path="/activities/:servicetype_id"
          element={<ActivityDetail />}
        />
        <Route path="/users/:user_id" element={<User />} />
        <Route path="/companies/:company_id" element={<CompanyDetail />} />
        <Route path="/auth" element={<Authentication />} />
      </Routes>
    </>
  );
}

export default App;
