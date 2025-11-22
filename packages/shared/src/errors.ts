export class SupranormaError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public meta?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      meta: this.meta,
      stack: this.stack,
    };
  }
}

export class ValidationError extends SupranormaError {
  constructor(message: string, meta?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, meta);
  }
}

export class NotFoundError extends SupranormaError {
  constructor(message: string, meta?: Record<string, any>) {
    super(message, 'NOT_FOUND', 404, meta);
  }
}

export class UnauthorizedError extends SupranormaError {
  constructor(message: string, meta?: Record<string, any>) {
    super(message, 'UNAUTHORIZED', 401, meta);
  }
}

export class ForbiddenError extends SupranormaError {
  constructor(message: string, meta?: Record<string, any>) {
    super(message, 'FORBIDDEN', 403, meta);
  }
}

export class ConfigurationError extends SupranormaError {
  constructor(message: string, meta?: Record<string, any>) {
    super(message, 'CONFIGURATION_ERROR', 500, meta);
  }
}

export class ProcessingError extends SupranormaError {
  constructor(message: string, meta?: Record<string, any>) {
    super(message, 'PROCESSING_ERROR', 500, meta);
  }
}

export function isSupranormaError(error: unknown): error is SupranormaError {
  return error instanceof SupranormaError;
}

export function handleError(error: unknown): SupranormaError {
  if (isSupranormaError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new SupranormaError(error.message, 'UNKNOWN_ERROR', 500, {
      originalError: error.name,
    });
  }

  return new SupranormaError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    500,
    { error: String(error) }
  );
}
