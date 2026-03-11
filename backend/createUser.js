const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://Rupesh_yadav_12:Rupesh_yadav_12@cluster0.te3iv0m.mongodb.net/vehicle-rental?retryWrites=true&w=majority')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      phone: String,
      address: String,
      isActive: Boolean,
      isVerified: Boolean
    }));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // Create Super Admin
    await User.create({
      name: 'Super Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'superadmin',
      phone: '9999999999',
      address: 'Admin Address',
      isActive: true,
      isVerified: true
    });

    // Create Vehicle Admin
    await User.create({
      name: 'Vehicle Admin',
      email: 'vehicle@admin.com',
      password: hashedPassword,
      role: 'vehicleadmin',
      phone: '8888888888',
      address: 'Vehicle Admin Address',
      isActive: true,
      isVerified: true
    });

    // Create Driver
    await User.create({
      name: 'Driver User',
      email: 'driver@test.com',
      password: hashedPassword,
      role: 'driver',
      phone: '7777777777',
      address: 'Driver Address',
      isActive: true,
      isVerified: true
    });

    console.log('✅ Users created successfully!');
    console.log('\nLogin Credentials:');
    console.log('Super Admin: admin@admin.com / 123456');
    console.log('Vehicle Admin: vehicle@admin.com / 123456');
    console.log('Driver: driver@test.com / 123456');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
