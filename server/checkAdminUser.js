const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-reservation', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const adminUser = await User.findOne({ email: 'admin@cinemax.com' });
    if (!adminUser) {
      console.log('Admin user not found');
    } else {
      console.log('Admin user found:');
      console.log('Email:', adminUser.email);
      console.log('Password (hashed):', adminUser.password);
      console.log('Phone:', adminUser.phone);
      console.log('Role:', adminUser.role);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking admin user:', error);
    process.exit(1);
  }
};

checkAdminUser();
