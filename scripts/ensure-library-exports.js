// Ensures all imports in context.ts, input.ts, and output.ts are exported from library.ts
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const libraryPath = path.join(srcDir, 'library.ts');
const scriptFiles = ['context.ts', 'input.ts', 'output.ts'];

// Collect all imported identifiers and their sources
const imports = {};
for (const file of scriptFiles) {
  const filePath = path.join(srcDir, file);
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  // Match: import { a, b } from 'source';
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?/g;
  let match;
  while ((match = importRegex.exec(content))) {
    const names = match[1].split(',').map(s => s.trim()).filter(Boolean);
    const source = match[2];
    for (const name of names) {
      if (!imports[name]) imports[name] = new Set();
      imports[name].add(source);
    }
  }
}


// Remove all export { ... } from ...; lines (auto-generated or manual)
let libraryContent = fs.readFileSync(libraryPath, 'utf8').replace(/^export\s+\{[^}]+\}\s+from\s+['"][^'"]+['"];?\s*$/gm, '');

// For each import, ensure it's exported from library.ts
for (const [name, sources] of Object.entries(imports)) {
  let alreadyExported = false;
  // Check if already exported
  const exportRegex = new RegExp(`export\\s+\\{[^}]*\\b${name}\\b[^}]*\\}\\s+from`);
  if (exportRegex.test(libraryContent)) {
    alreadyExported = true;
  } else if (new RegExp(`export function\\s+${name}\\b`).test(libraryContent)) {
    alreadyExported = true;
  } else if (new RegExp(`export (const|let|var|class)\\s+${name}\\b`).test(libraryContent)) {
    alreadyExported = true;
  }
  if (!alreadyExported) {
    // Export from each source (usually only one)
    for (const source of sources) {
      if (source.startsWith('.')) {
        // Don't re-export from local files except library itself
        continue;
      }
      libraryContent += `\nexport { ${name} } from '${source}';\n`;
    }
  }
}

fs.writeFileSync(libraryPath, libraryContent, 'utf8');
