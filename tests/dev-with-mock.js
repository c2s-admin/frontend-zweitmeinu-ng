const { spawn } = require('child_process');
const http = require('http');

// Simple mock Strapi server
const strapiServer = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/contact-messages') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      const parsed = JSON.parse(body || '{}');
      const payload = parsed.data || {};
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ data: { id: 1, attributes: payload } })
      );
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
});

strapiServer.listen(5050, () => {
  console.log('Mock Strapi server running on http://localhost:5050');
});

const dev = spawn('npm', ['run', 'dev'], {
  env: {
    ...process.env,
    STRAPI_API_URL: 'http://localhost:5050',
    NEXT_PUBLIC_STRAPI_URL: 'http://localhost:5050'
  },
  stdio: 'inherit'
});

const shutdown = () => {
  strapiServer.close(() => {
    process.exit();
  });
  dev.kill('SIGINT');
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

dev.on('close', (code) => {
  shutdown();
  process.exit(code);
});
