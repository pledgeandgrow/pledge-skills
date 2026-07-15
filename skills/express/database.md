# Database Integration

Connecting Express applications to databases.

---

## MongoDB

### Mongoose

```bash
npm install mongoose
```

```js
import mongoose from 'mongoose';

await mongoose.connect('mongodb://localhost:27017/myapp');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  age: Number,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});
```

### Native MongoDB Driver

```bash
npm install mongodb
```

```js
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myapp');
const users = db.collection('users');

app.get('/users', async (req, res) => {
  const result = await users.find({}).toArray();
  res.json(result);
});
```

---

## PostgreSQL

### `pg` (node-postgres)

```bash
npm install pg
```

```js
import pg from 'pg';

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'password',
  max: 20,
  idleTimeoutMillis: 30000
});

app.get('/users', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users');
  res.json(rows);
});

app.get('/users/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});
```

### Prisma

```bash
npm install @prisma/client
npx prisma init
```

```js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const user = await prisma.user.create({
    data: { name: req.body.name, email: req.body.email }
  });
  res.status(201).json(user);
});
```

### Drizzle ORM

```bash
npm install drizzle-orm pg
```

```js
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique()
});

const db = drizzle(pool);

app.get('/users', async (req, res) => {
  const result = await db.select().from(users);
  res.json(result);
});
```

---

## MySQL

### `mysql2`

```bash
npm install mysql2
```

```js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'myapp',
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/users', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users');
  res.json(rows);
});

app.post('/users', async (req, res) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [req.body.name, req.body.email]
  );
  res.status(201).json({ id: result.insertId, ...req.body });
});
```

---

## Redis

```bash
npm install redis
```

```js
import { createClient } from 'redis';

const redis = createClient({ url: 'redis://localhost:6379' });
await redis.connect();

// Cache middleware
const cache = (key, ttl = 3600) => async (req, res, next) => {
  const cached = await redis.get(key);
  if (cached) return res.json(JSON.parse(cached));

  res.sendResponse = res.json;
  res.json = async (body) => {
    await redis.setEx(key, ttl, JSON.stringify(body));
    res.sendResponse(body);
  };
  next();
};

app.get('/users', cache('users:all'), async (req, res) => {
  const users = await User.find();
  res.json(users);
});
```

---

## Connection Best Practices

### Use Connection Pools

```js
// Always use pools, not individual connections
const pool = new pg.Pool({ max: 20 });
// Pool reuses connections across requests
```

### Handle Connection Errors

```js
pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy' });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy' });
  }
});
```

### Graceful Shutdown

```js
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await pool.end();
  await mongoose.disconnect();
  await redis.quit();
  server.close(() => process.exit(0));
});
```

### Environment-Based Configuration

```js
const config = {
  development: {
    database: 'mongodb://localhost:27017/myapp_dev'
  },
  production: {
    database: process.env.DATABASE_URL
  }
};

const env = process.env.NODE_ENV || 'development';
await mongoose.connect(config[env].database);
```
