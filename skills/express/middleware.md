# Middleware

Middleware functions have access to the request (`req`), response (`res`), and the `next` function in the request-response cycle.

---

## What is Middleware?

A middleware function can:
- Execute any code
- Modify request and response objects
- End the request-response cycle
- Call the next middleware in the stack

```js
const myMiddleware = (req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  next(); // Pass control to next middleware
};
```

If the current middleware doesn't end the cycle, it **must** call `next()`.

---

## Writing Middleware

### Simple Logger

```js
const myLogger = (req, res, next) => {
  console.log('LOGGED');
  next();
};

app.use(myLogger);
```

### Request Time

```js
const requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

app.use(requestTime);

app.get('/', (req, res) => {
  const responseText = `Hello! Request time: ${req.requestTime}`;
  res.send(responseText);
});
```

### Cookie Validation

```js
const validateCookies = (req, res, next) => {
  console.log(`Cookies: ${JSON.stringify(req.cookies)}`);
  next();
};

app.use(validateCookies);
```

### Configurable Middleware

```js
function optionsMiddleware(options) {
  return (req, res, next) => {
    // Use options to configure behavior
    req.options = options;
    next();
  };
}

app.use(optionsMiddleware({ option1: 'value1', option2: 'value2' }));
```

---

## Using Middleware

### Application-Level Middleware

```js
// Without mount path — runs for every request
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// With mount path — runs for /user/:id
app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method);
  next();
});

// Multiple middleware functions
app.use('/user/:id',
  (req, res, next) => {
    console.log('Request URL:', req.originalUrl);
    next();
  },
  (req, res, next) => {
    console.log('Request Type:', req.method);
    next();
  }
);
```

### Router-Level Middleware

```js
const router = express.Router();

router.use((req, res, next) => {
  console.log('Router-level middleware');
  next();
});

router.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  next();
});

app.use('/', router);
```

### Error-Handling Middleware

Error middleware has **4 parameters** (err, req, res, next):

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

---

## Built-in Middleware

### `express.static()`

Serves static files:

```js
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
```

### `express.json()`

Parses JSON bodies (Express 4.16+):

```js
app.use(express.json());

app.post('/api', (req, res) => {
  console.log(req.body); // Parsed JSON
  res.json({ received: true });
});
```

Options:

```js
app.use(express.json({
  limit: '1mb',
  strict: true,
  type: 'application/json',
  verify: (req, res, buf, encoding) => { /* verify */ }
}));
```

### `express.urlencoded()`

Parses URL-encoded bodies:

```js
app.use(express.urlencoded({ extended: true }));
```

### `express.raw()`

Parses raw bodies as Buffer:

```js
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));
```

### `express.text()`

Parses text bodies:

```js
app.use(express.text({ type: 'text/plain' }));
```

---

## Third-Party Middleware

### `cors`

```bash
npm install cors
```

```js
import cors from 'cors';
app.use(cors());

// Configured
app.use(cors({
  origin: ['https://example.com', 'https://app.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204
}));
```

### `helmet`

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
      scriptSrc: ["'self'", 'cdn.example.com']
    }
  }
}));
```

### `morgan` (HTTP request logger)

```bash
npm install morgan
```

```js
import morgan from 'morgan';
app.use(morgan('combined'));
app.use(morgan('dev')); // Development
app.use(morgan('tiny')); // Minimal
```

### `compression`

```bash
npm install compression
```

```js
import compression from 'compression';
app.use(compression());
```

### `body-parser` (legacy — use built-in)

Express 4.16+ includes `express.json()` and `express.urlencoded()`. Only use `body-parser` for advanced needs:

```js
import bodyParser from 'body-parser';
app.use(bodyParser.json({ limit: '10mb' }));
```

### `cookie-parser`

```bash
npm install cookie-parser
```

```js
import cookieParser from 'cookie-parser';
app.use(cookieParser());

app.get('/', (req, res) => {
  console.log('Cookies:', req.cookies);
  console.log('Signed cookies:', req.signedCookies);
});
```

### `express-session`

```bash
npm install express-session
```

```js
import session from 'express-session';
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
```

---

## Middleware Order

Order matters — middleware runs in the order it's registered:

```js
// 1. Security headers first
app.use(helmet());

// 2. CORS
app.use(cors());

// 3. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Cookies
app.use(cookieParser());

// 5. Logging
app.use(morgan('combined'));

// 6. Static files
app.use(express.static('public'));

// 7. Routes
app.use('/api', apiRouter);

// 8. 404 handler (after all routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// 9. Error handler (last)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```
