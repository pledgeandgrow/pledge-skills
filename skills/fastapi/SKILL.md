# FastAPI Skill

- **Version**: FastAPI 0.115+ (latest)
- **Documentation**: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
- **Learn**: [https://fastapi.tiangolo.com/learn/](https://fastapi.tiangolo.com/learn/)
- **Reference**: [https://fastapi.tiangolo.com/reference/](https://fastapi.tiangolo.com/reference/)

## Quick Reference

| Topic | File |
|-------|------|
| Getting Started (Python types, async/await, environment variables, virtual environments, first steps, path parameters, query parameters, request body) | `getting-started.md` |
| Tutorial Core (Query/path string & numeric validations, query/body parameter models, body fields, nested models, request examples, extra data types, cookie/header parameters, response model, extra models, response status code, form data, form models, request files, forms and files, handling errors, path operation configuration, JSON encoder, body updates) | `tutorial-core.md` |
| Tutorial: Dependencies & Security (Dependencies, classes as dependencies, sub-dependencies, decorator dependencies, global dependencies, yield dependencies, security first steps, get current user, OAuth2 with JWT, middleware, CORS, SQL databases, bigger applications with APIRouter, stream JSON lines, server-sent events, background tasks, metadata and docs URLs, frontend, static files, testing, debugging) | `tutorial-deps-security.md` |
| Advanced User Guide (Stream data, path operation advanced config, additional status codes, return response directly, custom responses: HTML/Stream/File, additional OpenAPI responses, response cookies, response headers, response change status code, advanced dependencies, OAuth2 scopes, HTTP Basic Auth, using request directly, dataclasses, advanced middleware, sub-applications/mounts, behind a proxy, templates, WebSockets, lifespan events, testing WebSockets, testing events, testing dependency overrides, async tests, settings & env vars, OpenAPI callbacks, OpenAPI webhooks, WSGI inclusion, generating SDKs, advanced Python types, JSON with bytes as Base64, strict content-type checking, FastAPI CLI, editor support) | `advanced.md` |
| Deployment (FastAPI versions, FastAPI Cloud, HTTPS, run server manually, deployment concepts, cloud providers, server workers with Uvicorn, Docker containers) | `deployment.md` |
| How To — Recipes (General recipes, Pydantic v1→v2 migration, GraphQL, custom request/APIRoute class, conditional OpenAPI, extending OpenAPI, separate input/output schemas, custom docs UI assets, configure Swagger UI, testing a database, old 403 auth error codes) | `how-to.md` |
| API Reference (FastAPI class, request parameters: Path/Query/Header/Cookie/Body/Form/File, status codes, UploadFile, exceptions: HTTPException/WebSocketException, Depends/Security, APIRouter, BackgroundTasks, Request class, WebSockets, HTTPConnection, Response class, custom response classes, middleware, OpenAPI docs & models, security tools, jsonable_encoder, StaticFiles, Jinja2Templates, TestClient) | `reference.md` |
| About & Resources (Features: FastAPI/Starlette/Pydantic features; Alternatives & inspiration: Django, Flask, NestJS, Marshmallow, APIStar; History, design & future; Benchmarks: Uvicorn/Starlette/FastAPI hierarchy; Repository management: owner & team; Release notes: all versions 0.1.19–0.139.2+; Help: newsletter, social, GitHub discussions, Discord; Contributing guidelines; Translations: LLM-assisted with native review; Full Stack Template: FastAPI+SQLModel+React+PostgreSQL+Docker; External links: top GitHub repos; FastAPI People: creator, team, experts, contributors, sponsors; Newsletter) | `about-resources.md` |

## Core Concepts

- **FastAPI**: Modern, fast web framework for building APIs with Python 3.8+ based on standard Python type hints
- **Pydantic**: Data validation and settings management using Python type annotations
- **Starlette**: Lightweight ASGI framework/toolkit that FastAPI builds upon
- **OpenAPI**: Automatic API documentation generation (Swagger UI at `/docs`, ReDoc at `/redoc`)
- **Type Hints**: Python type annotations used for validation, serialization, and documentation
- **Dependency Injection**: `Depends()` for reusable components, database sessions, auth, etc.
- **Security**: OAuth2 with Password flow, JWT tokens, HTTP Basic/Digest, API keys, OAuth2 scopes
- **Async/Await**: Native async support for high-performance I/O-bound operations
- **APIRouter**: Modular route organization for larger applications
- **Lifespan**: Context manager-based startup/shutdown event handling

## Official Documentation Sources

- [Learn](https://fastapi.tiangolo.com/learn/) — Tutorial and user guide
- [Reference](https://fastapi.tiangolo.com/reference/) — API reference
- [Python Types Intro](https://fastapi.tiangolo.com/python-types/) — Type hints overview
- [Concurrency and async/await](https://fastapi.tiangolo.com/async/) — Async concepts
- [Environment Variables](https://fastapi.tiangolo.com/environment-variables/) — Settings management
- [Virtual Environments](https://fastapi.tiangolo.com/virtual-environments/) — Project setup
- [Tutorial - User Guide](https://fastapi.tiangolo.com/tutorial/) — Step-by-step tutorial
- [Advanced User Guide](https://fastapi.tiangolo.com/advanced/) — Advanced features
- [Deployment](https://fastapi.tiangolo.com/deployment/) — Production deployment
- [How To - Recipes](https://fastapi.tiangolo.com/how-to/) — Practical recipes
- [FastAPI CLI](https://fastapi.tiangolo.com/fastapi-cli/) — CLI commands
- [FastAPI class Reference](https://fastapi.tiangolo.com/reference/fastapi/) — FastAPI class API
- [Request Parameters Reference](https://fastapi.tiangolo.com/reference/parameters/) — Path/Query/Header/Cookie/Body/Form/File
- [Status Codes Reference](https://fastapi.tiangolo.com/reference/status/) — HTTP status codes
- [UploadFile Reference](https://fastapi.tiangolo.com/reference/uploadfile/) — File upload class
- [Exceptions Reference](https://fastapi.tiangolo.com/reference/exceptions/) — HTTPException & WebSocketException
- [Dependencies Reference](https://fastapi.tiangolo.com/reference/dependencies/) — Depends() & Security()
- [APIRouter Reference](https://fastapi.tiangolo.com/reference/apirouter/) — APIRouter class
- [BackgroundTasks Reference](https://fastapi.tiangolo.com/reference/background/) — Background tasks
- [Request Reference](https://fastapi.tiangolo.com/reference/request/) — Request class
- [WebSockets Reference](https://fastapi.tiangolo.com/reference/websockets/) — WebSocket support
- [HTTPConnection Reference](https://fastapi.tiangolo.com/reference/httpconnection/) — HTTP connection class
- [Response Reference](https://fastapi.tiangolo.com/reference/response/) — Response class
- [Custom Responses Reference](https://fastapi.tiangolo.com/reference/responses/) — HTML/Stream/File responses
- [Middleware Reference](https://fastapi.tiangolo.com/reference/middleware/) — Middleware classes
- [OpenAPI Docs Reference](https://fastapi.tiangolo.com/reference/openapi/docs/) — OpenAPI documentation
- [OpenAPI Models Reference](https://fastapi.tiangolo.com/reference/openapi/models/) — OpenAPI schema models
- [Security Tools Reference](https://fastapi.tiangolo.com/reference/security/) — Security utilities
- [Encoders Reference](https://fastapi.tiangolo.com/reference/encoders/) — jsonable_encoder
- [StaticFiles Reference](https://fastapi.tiangolo.com/reference/staticfiles/) — Static file serving
- [Templating Reference](https://fastapi.tiangolo.com/reference/templating/) — Jinja2 templates
- [TestClient Reference](https://fastapi.tiangolo.com/reference/testclient/) — Test client
- [Features](https://fastapi.tiangolo.com/features/) — FastAPI features overview
- [Alternatives](https://fastapi.tiangolo.com/alternatives/) — Inspiration and comparisons
- [History, Design and Future](https://fastapi.tiangolo.com/history-design-future/) — Project history
- [Benchmarks](https://fastapi.tiangolo.com/benchmarks/) — Performance benchmarks
- [Repository Management](https://fastapi.tiangolo.com/management/) — Owner and team
- [Release Notes](https://fastapi.tiangolo.com/release-notes/) — All version changelogs
- [Help FastAPI](https://fastapi.tiangolo.com/help-fastapi/) — Newsletter, social, community
- [Contributing](https://fastapi.tiangolo.com/contributing/) — Contribution guidelines
- [Translations](https://fastapi.tiangolo.com/translations/) — Multi-language docs
- [Full Stack Template](https://fastapi.tiangolo.com/project-generation/) — Full stack project generator
- [External Links](https://fastapi.tiangolo.com/external-links/) — Top FastAPI GitHub repos
- [FastAPI People](https://fastapi.tiangolo.com/fastapi-people/) — Creator, team, contributors
- [Newsletter](https://fastapi.tiangolo.com/newsletter/) — FastAPI and friends newsletter
