# API Endpoints

## Table of Contents

- [API Endpoints](#api-endpoints)
  - [Understanding API Endpoints](#understanding-api-endpoints)
  - [Flights](#flights)
    - [Get Flights](#1-get-flights)
    - [Get User Flights](#2-get-user-flights)

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
        "seat_number": "1A",
        "servicetype_id": "1",
        "is_taken": false,
        "class": "economy",
        "seat_price": "60.00"
    }
]
```

---

## Buses
