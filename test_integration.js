const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:5000' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, preview: data.slice(0, 150) });
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function verifyIntegratedApp() {
  console.log('1. Health Check:', await testEndpoint('/api/health'));
  console.log('2. Frontend Root HTML:', await testEndpoint('/'));
  console.log('3. Sample Audio File:', await testEndpoint('/uploads/audio/sample_jft_audio_1.mp3'));
}

verifyIntegratedApp();
