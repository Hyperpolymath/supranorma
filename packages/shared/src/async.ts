export class AsyncQueue<T> {
  private queue: Array<() => Promise<T>> = [];
  private running = 0;
  private results: T[] = [];

  constructor(private concurrency: number = 1) {}

  add(fn: () => Promise<T>): void {
    this.queue.push(fn);
    this.run();
  }

  private async run(): Promise<void> {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.running++;
    const fn = this.queue.shift()!;

    try {
      const result = await fn();
      this.results.push(result);
    } finally {
      this.running--;
      this.run();
    }
  }

  async drain(): Promise<T[]> {
    while (this.queue.length > 0 || this.running > 0) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    return this.results;
  }

  clear(): void {
    this.queue = [];
    this.results = [];
  }
}

export async function promiseAllSettled<T>(
  promises: Promise<T>[]
): Promise<Array<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: any }>> {
  return Promise.allSettled(promises) as any;
}

export async function promiseMap<T, R>(
  items: T[],
  mapper: (item: T, index: number) => Promise<R>,
  options: { concurrency?: number } = {}
): Promise<R[]> {
  const { concurrency = Infinity } = options;
  const results: R[] = [];
  const queue = new AsyncQueue<R>(concurrency);

  for (let i = 0; i < items.length; i++) {
    queue.add(async () => {
      const result = await mapper(items[i], i);
      results[i] = result;
      return result;
    });
  }

  await queue.drain();
  return results;
}

export class Deferred<T> {
  promise: Promise<T>;
  resolve!: (value: T) => void;
  reject!: (reason?: any) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export class Semaphore {
  private permits: number;
  private queue: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }

    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    const next = this.queue.shift();
    if (next) {
      next();
    } else {
      this.permits++;
    }
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

export class Mutex {
  private semaphore = new Semaphore(1);

  async lock(): Promise<void> {
    await this.semaphore.acquire();
  }

  unlock(): void {
    this.semaphore.release();
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    return this.semaphore.run(fn);
  }
}

export function timeout<T>(promise: Promise<T>, ms: number, message = 'Timeout'): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}
