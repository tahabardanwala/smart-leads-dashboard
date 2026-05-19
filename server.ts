import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import authRoutes from './src/routes/authRoutes.ts';
import leadRoutes from './src/routes/leadRoutes.ts';
import { errorHandler } from './src/utils/errorHandler';

dotenv.config();

// Environment Variable Validation
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`CRITICAL ERROR: Environment variable ${varName} is missing.`);
    process.exit(1);
  }
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middlewares
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.APP_URL || '*'] 
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  }));
  app.use(express.json());

  // Database Connection
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Successfully connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Fail fast if DB connection fails
  }

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API is healthy', data: { timestamp: new Date() } });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/leads', leadRoutes);

  // Centralized Error Handling
  app.use(errorHandler);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT as number, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
