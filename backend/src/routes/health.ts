import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { getRedisClient } from '../config/redis';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

router.get('/detailed', async (_req: Request, res: Response) => {
  const checks: any = {
    server: 'healthy',
    database: 'unknown',
    redis: 'unknown',
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'healthy';
  } catch (error) {
    checks.database = 'unhealthy';
  }

  try {
    const redis = await getRedisClient();
    await redis.ping();
    checks.redis = 'healthy';
  } catch (error) {
    checks.redis = 'unhealthy';
  }

  const isHealthy = checks.database === 'healthy' && checks.redis === 'healthy';

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    data: {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    },
  });
});

export default router;