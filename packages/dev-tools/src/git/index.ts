import simpleGit, { SimpleGit, StatusResult } from 'simple-git';
import { GitConfig, CommitConfig } from '../types';
import { createLogger } from '@supranorma/shared';

const logger = createLogger({ prefix: 'git' });

export class GitAutomation {
  private git: SimpleGit;

  constructor(config: GitConfig = {}) {
    this.git = simpleGit({
      baseDir: config.baseDir || process.cwd(),
      ...config,
    });
  }

  async status(): Promise<StatusResult> {
    return this.git.status();
  }

  async isRepo(): Promise<boolean> {
    try {
      await this.git.status();
      return true;
    } catch {
      return false;
    }
  }

  async init(): Promise<void> {
    logger.info('Initializing git repository');
    await this.git.init();
  }

  async getCurrentBranch(): Promise<string> {
    const branch = await this.git.branchLocal();
    return branch.current;
  }

  async createBranch(name: string, checkout = true): Promise<void> {
    logger.info(`Creating branch: ${name}`);
    if (checkout) {
      await this.git.checkoutLocalBranch(name);
    } else {
      await this.git.branch([name]);
    }
  }

  async checkout(branch: string): Promise<void> {
    logger.info(`Checking out branch: ${branch}`);
    await this.git.checkout(branch);
  }

  async add(files: string | string[]): Promise<void> {
    const fileList = Array.isArray(files) ? files : [files];
    logger.info(`Adding files: ${fileList.join(', ')}`);
    await this.git.add(fileList);
  }

  async addAll(): Promise<void> {
    logger.info('Adding all files');
    await this.git.add('.');
  }

  async commit(message: string): Promise<void> {
    logger.info(`Committing: ${message}`);
    await this.git.commit(message);
  }

  async conventionalCommit(config: CommitConfig): Promise<void> {
    const { type, scope, subject, body, breaking } = config;

    let message = `${type}`;
    if (scope) {
      message += `(${scope})`;
    }
    if (breaking) {
      message += '!';
    }
    message += `: ${subject}`;

    if (body) {
      message += `\n\n${body}`;
    }

    if (breaking && body && !body.includes('BREAKING CHANGE:')) {
      message += '\n\nBREAKING CHANGE: This commit contains breaking changes.';
    }

    await this.commit(message);
  }

  async push(remote = 'origin', branch?: string): Promise<void> {
    const targetBranch = branch || (await this.getCurrentBranch());
    logger.info(`Pushing to ${remote}/${targetBranch}`);
    await this.git.push(remote, targetBranch);
  }

  async pull(remote = 'origin', branch?: string): Promise<void> {
    const targetBranch = branch || (await this.getCurrentBranch());
    logger.info(`Pulling from ${remote}/${targetBranch}`);
    await this.git.pull(remote, targetBranch);
  }

  async getDiff(staged = false): Promise<string> {
    if (staged) {
      return this.git.diff(['--staged']);
    }
    return this.git.diff();
  }

  async getLog(count = 10): Promise<string[]> {
    const log = await this.git.log({ maxCount: count });
    return log.all.map((entry) => `${entry.hash.substring(0, 7)} ${entry.message}`);
  }

  async stash(message?: string): Promise<void> {
    logger.info('Stashing changes');
    if (message) {
      await this.git.stash(['push', '-m', message]);
    } else {
      await this.git.stash();
    }
  }

  async stashPop(): Promise<void> {
    logger.info('Popping stash');
    await this.git.stash(['pop']);
  }

  async getRemotes(): Promise<string[]> {
    const remotes = await this.git.getRemotes();
    return remotes.map((r) => r.name);
  }

  async addRemote(name: string, url: string): Promise<void> {
    logger.info(`Adding remote: ${name} (${url})`);
    await this.git.addRemote(name, url);
  }

  async clone(url: string, directory?: string): Promise<void> {
    logger.info(`Cloning: ${url}`);
    if (directory) {
      await this.git.clone(url, directory);
    } else {
      await this.git.clone(url);
    }
  }

  async merge(branch: string): Promise<void> {
    logger.info(`Merging branch: ${branch}`);
    await this.git.merge([branch]);
  }

  async tag(name: string, message?: string): Promise<void> {
    logger.info(`Creating tag: ${name}`);
    if (message) {
      await this.git.tag(['-a', name, '-m', message]);
    } else {
      await this.git.tag([name]);
    }
  }

  async getTags(): Promise<string[]> {
    const tags = await this.git.tags();
    return tags.all;
  }
}

export function createGitAutomation(config?: GitConfig): GitAutomation {
  return new GitAutomation(config);
}
