import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ConfigurationError } from './errors';

export interface ConfigLoader<T = any> {
  load(path: string): T;
}

export class JsonConfigLoader<T = any> implements ConfigLoader<T> {
  load(path: string): T {
    if (!existsSync(path)) {
      throw new ConfigurationError(`Config file not found: ${path}`);
    }

    try {
      const content = readFileSync(path, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new ConfigurationError(
        `Failed to parse JSON config: ${(error as Error).message}`,
        { path }
      );
    }
  }
}

export class EnvironmentConfigLoader<T = any> implements ConfigLoader<T> {
  constructor(private prefix: string = '') {}

  load(): T {
    const config: Record<string, any> = {};

    Object.entries(process.env).forEach(([key, value]) => {
      if (!this.prefix || key.startsWith(this.prefix)) {
        const configKey = this.prefix
          ? key.substring(this.prefix.length)
          : key;
        config[configKey] = value;
      }
    });

    return config as T;
  }
}

export class ConfigManager<T extends Record<string, any>> {
  private config: T;
  private watchers: Map<string, Set<(value: any) => void>> = new Map();

  constructor(initialConfig: T) {
    this.config = { ...initialConfig };
  }

  get<K extends keyof T>(key: K): T[K];
  get<K extends keyof T>(key: K, defaultValue: T[K]): T[K];
  get<K extends keyof T>(key: K, defaultValue?: T[K]): T[K] | undefined {
    return this.config[key] ?? defaultValue;
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.config[key] = value;
    this.notifyWatchers(key as string, value);
  }

  has<K extends keyof T>(key: K): boolean {
    return key in this.config;
  }

  getAll(): Readonly<T> {
    return { ...this.config };
  }

  merge(config: Partial<T>): void {
    Object.assign(this.config, config);
    Object.keys(config).forEach((key) => {
      this.notifyWatchers(key, (config as any)[key]);
    });
  }

  watch<K extends keyof T>(key: K, callback: (value: T[K]) => void): () => void {
    const keyStr = key as string;
    if (!this.watchers.has(keyStr)) {
      this.watchers.set(keyStr, new Set());
    }
    this.watchers.get(keyStr)!.add(callback);

    return () => {
      this.watchers.get(keyStr)?.delete(callback);
    };
  }

  private notifyWatchers(key: string, value: any): void {
    this.watchers.get(key)?.forEach((callback) => callback(value));
  }

  loadFromFile(path: string, loader: ConfigLoader<Partial<T>> = new JsonConfigLoader()): void {
    const fileConfig = loader.load(path);
    this.merge(fileConfig);
  }

  loadFromEnv(prefix?: string): void {
    const loader = new EnvironmentConfigLoader<Partial<T>>(prefix);
    const envConfig = loader.load();
    this.merge(envConfig);
  }
}

export function createConfig<T extends Record<string, any>>(
  initialConfig: T
): ConfigManager<T> {
  return new ConfigManager(initialConfig);
}
