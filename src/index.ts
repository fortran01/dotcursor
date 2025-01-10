#!/usr/bin/env bun
import { readdir, stat } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

interface FileInfo {
  path: string;
  size: number;
  type: string;
  functions?: string[];
}

interface DirectoryInfo {
  path: string;
  files: FileInfo[];
  subdirectories: DirectoryInfo[];
}

const LANGUAGE_FILE_SIZE_LIMITS: Record<string, number> = {
  ts: 400,
  js: 400,
  py: 500,
  java: 500,
  cpp: 500,
  'tsx': 400,
  'jsx': 400,
};

async function detectFileType(path: string): Promise<string> {
  const extension = path.split('.').pop()?.toLowerCase() || '';
  const commonExtensions: Record<string, string> = {
    ts: 'TypeScript',
    js: 'JavaScript',
    py: 'Python',
    java: 'Java',
    cpp: 'C++',
    h: 'C/C++ Header',
    jsx: 'React JSX',
    tsx: 'React TSX',
    md: 'Markdown',
    json: 'JSON',
    yml: 'YAML',
    yaml: 'YAML',
    css: 'CSS',
    html: 'HTML',
  };
  
  return commonExtensions[extension] || 'Unknown';
}

async function extractFunctions(content: string, fileType: string): Promise<string[]> {
  const functions: string[] = [];
  let regex: RegExp;

  switch (fileType) {
    case 'TypeScript':
    case 'JavaScript':
      regex = /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|class\s+(\w+))/g;
      break;
    case 'Python':
      regex = /def\s+(\w+)\s*\([^)]*\):|class\s+(\w+):/g;
      break;
    default:
      return [];
  }

  let match;
  while ((match = regex.exec(content)) !== null) {
    const name = match[1] || match[2] || match[3];
    if (name) functions.push(name);
  }

  return functions;
}

async function analyzeDirectory(dirPath: string): Promise<DirectoryInfo> {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files: FileInfo[] = [];
  const subdirectories: DirectoryInfo[] = [];

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    const relativePath = relative(process.cwd(), fullPath);

    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    if (entry.isDirectory()) {
      subdirectories.push(await analyzeDirectory(fullPath));
    } else {
      const fileStats = await stat(fullPath);
      const fileType = await detectFileType(entry.name);
      const content = await Bun.file(fullPath).text();
      const functions = await extractFunctions(content, fileType);

      files.push({
        path: relativePath,
        size: fileStats.size,
        type: fileType,
        functions: functions.length > 0 ? functions : undefined,
      });
    }
  }

  return {
    path: relative(process.cwd(), dirPath),
    files,
    subdirectories,
  };
}

function generateMarkdown(info: DirectoryInfo, level: number = 0): string {
  const indent = '  '.repeat(level);
  let markdown = '';

  // Directory name
  if (info.path) {
    markdown += `${indent}${'#'.repeat(level + 2)} 📁 ${info.path}\n\n`;
  } else {
    markdown += `# 📁 Project Structure\n\n`;
  }

  // Files
  if (info.files.length > 0) {
    if (level === 0) {
      markdown += `## Files\n\n`;
    }
    for (const file of info.files) {
      markdown += `${indent}- 📄 \`${file.path}\`\n`;
      markdown += `${indent}  - Type: ${file.type}\n`;
      markdown += `${indent}  - Size: ${(file.size / 1024).toFixed(2)}KB\n`;

      const fileExt = file.path.split('.').pop()?.toLowerCase();
      if (fileExt && LANGUAGE_FILE_SIZE_LIMITS[fileExt] && file.size > LANGUAGE_FILE_SIZE_LIMITS[fileExt] * 1024) {
        markdown += `${indent}  - ⚠️ **File size exceeds recommended limit**\n`;
      }

      if (file.functions && file.functions.length > 0) {
        markdown += `${indent}  - Functions:\n`;
        file.functions.forEach(func => {
          markdown += `${indent}    - \`${func}\`\n`;
        });
      }
      markdown += '\n';
    }
  }

  // Subdirectories
  for (const subdir of info.subdirectories) {
    markdown += generateMarkdown(subdir, level + 1);
  }

  return markdown;
}

async function main() {
  try {
    const info = await analyzeDirectory(process.cwd());
    const markdown = generateMarkdown(info);
    await Bun.write('.cursor.directory_structure.md', markdown);
    console.log('✅ Directory structure documentation generated successfully!');
  } catch (error) {
    console.error('❌ Error generating directory structure:', error);
    process.exit(1);
  }
}

main(); 