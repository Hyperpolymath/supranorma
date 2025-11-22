import { Request, Response, NextFunction } from 'express';
import { isSupranormaError } from '@supranorma/shared';
import { createLogger } from '@supranorma/shared';

const logger = createLogger({ prefix: 'error-handler' });

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Request error:', error.message);

  if (isSupranormaError(error)) {
    return res.status(error.statusCode || 500).json({
      error: {
        message: error.message,
        code: error.code,
        ...error.meta,
      },
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        message: error.message,
        code: 'VALIDATION_ERROR',
      },
    });
  }

  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
}
