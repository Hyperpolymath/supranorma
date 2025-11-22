import { z } from 'zod';
import { ValidationRule, DataRecord } from './types';

export class SchemaValidator implements ValidationRule {
  constructor(
    public name: string,
    private schema: z.ZodSchema,
    public message?: string
  ) {}

  validate(record: DataRecord): boolean {
    return this.schema.safeParse(record).success;
  }
}

export class RequiredFieldsValidator implements ValidationRule {
  public name = 'required-fields';

  constructor(
    private fields: string[],
    public message = 'Missing required fields'
  ) {}

  validate(record: DataRecord): boolean {
    return this.fields.every((field) => field in record && record[field] != null);
  }
}

export class TypeValidator implements ValidationRule {
  public name = 'type-validator';

  constructor(
    private schema: Record<string, 'string' | 'number' | 'boolean' | 'object' | 'array'>,
    public message = 'Type validation failed'
  ) {}

  validate(record: DataRecord): boolean {
    return Object.entries(this.schema).every(([field, type]) => {
      if (!(field in record)) return true;

      const value = record[field];

      switch (type) {
        case 'string':
          return typeof value === 'string';
        case 'number':
          return typeof value === 'number';
        case 'boolean':
          return typeof value === 'boolean';
        case 'object':
          return typeof value === 'object' && !Array.isArray(value);
        case 'array':
          return Array.isArray(value);
        default:
          return true;
      }
    });
  }
}

export class RangeValidator implements ValidationRule {
  public name = 'range-validator';

  constructor(
    private field: string,
    private min: number,
    private max: number,
    public message = `Value must be between ${min} and ${max}`
  ) {}

  validate(record: DataRecord): boolean {
    const value = record[this.field];

    if (typeof value !== 'number') return false;

    return value >= this.min && value <= this.max;
  }
}

export class PatternValidator implements ValidationRule {
  public name = 'pattern-validator';

  constructor(
    private field: string,
    private pattern: RegExp,
    public message = 'Pattern validation failed'
  ) {}

  validate(record: DataRecord): boolean {
    const value = record[this.field];

    if (typeof value !== 'string') return false;

    return this.pattern.test(value);
  }
}

export class CustomValidator implements ValidationRule {
  constructor(
    public name: string,
    private validator: (record: DataRecord) => boolean | Promise<boolean>,
    public message = 'Custom validation failed'
  ) {}

  validate(record: DataRecord): boolean | Promise<boolean> {
    return this.validator(record);
  }
}

export class ValidatorChain implements ValidationRule {
  public name = 'validator-chain';
  public message = 'Validation failed';

  constructor(private validators: ValidationRule[]) {}

  async validate(record: DataRecord): Promise<boolean> {
    for (const validator of this.validators) {
      const result = await validator.validate(record);
      if (!result) {
        this.message = validator.message || 'Validation failed';
        return false;
      }
    }
    return true;
  }
}
