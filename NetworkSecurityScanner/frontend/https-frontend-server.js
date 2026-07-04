const https = require('https');
const fs = require('fs');
const path = require('path');

const HTTPS_PORT = 3001;
const REACT_BUILD_DIR = path.join(__dirname, 'build');

const options = {
  key: fs.readFileSync(path.join(__dirname, 'cert.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
};

const server = https.createServer(options, (req, res) => {
  let filePath = path.join(REACT_BUILD_DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (req.url.startsWith('/api')) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      // SPA fallback: serve index.html
      fs.readFile(path.join(REACT_BUILD_DIR, 'index.html'), (err2, html) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(HTTPS_PORT, '0.0.0.0', () => {
  console.log(`🔒 HTTPS React frontend running at https://localhost:${HTTPS_PORT}`);
});