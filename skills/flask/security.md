# Flask Security Considerations

## Resource Use (DoS Prevention)

Flask provides configuration options to limit resource consumption:

| Setting | Default | Description |
|---------|---------|-------------|
| `MAX_CONTENT_LENGTH` | `None` | Max request body size (bytes) |
| `MAX_FORM_MEMORY_SIZE` | 500kB | Max size of non-file form fields |
| `MAX_FORM_PARTS` | 1000 | Max multipart form parts |

Can also be set per-request: `Request.max_content_length`, `Request.max_form_memory_size`, `Request.max_form_parts`.

Also review limits from: OS, container (Docker), WSGI server, HTTP server, hosting platform.

## Cross-Site Scripting (XSS)

Flask configures Jinja to **automatically escape** all values unless explicitly told otherwise. This rules out XSS in templates, but be careful with:

- Generating HTML without Jinja
- Calling `Markup` on user-submitted data
- Sending HTML from uploaded files (use `Content-Disposition: attachment` instead)
- Sending text files from uploaded files (browser content-type guessing)

### Unquoted Attributes

Always quote attributes when using Jinja expressions:

```html
<input value="{{ value }}">
```

Without quotes, attackers can inject JavaScript handlers: `onmouseover=alert(document.cookie)`.

### javascript: URIs

Jinja escaping doesn't protect against `javascript:` URIs in `href` attributes:

```html
<a href="{{ value }}">click here</a>
<!-- If value is "javascript:alert('unsafe')" -->
```

Use Content Security Policy (CSP) to prevent this.

## Cross-Site Request Forgery (CSRF)

If authentication is stored in cookies, state is managed implicitly. Third-party sites can trigger requests with cookies attached.

**Prevention**: Use one-time tokens stored in cookies and transmitted with form data. Compare tokens on the server.

Flask doesn't include CSRF protection built-in — use a Flask extension like Flask-WTF.

## JSON Security

`jsonify()` now supports serializing top-level arrays (ECMAScript 5 closed the vulnerability that previously required this restriction).

## Security Headers

Use **Flask-Talisman** extension to manage HTTPS and security headers.

### HTTP Strict Transport Security (HSTS)

Forces HTTPS:

```python
response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
```

### Content Security Policy (CSP)

Controls resource loading sources:

```python
response.headers['Content-Security-Policy'] = "default-src 'self'"
```

### X-Content-Type-Options

Prevents MIME type sniffing:

```python
response.headers['X-Content-Type-Options'] = 'nosniff'
```

### X-Frame-Options

Prevents clickjacking (iframe embedding):

```python
response.headers['X-Frame-Options'] = 'SAMEORIGIN'
```

## Set-Cookie Options

| Option | Description |
|--------|-------------|
| `Secure` | HTTPS only |
| `HttpOnly` | Prevent JavaScript access |
| `SameSite` | `'Lax'` (recommended) or `'Strict'` — controls cross-site cookie sending |

```python
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
)

response.set_cookie('username', 'flask', secure=True, httponly=True, samesite='Lax')
```

### Cookie Expiration

```python
# Expires after 10 minutes
response.set_cookie('snakes', '3', max_age=600)
```

For session cookies, set `session.permanent = True` and configure `PERMANENT_SESSION_LIFETIME`:

```python
app.config.update(
    PERMANENT_SESSION_LIFETIME=600
)

@app.route('/login', methods=['POST'])
def login():
    session.clear()
    session['user_id'] = user.id
    session.permanent = True
```

Use `itsdangerous.TimedSerializer` for signing other cookie values.

## Host Header Validation

By default, Flask accepts any Host header. Attackers can set custom Host headers in non-browser requests.

Set `TRUSTED_HOSTS` config to restrict allowed hosts:

```python
app.config['TRUSTED_HOSTS'] = ['example.com', '.example.com']
```

If behind a proxy, use `ProxyFix` middleware to trust proxy headers.

## Copy/Paste to Terminal

Hidden characters (e.g., backspace `\b`) can render differently in HTML vs. terminals:

- `import y\b ose\b m\b i\b t\b e\b` renders as `import yosemite` in HTML
- Pasting into terminal becomes `import os`

If users copy untrusted code from your site, filter backspace characters:

```python
body = body.replace("\b", "")
```
