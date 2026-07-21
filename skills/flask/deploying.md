# Deploying Flask to Production

Flask is a WSGI application. A WSGI server converts incoming HTTP requests to the standard WSGI environ, and converts outgoing WSGI responses to HTTP responses. The development server (`flask run`) is not suitable for production.

## Self-Hosted Options

### WSGI Servers

- **[Gunicorn](https://flask.palletsprojects.com/en/stable/deploying/gunicorn/)** — Python WSGI HTTP server for UNIX
- **[Waitress](https://flask.palletsprojects.com/en/stable/deploying/waitress/)** — Cross-platform WSGI server (Windows + Linux)
- **[mod_wsgi](https://flask.palletsprojects.com/en/stable/deploying/mod_wsgi/)** — Apache module for WSGI
- **[uWSGI](https://flask.palletsprojects.com/en/stable/deploying/uwsgi/)** — High-performance WSGI server
- **[gevent](https://flask.palletsprojects.com/en/stable/deploying/gevent/)** — Coroutine-based WSGI server
- **[ASGI](https://flask.palletsprojects.com/en/stable/deploying/asgi/)** — Running WSGI apps under ASGI servers

### Reverse Proxies

WSGI servers have built-in HTTP servers, but a dedicated HTTP server may be safer, more efficient, or more capable. Placing an HTTP server in front of the WSGI server is called a "reverse proxy."

- **[Tell Flask it is Behind a Proxy](https://flask.palletsprojects.com/en/stable/deploying/proxy_fix/)** — Using `ProxyFix` middleware
- **[nginx](https://flask.palletsprojects.com/en/stable/deploying/nginx/)** — High-performance HTTP server and reverse proxy
- **[Apache httpd](https://flask.palletsprojects.com/en/stable/deploying/apache-httpd/)** — Apache HTTP Server as reverse proxy

### Example: Waitress

```bash
$ pip install waitress
$ waitress-serve --call 'flaskr:create_app'
```

### Example: Gunicorn

```bash
$ pip install gunicorn
$ gunicorn 'flaskr:create_app()'
```

### Behind a Proxy (ProxyFix)

When behind a reverse proxy, use `ProxyFix` to correct headers:

```python
from werkzeug.middleware.proxy_fix import ProxyFix

app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
```

## Hosting Platforms

Services that host web applications without maintaining your own server:

- **[PythonAnywhere](https://help.pythonanywhere.com/pages/Flask/)** — Python-focused hosting
- **[Google App Engine](https://cloud.google.com/appengine/docs/standard/python3/building-app)** — Google Cloud PaaS
- **[Google Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service)** — Containerized serverless
- **[AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-flask.html)** — AWS PaaS
- **[Microsoft Azure](https://docs.microsoft.com/en-us/azure/app-service/quickstart-python)** — Azure App Service

Most hosting platforms use one of the WSGI servers described above or a similar interface. You'll likely need to tell Flask it is behind a proxy when using most hosting platforms.

## Key Points

- Never use the development server in production
- Choose a WSGI server based on your platform and needs
- Consider a reverse proxy (nginx, Apache) for security and performance
- Use `ProxyFix` when behind a proxy
- Hosting platforms simplify deployment but may have limitations
- Evaluate servers and platforms based on capabilities, configuration, pricing, and support
