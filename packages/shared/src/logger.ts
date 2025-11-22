import chalk from 'chalk';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  timestamps?: boolean;
}

export class Logger {
  private level: LogLevel;
  private prefix: string;
  private timestamps: boolean;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? LogLevel.INFO;
    this.prefix = options.prefix ?? '';
    this.timestamps = options.timestamps ?? true;
  }

  private formatMessage(level: string, message: string): string {
    const parts: string[] = [];

    if (this.timestamps) {
      parts.push(chalk.gray(`[${new Date().toISOString()}]`));
    }

    if (this.prefix) {
      parts.push(chalk.cyan(`[${this.prefix}]`));
    }

    parts.push(`[${level}]`);
    parts.push(message);

    return parts.join(' ');
  }

  debug(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.log(this.formatMessage(chalk.magenta('DEBUG'), message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      console.log(this.formatMessage(chalk.blue('INFO'), message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(this.formatMessage(chalk.yellow('WARN'), message), ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(this.formatMessage(chalk.red('ERROR'), message), ...args);
    }
  }

  success(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      console.log(this.formatMessage(chalk.green('SUCCESS'), message), ...args);
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  getLevel(): LogLevel {
    return this.level;
  }
}

export const createLogger = (options?: LoggerOptions): Logger => {
  return new Logger(options);
};

export const defaultLogger = createLogger();
