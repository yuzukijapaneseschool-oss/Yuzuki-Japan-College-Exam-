const fs = require('fs');
const path = require('path');

const candidates = [
  path.resolve(__dirname, 'backend/src/server.js'),
  path.resolve(__dirname, 'src/server.js'),
  path.resolve(__dirname, 'backend/server.js'),
  path.resolve(__dirname, 'server.js')
];

const target = candidates.find(c => fs.existsSync(c));
if (target) {
  console.log('🚀 Starting YUZUKI Server from:', target);
  require(target);
} else {
  console.error('❌ Server file not found in:', candidates);
  process.exit(1);
}