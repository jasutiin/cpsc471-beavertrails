const API_BASE_URL = 'http://localhost:8080/api';

export interface Flight {
  id: number;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  class: string;
  price: string;
}

export interface Bus {
  id: number;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  seats: string;
  capacity: number;
  price: string;
  amenities: string;
}

export interface HotelRoom {
  id: number;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  price: string;
  bedType: string;
  city: string;
  capacity: number;
  amenities: string;
  floor: number;
  status: string;
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  price: string;
  capacity: number;
  ageRestriction: string;
  startTime: string;
  endTime: string;
  signups: string;
}

export const fetchFlights = async (): Promise<Flight[]> => {
  const response = await fetch(`${API_BASE_URL}/flights`);
  if (!response.ok) {
    throw new Error('Failed to fetch flights');
  }
  return response.json();
};

export const fetchBuses = async (): Promise<Bus[]> => {
  const response = await fetch(`${API_BASE_URL}/buses`);
  if (!response.ok) {
    throw new Error('Failed to fetch buses');
  }
  return response.json();
};

export const fetchHotelRooms = async (): Promise<HotelRoom[]> => {
  const response = await fetch(`${API_BASE_URL}/hotel-rooms`);
  if (!response.ok) {
    throw new Error('Failed to fetch hotel rooms');
  }
  return response.json();
};

export const fetchActivities = async (): Promise<Activity[]> => {
  const response = await fetch(`${API_BASE_URL}/activities`);
  if (!response.ok) {
    throw new Error('Failed to fetch activities');
  }
  return response.json();
};

export const fetchStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
};
