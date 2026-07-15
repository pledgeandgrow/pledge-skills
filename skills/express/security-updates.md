# Security Updates

Known vulnerabilities and security patches for Express.js versions.

---

## Keeping Express Updated

```bash
# Check for vulnerabilities
npm audit

# Update Express
npm install express@latest

# Check installed version
npm list express
```

---

## Express 4.x Security Updates

### 4.21.2

- `path-to-regexp` updated to address [vulnerability](https://github.com/pillarjs/path-to-regexp/security/advisories/GHSA-rhx6-c78j-4q9w)

### 4.21.1

- `cookie` dependency updated to address [vulnerability](https://github.com/jshttp/cookie/security/advisories/GHSA-pxg6-pf52-xh8x)
- May affect applications using `res.cookie`

### 4.20.0

- Fixed XSS [vulnerability](https://github.com/advisories/GHSA-qwcr-r2fm-qrc7) in `res.redirect` (CVE-2024-43796)
- `serve-static` updated for vulnerability
- `send` updated for vulnerability
- `path-to-regexp` updated for vulnerability
- `body-parser` updated — affects apps with URL encoding activated

### 4.19.0 / 4.19.1

- Fixed open redirect vulnerability in `res.location` and `res.redirect` (CVE-2024-29041)

### 4.17.3

- `qs` updated — affects `req.query`, `req.body`, `req.param`

### 4.16.0

- `forwarded` updated — affects `req.host`, `req.hostname`, `req.ip`, `req.ips`, `req.protocol`
- `send` updated for Node.js 8.5.0 path validation vulnerability

### 4.15.5

- `fresh` updated — affects `express.static`, `req.fresh`, `res.json`, `res.jsonp`, `res.send`, `res.sendFile`, `res.sendStatus`

---

## Express 3.x (End of Life)

**Express 3.x is no longer maintained.** All known vulnerabilities:

- 3.19.2: Fixed XSS in `res.redirect` (CVE-2024-43796)
- 3.19.0: Fixed open redirect in `res.location`/`res.redirect`
- 3.11.0: `qs` dependency vulnerability

**Upgrade to Express 4.x or 5.x immediately if still on 3.x.**

---

## Vulnerability Checklist

| Vulnerability | Affected APIs | Fixed In |
|---------------|---------------|----------|
| XSS in `res.redirect` | `res.redirect`, `res.location` | 4.20.0 |
| Open redirect | `res.redirect`, `res.location` | 4.19.0 |
| `path-to-regexp` ReDoS | Route matching | 4.21.2 |
| `cookie` parsing | `res.cookie` | 4.21.1 |
| `qs` prototype pollution | `req.query`, `req.body` | 4.17.3 |
| `forwarded` header parsing | `req.ip`, `req.ips`, `req.protocol` | 4.16.0 |
| `body-parser` URL encoding | `express.urlencoded()` | 4.20.0 |

---

## Staying Secure

- **Update regularly** — `npm audit` and `npm update`
- **Subscribe to advisories** — [GitHub Security Advisories](https://github.com/expressjs/express/security/advisories)
- **Use Express 4.21.2+ or 5.x** — latest patches
- **Never use Express 3.x** — end of life, unpatched vulnerabilities
- **Monitor dependencies** — `npm audit`, Snyk, GitHub Dependabot
- **Review CVEs** — [CVE database for Express](https://www.cve.org/)
