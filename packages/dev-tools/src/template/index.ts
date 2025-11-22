import ejs from 'ejs';
import { TemplateConfig } from '../types';
import { createLogger } from '@supranorma/shared';

const logger = createLogger({ prefix: 'template' });

export class TemplateEngine {
  async render(template: string, variables: Record<string, any>): Promise<string> {
    try {
      return ejs.render(template, variables);
    } catch (error) {
      logger.error('Template rendering failed:', (error as Error).message);
      throw error;
    }
  }

  async renderFile(filePath: string, variables: Record<string, any>): Promise<string> {
    try {
      return ejs.renderFile(filePath, variables);
    } catch (error) {
      logger.error('Template file rendering failed:', (error as Error).message);
      throw error;
    }
  }

  validateVariables(config: TemplateConfig, variables: Record<string, any>): string[] {
    const errors: string[] = [];

    config.variables.forEach((varConfig) => {
      const value = variables[varConfig.name];

      if (varConfig.required && (value === undefined || value === null)) {
        errors.push(`Required variable '${varConfig.name}' is missing`);
        return;
      }

      if (value !== undefined && value !== null) {
        const actualType = typeof value;
        if (actualType !== varConfig.type) {
          errors.push(
            `Variable '${varConfig.name}' should be ${varConfig.type}, got ${actualType}`
          );
        }
      }
    });

    return errors;
  }

  getDefaultVariables(config: TemplateConfig): Record<string, any> {
    const defaults: Record<string, any> = {};

    config.variables.forEach((varConfig) => {
      if (varConfig.default !== undefined) {
        defaults[varConfig.name] = varConfig.default;
      }
    });

    return defaults;
  }
}

export function createTemplateEngine(): TemplateEngine {
  return new TemplateEngine();
}

// Common template helpers
export const templateHelpers = {
  camelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  },

  pascalCase(str: string): string {
    const camel = templateHelpers.camelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  },

  kebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },

  snakeCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  },

  upperCase(str: string): string {
    return str.toUpperCase();
  },

  lowerCase(str: string): string {
    return str.toLowerCase();
  },

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};
