#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function printHelp() {
  console.log(`\nAI Dungeon TypeScript Starter\n`);
  console.log('Usage:');
  console.log('  npx ai-dungeon-typescript-starter <project-directory>');
  console.log('\nThis will scaffold a new AI Dungeon TypeScript project.');
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

const projectDir = args[0];
if (!projectDir) {
  console.error('Error: Please specify a project directory.');
  process.exit(1);
}

const dest = path.resolve(process.cwd(), projectDir);
if (fs.existsSync(dest)) {
  console.error(`Error: Directory ${dest} already exists.`);
  process.exit(1);
}

console.log(`Creating new AI Dungeon TypeScript project in ${dest}...`);
fs.mkdirSync(dest, { recursive: true });

// Copy template files (assumes a 'template' folder exists in the package)
const templateDir = path.join(__dirname, '../template');
if (!fs.existsSync(templateDir)) {
  console.error('Error: Template directory not found.');
  process.exit(1);
}

function copyRecursive(src, target) {
  if (fs.statSync(src).isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(target, file));
    }
  } else {
    fs.copyFileSync(src, target);
  }
}

copyRecursive(templateDir, dest);

console.log('Installing dependencies...');
execSync('npm install', { cwd: dest, stdio: 'inherit' });

console.log('\nSuccess! Your AI Dungeon TypeScript project is ready.');
console.log(`\nNext steps:\n  cd ${projectDir}\n  npm run build\n`);
