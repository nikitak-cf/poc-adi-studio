import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { createSessionMiddleware } from './config/session';
import { requestIdMiddleware, requestLoggerMiddleware } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import healthRouter from './routes/health';
import logger from './utils/logger';

async function createApp(): Promise<Application> {
  const app = express();

  app.set('trust proxy', 1);
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  const sessionMiddleware = await createSessionMiddleware();
  app.use(sessionMiddleware);

  app.use('/health', healthRouter);

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      data: {
        name: 'ADI Studio API',
        version: '0.1.0',
        description: 'AI-powered Linear task management assistant',
        environment: env.NODE_ENV,
        mockMode: env.USE_MOCK_SERVICES,
      },
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

async function startServer() {
  try {
    logger.info('Starting ADI Studio Backend...');

    const app = await createApp();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`Mock Services: ${env.USE_MOCK_SERVICES ? 'ENABLED' : 'DISABLED'}`);
      logger.info(`Health check: http://localhost:${env.PORT}/health`);
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, starting graceful shutdown...`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

export { createApp, startServer };
export default createApp;