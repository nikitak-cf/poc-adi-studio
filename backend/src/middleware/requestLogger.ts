import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = uuidv4();
  (req as any).id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const requestId = (req as any).id;

  logger.http('Request started', {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    if (res.statusCode >= 500) {
      logger.error('Request completed with error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request completed with client error', logData);
    } else {
      logger.http('Request completed', logData);
    }
  });

  next();
}

export default { requestIdMiddleware, requestLoggerMiddleware };