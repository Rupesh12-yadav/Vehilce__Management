const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoUri =
      process.env.MONGODB_URI || process.env.MONGO_URI;

    // Agar .env me nahi hai to direct fallback use karo
    if (!mongoUri) {
      mongoUri =
        "mongodb+srv://Rupesh_yadav_12:Rupesh_yadav_12@cluster0.te3iv0m.mongodb.net/vehicle-rental?retryWrites=true&w=majority&appName=Cluster0";
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;