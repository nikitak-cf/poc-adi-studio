import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';
import { env } from '../config/env';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';
  let details: any = undefined;
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code || code;
    message = err.message;
    details = err.details;
    isOperational = err.isOperational;
  }

  const logData = {
    requestId: (req as any).id,
    method: req.method,
    url: req.url,
    statusCode,
    code,
    message,
    details,
    stack: err.stack,
  };

  if (isOperational) {
    logger.warn('Operational error:', logData);
  } else {
    logger.error('Unexpected error:', logData);
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };

  if (env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.url}`,
    },
  });
}

export default errorHandler;