import { readFile } from 'fs/promises';
import { extname } from 'path';

export async function readCodeFile(filePath: string): Promise<{ code: string; language: string }> {
  const code = await readFile(filePath, 'utf-8');
  const language = detectLanguage(filePath);

  return { code, language };
}

export function detectLanguage(filePath: string): string {
  const ext = extname(filePath).toLowerCase();

  const languageMap: Record<string, string> = {
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.py': 'python',
    '.java': 'java',
    '.go': 'go',
    '.rs': 'rust',
    '.rb': 'ruby',
    '.php': 'php',
    '.c': 'c',
    '.cpp': 'cpp',
    '.cs': 'csharp',
    '.swift': 'swift',
    '.kt': 'kotlin',
    '.scala': 'scala',
  };

  return languageMap[ext] || 'unknown';
}
