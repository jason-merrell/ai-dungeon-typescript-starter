// auto-globals.js: Injects imports and global assignments into library.ts, then restores after build
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const libraryPath = path.join(srcDir, 'library.ts');
const backupPath = path.join(srcDir, 'library.ts.bak');
const scriptFiles = ['context.ts', 'input.ts', 'output.ts'];

function parseImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // import { a, b } from 'source';
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?/g;
  let match;
  const imports = [];
  while ((match = importRegex.exec(content))) {
    const names = match[1].split(',').map(s => s.trim()).filter(Boolean);
    const source = match[2];
    for (const name of names) {
      imports.push({ name, source });
    }
  }
  return imports;
}

function getDefinedFunctions(tsContent) {
  // Matches: export function foo(, function foo(, const foo = (, let foo = (, var foo = (
  const fnRegex = /(?:export\s+)?function\s+(\w+)\s*\(|(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*\(/g;
  const defined = new Set();
  let match;
  while ((match = fnRegex.exec(tsContent))) {
    if (match[1]) defined.add(match[1]);
    if (match[2]) defined.add(match[2]);
  }
  return defined;
}

function injectGlobals() {
  // Backup original library.ts
  fs.copyFileSync(libraryPath, backupPath);
  let libraryContent = fs.readFileSync(libraryPath, 'utf8');
  const defined = getDefinedFunctions(libraryContent);
  let injected = '';
  const seen = new Set();
  for (const file of scriptFiles) {
    const filePath = path.join(srcDir, file);
    if (!fs.existsSync(filePath)) continue;
    const imports = parseImports(filePath);
    for (const { name, source } of imports) {
      const key = `${name}|${source}`;
      if (seen.has(key)) continue;
      if (defined.has(name)) continue; // skip if already defined in library
      seen.add(key);
      injected += `import { ${name} } from '${source}';\n`;
    }
  }
  // Insert after the first comment or at the top
  if (/^\/\//.test(libraryContent)) {
    const idx = libraryContent.indexOf('\n');
    libraryContent = libraryContent.slice(0, idx+1) + injected + libraryContent.slice(idx+1);
  } else {
    libraryContent = injected + libraryContent;
  }
  fs.writeFileSync(libraryPath, libraryContent, 'utf8');
}

function restoreLibrary() {
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, libraryPath);
    fs.unlinkSync(backupPath);
  }
}

// Usage: node auto-globals.js inject|restore
if (process.argv[2] === 'inject') {
  injectGlobals();
  console.log('Injected globals into library.ts');
} else if (process.argv[2] === 'restore') {
  restoreLibrary();
  console.log('Restored original library.ts');
} else {
  console.log('Usage: node auto-globals.js inject|restore');
}
