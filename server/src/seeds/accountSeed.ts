import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Seed admin account
async function seedAdminAccount() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vnfoodlibrary';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Import User model
    const { default: User } = await import('../features/users/models/Users.js');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@vnfoodlibrary.com' });
    if (existingAdmin) {
      // Update mật khẩu (middleware sẽ tự hash)
      existingAdmin.password = 'Admin@123456';
      await existingAdmin.save();
      console.log('✓ Admin account updated');
      await mongoose.disconnect();
      return;
    }

    // Create admin account (middleware sẽ tự hash password)
    const adminAccount = new User({
      name: 'Admin',
      email: 'admin@vnfoodlibrary.com',
      password: 'Admin@123456',
      role: 'admin',
      status: 'active',
      isActive: true,
      contributionsCount: 0,
      approvedContributions: 0
    });

    await adminAccount.save();
    console.log('✓ Admin account created successfully');
    console.log('  Email: admin@vnfoodlibrary.com');
    console.log('  Password: Admin@123456');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding admin account:', error);
    process.exit(1);
  }
}

// Run seed
seedAdminAccount();
