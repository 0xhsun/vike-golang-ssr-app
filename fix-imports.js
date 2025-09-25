import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function fixImportsInFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf-8');

    // Fix common import patterns
    content = content.replace(/from ['"]\.\/(.*?)\.js['"]/g, 'from "./$1.jsx"');
    content = content.replace(/from ['"]\.\.\/components\/(.*?)\.js['"]/g, 'from "../components/$1.jsx"');
    content = content.replace(/from ['"]\.\.\/layouts\/(.*?)\.js['"]/g, 'from "../layouts/$1.jsx"');

    // Remove TypeScript type annotations
    content = content.replace(/: React\.ReactNode/g, '');
    content = content.replace(/ as React\.CSSProperties/g, '');
    content = content.replace(/\}: \{[^}]+\}/g, '}');

    writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory() && !file.includes('node_modules')) {
      walkDir(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fixImportsInFile(filePath);
    }
  }
}

// Fix imports in main directories
walkDir('./pages');
walkDir('./layouts');
walkDir('./components');
walkDir('./server');

console.log('Import fixes completed!');