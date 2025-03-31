# API Endpoints

## Table of Contents

- [API Endpoints](#api-endpoints)
  - [Understanding API Endpoints](#understanding-api-endpoints)
  - [Flights](#flights)
    - [Get Flights](#1-get-flights)
    - [Get Flight](#1-get-flight)
    - [Get User Flights](#3-get-user-flights)
    - [Get Flight Seats](#4-get-flight-seats)
  - [Buses](#flights)
    - [Get Buses](#1-get-buses)
    - [Get Bus](#1-get-bus)
    - [Get User Buses](#3-get-user-buses)
    - [Get Bus Seats](#4-get-bus-seats)

---

## Understanding API Endpoints

Each API endpoint in this documentation follows a standard format:

### 1. Method

The HTTP method specifies the type of request being made. Common methods include:

- GET – Retrieve data from the server
- POST – Send new data to the server
- PUT – Update existing data
- DELETE – Remove data

### 2. URL

The URL defines the specific route to access the API resource. Some URLs may include path parameters (e.g., /users/:user_id/flights), while others use query parameters (e.g., /flights?date=2025-05-10).

### 3. Path Parameters

These are dynamic values in the URL that specify a specific resource. They are denoted with a : in the endpoint definition.

Example: /users/:user_id/flights

Usage: /users/123/flights (fetches flights for user with ID 123)

### 4. Query Parameters

Query parameters provide additional filtering options in the request URL. They are appended using ? and separated by &.

Example: /flights?daparture_date=2025-05-10

Usage: Allows filtering flights by departure date

### 5. Description

A short explanation of what the endpoint does.

### 6. Response Example

A sample JSON response demonstrating the format of the data returned by the API.

---

## Flights

### 1. Get Flights

**Method:** GET  
**URL:** api/flights  
**Description:** Fetches all available flights  
**Query Parameters:**

1. departure_date=2025-05-10
   - Gets all flights that depart on May 10, 2025
2. departure_city=Calgary
   - Gets all flights that depart from Calgary
3. arrival_city=Toronto
   - Gets all flights that arrive in Toronto

**Response Example:**

```
[
    {
        "servicetype_id": "1",
        "departure_city": "Calgary",
        "arrival_city": "Toronto",
        "departure_time": "2025-05-10T14:00:00.000Z",
        "arrival_time": "2025-05-10T18:00:00.000Z",
        "flightclassoptions": "Economy, Business",
        "flight_price": "120.35"
    }
]
```

### 2. Get Flight

**Method:** GET  
**URL:** api/flights/:flight_id  
**Description:** Fetches a single flight's information  
**Query Parameters:**  
**Response Example:**

```
[
    {
        "servicetype_id": "1",
        "departure_city": "Calgary",
        "arrival_city": "Toronto",
        "departure_time": "2025-05-10T14:00:00.000Z",
        "arrival_time": "2025-05-10T18:00:00.000Z",
        "flightclassoptions": "Economy, Business",
        "flight_price": "120.35"
    }
]
```

### 3. Get User Flights

**Method:** GET  
**URL:** api/users/:user_id/flights  
**Description:** Fetches flights that the user booked  
**Response Example:**

```
[
    {
        "servicetype_id": "1",
        "departure_city": "Calgary",
        "arrival_city": "Toronto",
        "departure_time": "2025-05-10T14:00:00.000Z",
        "arrival_time": "2025-05-10T18:00:00.000Z",
        "flightclassoptions": "Economy, Business",
        "flight_price": "120.35"
    }
]
```

### 4. Get Flight Seats

**Method:** GET  
**URL:** api/flights/:flight_id/seats  
**Description:** Fetches seats in a specific flight  
**Query Parameters:**

1. flightclass=business
   - Gets all business class seats in a flight

**Response Example:**

```
[
    {
        "seat_number": "3A",
        "is_taken": false,
        "class": "business",
        "seat_price": "200.00"
    }
]
```

---

## Buses

### 1. Get Buses

**Method:** GET  
**URL:** api/buses  
**Description:** Fetches all available buses  
**Query Parameters:**

1. departure_date=2025-06-05
   - Gets all buses that depart on June 05, 2025
2. departure_city=Calgary
   - Gets all buses that depart from Calgary
3. arrival_city=Ottawa
   - Gets all buses that arrive in Ottawa

**Response Example:**

```
[
    {
        "servicetype_id": "9",
        "departure_city": "Seattle",
        "arrival_city": "Portland",
        "departure_time": "2025-06-05T14:00:00.000Z",
        "arrival_time": "2025-06-05T17:00:00.000Z",
        "seats_available": 40,
        "capacity": 50,
        "bus_price": "35.00",
        "amenities": "WiFi, Power Outlets"
    }
]
```

### 2. Get Bus

**Method:** GET  
**URL:** api/buses/:bus_id  
**Description:** Fetches a single flight's information  
**Query Parameters:**  
**Response Example:**

```
[
    {
        "servicetype_id": "3",
        "departure_city": "Calgary",
        "arrival_city": "Edmonton",
        "departure_time": "2025-04-12T15:00:00.000Z",
        "arrival_time": "2025-04-12T18:30:00.000Z",
        "seats_available": 30,
        "capacity": 40,
        "bus_price": "50.00",
        "amenities": "WiFi, Reclining Seats"
    }
]
```

### 3. Get User Buses

**Method:** GET  
**URL:** api/users/:user_id/buses  
**Description:** Fetches buses that the user booked  
**Response Example:**

```
[
    {
        "servicetype_id": "3",
        "departure_city": "Calgary",
        "arrival_city": "Edmonton",
        "departure_time": "2025-04-12T15:00:00.000Z",
        "arrival_time": "2025-04-12T18:30:00.000Z",
        "seats_available": 30,
        "capacity": 40,
        "bus_price": "50.00",
        "amenities": "WiFi, Reclining Seats"
    }
]
```

### 4. Get Bus Seats

**Method:** GET  
**URL:** api/buses/:bus_id/seats  
**Description:** Fetches seats in a specific bus  
**Response Example:**

```
[
    {
        "seat_number": "3A",
        "is_taken": false,
        "class": "business",
        "seat_price": "200.00"
    }
]
```

---
