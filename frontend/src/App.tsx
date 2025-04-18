import Home from '@/pages/Home.tsx';
import Flights from '@/pages/flights/Flights';
import Buses from '@/pages/buses/Buses';
import Hotels from '@/pages/hotels/Hotels';
import Activities from '@/pages/activities/Activities';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/flights" element={<Flights />} />
      <Route path="/buses" element={<Buses />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/activities" element={<Activities />} />
    </Routes>
  );
}

export default App;
