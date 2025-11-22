import { writeFile, appendFile } from 'fs/promises';
import { DataSink, DataRecord } from './types';
import { createLogger } from '@supranorma/shared';

const logger = createLogger({ prefix: 'data-sink' });

export class ArraySink<T = DataRecord> implements DataSink<T> {
  public data: T[] = [];

  async write(record: T): Promise<void> {
    this.data.push(record);
  }

  async writeBatch(records: T[]): Promise<void> {
    this.data.push(...records);
  }

  async close(): Promise<void> {
    logger.info(`ArraySink collected ${this.data.length} records`);
  }

  getData(): T[] {
    return this.data;
  }
}

export class JsonFileSink implements DataSink {
  private records: DataRecord[] = [];

  constructor(
    private filePath: string,
    private options: { pretty?: boolean } = {}
  ) {}

  async write(record: DataRecord): Promise<void> {
    this.records.push(record);
  }

  async writeBatch(records: DataRecord[]): Promise<void> {
    this.records.push(...records);
  }

  async close(): Promise<void> {
    logger.info(`Writing ${this.records.length} records to ${this.filePath}`);

    const content = this.options.pretty
      ? JSON.stringify(this.records, null, 2)
      : JSON.stringify(this.records);

    await writeFile(this.filePath, content, 'utf-8');
  }
}

export class JsonLinesSink implements DataSink {
  constructor(private filePath: string) {}

  async write(record: DataRecord): Promise<void> {
    await appendFile(this.filePath, JSON.stringify(record) + '\n', 'utf-8');
  }

  async writeBatch(records: DataRecord[]): Promise<void> {
    const content = records.map((r) => JSON.stringify(r)).join('\n') + '\n';
    await appendFile(this.filePath, content, 'utf-8');
  }

  async close(): Promise<void> {
    logger.info(`Finished writing to ${this.filePath}`);
  }
}

export class CsvFileSink implements DataSink {
  private isFirstWrite = true;
  private headers: string[] = [];

  constructor(
    private filePath: string,
    private options: { delimiter?: string; includeHeaders?: boolean } = {}
  ) {}

  async write(record: DataRecord): Promise<void> {
    await this.writeBatch([record]);
  }

  async writeBatch(records: DataRecord[]): Promise<void> {
    if (records.length === 0) return;

    const delimiter = this.options.delimiter || ',';
    const includeHeaders = this.options.includeHeaders ?? true;

    if (this.isFirstWrite) {
      this.headers = Object.keys(records[0]);

      if (includeHeaders) {
        await writeFile(
          this.filePath,
          this.headers.join(delimiter) + '\n',
          'utf-8'
        );
      }

      this.isFirstWrite = false;
    }

    const lines = records.map((record) =>
      this.headers.map((h) => this.escapeField(record[h])).join(delimiter)
    );

    await appendFile(this.filePath, lines.join('\n') + '\n', 'utf-8');
  }

  private escapeField(value: any): string {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  async close(): Promise<void> {
    logger.info(`Finished writing to ${this.filePath}`);
  }
}

export class ConsoleSink implements DataSink {
  private count = 0;

  constructor(private options: { pretty?: boolean; limit?: number } = {}) {}

  async write(record: DataRecord): Promise<void> {
    if (this.options.limit && this.count >= this.options.limit) {
      return;
    }

    const output = this.options.pretty
      ? JSON.stringify(record, null, 2)
      : JSON.stringify(record);

    console.log(output);
    this.count++;
  }

  async writeBatch(records: DataRecord[]): Promise<void> {
    for (const record of records) {
      await this.write(record);
    }
  }

  async close(): Promise<void> {
    logger.info(`Wrote ${this.count} records to console`);
  }
}

export class CallbackSink<T = DataRecord> implements DataSink<T> {
  constructor(
    private callback: (record: T) => void | Promise<void>,
    private onClose?: () => void | Promise<void>
  ) {}

  async write(record: T): Promise<void> {
    await this.callback(record);
  }

  async writeBatch(records: T[]): Promise<void> {
    for (const record of records) {
      await this.callback(record);
    }
  }

  async close(): Promise<void> {
    if (this.onClose) {
      await this.onClose();
    }
  }
}

export class MultiSink<T = DataRecord> implements DataSink<T> {
  constructor(private sinks: DataSink<T>[]) {}

  async write(record: T): Promise<void> {
    await Promise.all(this.sinks.map((sink) => sink.write(record)));
  }

  async writeBatch(records: T[]): Promise<void> {
    await Promise.all(this.sinks.map((sink) => sink.writeBatch(records)));
  }

  async close(): Promise<void> {
    await Promise.all(this.sinks.map((sink) => sink.close()));
  }
}
