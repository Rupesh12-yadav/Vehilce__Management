const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.log('⚠️  MONGO_URI not found in .env file');
      console.log('Please add: MONGO_URI=mongodb://localhost:27017/vehicle-rental');
      return;
    }
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('Make sure MongoDB is running or use MongoDB Atlas');
  }
};

module.exports = connectDB;