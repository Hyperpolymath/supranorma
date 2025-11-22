import { Transformer, DataRecord } from './types';

export class MapTransformer<TIn, TOut> implements Transformer<TIn, TOut> {
  constructor(private mapper: (record: TIn) => TOut | Promise<TOut>) {}

  async transform(record: TIn): Promise<TOut> {
    return this.mapper(record);
  }
}

export class FilterTransformer<T> implements Transformer<T, T> {
  constructor(private predicate: (record: T) => boolean | Promise<boolean>) {}

  async transform(record: T): Promise<T | null> {
    const passes = await this.predicate(record);
    return passes ? record : null;
  }
}

export class FlatMapTransformer<TIn, TOut> implements Transformer<TIn, TOut> {
  constructor(private mapper: (record: TIn) => TOut[] | Promise<TOut[]>) {}

  async transform(record: TIn): Promise<TOut[]> {
    return this.mapper(record);
  }
}

export class RenameFieldsTransformer implements Transformer {
  constructor(private fieldMap: Record<string, string>) {}

  async transform(record: DataRecord): Promise<DataRecord> {
    const result: DataRecord = {};

    Object.entries(record).forEach(([key, value]) => {
      const newKey = this.fieldMap[key] || key;
      result[newKey] = value;
    });

    return result;
  }
}

export class SelectFieldsTransformer implements Transformer {
  constructor(private fields: string[]) {}

  async transform(record: DataRecord): Promise<DataRecord> {
    const result: DataRecord = {};

    this.fields.forEach((field) => {
      if (field in record) {
        result[field] = record[field];
      }
    });

    return result;
  }
}

export class ExcludeFieldsTransformer implements Transformer {
  constructor(private fields: string[]) {}

  async transform(record: DataRecord): Promise<DataRecord> {
    const result = { ...record };

    this.fields.forEach((field) => {
      delete result[field];
    });

    return result;
  }
}

export class AddFieldTransformer implements Transformer {
  constructor(
    private fieldName: string,
    private valueOrFn: any | ((record: DataRecord) => any)
  ) {}

  async transform(record: DataRecord): Promise<DataRecord> {
    const value =
      typeof this.valueOrFn === 'function'
        ? this.valueOrFn(record)
        : this.valueOrFn;

    return {
      ...record,
      [this.fieldName]: value,
    };
  }
}

export class TypeCastTransformer implements Transformer {
  constructor(private schema: Record<string, 'string' | 'number' | 'boolean' | 'date'>) {}

  async transform(record: DataRecord): Promise<DataRecord> {
    const result: DataRecord = {};

    Object.entries(record).forEach(([key, value]) => {
      const type = this.schema[key];

      if (!type) {
        result[key] = value;
        return;
      }

      switch (type) {
        case 'string':
          result[key] = String(value);
          break;
        case 'number':
          result[key] = Number(value);
          break;
        case 'boolean':
          result[key] = Boolean(value);
          break;
        case 'date':
          result[key] = new Date(value);
          break;
        default:
          result[key] = value;
      }
    });

    return result;
  }
}

export class SortTransformer implements Transformer {
  private buffer: DataRecord[] = [];

  constructor(
    private compareFn: (a: DataRecord, b: DataRecord) => number,
    private bufferSize: number = 1000
  ) {}

  async transform(record: DataRecord): Promise<DataRecord[] | null> {
    this.buffer.push(record);

    if (this.buffer.length >= this.bufferSize) {
      const sorted = this.buffer.sort(this.compareFn);
      this.buffer = [];
      return sorted;
    }

    return null;
  }
}

export class DeduplicateTransformer implements Transformer {
  private seen = new Set<string>();

  constructor(private keyFn: (record: DataRecord) => string) {}

  async transform(record: DataRecord): Promise<DataRecord | null> {
    const key = this.keyFn(record);

    if (this.seen.has(key)) {
      return null;
    }

    this.seen.add(key);
    return record;
  }
}

export class JoinTransformer implements Transformer {
  constructor(
    private lookupData: Map<any, DataRecord>,
    private leftKey: string,
    private rightKey: string = leftKey
  ) {}

  async transform(record: DataRecord): Promise<DataRecord | null> {
    const keyValue = record[this.leftKey];
    const rightRecord = this.lookupData.get(keyValue);

    if (!rightRecord) {
      return null;
    }

    return {
      ...record,
      ...rightRecord,
    };
  }
}

export class GroupByTransformer implements Transformer {
  private groups = new Map<string, DataRecord[]>();

  constructor(private keyFn: (record: DataRecord) => string) {}

  async transform(record: DataRecord): Promise<null> {
    const key = this.keyFn(record);

    if (!this.groups.has(key)) {
      this.groups.set(key, []);
    }

    this.groups.get(key)!.push(record);
    return null;
  }

  getGroups(): Map<string, DataRecord[]> {
    return this.groups;
  }
}
