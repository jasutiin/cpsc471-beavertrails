const API_BASE_URL = 'http://localhost:8080/api';

export interface Flight {
  servicetype_id: number;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  flightclassoptions: string;
  flight_price: number;
}

export interface Bus {
  servicetype_id: number;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  seats_available: number;
  capacity: number;
  bus_price: number;
  amenities: string;
}

export interface HotelRoom {
  servicetype_id: number;
  room_number: string;
  room_type: string;
  check_in_time: string;
  check_out_time: string;
  price: number;
  bed_type: string;
  city: string;
  capacity: number;
  amenities: string;
  floor_number: number;
  status: string;
}

export interface Activity {
  servicetype_id: number;
  description: string;
  price: number;
  capacity: number;
  age_restriction: number;
  start_time: string;
  end_time: string;
  signups: number;
  city: string;
}

// GET functions
export async function getCompanyFlights(companyId: number): Promise<Flight[]> {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/company/${companyId}/flights`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch flights');
  }
  return response.json();
}

export async function getCompanyBuses(companyId: number): Promise<Bus[]> {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/company/${companyId}/buses`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch buses');
  }
  return response.json();
}

export async function getCompanyHotelRooms(
  companyId: number
): Promise<HotelRoom[]> {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/company/${companyId}/hotel-rooms`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch hotel rooms');
  }
  return response.json();
}

export async function getCompanyActivities(
  companyId: number
): Promise<Activity[]> {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/company/${companyId}/activities`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch activities');
  }
  return response.json();
}

// POST functions
export async function addCompanyFlight(
  companyId: number,
  flightData: Omit<Flight, 'servicetype_id'>
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/company/${companyId}/flights`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flightData),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to add flight');
  }
}

export async function addCompanyBus(
  companyId: number,
  busData: Omit<Bus, 'servicetype_id'>
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/company/${companyId}/buses`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(busData),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to add bus');
  }
}

export async function addCompanyHotelRoom(
  companyId: number,
  hotelRoomData: Omit<HotelRoom, 'servicetype_id'>
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/company/${companyId}/hotel-rooms`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hotelRoomData),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to add hotel room');
  }
}

export async function addCompanyActivity(
  companyId: number,
  activityData: Omit<Activity, 'servicetype_id'>
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/company/${companyId}/activities`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to add activity');
  }
}
