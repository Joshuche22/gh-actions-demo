'use strict';

const http = require('http');

const PORT = process.env.PORT || 3000;
const SERVICE_NAME = process.env.SERVICE_NAME || 'gh-actions-demo';
const VERSION = process.env.VERSION || '1.0.0';

const startTime = Date.now();

function getUptime() {
  return Math.floor((Date.now() - startTime) / 1000);
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Health check endpoint — used by load balancers and ECS health checks
  if (url === '/health' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: SERVICE_NAME,
      version: VERSION,
      uptime: getUptime(),
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // Readiness endpoint — signals the service is ready to receive traffic
  if (url === '/ready' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ready',
      service: SERVICE_NAME,
    }));
    return;
  }

  // Metrics endpoint — exposes basic runtime metrics
  if (url === '/metrics' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end([
      `# HELP uptime_seconds Total uptime in seconds`,
      `# TYPE uptime_seconds gauge`,
      `uptime_seconds ${getUptime()}`,
      `# HELP http_requests_total Total HTTP requests`,
      `# TYPE http_requests_total counter`,
      `http_requests_total ${requestCount}`,
    ].join('\n'));
    return;
  }

  // Root endpoint
  if (url === '/' && method === 'GET') {
    requestCount++;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Service is running',
      service: SERVICE_NAME,
      version: VERSION,
    }));
    return;
  }

  // 404 for everything else
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

let requestCount = 0;

server.listen(PORT, () => {
  console.log(`${SERVICE_NAME} v${VERSION} running on port ${PORT}`);
});

module.exports = server;