import { describe, it, expect } from 'vitest';
import {
  SupranormaError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConfigurationError,
  ProcessingError,
  isSupranormaError,
  handleError,
} from '../src/errors';

describe('SupranormaError', () => {
  it('should create basic error', () => {
    const error = new SupranormaError('Test error');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SupranormaError);
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('SupranormaError');
  });

  it('should accept error code', () => {
    const error = new SupranormaError('Test error', 'TEST_CODE');
    expect(error.code).toBe('TEST_CODE');
  });

  it('should accept status code', () => {
    const error = new SupranormaError('Test error', 'TEST_CODE', 500);
    expect(error.statusCode).toBe(500);
  });

  it('should accept metadata', () => {
    const meta = { userId: '123', action: 'login' };
    const error = new SupranormaError('Test error', 'TEST_CODE', 500, meta);
    expect(error.meta).toEqual(meta);
  });

  it('should have stack trace', () => {
    const error = new SupranormaError('Test error');
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('SupranormaError');
  });

  describe('toJSON', () => {
    it('should serialize to JSON', () => {
      const error = new SupranormaError(
        'Test error',
        'TEST_CODE',
        500,
        { foo: 'bar' }
      );
      const json = error.toJSON();

      expect(json).toMatchObject({
        name: 'SupranormaError',
        message: 'Test error',
        code: 'TEST_CODE',
        statusCode: 500,
        meta: { foo: 'bar' },
      });
      expect(json.stack).toBeDefined();
    });

    it('should handle optional fields', () => {
      const error = new SupranormaError('Test error');
      const json = error.toJSON();

      expect(json.name).toBe('SupranormaError');
      expect(json.message).toBe('Test error');
      expect(json.code).toBeUndefined();
      expect(json.statusCode).toBeUndefined();
      expect(json.meta).toBeUndefined();
    });
  });
});

describe('ValidationError', () => {
  it('should extend SupranormaError', () => {
    const error = new ValidationError('Invalid input');
    expect(error).toBeInstanceOf(SupranormaError);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should have correct code and status', () => {
    const error = new ValidationError('Invalid input');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.statusCode).toBe(400);
  });

  it('should accept metadata', () => {
    const error = new ValidationError('Invalid email', { email: 'invalid' });
    expect(error.meta).toEqual({ email: 'invalid' });
  });

  it('should have correct name', () => {
    const error = new ValidationError('Invalid input');
    expect(error.name).toBe('ValidationError');
  });
});

describe('NotFoundError', () => {
  it('should extend SupranormaError', () => {
    const error = new NotFoundError('Resource not found');
    expect(error).toBeInstanceOf(SupranormaError);
    expect(error).toBeInstanceOf(NotFoundError);
  });

  it('should have correct code and status', () => {
    const error = new NotFoundError('User not found');
    expect(error.code).toBe('NOT_FOUND');
    expect(error.statusCode).toBe(404);
  });

  it('should accept metadata', () => {
    const error = new NotFoundError('User not found', { userId: '123' });
    expect(error.meta).toEqual({ userId: '123' });
  });
});

describe('UnauthorizedError', () => {
  it('should extend SupranormaError', () => {
    const error = new UnauthorizedError('Unauthorized');
    expect(error).toBeInstanceOf(SupranormaError);
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('should have correct code and status', () => {
    const error = new UnauthorizedError('Invalid credentials');
    expect(error.code).toBe('UNAUTHORIZED');
    expect(error.statusCode).toBe(401);
  });
});

describe('ForbiddenError', () => {
  it('should extend SupranormaError', () => {
    const error = new ForbiddenError('Forbidden');
    expect(error).toBeInstanceOf(SupranormaError);
    expect(error).toBeInstanceOf(ForbiddenError);
  });

  it('should have correct code and status', () => {
    const error = new ForbiddenError('Access denied');
    expect(error.code).toBe('FORBIDDEN');
    expect(error.statusCode).toBe(403);
  });
});

describe('ConfigurationError', () => {
  it('should extend SupranormaError', () => {
    const error = new ConfigurationError('Invalid configuration');
    expect(error).toBeInstanceOf(SupranormaError);
    expect(error).toBeInstanceOf(ConfigurationError);
  });

  it('should have correct code and status', () => {
    const error = new ConfigurationError('Missing API key');
    expect(error.code).toBe('CONFIGURATION_ERROR');
    expect(error.statusCode).toBe(500);
  });
});

describe('ProcessingError', () => {
  it('should extend SupranormaError', () => {
    const error = new ProcessingError('Processing failed');
    expect(error).toBeInstanceOf(SupranormaError);
    expect(error).toBeInstanceOf(ProcessingError);
  });

  it('should have correct code and status', () => {
    const error = new ProcessingError('Data transformation failed');
    expect(error.code).toBe('PROCESSING_ERROR');
    expect(error.statusCode).toBe(500);
  });
});

describe('isSupranormaError', () => {
  it('should return true for SupranormaError', () => {
    const error = new SupranormaError('test');
    expect(isSupranormaError(error)).toBe(true);
  });

  it('should return true for derived errors', () => {
    expect(isSupranormaError(new ValidationError('test'))).toBe(true);
    expect(isSupranormaError(new NotFoundError('test'))).toBe(true);
    expect(isSupranormaError(new UnauthorizedError('test'))).toBe(true);
  });

  it('should return false for regular Error', () => {
    const error = new Error('test');
    expect(isSupranormaError(error)).toBe(false);
  });

  it('should return false for non-errors', () => {
    expect(isSupranormaError('test')).toBe(false);
    expect(isSupranormaError(123)).toBe(false);
    expect(isSupranormaError(null)).toBe(false);
    expect(isSupranormaError(undefined)).toBe(false);
    expect(isSupranormaError({})).toBe(false);
  });
});

describe('handleError', () => {
  it('should return SupranormaError as-is', () => {
    const original = new ValidationError('test', { foo: 'bar' });
    const handled = handleError(original);
    expect(handled).toBe(original);
  });

  it('should wrap regular Error', () => {
    const original = new Error('test error');
    const handled = handleError(original);

    expect(handled).toBeInstanceOf(SupranormaError);
    expect(handled.message).toBe('test error');
    expect(handled.code).toBe('UNKNOWN_ERROR');
    expect(handled.statusCode).toBe(500);
    expect(handled.meta).toEqual({ originalError: 'Error' });
  });

  it('should handle string errors', () => {
    const handled = handleError('string error');

    expect(handled).toBeInstanceOf(SupranormaError);
    expect(handled.message).toBe('An unknown error occurred');
    expect(handled.code).toBe('UNKNOWN_ERROR');
    expect(handled.statusCode).toBe(500);
    expect(handled.meta).toEqual({ error: 'string error' });
  });

  it('should handle null/undefined errors', () => {
    const handledNull = handleError(null);
    const handledUndefined = handleError(undefined);

    expect(handledNull).toBeInstanceOf(SupranormaError);
    expect(handledUndefined).toBeInstanceOf(SupranormaError);
  });

  it('should handle object errors', () => {
    const handled = handleError({ message: 'object error' });

    expect(handled).toBeInstanceOf(SupranormaError);
    expect(handled.code).toBe('UNKNOWN_ERROR');
    expect(handled.meta?.error).toBeDefined();
  });
});

describe('Error inheritance chain', () => {
  it('should maintain proper inheritance', () => {
    const validation = new ValidationError('test');
    const notFound = new NotFoundError('test');
    const unauthorized = new UnauthorizedError('test');

    // All should be instances of Error
    expect(validation).toBeInstanceOf(Error);
    expect(notFound).toBeInstanceOf(Error);
    expect(unauthorized).toBeInstanceOf(Error);

    // All should be instances of SupranormaError
    expect(validation).toBeInstanceOf(SupranormaError);
    expect(notFound).toBeInstanceOf(SupranormaError);
    expect(unauthorized).toBeInstanceOf(SupranormaError);

    // Should not be instances of each other
    expect(validation).not.toBeInstanceOf(NotFoundError);
    expect(notFound).not.toBeInstanceOf(ValidationError);
  });
});
