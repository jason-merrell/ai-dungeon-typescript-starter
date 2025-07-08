// cleanup.js: Remove export statements from dist/library.js at the end of the build
const fs = require('fs');
const path = require('path');



// Remove require/import statements and rewrite helper references in context.js, input.js, output.js
const distDir = path.join(__dirname, '../dist');
const helperNames = ['deepFreeze', 'exampleHelper']; // Add all helpers you want to expose
const targetFiles = ['context.js', 'input.js', 'output.js'];

if (fs.existsSync(distDir)) {
  for (const file of targetFiles) {
    const filePath = path.join(distDir, file);
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');
    // Remove require/import statements
    content = content.replace(/^.*(import|require)[^;]*;?\s*$/gm, '');
    // Replace references like ai_dungeon_sdk_1.deepFreeze or library_1.exampleHelper with just deepFreeze/exampleHelper
    helperNames.forEach(name => {
      content = content.replace(new RegExp(`[\\w.]+\\.${name}`, 'g'), name);
    });
    // Replace (0, helperName)(...) or (0,helperName)(...) with helperName(...)
    helperNames.forEach(name => {
      content = content.replace(new RegExp(`\\(\\s*0\\s*,\\s*${name}\\s*\\)\\s*\\(`, 'g'), `${name}(`);
    });
    // Replace (0, helperName) with helperName (standalone)
    helperNames.forEach(name => {
      content = content.replace(new RegExp(`\\(\\s*0\\s*,\\s*${name}\\s*\\)`, 'g'), name);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned up and rewired ${file}`);
  }
} else {
  console.log('dist/ not found, nothing to clean.');
}
// Remove export statements from dist/library.js as the very last step
const distLibraryPath = path.join(distDir, 'library.js');
if (fs.existsSync(distLibraryPath)) {
  let libContent = fs.readFileSync(distLibraryPath, 'utf8');
  libContent = libContent.replace(/\n*export\s*\{[^}]+\}\s*;?\s*$/gm, '');
  fs.writeFileSync(distLibraryPath, libContent, 'utf8');
  console.log('Removed export statements from dist/library.js');
}
