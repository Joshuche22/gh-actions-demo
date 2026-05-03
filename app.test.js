'use strict';

const supertest = require('supertest');
const server = require('./app');

const request = supertest(server);

afterAll(() => {
  server.close();
});

describe('GET /', () => {
  it('returns 200 with service info', async () => {
    const res = await request.get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Service is running');
    expect(res.body).toHaveProperty('service');
    expect(res.body).toHaveProperty('version');
  });
});

describe('GET /health', () => {
  it('returns 200 with healthy status', async () => {
    const res = await request.get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('GET /ready', () => {
  it('returns 200 with ready status', async () => {
    const res = await request.get('/ready');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ready');
  });
});

describe('GET /metrics', () => {
  it('returns 200 with prometheus metrics format', async () => {
    const res = await request.get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('uptime_seconds');
    expect(res.text).toContain('http_requests_total');
  });
});

describe('GET /unknown', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request.get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Not found');
  });
});