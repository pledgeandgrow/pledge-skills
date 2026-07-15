# Debugging

Debug Express applications using the `debug` module.

---

## Enabling Debug

```bash
# All Express debug output
DEBUG=express:* node app.js

# Only router debug
DEBUG=express:router node app.js

# Only application debug
DEBUG=express:application node app.js

# Multiple namespaces
DEBUG=express:router,express:application node app.js

# Everything except views
DEBUG=express:*,-express:view node app.js

# In production (redirect to file)
DEBUG=express:* node app.js > debug.log 2>&1
```

---

## Debug Namespaces

| Namespace | Description |
|-----------|-------------|
| `express:application` | Application settings and events |
| `express:router` | Router matching and dispatching |
| `express:router:layer` | Route layer details |
| `express:router:route` | Route matching details |
| `express:view` | View rendering |
| `express:*` | All Express debug output |

---

## Custom Debug Logging

```js
import debug from 'debug';

const log = debug('myapp:server');
const dbLog = debug('myapp:db');

app.get('/users', async (req, res) => {
  log('Fetching users');
  const users = await db.query('SELECT * FROM users');
  dbLog('Query returned %d users', users.length);
  res.json(users);
});
```

Enable:

```bash
DEBUG=myapp:* node app.js
DEBUG=myapp:server node app.js
DEBUG=myapp:db node app.js
```

---

## Debugging in Windows

```powershell
# PowerShell
$env:DEBUG="express:*"; node app.js

# CMD
set DEBUG=express:* & node app.js
```

---

## Debugging Middleware

Log all requests with full details:

```js
import debug from 'debug';
const log = debug('myapp:request');

app.use((req, res, next) => {
  log('%s %s', req.method, req.url);
  log('Headers: %O', req.headers);
  log('Query: %O', req.query);
  log('Params: %O', req.params);
  next();
});
```

---

## Debugging Route Matching

```bash
DEBUG=express:router node app.js
```

Output shows:
- Route pattern matching
- Middleware execution order
- Parameter extraction
- Route dispatching

---

## Debugging Views

```bash
DEBUG=express:view node app.js
```

Output shows:
- View lookup
- Template file resolution
- Engine rendering

---

## Common Debug Scenarios

### Route Not Matching

```bash
DEBUG=express:router,express:router:route node app.js
```

Check:
- Route pattern syntax
- Route registration order
- HTTP method matching

### Middleware Not Running

```bash
DEBUG=express:router,express:router:layer node app.js
```

Check:
- `next()` calls
- Middleware registration order
- Path matching

### Template Not Found

```bash
DEBUG=express:view node app.js
```

Check:
- `views` directory setting
- File extension
- View engine registration

---

## Using `console.log` vs `debug`

`console.log` always outputs. `debug` is environment-controlled:

```js
// Always logs (not recommended for production)
console.log('User:', user);

// Only logs when DEBUG=myapp:users is set
import debug from 'debug';
const log = debug('myapp:users');
log('User:', user);
```

---

## Debugging with `nodemon`

```bash
# Install nodemon
npm install -D nodemon

# Run with debug
DEBUG=express:* nodemon app.js

# package.json
{
  "scripts": {
    "dev": "DEBUG=express:* nodemon app.js",
    "dev:api": "DEBUG=express:router nodemon app.js"
  }
}
```
