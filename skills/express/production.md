# Production

Health checks, graceful shutdown, running behind proxies, and process management.

---

## Behind Proxies

### Trust Proxy

When running behind nginx, Apache, or a load balancer:

```js
// Trust all proxies
app.set('trust proxy', true);

// Trust specific proxy
app.set('trust proxy', '10.0.0.1');

// Trust proxy hops
app.set('trust proxy', 1);

// Trust subnet
app.set('trust proxy', '10.0.0.0/24');

// Custom function
app.set('trust proxy', (ip) => {
  return ip === '10.0.0.1' || ip === '10.0.0.2';
});
```

### What Trust Proxy Affects

| Property | Without Trust | With Trust |
|----------|--------------|------------|
| `req.ip` | Socket IP | `X-Forwarded-For` IP |
| `req.ips` | `[]` | Array from `X-Forwarded-For` |
| `req.protocol` | Socket protocol | `X-Forwarded-Proto` |
| `req.hostname` | Host header | `X-Forwarded-Host` |

### nginx Configuration

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve static files directly
    location /static/ {
        alias /app/public/;
        expires 1d;
    }
}
```

---

## Health Checks

### Basic Health Check

```js
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});
```

### Detailed Health Check

```js
app.get('/health', async (req, res) => {
  const checks = {
    server: true,
    database: false,
    redis: false
  };

  try {
    await pool.query('SELECT 1');
    checks.database = true;
  } catch {
    checks.database = false;
  }

  try {
    await redis.ping();
    checks.redis = true;
  } catch {
    checks.redis = false;
  }

  const healthy = Object.values(checks).every(Boolean);
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: Date.now()
  });
});
```

### Readiness vs Liveness

```js
// Liveness — is the server running?
app.get('/health/live', (req, res) => {
  res.json({ status: 'alive' });
});

// Readiness — is the server ready to handle requests?
app.get('/health/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'not ready' });
  }
});
```

---

## Graceful Shutdown

```js
const server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});

let isShuttingDown = false;

// Middleware to reject new requests during shutdown
app.use((req, res, next) => {
  if (isShuttingDown) {
    res.set('Connection', 'close');
    return res.status(503).json({ error: 'Server shutting down' });
  }
  next();
});

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  isShuttingDown = true;

  server.close(async () => {
    console.log('HTTP server closed');

    try {
      await pool.end();
      console.log('Database pool closed');

      await redis.quit();
      console.log('Redis connection closed');

      await mongoose.disconnect();
      console.log('MongoDB disconnected');

      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  // Force exit after 30 seconds
  setTimeout(() => {
    console.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

---

## Process Management

### PM2

```bash
# Install
npm install -g pm2

# Start
pm2 start app.js --name "myapp" -i max

# Start with ecosystem file
pm2 start ecosystem.config.js

# Commands
pm2 status
pm2 logs myapp
pm2 reload myapp      # Zero-downtime reload
pm2 restart myapp
pm2 stop myapp
pm2 delete myapp
pm2 monit             # Real-time monitoring
```

### PM2 Ecosystem File

```js
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'myapp',
    script: 'app.js',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 3001
    }
  }]
};
```

```bash
pm2 start ecosystem.config.js --env production
```

### Docker

```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js
CMD ["node", "app.js"]
```

```js
// healthcheck.js
import http from 'http';

const req = http.get('http://localhost:3000/health', (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on('error', () => process.exit(1));
```

---

## Environment Variables

```js
const required = ['DATABASE_URL', 'JWT_SECRET', 'SESSION_SECRET'];
for (const env of required) {
  if (!process.env[env]) {
    console.error(`Missing required env var: ${env}`);
    process.exit(1);
  }
}
```

### `.env` in Production

Don't use `.env` files in production. Set environment variables directly:

```bash
# Systemd
# /etc/systemd/system/myapp.service
[Service]
Environment=NODE_ENV=production
Environment=DATABASE_URL=postgresql://...
Environment=JWT_SECRET=...
ExecStart=/usr/bin/node /app/app.js

# Docker
docker run -e DATABASE_URL=... -e JWT_SECRET=... myapp
```
