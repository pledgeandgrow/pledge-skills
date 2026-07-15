# Security

Security best practices for Express applications.

---

## Use Helmet

Set security-related HTTP headers:

```bash
npm install helmet
```

```js
import helmet from 'helmet';
app.use(helmet());

// Configured
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'cdn.example.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'api.example.com']
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Headers Set by Helmet

| Header | Purpose |
|--------|---------|
| `Content-Security-Policy` | Prevent XSS, data injection |
| `X-Content-Type-Options` | Prevent MIME sniffing |
| `X-Frame-Options` | Prevent clickjacking |
| `Strict-Transport-Security` | Force HTTPS |
| `X-XSS-Protection` | XSS filter (legacy browsers) |
| `Referrer-Policy` | Control referrer info |
| `X-DNS-Prefetch-Control` | DNS prefetch control |

---

## CORS

```bash
npm install cors
```

```js
import cors from 'cors';

// Allow all origins
app.use(cors());

// Specific origins
app.use(cors({
  origin: ['https://app.example.com', 'https://admin.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));

// Per-route
app.get('/api/public', cors(), handler);
app.post('/api/private', cors({ origin: 'https://app.example.com' }), handler);
```

---

## Rate Limiting

```bash
npm install express-rate-limit
```

```js
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests' }
});

app.use('/api', apiLimiter);

// Stricter for login
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  message: { error: 'Too many login attempts' }
});

app.post('/auth/login', loginLimiter, loginHandler);
```

---

## Input Validation

### `express-validator`

```bash
npm install express-validator
```

```js
import { body, validationResult } from 'express-validator';

app.post('/users',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be 8+ chars'),
  body('name').trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Create user
  }
);
```

### `zod`

```bash
npm install zod
```

```js
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100)
});

app.post('/users', (req, res) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }
  // result.data is validated
});
```

---

## Authentication

### JWT

```bash
npm install jsonwebtoken
```

```js
import jwt from 'jsonwebtoken';

// Generate token
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verify middleware
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/profile', auth, getProfile);
```

### `passport`

```bash
npm install passport passport-local
```

```js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ username });
  if (!user || !await user.verifyPassword(password)) {
    return done(null, false, { message: 'Invalid credentials' });
  }
  done(null, user);
}));

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ user: req.user });
});
```

---

## HTTPS / TLS

```js
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
};

https.createServer(options, app).listen(443);
```

### Force HTTPS

```js
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
```

---

## Cookie Security

```js
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // No JS access
    sameSite: 'strict', // CSRF protection
    maxAge: 3600000    // 1 hour
  }
}));
```

---

## Preventing Common Attacks

### XSS (Cross-Site Scripting)

- Use template engines that auto-escape (EJS `<%= %>`, Pug `=`)
- Never use `set:html` with user input
- Set `Content-Security-Policy` via Helmet

### SQL Injection

- Use parameterized queries (never string concatenation)

```js
// GOOD
pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);

// BAD
pool.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
```

### CSRF (Cross-Site Request Forgery)

```bash
npm install csurf
```

```js
import csrf from 'csurf';
app.use(csrf({ cookie: true }));

// Include token in forms
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});
```

### NoSQL Injection

```js
// Sanitize input to prevent operator injection
import { sanitizeFilter } from 'express-mongo-sanitize';
app.use(sanitizeFilter());
```

---

## Security Checklist

- [ ] Use `helmet` for security headers
- [ ] Enable CORS with specific origins
- [ ] Rate limit API endpoints
- [ ] Validate and sanitize all input
- [ ] Use parameterized database queries
- [ ] Store secrets in environment variables
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Implement authentication (JWT/Passport)
- [ ] Log security events
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Disable `x-powered-by` header: `app.disable('x-powered-by')`
- [ ] Use `express-mongo-sanitize` for MongoDB
- [ ] Set `NODE_ENV=production`
