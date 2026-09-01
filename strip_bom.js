const fs = require('fs');
const path = require('path');

function stripBOMFromDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        stripBOMFromDir(fullPath);
      }
    } else if (entry.isFile() && /\.(json|js|jsx|css|html|md)$/i.test(entry.name)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Stripped BOM from:', fullPath);
      }
    }
  }
}

stripBOMFromDir(path.resolve(__dirname, 'frontend'));
stripBOMFromDir(path.resolve(__dirname, 'backend'));
console.log('BOM check complete.');
