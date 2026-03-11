const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');
const Complaint = require('./models/Complaint');
const Document = require('./models/Document');
const Review = require('./models/Review');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://Rupesh_yadav_12:Rupesh_yadav_12@cluster0.te3iv0m.mongodb.net/vehicle-rental?retryWrites=true&w=majority&appName=Cluster0");
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Complaint.deleteMany({});
    await Document.deleteMany({});
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const superadmin = await User.create({
      name: 'Super Admin',
      email: 'admin@vehiclerental.com',
      password: hashedPassword,
      role: 'superadmin',
      phone: '9876543210',
      address: 'Mumbai, Maharashtra',
      isActive: true,
      isVerified: true
    });

    const vehicleAdmin = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh@vehiclerental.com',
      password: hashedPassword,
      role: 'vehicleadmin',
      phone: '9876543211',
      address: 'Delhi, India',
      licenseNumber: 'DL1234567890',
      aadharNumber: '123456789012',
      isActive: true,
      isVerified: true
    });

    const driver = await User.create({
      name: 'Amit Sharma',
      email: 'amit@driver.com',
      password: hashedPassword,
      role: 'driver',
      phone: '9876543212',
      address: 'Pune, Maharashtra',
      licenseNumber: 'MH1234567890',
      aadharNumber: '234567890123',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male',
      isActive: true,
      isVerified: true,
      rating: 4.5,
      totalRides: 10
    });

    console.log('✅ Users created');

    // Create Vehicles
    const vehicle1 = await Vehicle.create({
      name: 'Honda City',
      brand: 'Honda',
      model: 'City VX',
      type: 'car',
      year: 2022,
      registrationNumber: 'MH12AB1234',
      pricePerDay: 2500,
      pricePerHour: 150,
      fuelType: 'Petrol',
      seatingCapacity: 5,
      transmission: 'Automatic',
      availability: true,
      owner: vehicleAdmin._id,
      images: [
        'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-77.jpeg'
      ],
      features: ['AC', 'GPS', 'Music System', 'Power Windows', 'Bluetooth'],
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      address: 'Andheri West, Mumbai',
      rating: 4.5,
      totalBookings: 5,
      isVerified: true,
      condition: 'excellent'
    });

    const vehicle2 = await Vehicle.create({
      name: 'Royal Enfield Classic',
      brand: 'Royal Enfield',
      model: 'Classic 350',
      type: 'bike',
      year: 2023,
      registrationNumber: 'MH12CD5678',
      pricePerDay: 800,
      pricePerHour: 50,
      fuelType: 'Petrol',
      seatingCapacity: 2,
      transmission: 'Manual',
      availability: true,
      owner: vehicleAdmin._id,
      images: [
        'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
      ],
      features: ['Helmet', 'Disc Brake', 'LED Lights'],
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      address: 'Koregaon Park, Pune',
      rating: 4.7,
      totalBookings: 3,
      isVerified: true,
      condition: 'good'
    });

    console.log('✅ Vehicles created');

    // Create Bookings
    const booking1 = await Booking.create({
      bookingId: 'BK' + Date.now(),
      vehicle: vehicle1._id,
      driver: driver._id,
      vehicleOwner: vehicleAdmin._id,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-17'),
      startTime: '10:00 AM',
      endTime: '10:00 AM',
      pickupLocation: {
        address: 'Andheri West, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      dropLocation: {
        address: 'Andheri West, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      bookingType: 'daily',
      duration: 2,
      baseAmount: 5000,
      taxes: 900,
      totalAmount: 6900,
      securityDeposit: 1250,
      status: 'completed',
      paymentStatus: 'paid',
      otp: '123456'
    });

    const booking2 = await Booking.create({
      bookingId: 'BK' + (Date.now() + 1),
      vehicle: vehicle2._id,
      driver: driver._id,
      vehicleOwner: vehicleAdmin._id,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-03'),
      startTime: '09:00 AM',
      endTime: '09:00 AM',
      pickupLocation: {
        address: 'Koregaon Park, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001'
      },
      dropLocation: {
        address: 'Koregaon Park, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001'
      },
      bookingType: 'daily',
      duration: 2,
      baseAmount: 1600,
      taxes: 288,
      totalAmount: 2288,
      securityDeposit: 400,
      status: 'confirmed',
      paymentStatus: 'paid',
      otp: '654321'
    });

    console.log('✅ Bookings created');

    // Create Payments
    await Payment.create({
      paymentId: 'PAY' + Date.now(),
      booking: booking1._id,
      user: driver._id,
      amount: 6900,
      paymentMethod: 'razorpay',
      paymentType: 'booking',
      status: 'success',
      transactionId: 'TXN' + Date.now(),
      paidAt: new Date('2024-01-15')
    });

    await Payment.create({
      paymentId: 'PAY' + (Date.now() + 1),
      booking: booking2._id,
      user: driver._id,
      amount: 2288,
      paymentMethod: 'cash',
      paymentType: 'booking',
      status: 'success',
      transactionId: 'TXN' + (Date.now() + 1),
      paidAt: new Date('2024-02-01')
    });

    console.log('✅ Payments created');

    // Create Complaints
    await Complaint.create({
      complainant: driver._id,
      booking: booking1._id,
      title: 'Vehicle cleanliness issue',
      description: 'The vehicle was not properly cleaned before handover.',
      status: 'resolved',
      priority: 'medium'
    });

    await Complaint.create({
      complainant: driver._id,
      title: 'Payment refund pending',
      description: 'Security deposit refund is pending for 5 days.',
      status: 'open',
      priority: 'high'
    });

    console.log('✅ Complaints created');

    // Create Documents
    await Document.create({
      user: vehicleAdmin._id,
      documentType: 'license',
      documentNumber: 'DL1234567890',
      documentUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      isVerified: true,
      verifiedBy: superadmin._id,
      verifiedAt: new Date()
    });

    await Document.create({
      user: driver._id,
      documentType: 'aadhar',
      documentNumber: '234567890123',
      documentUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      isVerified: false
    });

    console.log('✅ Documents created');

    // Create Reviews
    await Review.create({
      booking: booking1._id,
      vehicle: vehicle1._id,
      user: driver._id,
      rating: 5,
      comment: 'Excellent car! Very clean and well maintained. Highly recommended.',
      isVerified: true
    });

    await Review.create({
      booking: booking2._id,
      vehicle: vehicle2._id,
      user: driver._id,
      rating: 4,
      comment: 'Good bike, smooth ride. Minor scratches but overall good condition.',
      isVerified: true
    });

    console.log('✅ Reviews created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Super Admin: admin@vehiclerental.com / password123');
    console.log('Vehicle Admin: rajesh@vehiclerental.com / password123');
    console.log('Driver: amit@driver.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
