export interface ScaffoldOptions {
  name: string;
  template: string;
  directory?: string;
  variables?: Record<string, any>;
}

export interface GitConfig {
  cwd?: string;
  baseDir?: string;
}

export interface QualityCheckResult {
  passed: boolean;
  errors: QualityIssue[];
  warnings: QualityIssue[];
  info: QualityIssue[];
  score: number;
}

export interface QualityIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  file?: string;
  line?: number;
  column?: number;
  rule?: string;
}

export interface TemplateConfig {
  name: string;
  description: string;
  variables: TemplateVariable[];
  files: TemplateFile[];
}

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
  default?: any;
  required?: boolean;
}

export interface TemplateFile {
  source: string;
  destination: string;
  transform?: boolean;
}

export interface CommitConfig {
  type: string;
  scope?: string;
  subject: string;
  body?: string;
  breaking?: boolean;
}
