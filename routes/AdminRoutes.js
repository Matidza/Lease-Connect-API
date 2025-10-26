import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import UserModel from '../models/UserModel.js';
import logger from '../config/logger.js';

dotenv.config();

const router = express.Router();

router.post('/create-admin', async (req, res) => {
  const routeInfo = '/create-admin';
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn(`⚠️ Missing email or password`, { route: routeInfo, body: req.body });
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Connect to DB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info(`✅ Connected to MongoDB for admin creation`, { route: routeInfo });
    }

    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ user_type: 'admin' });
    if (existingAdmin) {
      logger.warn('⚠️ Admin already exists', { route: routeInfo, email });
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new UserModel({
      email,
      password: hashedPassword,
      user_type: 'admin',
      verified: true,
    });

    await admin.save();

    logger.info(`✅ Super Admin created`, { route: routeInfo, email: admin.email });
    res.status(201).json({
      message: 'Super Admin created successfully',
      email: admin.email,
    });

  } catch (error) {
    logger.error(`❌ Error creating admin`, { route: routeInfo, error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
