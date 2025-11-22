import { join, dirname } from 'path';
import { ensureDir, copy, readFile, writeFile } from 'fs-extra';
import ejs from 'ejs';
import { globby } from 'globby';
import { ScaffoldOptions } from '../types';
import { createLogger } from '@supranorma/shared';

const logger = createLogger({ prefix: 'scaffold' });

export class ProjectScaffolder {
  private templatesDir: string;

  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir || join(__dirname, '../../templates');
  }

  async scaffold(options: ScaffoldOptions): Promise<void> {
    const { name, template, directory, variables = {} } = options;

    const targetDir = directory || join(process.cwd(), name);
    const templateDir = join(this.templatesDir, template);

    logger.info(`Scaffolding project: ${name} from template: ${template}`);
    logger.info(`Target directory: ${targetDir}`);

    // Ensure target directory exists
    await ensureDir(targetDir);

    // Get all files from template
    const files = await globby('**/*', {
      cwd: templateDir,
      dot: true,
    });

    // Process each file
    for (const file of files) {
      const sourcePath = join(templateDir, file);
      const targetPath = join(targetDir, this.transformPath(file, variables));

      // Ensure parent directory exists
      await ensureDir(dirname(targetPath));

      // Check if file should be templated
      if (this.shouldTemplate(file)) {
        await this.processTemplate(sourcePath, targetPath, {
          ...variables,
          projectName: name,
        });
      } else {
        await copy(sourcePath, targetPath);
      }

      logger.debug(`Created: ${targetPath}`);
    }

    logger.success(`Project scaffolded successfully: ${targetDir}`);
  }

  private shouldTemplate(filePath: string): boolean {
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css', '.yml', '.yaml'];
    return extensions.some((ext) => filePath.endsWith(ext));
  }

  private async processTemplate(
    sourcePath: string,
    targetPath: string,
    variables: Record<string, any>
  ): Promise<void> {
    const content = await readFile(sourcePath, 'utf-8');
    const processed = ejs.render(content, variables);
    await writeFile(targetPath, processed, 'utf-8');
  }

  private transformPath(path: string, variables: Record<string, any>): string {
    let transformed = path;

    // Replace variables in path
    Object.entries(variables).forEach(([key, value]) => {
      transformed = transformed.replace(`__${key}__`, String(value));
    });

    return transformed;
  }

  async listTemplates(): Promise<string[]> {
    const templates = await globby('*', {
      cwd: this.templatesDir,
      onlyDirectories: true,
    });

    return templates;
  }
}

export function createScaffolder(templatesDir?: string): ProjectScaffolder {
  return new ProjectScaffolder(templatesDir);
}

// Pre-built templates
export const templates = {
  typescript: {
    name: 'typescript',
    description: 'Basic TypeScript project',
    files: {
      'package.json': JSON.stringify({
        name: '<%= projectName %>',
        version: '0.1.0',
        scripts: {
          build: 'tsc',
          dev: 'tsc --watch',
        },
        devDependencies: {
          typescript: '^5.3.2',
        },
      }, null, 2),
      'tsconfig.json': JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: 'commonjs',
          outDir: './dist',
          strict: true,
        },
      }, null, 2),
    },
  },

  react: {
    name: 'react',
    description: 'React application with TypeScript and Vite',
    files: {
      'package.json': JSON.stringify({
        name: '<%= projectName %>',
        version: '0.1.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'tsc && vite build',
        },
      }, null, 2),
    },
  },

  node: {
    name: 'node',
    description: 'Node.js application with Express',
    files: {
      'package.json': JSON.stringify({
        name: '<%= projectName %>',
        version: '0.1.0',
        scripts: {
          start: 'node dist/index.js',
          dev: 'tsx watch src/index.ts',
        },
      }, null, 2),
    },
  },
};
