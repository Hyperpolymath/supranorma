import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { createLogger } from '@supranorma/shared';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';
import { authRouter } from './routes/auth';
import { projectsRouter } from './routes/projects';
import { tasksRouter } from './routes/tasks';
import { aiRouter } from './routes/ai';
import { usersRouter } from './routes/users';
import { initDatabase } from './database';

config();

const logger = createLogger({ prefix: 'server' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/ai', aiRouter);
app.use('/api/users', usersRouter);

// Error handling
app.use(errorHandler);

// Initialize database and start server
async function start() {
  try {
    await initDatabase();
    logger.info('Database initialized');

    app.listen(PORT, () => {
      logger.success(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', (error as Error).message);
    process.exit(1);
  }
}

start();
