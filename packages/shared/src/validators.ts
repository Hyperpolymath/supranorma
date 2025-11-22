import { z } from 'zod';
import { ValidationError } from './errors';

export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', {
        errors: error.errors,
      });
    }
    throw error;
  }
}

export function validateSchemaAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  return schema.parseAsync(data).catch((error) => {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', {
        errors: error.errors,
      });
    }
    throw error;
  });
}

export function isEmail(value: string): boolean {
  return z.string().email().safeParse(value).success;
}

export function isUrl(value: string): boolean {
  return z.string().url().safeParse(value).success;
}

export function isUuid(value: string): boolean {
  return z.string().uuid().safeParse(value).success;
}

export function isPositiveInteger(value: number): boolean {
  return z.number().int().positive().safeParse(value).success;
}

export const CommonSchemas = {
  email: z.string().email(),
  url: z.string().url(),
  uuid: z.string().uuid(),
  positiveInt: z.number().int().positive(),
  nonEmptyString: z.string().min(1),
  pagination: z.object({
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().max(100).default(20),
  }),
  sortDirection: z.enum(['asc', 'desc']),
  timestamp: z.string().datetime(),
};
