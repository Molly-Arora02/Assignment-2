import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedDatabase } from './services/seedService.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import driveRoutes from './routes/driveRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sub-router for all API endpoints
const apiRouter = express.Router();

// Healthcheck
apiRouter.get('/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'online',
    system: 'CampusConnect Placement & Internship Management API',
    databaseConnected: isConnected,
    databaseMode: process.env.MONGODB_URI ? 'MongoDB Atlas' : 'In-Memory / Unconfigured',
    timestamp: new Date().toISOString(),
  });
});

// Guard API endpoints against hanging when MongoDB is unconfigured
apiRouter.use((req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1 && !process.env.MONGODB_URI && (process.env.NODE_ENV === 'production' || process.env.VERCEL)) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB is not connected. Please set the MONGODB_URI environment variable in your Vercel Project Settings.',
    });
  }
  next();
});

// API Endpoints
apiRouter.use('/auth', authRoutes);
apiRouter.use('/students', studentRoutes);
apiRouter.use('/drives', driveRoutes);
apiRouter.use('/applications', applicationRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/companies', companyRoutes);
apiRouter.use('/resume', resumeRoutes);

// Database re-seed endpoint for demo testing
apiRouter.post('/seed', async (req, res, next) => {
  try {
    await seedDatabase();
    res.status(200).json({ success: true, message: 'Database refreshed & seeded successfully' });
  } catch (error) {
    next(error);
  }
});

// Mount router at both '/api' and '/' (for Vercel serverless function path flexibility)
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Centralized error handler
app.use(errorHandler);

export default app;
