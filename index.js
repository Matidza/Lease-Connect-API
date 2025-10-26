import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Routes
import AuthRoutes from './routes/AuthRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

const allowdOrigins = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({
  origin: allowdOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', AuthRoutes);
// app.use('/api/properties', propertyRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/enquiries', enquiryRoutes);

app.get('/', (req, res) => {
  res.send('Lease Connect Back-end Service is running...');
});


// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Database connection + server start
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/PropertiesDB';

const startServer = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Auth Service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit if DB fails
  }
};

startServer()
