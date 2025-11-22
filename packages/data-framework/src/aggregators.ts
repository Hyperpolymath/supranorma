import { AggregationFunction, DataRecord } from './types';

export class CountAggregator implements AggregationFunction {
  name = 'count';

  initialize(): number {
    return 0;
  }

  accumulate(acc: number): number {
    return acc + 1;
  }

  finalize(acc: number): number {
    return acc;
  }
}

export class SumAggregator implements AggregationFunction {
  constructor(private field: string) {}

  name = 'sum';

  initialize(): number {
    return 0;
  }

  accumulate(acc: number, record: DataRecord): number {
    const value = record[this.field];
    return acc + (typeof value === 'number' ? value : 0);
  }

  finalize(acc: number): number {
    return acc;
  }
}

export class AverageAggregator implements AggregationFunction {
  constructor(private field: string) {}

  name = 'average';

  initialize(): { sum: number; count: number } {
    return { sum: 0, count: 0 };
  }

  accumulate(acc: { sum: number; count: number }, record: DataRecord): { sum: number; count: number } {
    const value = record[this.field];
    if (typeof value === 'number') {
      return {
        sum: acc.sum + value,
        count: acc.count + 1,
      };
    }
    return acc;
  }

  finalize(acc: { sum: number; count: number }): number {
    return acc.count > 0 ? acc.sum / acc.count : 0;
  }
}

export class MinAggregator implements AggregationFunction {
  constructor(private field: string) {}

  name = 'min';

  initialize(): number {
    return Infinity;
  }

  accumulate(acc: number, record: DataRecord): number {
    const value = record[this.field];
    if (typeof value === 'number') {
      return Math.min(acc, value);
    }
    return acc;
  }

  finalize(acc: number): number {
    return acc === Infinity ? 0 : acc;
  }
}

export class MaxAggregator implements AggregationFunction {
  constructor(private field: string) {}

  name = 'max';

  initialize(): number {
    return -Infinity;
  }

  accumulate(acc: number, record: DataRecord): number {
    const value = record[this.field];
    if (typeof value === 'number') {
      return Math.max(acc, value);
    }
    return acc;
  }

  finalize(acc: number): number {
    return acc === -Infinity ? 0 : acc;
  }
}

export class CollectAggregator implements AggregationFunction {
  constructor(private field: string) {}

  name = 'collect';

  initialize(): any[] {
    return [];
  }

  accumulate(acc: any[], record: DataRecord): any[] {
    acc.push(record[this.field]);
    return acc;
  }

  finalize(acc: any[]): any[] {
    return acc;
  }
}

export class UniqueAggregator implements AggregationFunction {
  constructor(private field: string) {}

  name = 'unique';

  initialize(): Set<any> {
    return new Set();
  }

  accumulate(acc: Set<any>, record: DataRecord): Set<any> {
    acc.add(record[this.field]);
    return acc;
  }

  finalize(acc: Set<any>): any[] {
    return Array.from(acc);
  }
}

export class GroupByAggregator {
  private groups = new Map<string, Map<string, any>>();

  constructor(
    private keyField: string,
    private aggregators: Record<string, AggregationFunction>
  ) {}

  process(record: DataRecord): void {
    const key = String(record[this.keyField]);

    if (!this.groups.has(key)) {
      const accumulators = new Map<string, any>();
      Object.entries(this.aggregators).forEach(([name, agg]) => {
        accumulators.set(name, agg.initialize());
      });
      this.groups.set(key, accumulators);
    }

    const accumulators = this.groups.get(key)!;

    Object.entries(this.aggregators).forEach(([name, agg]) => {
      const acc = accumulators.get(name);
      accumulators.set(name, agg.accumulate(acc, record));
    });
  }

  getResults(): DataRecord[] {
    const results: DataRecord[] = [];

    this.groups.forEach((accumulators, key) => {
      const result: DataRecord = { [this.keyField]: key };

      Object.entries(this.aggregators).forEach(([name, agg]) => {
        const acc = accumulators.get(name);
        result[name] = agg.finalize(acc);
      });

      results.push(result);
    });

    return results;
  }
}
