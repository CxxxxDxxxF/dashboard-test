import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { logger } from './utils/logger.js';
import { Database } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

// Import routes
import postsRouter from './routes/posts.js';
import analyticsRouter from './routes/analytics.js';
import socialAccountsRouter from './routes/socialAccounts.js';
import healthRouter from './routes/health.js';
import calendarRouter from './routes/calendar.js';
// import mediaRouter from './routes/media.js';
import composerRouter from './routes/composer.js';
import settingsRouter from './routes/settings.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 4000;

/**
 * Security middleware
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

/**
 * CORS configuration
 */
app.use(cors({
  origin: process.env['FRONTEND_URL'] || 'http://localhost:8000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * Rate limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

/**
 * Body parsing middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Compression middleware
 */
app.use(compression());

/**
 * Logging middleware
 */
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * API routes
 */
app.use('/api/health', healthRouter);
app.use('/api/posts', postsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/social-accounts', socialAccountsRouter);
app.use('/api/calendar', calendarRouter);
// app.use('/api/media', mediaRouter);
app.use('/api/composer', composerRouter);
app.use('/api/settings', settingsRouter);

/**
 * API documentation endpoint
 */
app.get('/api', (req, res) => {
  res.json({
    message: 'Rutgers University Social Media Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      posts: '/api/posts',
      analytics: '/api/analytics',
      socialAccounts: '/api/social-accounts',
    },
  });
});

/**
 * Error handling middleware (must be last)
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Start server
 */
async function startServer(): Promise<void> {
  try {
    // Connect to database
    await Database.connect();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 API available at http://localhost:${PORT}/api`);
      logger.info(`🏥 Health check at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await Database.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await Database.disconnect();
  process.exit(0);
});

// Start the server
startServer(); 