import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Logger, LogLevel, createLogger, defaultLogger } from '../src/logger';

describe('Logger', () => {
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    // Spy on console methods
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('LogLevel', () => {
    it('should define all log levels', () => {
      expect(LogLevel.DEBUG).toBe(0);
      expect(LogLevel.INFO).toBe(1);
      expect(LogLevel.WARN).toBe(2);
      expect(LogLevel.ERROR).toBe(3);
      expect(LogLevel.SILENT).toBe(4);
    });
  });

  describe('constructor', () => {
    it('should create logger with default options', () => {
      const logger = new Logger();
      expect(logger.getLevel()).toBe(LogLevel.INFO);
    });

    it('should create logger with custom level', () => {
      const logger = new Logger({ level: LogLevel.DEBUG });
      expect(logger.getLevel()).toBe(LogLevel.DEBUG);
    });

    it('should create logger with prefix', () => {
      const logger = new Logger({ prefix: 'TEST' });
      logger.info('test message');
      expect(consoleSpy.log).toHaveBeenCalled();
      const call = consoleSpy.log.mock.calls[0][0];
      expect(call).toContain('TEST');
    });

    it('should create logger without timestamps', () => {
      const logger = new Logger({ timestamps: false });
      logger.info('test message');
      expect(consoleSpy.log).toHaveBeenCalled();
    });
  });

  describe('debug', () => {
    it('should log debug messages when level is DEBUG', () => {
      const logger = new Logger({ level: LogLevel.DEBUG, timestamps: false });
      logger.debug('debug message');
      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
    });

    it('should not log debug messages when level is INFO', () => {
      const logger = new Logger({ level: LogLevel.INFO });
      logger.debug('debug message');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('should handle additional arguments', () => {
      const logger = new Logger({ level: LogLevel.DEBUG });
      logger.debug('debug message', { foo: 'bar' }, 123);
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.any(String),
        { foo: 'bar' },
        123
      );
    });
  });

  describe('info', () => {
    it('should log info messages when level is INFO', () => {
      const logger = new Logger({ level: LogLevel.INFO, timestamps: false });
      logger.info('info message');
      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
    });

    it('should not log info messages when level is WARN', () => {
      const logger = new Logger({ level: LogLevel.WARN });
      logger.info('info message');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should log warn messages when level is WARN', () => {
      const logger = new Logger({ level: LogLevel.WARN, timestamps: false });
      logger.warn('warn message');
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
    });

    it('should not log warn messages when level is ERROR', () => {
      const logger = new Logger({ level: LogLevel.ERROR });
      logger.warn('warn message');
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should log error messages when level is ERROR', () => {
      const logger = new Logger({ level: LogLevel.ERROR, timestamps: false });
      logger.error('error message');
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });

    it('should not log error messages when level is SILENT', () => {
      const logger = new Logger({ level: LogLevel.SILENT });
      logger.error('error message');
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('should log success messages when level is INFO', () => {
      const logger = new Logger({ level: LogLevel.INFO, timestamps: false });
      logger.success('success message');
      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
    });

    it('should not log success messages when level is WARN', () => {
      const logger = new Logger({ level: LogLevel.WARN });
      logger.success('success message');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('setLevel', () => {
    it('should update log level', () => {
      const logger = new Logger({ level: LogLevel.INFO });
      expect(logger.getLevel()).toBe(LogLevel.INFO);

      logger.setLevel(LogLevel.DEBUG);
      expect(logger.getLevel()).toBe(LogLevel.DEBUG);
    });

    it('should affect message filtering', () => {
      const logger = new Logger({ level: LogLevel.WARN });
      logger.info('should not log');
      expect(consoleSpy.log).not.toHaveBeenCalled();

      logger.setLevel(LogLevel.INFO);
      logger.info('should log');
      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
    });
  });

  describe('createLogger', () => {
    it('should create logger instance', () => {
      const logger = createLogger();
      expect(logger).toBeInstanceOf(Logger);
    });

    it('should accept options', () => {
      const logger = createLogger({ level: LogLevel.DEBUG, prefix: 'TEST' });
      expect(logger.getLevel()).toBe(LogLevel.DEBUG);
    });
  });

  describe('defaultLogger', () => {
    it('should be a Logger instance', () => {
      expect(defaultLogger).toBeInstanceOf(Logger);
    });

    it('should have default INFO level', () => {
      expect(defaultLogger.getLevel()).toBe(LogLevel.INFO);
    });
  });

  describe('level hierarchy', () => {
    it('should respect DEBUG level hierarchy', () => {
      const logger = new Logger({ level: LogLevel.DEBUG });
      logger.debug('test');
      logger.info('test');
      logger.warn('test');
      logger.error('test');

      expect(consoleSpy.log).toHaveBeenCalledTimes(2); // debug + info
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });

    it('should respect INFO level hierarchy', () => {
      const logger = new Logger({ level: LogLevel.INFO });
      logger.debug('test');
      logger.info('test');
      logger.warn('test');
      logger.error('test');

      expect(consoleSpy.log).toHaveBeenCalledTimes(1); // info only
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });

    it('should respect SILENT level', () => {
      const logger = new Logger({ level: LogLevel.SILENT });
      logger.debug('test');
      logger.info('test');
      logger.warn('test');
      logger.error('test');
      logger.success('test');

      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });
});
