import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/common/Home';
import Login from './pages/superadmin/Login';
import Signup from './pages/common/Signup';
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import VehicleAdminDashboard from './pages/vehicleadmin/Dashboard';
import DriverDashboard from './pages/driver/Dashboard';
import SearchVehicles from './pages/driver/SearchVehicles';
import BookVehicle from './pages/driver/BookVehicle';
import MyBookings from './pages/driver/MyBookings';
import Vehicles from './pages/vehicleadmin/Vehicles';
import VehicleAdminBookings from './pages/vehicleadmin/Bookings';
import Earnings from './pages/vehicleadmin/Earnings';
import ManageUsers from './pages/superadmin/ManageUsers';
import Reports from './pages/superadmin/Reports';
import Complaints from './pages/superadmin/Complaints';
import Payments from './pages/driver/Payments';
import Profile from './pages/common/Profile';
import DocumentApproval from './pages/superadmin/DocumentApproval';
import ManageVehicleAdmins from './pages/superadmin/ManageVehicleAdmins';
import About from './pages/common/About';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Super Admin Routes */}
            <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/users" element={<ManageUsers />} />
            <Route path="/superadmin/admins" element={<ManageVehicleAdmins />} />
            <Route path="/superadmin/documents" element={<DocumentApproval />} />
            <Route path="/superadmin/reports" element={<Reports />} />
            <Route path="/superadmin/complaints" element={<Complaints />} />

            {/* Vehicle Admin Routes */}
            <Route path="/vehicleadmin/dashboard" element={<VehicleAdminDashboard />} />
            <Route path="/vehicleadmin/vehicles" element={<Vehicles />} />
            <Route path="/vehicleadmin/bookings" element={<VehicleAdminBookings />} />
            <Route path="/vehicleadmin/earnings" element={<Earnings />} />

            {/* Driver Routes */}
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/driver/search" element={<SearchVehicles />} />
            <Route path="/driver/book/:vehicleId" element={<BookVehicle />} />
            <Route path="/driver/bookings" element={<MyBookings />} />
            <Route path="/driver/payments" element={<Payments />} />

            {/* Common Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;