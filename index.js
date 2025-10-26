import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

// Import the shared logger
import logger from './config/logger.js';

// Routes
import AuthRoutes from './routes/AuthRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Morgan setup (pipe to Winston)
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// ✅ Security and middleware
const allowedOrigins = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/auth', AuthRoutes);
// app.use('/api/properties', propertyRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/enquiries', enquiryRoutes);

app.get('/', (req, res) => {
  res.send('Lease Connect Back-end Service is running...');
});

// ✅ Centralized error handling middleware
app.use((err, req, res, next) => {
  logger.error(`❌ Error: ${err.message}`, { stack: err.stack });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ✅ Database connection + server start
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/PropertiesDB';

const startServer = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      logger.info(`🚀 Auth Service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
