import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  signup: (data) => API.post('/auth/signup', data),
};

// User APIs
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  getAllUsers: (params) => API.get('/users', { params }),
  getUserStats: () => API.get('/users/stats'),
  getUserById: (id) => API.get(`/users/${id}`),
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  deleteUser: (id) => API.delete(`/users/${id}`),
};

// Vehicle APIs
export const vehicleAPI = {
  getAllVehicles: (params) => API.get('/vehicles', { params }),
  getCities: (search) => API.get('/vehicles/cities', { params: { search } }),
  getMyVehicles: () => API.get('/vehicles/my/vehicles'),
  getVehicleStats: () => API.get('/vehicles/my/stats'),
  getVehicleById: (id) => API.get(`/vehicles/${id}`),
  createVehicle: (data) => API.post('/vehicles', data),
  updateVehicle: (id, data) => API.put(`/vehicles/${id}`, data),
  deleteVehicle: (id) => API.delete(`/vehicles/${id}`),
  toggleAvailability: (id) => API.patch(`/vehicles/${id}/availability`),
  searchVehicles: (params) => API.get('/vehicles/search', { params }),
};

// Booking APIs
export const bookingAPI = {
  getAllBookings: (params) => API.get('/bookings', { params }),
  getMyBookings: () => API.get('/bookings/my'),
  getBookingStats: () => API.get('/bookings/stats'),
  getBookingById: (id) => API.get(`/bookings/${id}`),
  createBooking: (data) => API.post('/bookings', data),
  updateBooking: (id, data) => API.put(`/bookings/${id}`, data),
  updateBookingStatus: (id, data) => API.put(`/bookings/${id}/status`, data),
  cancelBooking: (id, data) => API.put(`/bookings/${id}/cancel`, data),
};

// Payment APIs
export const paymentAPI = {
  getAllPayments: () => API.get('/payments'),
  getPaymentById: (id) => API.get(`/payments/${id}`),
  createPayment: (data) => API.post('/payments', data),
  getMyPayments: () => API.get('/payments/my'),
};

// Complaint APIs
export const complaintAPI = {
  getAllComplaints: () => API.get('/complaints'),
  getComplaintById: (id) => API.get(`/complaints/${id}`),
  createComplaint: (data) => API.post('/complaints', data),
  updateComplaint: (id, data) => API.put(`/complaints/${id}`, data),
  getMyComplaints: () => API.get('/complaints/my'),
};

// Document APIs
export const documentAPI = {
  getAllDocuments: () => API.get('/documents'),
  uploadDocument: (data) => API.post('/documents', data),
  verifyDocument: (id) => API.put(`/documents/${id}/verify`),
  deleteDocument: (id) => API.delete(`/documents/${id}`),
};

// Upload APIs (Cloudinary)
export const uploadAPI = {
  // Upload multiple vehicle images
  uploadVehicleImages: (formData) => API.post('/upload/vehicle', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Upload single vehicle image
  uploadVehicleImage: (formData) => API.post('/upload/vehicle/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Upload document
  uploadDocument: (formData) => API.post('/upload/document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Upload profile image
  uploadProfileImage: (formData) => API.post('/upload/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Delete image from Cloudinary
  deleteImage: (publicId) => API.delete('/upload/delete', { data: { publicId } })
};

// Location APIs (OpenStreetMap)
export const locationAPI = {
  searchLocation: (query) => API.get('/location/search', { params: { query } }),
  getVehiclesByLocation: (lat, lon, radius, type) => API.get('/location/vehicles', { params: { lat, lon, radius, type } }),
};

export default API;


