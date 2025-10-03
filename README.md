# Vehicle Rental System

A comprehensive vehicle rental management system with role-based access control.

## Complete Features

### 🔐 Super Admin Features
- ✅ Login / Authentication (Super Admin panel access)
- ✅ Manage Vehicle Admins (Add / Approve / Reject / Delete)
- ✅ Monitor All Vehicles in the system
- ✅ Monitor All Drivers (Customers)
- ✅ View & Manage Bookings across all Vehicle Admins
- ✅ Handle Complaints or Issues raised by Drivers or Vehicle Admins
- ✅ Generate System Reports (total bookings, earnings)
- ✅ Block / Unblock Accounts (Vehicle Admin or Driver)
- ✅ Approve Documents (vehicle license, RC, etc.)
- ✅ Super Admin Dashboard (Overview of system activities)

### 🚗 Vehicle Admin (Owner) Features
- ✅ Signup / Login / Authentication
- ✅ Profile Management (update details, contact info, etc.)
- ✅ Add Vehicle Details (vehicle type, model, registration, images, rent price)
- ✅ Edit / Update Vehicle Information
- ✅ View Vehicle Availability (Booked / Free)
- ✅ Manage Driver/Customer Bookings
- ✅ Accept / Reject Booking Requests
- ✅ Track Vehicle Usage (who booked it, when, how long)
- ✅ View Earnings Report (from rented vehicles)
- ✅ Vehicle Admin Dashboard (overview of vehicles, bookings, earnings)

### 🧑‍🦱 Driver (Customer/User) Features
- ✅ Signup / Login / Authentication
- ✅ Profile Management
- ✅ Search Available Vehicles (by type, price, date, availability)
- ✅ View Vehicle Details (model, price, owner, availability)
- ✅ Book Vehicle (select dates, confirm booking)
- ✅ Cancel Booking (with conditions)
- ✅ View Booking History
- ✅ Payment Options (cash/online)
- ✅ Driver Dashboard (my bookings, upcoming trips, payments)

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, JWT Authentication
- **Frontend**: React.js, Tailwind CSS, Axios

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/vehicle-rental
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - User registration
- POST `/api/auth/login` - User login

### Vehicles
- GET `/api/vehicles` - Get all vehicles
- POST `/api/vehicles` - Create vehicle (Vehicle Admin only)
- PUT `/api/vehicles/:id` - Update vehicle
- DELETE `/api/vehicles/:id` - Delete vehicle

### Bookings
- GET `/api/bookings` - Get all bookings
- POST `/api/bookings` - Create booking (Driver only)
- PUT `/api/bookings/:id/status` - Update booking status

### Users
- GET `/api/users` - Get all users (Super Admin only)

### Complaints
- GET `/api/complaints` - Get all complaints
- POST `/api/complaints` - Create complaint

## Default Roles

- `superadmin` - Full system access
- `vehicleadmin` - Vehicle and booking management
- `driver` - Vehicle booking and payments