import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Home from './pages/common/Home';
import Login from './pages/superadmin/Login';
import Signup from './pages/common/Signup';
import PublicVehicleSearch from './pages/common/PublicVehicleSearch';
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
import Contact from './pages/Contact';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const dashboards = {
    superadmin: '/superadmin/dashboard',
    vehicleadmin: '/vehicleadmin/dashboard',
    driver: '/driver/dashboard'
  };

  if (role && user.role !== role) {
    return <Navigate to={dashboards[user.role] || '/login'} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/vehicles" element={<PublicVehicleSearch />} />

            {/* Super Admin Routes */}
            <Route path="/superadmin/dashboard" element={<ProtectedRoute role="superadmin"><SuperAdminDashboard /></ProtectedRoute>} />
            <Route path="/superadmin/users" element={<ProtectedRoute role="superadmin"><ManageUsers /></ProtectedRoute>} />
            <Route path="/superadmin/admins" element={<ProtectedRoute role="superadmin"><ManageVehicleAdmins /></ProtectedRoute>} />
            <Route path="/superadmin/documents" element={<ProtectedRoute role="superadmin"><DocumentApproval /></ProtectedRoute>} />
            <Route path="/superadmin/reports" element={<ProtectedRoute role="superadmin"><Reports /></ProtectedRoute>} />
            <Route path="/superadmin/complaints" element={<ProtectedRoute role="superadmin"><Complaints /></ProtectedRoute>} />

            {/* Vehicle Admin Routes */}
            <Route path="/vehicleadmin/dashboard" element={<ProtectedRoute role="vehicleadmin"><VehicleAdminDashboard /></ProtectedRoute>} />
            <Route path="/vehicleadmin/vehicles" element={<ProtectedRoute role="vehicleadmin"><Vehicles /></ProtectedRoute>} />
            <Route path="/vehicleadmin/bookings" element={<ProtectedRoute role="vehicleadmin"><VehicleAdminBookings /></ProtectedRoute>} />
            <Route path="/vehicleadmin/earnings" element={<ProtectedRoute role="vehicleadmin"><Earnings /></ProtectedRoute>} />
          
            {/* Driver Routes */}
            <Route path="/driver/dashboard" element={<ProtectedRoute role="driver"><DriverDashboard /></ProtectedRoute>} />
            <Route path="/driver/search" element={<ProtectedRoute role="driver"><SearchVehicles /></ProtectedRoute>} />
            <Route path="/driver/book/:vehicleId" element={<ProtectedRoute role="driver"><BookVehicle /></ProtectedRoute>} />
            <Route path="/driver/bookings" element={<ProtectedRoute role="driver"><MyBookings /></ProtectedRoute>} />
            <Route path="/driver/payments" element={<ProtectedRoute role="driver"><Payments /></ProtectedRoute>} />

            {/* Common Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


