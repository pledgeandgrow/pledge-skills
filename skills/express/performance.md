# Performance

Performance best practices for Express applications in production.

---

## Environment

### Set `NODE_ENV=production`

```bash
NODE_ENV=production node app.js
```

Express optimizes for production when this is set:
- View caching enabled
- Less verbose error messages
- Faster middleware execution

```js
console.log(app.get('env')); // 'production'
```

---

## Gzip Compression

```bash
npm install compression
```

```js
import compression from 'compression';
app.use(compression());

// With options
app.use(compression({
  level: 6,
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));
```

---

## Caching

### Response Caching

```js
// Cache-Control headers
app.use(express.static('public', { maxAge: '1d' }));

app.get('/api/data', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.json(data);
});

// ETag
app.get('/api/data', (req, res) => {
  res.set('ETag', '"12345"');
  res.json(data);
});
```

### Redis Caching

```js
import { createClient } from 'redis';
const redis = createClient();
await redis.connect();

const cacheMiddleware = (key, ttl = 3600) => async (req, res, next) => {
  const cached = await redis.get(key);
  if (cached) return res.json(JSON.parse(cached));

  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    await redis.setEx(key, ttl, JSON.stringify(body));
    originalJson(body);
  };
  next();
};

app.get('/users', cacheMiddleware('users:all'), async (req, res) => {
  const users = await User.find();
  res.json(users);
});
```

### In-Memory Caching

```js
const cache = new Map();

const memoize = (ttl = 60000) => (req, res, next) => {
  const key = req.originalUrl;
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < ttl) {
    return res.json(cached.data);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, { data: body, timestamp: Date.now() });
    originalJson(body);
  };
  next();
};
```

---

## Clustering

Use all CPU cores with Node.js cluster module:

```js
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const cpus = os.cpus().length;
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  app.listen(3000);
}
```

### Using PM2

```bash
# Start with cluster mode
pm2 start app.js -i max

# Or specific number of instances
pm2 start app.js -i 4

# Reload without downtime
pm2 reload app.js
```

---

## Streaming

### Stream Large Files

```js
app.get('/download', (req, res) => {
  const stream = fs.createReadStream('large-file.pdf');
  stream.pipe(res);
});

// Range requests (video/audio)
app.get('/video', (req, res) => {
  const stat = fs.statSync('video.mp4');
  const range = req.range(stat.size);

  if (range) {
    const { start, end } = range[0];
    res.status(206);
    res.set({
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'video/mp4'
    });
    fs.createReadStream('video.mp4', { start, end }).pipe(res);
  } else {
    res.set('Content-Length', stat.size);
    fs.createReadStream('video.mp4').pipe(res);
  }
});
```

### Stream JSON Responses

```js
app.get('/api/large-data', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.write('[');

  const cursor = db.collection('items').find().stream();
  let first = true;

  cursor.on('data', (item) => {
    if (!first) res.write(',');
    res.write(JSON.stringify(item));
    first = false;
  });

  cursor.on('end', () => {
    res.write(']');
    res.end();
  });
});
```

---

## Connection Pooling

### Database Pools

```js
// PostgreSQL
const pool = new pg.Pool({ max: 20, idleTimeoutMillis: 30000 });

// MongoDB
const client = new MongoClient(uri, { maxPoolSize: 50 });

// MySQL
const pool = mysql.createPool({ connectionLimit: 20 });
```

### HTTP Agent (Outbound Requests)

```js
import http from 'http';

const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 50,
  timeout: 5000
});

// Use with fetch or http requests
fetch('http://api.example.com/data', { agent });
```

---

## Optimizing Middleware

### Minimize Middleware Overhead

```js
// BAD: Heavy middleware on every request
app.use((req, res, next) => {
  // Expensive operation on every request
  const data = expensiveCalculation();
  req.data = data;
  next();
});

// GOOD: Only on routes that need it
app.use('/api', dataMiddleware);
```

### Use `express.static` Efficiently

```js
// Serve static files before routes
app.use(express.static('public', { maxAge: '1d' }));

// Or use a CDN/reverse proxy for static files
// Let nginx handle static files in production
```

---

## Performance Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Enable gzip compression
- [ ] Use caching (Redis/in-memory)
- [ ] Run in cluster mode (PM2 or cluster module)
- [ ] Use connection pooling for databases
- [ ] Stream large responses
- [ ] Minimize middleware on hot paths
- [ ] Use a reverse proxy (nginx) for static files
- [ ] Keep dependencies lean (`npm prune --production`)
- [ ] Monitor with APM tools (New Relic, PM2 Plus)
- [ ] Use async/await to avoid blocking event loop
- [ ] Profile with `--prof` flag
