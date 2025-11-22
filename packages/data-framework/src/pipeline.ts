import {
  DataSource,
  DataSink,
  Transformer,
  FilterPredicate,
  PipelineOptions,
  PipelineStats,
  DataRecord,
} from './types';
import { createLogger } from '@supranorma/shared';
import { promiseMap } from '@supranorma/shared';

const logger = createLogger({ prefix: 'pipeline' });

export class Pipeline<TIn = DataRecord, TOut = DataRecord> {
  private source?: DataSource<TIn>;
  private sink?: DataSink<TOut>;
  private transformers: Transformer<any, any>[] = [];
  private filters: FilterPredicate<any>[] = [];
  private stats: PipelineStats;
  private options: Required<PipelineOptions>;

  constructor(options: PipelineOptions = {}) {
    this.options = {
      batchSize: options.batchSize || 100,
      concurrency: options.concurrency || 10,
      errorHandler: options.errorHandler || this.defaultErrorHandler,
    };

    this.stats = {
      recordsProcessed: 0,
      recordsSkipped: 0,
      recordsErrored: 0,
      startTime: new Date(),
    };
  }

  from(source: DataSource<TIn>): this {
    this.source = source;
    return this;
  }

  to(sink: DataSink<TOut>): this {
    this.sink = sink;
    return this;
  }

  transform<TNext>(transformer: Transformer<TOut, TNext>): Pipeline<TIn, TNext> {
    this.transformers.push(transformer);
    return this as any;
  }

  filter(predicate: FilterPredicate<TOut>): this {
    this.filters.push(predicate);
    return this;
  }

  map<TNext>(
    mapper: (record: TOut) => TNext | Promise<TNext>
  ): Pipeline<TIn, TNext> {
    return this.transform({
      async transform(record: TOut): Promise<TNext> {
        return mapper(record);
      },
    });
  }

  flatMap<TNext>(
    mapper: (record: TOut) => TNext[] | Promise<TNext[]>
  ): Pipeline<TIn, TNext> {
    return this.transform({
      async transform(record: TOut): Promise<TNext[]> {
        return mapper(record);
      },
    });
  }

  async execute(): Promise<PipelineStats> {
    if (!this.source) {
      throw new Error('Pipeline source not set');
    }

    logger.info('Starting pipeline execution');
    this.stats.startTime = new Date();

    try {
      const batches: TOut[] = [];

      for await (const record of this.source.read()) {
        try {
          const processed = await this.processRecord(record);

          if (processed !== null) {
            if (Array.isArray(processed)) {
              batches.push(...processed);
            } else {
              batches.push(processed);
            }
          }

          if (batches.length >= this.options.batchSize && this.sink) {
            await this.sink.writeBatch(batches.splice(0, batches.length));
          }
        } catch (error) {
          this.stats.recordsErrored++;
          await this.options.errorHandler(error as Error, record as any);
        }
      }

      // Flush remaining records
      if (batches.length > 0 && this.sink) {
        await this.sink.writeBatch(batches);
      }
    } finally {
      await this.cleanup();
    }

    this.stats.endTime = new Date();
    this.stats.duration = this.stats.endTime.getTime() - this.stats.startTime.getTime();

    logger.info('Pipeline execution completed', this.stats);
    return this.stats;
  }

  private async processRecord(record: TIn): Promise<TOut | TOut[] | null> {
    let current: any = record;

    // Apply transformers
    for (const transformer of this.transformers) {
      if (Array.isArray(current)) {
        const results: any[] = [];
        for (const item of current) {
          const transformed = await transformer.transform(item);
          if (transformed !== null) {
            if (Array.isArray(transformed)) {
              results.push(...transformed);
            } else {
              results.push(transformed);
            }
          }
        }
        current = results;
      } else {
        current = await transformer.transform(current);
      }

      if (current === null) {
        this.stats.recordsSkipped++;
        return null;
      }
    }

    // Apply filters
    const records = Array.isArray(current) ? current : [current];
    const filtered: TOut[] = [];

    for (const rec of records) {
      let passesFilters = true;

      for (const filter of this.filters) {
        if (!(await filter(rec))) {
          passesFilters = false;
          break;
        }
      }

      if (passesFilters) {
        filtered.push(rec);
      } else {
        this.stats.recordsSkipped++;
      }
    }

    this.stats.recordsProcessed += filtered.length;

    return filtered.length === 0 ? null : filtered.length === 1 ? filtered[0] : filtered;
  }

  private async cleanup(): Promise<void> {
    if (this.source?.close) {
      await this.source.close();
    }

    if (this.sink) {
      await this.sink.close();
    }
  }

  private defaultErrorHandler(error: Error, record: DataRecord): void {
    logger.error('Error processing record:', error.message, record);
  }

  getStats(): PipelineStats {
    return { ...this.stats };
  }
}

export function createPipeline<T = DataRecord>(
  options?: PipelineOptions
): Pipeline<T, T> {
  return new Pipeline<T, T>(options);
}
