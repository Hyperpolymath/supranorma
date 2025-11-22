import { describe, it, expect, beforeEach } from 'vitest';
import { Pipeline } from '../src/pipeline';
import { DataSource, DataSink, Transformer } from '../src/types';

// Mock source that generates test data
class ArraySource<T> implements DataSource<T> {
  constructor(private data: T[]) {}

  async *read(): AsyncGenerator<T> {
    for (const item of this.data) {
      yield item;
    }
  }
}

// Mock sink that collects data
class ArraySink<T> implements DataSink<T> {
  public data: T[] = [];

  async write(records: T[]): Promise<void> {
    this.data.push(...records);
  }

  async close(): Promise<void> {
    // No-op
  }
}

// Mock transformer that doubles numbers
class DoubleTransformer implements Transformer<number, number> {
  async transform(record: number): Promise<number> {
    return record * 2;
  }
}

describe('Pipeline', () => {
  describe('constructor', () => {
    it('should create pipeline with default options', () => {
      const pipeline = new Pipeline();
      expect(pipeline).toBeInstanceOf(Pipeline);
    });

    it('should create pipeline with custom options', () => {
      const pipeline = new Pipeline({
        batchSize: 50,
        concurrency: 5,
      });
      expect(pipeline).toBeInstanceOf(Pipeline);
    });
  });

  describe('from', () => {
    it('should set source', () => {
      const pipeline = new Pipeline();
      const source = new ArraySource([1, 2, 3]);
      const result = pipeline.from(source);
      expect(result).toBe(pipeline); // Should return this for chaining
    });
  });

  describe('to', () => {
    it('should set sink', () => {
      const pipeline = new Pipeline();
      const sink = new ArraySink();
      const result = pipeline.to(sink);
      expect(result).toBe(pipeline); // Should return this for chaining
    });
  });

  describe('transform', () => {
    it('should add transformer', () => {
      const pipeline = new Pipeline<number, number>();
      const transformer = new DoubleTransformer();
      const result = pipeline.transform(transformer);
      expect(result).toBeTruthy(); // Should return pipeline for chaining
    });
  });

  describe('filter', () => {
    it('should add filter', () => {
      const pipeline = new Pipeline<number, number>();
      const predicate = (n: number) => n > 5;
      const result = pipeline.filter(predicate);
      expect(result).toBe(pipeline); // Should return this for chaining
    });
  });

  describe('map', () => {
    it('should add mapper transformation', () => {
      const pipeline = new Pipeline<number, number>();
      const mapper = (n: number) => n * 2;
      const result = pipeline.map(mapper);
      expect(result).toBeTruthy(); // Should return pipeline for chaining
    });
  });

  describe('execute', () => {
    it('should process simple pipeline', async () => {
      const source = new ArraySource([1, 2, 3, 4, 5]);
      const sink = new ArraySink<number>();

      const pipeline = new Pipeline<number, number>()
        .from(source)
        .to(sink);

      const stats = await pipeline.execute();

      expect(stats.recordsProcessed).toBe(5);
      expect(sink.data).toEqual([1, 2, 3, 4, 5]);
    });

    it('should apply transformations', async () => {
      const source = new ArraySource([1, 2, 3]);
      const sink = new ArraySink<number>();

      const pipeline = new Pipeline<number, number>()
        .from(source)
        .map((n) => n * 2)
        .to(sink);

      await pipeline.execute();

      expect(sink.data).toEqual([2, 4, 6]);
    });

    it('should apply filters', async () => {
      const source = new ArraySource([1, 2, 3, 4, 5]);
      const sink = new ArraySink<number>();

      const pipeline = new Pipeline<number, number>()
        .from(source)
        .filter((n) => n % 2 === 0) // Only even numbers
        .to(sink);

      const stats = await pipeline.execute();

      expect(sink.data).toEqual([2, 4]);
      expect(stats.recordsSkipped).toBe(3); // 1, 3, 5 were skipped
    });

    it('should apply multiple transformations', async () => {
      const source = new ArraySource([1, 2, 3]);
      const sink = new ArraySink<number>();

      const pipeline = new Pipeline<number, number>()
        .from(source)
        .map((n) => n * 2)  // 2, 4, 6
        .map((n) => n + 1)  // 3, 5, 7
        .to(sink);

      await pipeline.execute();

      expect(sink.data).toEqual([3, 5, 7]);
    });

    it('should combine transformations and filters', async () => {
      const source = new ArraySource([1, 2, 3, 4, 5]);
      const sink = new ArraySink<number>();

      const pipeline = new Pipeline<number, number>()
        .from(source)
        .map((n) => n * 2)      // 2, 4, 6, 8, 10
        .filter((n) => n > 5)   // 6, 8, 10
        .map((n) => n / 2)      // 3, 4, 5
        .to(sink);

      await pipeline.execute();

      expect(sink.data).toEqual([3, 4, 5]);
    });

    it('should handle async transformations', async () => {
      const source = new ArraySource([1, 2, 3]);
      const sink = new ArraySink<number>();

      const pipeline = new Pipeline<number, number>()
        .from(source)
        .map(async (n) => {
          await new Promise((resolve) => setTimeout(resolve, 1));
          return n * 2;
        })
        .to(sink);

      await pipeline.execute();

      expect(sink.data).toEqual([2, 4, 6]);
    });

    it('should throw error if source not set', async () => {
      const pipeline = new Pipeline();
      await expect(pipeline.execute()).rejects.toThrow('Pipeline source not set');
    });

    it('should return stats with timing', async () => {
      const source = new ArraySource([1, 2, 3]);
      const sink = new ArraySink<number>();

      const pipeline = new Pipeline<number, number>()
        .from(source)
        .to(sink);

      const stats = await pipeline.execute();

      expect(stats).toHaveProperty('recordsProcessed');
      expect(stats).toHaveProperty('recordsSkipped');
      expect(stats).toHaveProperty('recordsErrored');
      expect(stats).toHaveProperty('startTime');
      expect(stats).toHaveProperty('endTime');
      expect(stats).toHaveProperty('durationMs');

      expect(stats.recordsProcessed).toBe(3);
      expect(stats.recordsSkipped).toBe(0);
      expect(stats.recordsErrored).toBe(0);
      expect(stats.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('should work without sink', async () => {
      const source = new ArraySource([1, 2, 3]);

      const pipeline = new Pipeline<number, number>()
        .from(source);

      const stats = await pipeline.execute();

      expect(stats.recordsProcessed).toBe(3);
    });
  });

  describe('flatMap', () => {
    it('should flatten arrays', async () => {
      const source = new ArraySource([1, 2, 3]);
      const sink = new ArraySink<number>();

      const pipeline = new Pipeline<number, number>()
        .from(source)
        .flatMap((n) => [n, n * 2]) // [1, 2, 2, 4, 3, 6]
        .to(sink);

      await pipeline.execute();

      expect(sink.data).toEqual([1, 2, 2, 4, 3, 6]);
    });

    it('should handle async flatMap', async () => {
      const source = new ArraySource([1, 2]);
      const sink = new ArraySink<number>();

      const pipeline = new Pipeline<number, number>()
        .from(source)
        .flatMap(async (n) => {
          await new Promise((resolve) => setTimeout(resolve, 1));
          return [n, n + 10];
        })
        .to(sink);

      await pipeline.execute();

      expect(sink.data).toEqual([1, 11, 2, 12]);
    });
  });

  describe('chaining', () => {
    it('should support method chaining', async () => {
      const source = new ArraySource([1, 2, 3, 4, 5]);
      const sink = new ArraySink<number>();

      const stats = await new Pipeline<number, number>()
        .from(source)
        .filter((n) => n > 2)
        .map((n) => n * 2)
        .filter((n) => n < 10)
        .to(sink)
        .execute();

      expect(sink.data).toEqual([6, 8]);
      expect(stats.recordsProcessed).toBe(5);
    });
  });

  describe('error handling', () => {
    it('should handle transformation errors with custom handler', async () => {
      const source = new ArraySource([1, 2, 3]);
      const sink = new ArraySink<number>();
      const errors: any[] = [];

      const pipeline = new Pipeline<number, number>({
        errorHandler: (record, error) => {
          errors.push({ record, error });
          return null; // Skip errored records
        },
      })
        .from(source)
        .map((n) => {
          if (n === 2) throw new Error('Test error');
          return n;
        })
        .to(sink);

      const stats = await pipeline.execute();

      expect(sink.data).toEqual([1, 3]);
      expect(errors).toHaveLength(1);
      expect(errors[0].record).toBe(2);
      expect(stats.recordsErrored).toBe(1);
    });
  });

  describe('type transformations', () => {
    it('should transform between types', async () => {
      interface User {
        id: number;
        name: string;
      }

      const source = new ArraySource<User>([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]);
      const sink = new ArraySink<string>();

      const pipeline = new Pipeline<User, User>()
        .from(source)
        .map((user) => user.name)
        .to(sink);

      await pipeline.execute();

      expect(sink.data).toEqual(['Alice', 'Bob']);
    });
  });
});
