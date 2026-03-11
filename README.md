# 🚗 Vehicle Management System

A full-stack MERN application for vehicle rental management with role-based access control.

## 🌟 Features

### For Drivers
- Browse and search available vehicles
- Filter by type, city, and price
- Book vehicles with date selection
- View booking history
- Make payments
- Track booking status

### For Vehicle Admins
- Add and manage vehicles
- Upload vehicle images
- View and manage bookings
- Track earnings
- Update vehicle availability

### For Super Admins
- Manage all users
- Approve vehicle admins
- View system reports
- Handle complaints
- Document verification
- System analytics

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Cloudinary (Image Upload)
- Bcrypt

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Vehilce__Management
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file (optional)
cp .env.example .env
```

## ⚙️ Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm install -g serve
serve -s build
```

## 📁 Project Structure

```
Vehilce__Management/
├── backend/
│   ├── config/         # Database & configurations
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth & validation
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   └── server.js       # Entry point
├── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── api/        # API calls
│   │   ├── components/ # Reusable components
│   │   ├── context/    # React Context
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── hooks/      # Custom hooks
│   │   ├── layouts/    # Layout components
│   │   ├── constants/  # Constants
│   │   └── utils/      # Utilities
│   └── package.json
└── README.md
```

## 🔐 Default Users

After seeding the database:

**Super Admin:**
- Email: superadmin@rentease.com
- Password: admin123

**Vehicle Admin:**
- Email: vehicleadmin@rentease.com
- Password: admin123

**Driver:**
- Email: driver@rentease.com
- Password: driver123

## 🗄️ Database Seeding

```bash
cd backend
node seedDB.js
```

## 🐳 Docker Support

```bash
docker-compose up
```

## 📝 API Endpoints

### Authentication
- POST `/api/auth/signup` - Register user
- POST `/api/auth/login` - Login user

### Vehicles
- GET `/api/vehicles` - Get all vehicles
- POST `/api/vehicles` - Add vehicle (Vehicle Admin)
- PUT `/api/vehicles/:id` - Update vehicle
- DELETE `/api/vehicles/:id` - Delete vehicle

### Bookings
- GET `/api/bookings` - Get bookings
- POST `/api/bookings` - Create booking
- PUT `/api/bookings/:id/status` - Update status

### Users
- GET `/api/users/profile` - Get profile
- PUT `/api/users/profile` - Update profile
- GET `/api/users` - Get all users (Super Admin)

## 🎨 Features Highlights

- ✅ JWT Authentication
- ✅ Role-based Access Control
- ✅ Image Upload (Cloudinary)
- ✅ Responsive Design
- ✅ Real-time Availability
- ✅ Payment Integration Ready
- ✅ Search & Filter
- ✅ Booking Management
- ✅ Admin Dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React Documentation
- MongoDB Documentation
- Tailwind CSS
- Cloudinary

## 📞 Support

For support, email support@rentease.com or create an issue in the repository.

---

**Built with ❤️ using MERN Stack**
