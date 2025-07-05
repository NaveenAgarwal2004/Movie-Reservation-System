const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkAdminUserEnhanced = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-reservation', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const adminUsers = await User.find({ role: 'admin' });
    if (adminUsers.length === 0) {
      console.log('No admin users found in the database.');
    } else {
      console.log(`Found ${adminUsers.length} admin user(s):`);
      adminUsers.forEach((user, index) => {
        console.log(`Admin User #${index + 1}:`);
        console.log('  Email:', user.email);
        console.log('  Phone:', user.phone);
        console.log('  Role:', user.role);
        console.log('  Created At:', user.createdAt);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking admin users:', error);
    process.exit(1);
  }
};

checkAdminUserEnhanced();
