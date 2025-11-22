import { readFile } from 'fs/promises';
import { createReadStream } from 'fs';
import Papa from 'papaparse';
import { DataSource, DataRecord } from './types';
import { createLogger } from '@supranorma/shared';

const logger = createLogger({ prefix: 'data-source' });

export class ArraySource<T = DataRecord> implements DataSource<T> {
  constructor(private data: T[]) {}

  async *read(): AsyncIterableIterator<T> {
    for (const record of this.data) {
      yield record;
    }
  }
}

export class JsonFileSource implements DataSource {
  constructor(private filePath: string) {}

  async *read(): AsyncIterableIterator<DataRecord> {
    logger.info(`Reading JSON from ${this.filePath}`);

    const content = await readFile(this.filePath, 'utf-8');
    const data = JSON.parse(content);

    const records = Array.isArray(data) ? data : [data];

    for (const record of records) {
      yield record;
    }
  }
}

export class CsvFileSource implements DataSource {
  constructor(
    private filePath: string,
    private options: {
      delimiter?: string;
      header?: boolean;
      skipEmptyLines?: boolean;
    } = {}
  ) {}

  async *read(): AsyncIterableIterator<DataRecord> {
    logger.info(`Reading CSV from ${this.filePath}`);

    const stream = createReadStream(this.filePath);
    const parser = Papa.parse(Papa.NODE_STREAM_INPUT, {
      delimiter: this.options.delimiter || ',',
      header: this.options.header ?? true,
      skipEmptyLines: this.options.skipEmptyLines ?? true,
    });

    stream.pipe(parser);

    for await (const record of parser as any) {
      yield record as DataRecord;
    }
  }
}

export class JsonLinesSource implements DataSource {
  constructor(private filePath: string) {}

  async *read(): AsyncIterableIterator<DataRecord> {
    logger.info(`Reading JSONL from ${this.filePath}`);

    const content = await readFile(this.filePath, 'utf-8');
    const lines = content.split('\n').filter((line) => line.trim());

    for (const line of lines) {
      try {
        yield JSON.parse(line);
      } catch (error) {
        logger.warn(`Failed to parse line: ${line}`);
      }
    }
  }
}

export class GeneratorSource<T = DataRecord> implements DataSource<T> {
  constructor(private generator: () => AsyncIterableIterator<T>) {}

  read(): AsyncIterableIterator<T> {
    return this.generator();
  }
}

export class TransformSource<TIn, TOut> implements DataSource<TOut> {
  constructor(
    private source: DataSource<TIn>,
    private transform: (record: TIn) => TOut | Promise<TOut>
  ) {}

  async *read(): AsyncIterableIterator<TOut> {
    for await (const record of this.source.read()) {
      yield await this.transform(record);
    }
  }
}

export class ConcatSource<T = DataRecord> implements DataSource<T> {
  constructor(private sources: DataSource<T>[]) {}

  async *read(): AsyncIterableIterator<T> {
    for (const source of this.sources) {
      yield* source.read();
    }
  }
}

export class LimitSource<T = DataRecord> implements DataSource<T> {
  constructor(private source: DataSource<T>, private limit: number) {}

  async *read(): AsyncIterableIterator<T> {
    let count = 0;

    for await (const record of this.source.read()) {
      if (count >= this.limit) {
        break;
      }
      yield record;
      count++;
    }
  }
}

export class SkipSource<T = DataRecord> implements DataSource<T> {
  constructor(private source: DataSource<T>, private skip: number) {}

  async *read(): AsyncIterableIterator<T> {
    let count = 0;

    for await (const record of this.source.read()) {
      if (count >= this.skip) {
        yield record;
      }
      count++;
    }
  }
}
