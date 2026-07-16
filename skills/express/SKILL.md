---
name: express-docs
version: "5.x"
tags:
  - express
  - nodejs
  - web-framework
  - backend
  - api
  - middleware
  - routing
  - rest
description: |
  Comprehensive Express.js reference covering getting started, routing, middleware,
  error handling, the Application/Request/Response/Router API objects, template engines,
  debugging, database integration, security, performance, production patterns, and
  migration guides. Use whenever the user mentions Express, Express.js, Node.js web
  server, REST API, or needs help building backend services with Express.
---

# Express Expert (v5.x)

**Official Documentation:** https://expressjs.com/
**GitHub:** https://github.com/expressjs/express

## What is Express?

Express is a fast, unopinionated, minimalist web framework for Node.js. It provides a robust set of features for web and mobile applications, including routing, middleware, template rendering, and API development.

## Quick Reference

| Topic | File |
|------|------|
| Getting Started (install, hello world, generator, static files, FAQ) | `getting-started.md` |
| Routing (methods, paths, params, handlers, app.route, Router) | `routing.md` |
| Middleware (writing, using, app-level, router-level, error, built-in, third-party) | `middleware.md` |
| Error Handling (catching errors, handlers, async patterns) | `error-handling.md` |
| API: express() & Application Object | `api-app.md` |
| API: Request Object (req properties & methods) | `api-request.md` |
| API: Response Object (res properties & methods) | `api-response.md` |
| API: Router Object (router methods) | `api-router.md` |
| Template Engines (using, developing, rendering) | `template-engines.md` |
| Debugging (DEBUG env var, debugging routes, views) | `debugging.md` |
| Database Integration (MongoDB, MySQL, PostgreSQL, Redis) | `database.md` |
| Security (best practices, helmet, CORS, rate limiting) | `security.md` |
| Performance (best practices, caching, clustering) | `performance.md` |
| Production (healthcheck, graceful shutdown, behind proxies) | `production.md` |
| Migration (to Express 4, to Express 5, breaking changes) | `migration.md` |
| Overriding Express API (methods, properties, TypeScript) | `overriding-api.md` |
| Security Updates (CVEs, vulnerabilities, patches) | `security-updates.md` |

## Hello World

```js
import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

## Project Structure

```
myapp/
  app.js              # Main application file
  routes/
    index.js          # Route handlers
    users.js
    api/
      v1.js
  middleware/
    auth.js
    logger.js
  public/             # Static assets
    images/
    css/
    js/
  views/              # Template files
    index.ejs
    layout.ejs
  package.json
```

## Key Concepts

- **Middleware** — Functions that execute during the request-response cycle
- **Routing** — Maps HTTP methods and URLs to handler functions
- **Application Object** — The `app` object created by `express()`
- **Request Object** — `req` represents the HTTP request
- **Response Object** — `res` represents the HTTP response
- **Router** — Isolated instance of middleware and routes (modular routing)
- **Template Engines** — Server-side rendering with EJS, Pug, Handlebars, etc.
- **Error Handling** — Centralized error handling via error middleware
- **Express 5** — Async error support, path-to-regexp v8, removed deprecated APIs

## Prerequisites

- Node.js (v18+ recommended for Express 5)
- JavaScript fundamentals
- HTTP basics (methods, headers, status codes)
- npm/pnpm/yarn package management

## Installation

```bash
# Create a new project
mkdir myapp && cd myapp
npm init -y
npm install express

# Using Express generator
npx express-generator myapp
cd myapp && npm install
```

## References

- [Express Docs](https://expressjs.com/)
- [Express GitHub](https://github.com/expressjs/express)
- [Express 5.x API](https://expressjs.com/en/5x/api.html)
- [Express GitHub Wiki](https://github.com/expressjs/express/wiki)
- [Express Community](https://github.com/expressjs/express/wiki#community)
- [Awesome Express](https://github.com/expressjs/express/wiki#middleware--modules)
