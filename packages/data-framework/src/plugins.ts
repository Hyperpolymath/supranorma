import { Plugin } from './types';
import { createLogger } from '@supranorma/shared';

const logger = createLogger({ prefix: 'plugins' });

export class PluginManager {
  private plugins = new Map<string, Plugin>();

  async register(plugin: Plugin): Promise<void> {
    logger.info(`Registering plugin: ${plugin.name} v${plugin.version}`);

    if (this.plugins.has(plugin.name)) {
      logger.warn(`Plugin ${plugin.name} is already registered`);
      return;
    }

    if (plugin.initialize) {
      await plugin.initialize();
    }

    this.plugins.set(plugin.name, plugin);
  }

  async unregister(name: string): Promise<void> {
    const plugin = this.plugins.get(name);

    if (!plugin) {
      logger.warn(`Plugin ${name} not found`);
      return;
    }

    if (plugin.shutdown) {
      await plugin.shutdown();
    }

    this.plugins.delete(name);
    logger.info(`Unregistered plugin: ${name}`);
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  has(name: string): boolean {
    return this.plugins.has(name);
  }

  list(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  async shutdownAll(): Promise<void> {
    logger.info('Shutting down all plugins');

    const shutdownPromises = Array.from(this.plugins.values())
      .filter((p) => p.shutdown)
      .map((p) => p.shutdown!());

    await Promise.all(shutdownPromises);

    this.plugins.clear();
  }
}

export const globalPluginManager = new PluginManager();
