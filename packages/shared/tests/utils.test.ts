import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  sleep,
  retry,
  debounce,
  throttle,
  chunk,
  groupBy,
  unique,
  pick,
  omit,
  isPromise,
  tryCatch,
  tryCatchAsync,
  formatBytes,
  formatDuration,
  generateId,
  isEmpty,
} from '../src/utils';

describe('sleep', () => {
  it('should resolve after specified time', async () => {
    const start = Date.now();
    await sleep(100);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some variance
  });
});

describe('retry', () => {
  it('should succeed on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await retry(fn);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('success');

    const result = await retry(fn, { maxAttempts: 3, delay: 10 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should throw after max attempts', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fails'));

    await expect(
      retry(fn, { maxAttempts: 3, delay: 10 })
    ).rejects.toThrow('always fails');

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should call onRetry callback', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');

    const onRetry = vi.fn();
    await retry(fn, { maxAttempts: 2, delay: 10, onRetry });

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error));
  });

  it('should apply exponential backoff', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('success');

    const start = Date.now();
    await retry(fn, { maxAttempts: 3, delay: 10, backoff: 2 });
    const elapsed = Date.now() - start;

    // First retry: 10ms, second retry: 20ms = ~30ms total
    expect(elapsed).toBeGreaterThanOrEqual(25);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should debounce function calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on new call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throttle function calls', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should allow call after limit', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('chunk', () => {
  it('should chunk array into groups', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    const chunks = chunk(arr, 3);
    expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it('should handle empty array', () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it('should handle single chunk', () => {
    expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
  });

  it('should handle chunk size of 1', () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });
});

describe('groupBy', () => {
  it('should group by key function', () => {
    const data = [
      { type: 'fruit', name: 'apple' },
      { type: 'vegetable', name: 'carrot' },
      { type: 'fruit', name: 'banana' },
    ];

    const grouped = groupBy(data, (item) => item.type);
    expect(grouped).toEqual({
      fruit: [
        { type: 'fruit', name: 'apple' },
        { type: 'fruit', name: 'banana' },
      ],
      vegetable: [{ type: 'vegetable', name: 'carrot' }],
    });
  });

  it('should handle empty array', () => {
    expect(groupBy([], (x) => x)).toEqual({});
  });

  it('should work with numbers', () => {
    const data = [1, 2, 3, 4, 5];
    const grouped = groupBy(data, (x) => (x % 2 === 0 ? 'even' : 'odd'));
    expect(grouped).toEqual({
      odd: [1, 3, 5],
      even: [2, 4],
    });
  });
});

describe('unique', () => {
  it('should remove duplicates from primitive array', () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('should use key function for objects', () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice Duplicate' },
    ];

    const result = unique(data, (item) => item.id);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });

  it('should handle empty array', () => {
    expect(unique([])).toEqual([]);
  });
});

describe('pick', () => {
  it('should pick specified keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('should handle missing keys', () => {
    const obj = { a: 1, b: 2 };
    expect(pick(obj, ['a', 'c' as any])).toEqual({ a: 1 });
  });

  it('should return empty object for empty keys', () => {
    expect(pick({ a: 1, b: 2 }, [])).toEqual({});
  });
});

describe('omit', () => {
  it('should omit specified keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    expect(omit(obj, ['b', 'd'])).toEqual({ a: 1, c: 3 });
  });

  it('should handle missing keys', () => {
    const obj = { a: 1, b: 2 };
    expect(omit(obj, ['c' as any])).toEqual({ a: 1, b: 2 });
  });

  it('should return copy for empty keys', () => {
    const obj = { a: 1, b: 2 };
    const result = omit(obj, []);
    expect(result).toEqual(obj);
    expect(result).not.toBe(obj); // Should be a copy
  });
});

describe('isPromise', () => {
  it('should return true for promises', () => {
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise(new Promise(() => {}))).toBe(true);
    expect(isPromise((async () => {})())).toBe(true);
  });

  it('should return false for non-promises', () => {
    expect(isPromise(null)).toBe(false);
    expect(isPromise(undefined)).toBe(false);
    expect(isPromise(123)).toBe(false);
    expect(isPromise('string')).toBe(false);
    expect(isPromise({})).toBe(false);
    expect(isPromise([])).toBe(false);
  });

  it('should return true for thenable objects', () => {
    expect(isPromise({ then: () => {} })).toBe(true);
  });
});

describe('tryCatch', () => {
  it('should return success result', () => {
    const result = tryCatch(() => 42);
    expect(result).toEqual({ success: true, data: 42 });
  });

  it('should return error result', () => {
    const result = tryCatch(() => {
      throw new Error('test error');
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('test error');
    }
  });
});

describe('tryCatchAsync', () => {
  it('should return success result', async () => {
    const result = await tryCatchAsync(async () => 42);
    expect(result).toEqual({ success: true, data: 42 });
  });

  it('should return error result', async () => {
    const result = await tryCatchAsync(async () => {
      throw new Error('test error');
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('test error');
    }
  });
});

describe('formatBytes', () => {
  it('should format bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
  });

  it('should handle decimals', () => {
    expect(formatBytes(1536, 1)).toBe('1.5 KB');
    expect(formatBytes(1536, 0)).toBe('2 KB');
  });

  it('should handle large numbers', () => {
    expect(formatBytes(1024 ** 4)).toContain('TB');
  });
});

describe('formatDuration', () => {
  it('should format seconds', () => {
    expect(formatDuration(1000)).toBe('1s');
    expect(formatDuration(30000)).toBe('30s');
  });

  it('should format minutes', () => {
    expect(formatDuration(60000)).toBe('1m 0s');
    expect(formatDuration(90000)).toBe('1m 30s');
  });

  it('should format hours', () => {
    expect(formatDuration(3600000)).toBe('1h 0m');
    expect(formatDuration(3660000)).toBe('1h 1m');
  });

  it('should format days', () => {
    expect(formatDuration(86400000)).toBe('1d 0h');
    expect(formatDuration(90000000)).toBe('1d 1h');
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(0);
  });

  it('should include prefix', () => {
    const id = generateId('user');
    expect(id).toMatch(/^user_/);
  });

  it('should work without prefix', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
  });
});

describe('isEmpty', () => {
  it('should return true for empty values', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
  });

  it('should return false for non-empty values', () => {
    expect(isEmpty('text')).toBe(false);
    expect(isEmpty([1, 2, 3])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty(new Map([['a', 1]]))).toBe(false);
    expect(isEmpty(new Set([1]))).toBe(false);
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(false)).toBe(false);
  });
});
