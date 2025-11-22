export interface DataRecord {
  [key: string]: any;
}

export interface DataSource<T = DataRecord> {
  read(): AsyncIterableIterator<T>;
  close?(): Promise<void>;
}

export interface DataSink<T = DataRecord> {
  write(record: T): Promise<void>;
  writeBatch(records: T[]): Promise<void>;
  close(): Promise<void>;
}

export interface Transformer<TIn = DataRecord, TOut = DataRecord> {
  transform(record: TIn): Promise<TOut | TOut[] | null>;
  transformBatch?(records: TIn[]): Promise<TOut[]>;
}

export interface FilterPredicate<T = DataRecord> {
  (record: T): boolean | Promise<boolean>;
}

export interface PipelineOptions {
  batchSize?: number;
  concurrency?: number;
  errorHandler?: (error: Error, record: DataRecord) => void | Promise<void>;
}

export interface PipelineStats {
  recordsProcessed: number;
  recordsSkipped: number;
  recordsErrored: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

export interface Plugin {
  name: string;
  version: string;
  initialize?(): Promise<void>;
  shutdown?(): Promise<void>;
}

export interface ValidationRule<T = DataRecord> {
  name: string;
  validate(record: T): boolean | Promise<boolean>;
  message?: string;
}

export interface AggregationFunction<T = DataRecord, R = any> {
  name: string;
  initialize(): R;
  accumulate(acc: R, record: T): R;
  finalize(acc: R): any;
}
