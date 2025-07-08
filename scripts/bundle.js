// This script bundles library.ts and removes import statements from context, input, and output for AI Dungeon compatibility
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const files = ['context.js', 'input.js', 'output.js'];

// Remove import/require statements from the main files and append modifier(text);
for (const file of files) {
  const filePath = path.join(distDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Remove require statements for ./library
    content = content.replace(/^.*require\(["']\.\/library["']\).*;?\s*$/gm, '');
    // Remove exports.* = ...
    content = content.replace(/^Object\.defineProperty\(exports,.*\);?\s*$/gm, '');
    content = content.replace(/^exports\.[^=]+ = [^;]+;?\s*$/gm, '');
    // Remove 'use strict' and __esModule
    content = content.replace(/^"use strict";?\s*$/gm, '');
    content = content.replace(/^Object\.defineProperty\(exports, "__esModule", \{ value: true \}\);?\s*$/gm, '');
    // Replace (0, library_1.fnName)(args) with fnName(args)
    content = content.replace(/\(0, library_1\.(\w+)\)\(/g, '$1(');
    // List of all hook params to pass as an object
    const params = '{ text, history, storyCards, worldInfo, state, info }';
    content = content.trim() + `\nmodifier(${params});\n`;
    fs.writeFileSync(filePath, content, 'utf8');
  }
}
// Bundle all exports from library.js into itself (noop, just for clarity)
// AI Dungeon will handle the import resolution
