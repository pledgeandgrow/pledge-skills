# FastAPI — About, Resources, and Community

## Features

FastAPI provides the following features:

### FastAPI Features

- **Based on open standards**: OpenAPI for API creation, JSON Schema for data model documentation. Designed around these standards, not an afterthought.
- **Automatic docs**: Interactive API documentation via Swagger UI (`/docs`) and ReDoc (`/redoc`), included by default.
- **Just Modern Python**: Based on standard Python type declarations via Pydantic. No new syntax to learn.
- **Editor support**: Designed for autocompletion in VS Code, PyCharm, and other editors. Type checks everywhere.
- **Short**: Sensible defaults with optional configurations everywhere.
- **Validation**: Validates most Python data types (JSON objects, arrays, strings, numbers) and exotic types (URL, Email, UUID). Powered by Pydantic.
- **Security and authentication**: Integrated security including HTTP Basic, OAuth2 with JWT, API keys (headers, query params, cookies). Plus all Starlette security features.
- **Dependency Injection**: Powerful DI system with hierarchical dependencies, automatic validation, and no compromise with databases or frontends.
- **Unlimited "plug-ins"**: No plug-in system needed — import and use code via dependencies.
- **Tested**: 100% test coverage, 100% type annotated codebase, used in production.

### Starlette Features (inherited)

- Impressive performance (on par with NodeJS and Go)
- WebSocket support
- In-process background tasks
- Startup and shutdown events (lifespan)
- Test client built on HTTPX
- CORS, GZip, Static Files, Streaming responses
- Session and Cookie support
- 100% test coverage

### Pydantic Features (inherited)

- No new schema definition micro-language — uses Python types
- IDE/linter/brain friendly — autocompletion, linting, mypy
- Validates complex structures — hierarchical models, `list`, `dict`, deeply nested JSON
- Extensible — custom data types, custom validators
- 100% test coverage

**Source**: [features](https://fastapi.tiangolo.com/features/)

---

## Alternatives, Inspiration and Comparisons

FastAPI was inspired by many previous tools:

### Previous tools that inspired FastAPI

- **Django** and **Django REST Framework**: Model serialization, admin UI, ORM
- **Flask**: Microframework approach, simplicity
- **Requests**: Developer-friendly API design
- **Swagger/OpenAPI**: API documentation standard
- **Flask REST frameworks**: Flask-RESTful, Flask-RESTX
- **Marshmallow**: Data serialization/validation
- **Webargs**: Request parameter parsing
- **APISpec**: OpenAPI generation
- **Flask-apispec**: Integration of Marshmallow, Webargs, APISpec
- **NestJS** (and Angular): Dependency injection, modules
- **Sanic**: Fast async Python framework
- **Falcon**: Minimal API framework
- **Molten**: Type-annotated API framework
- **Hug**: Type-annotated API framework
- **APIStar** (<= 0.5): Type-annotated API framework with schema generation

### Used by FastAPI

- **Pydantic**: Data validation and settings management
- **Starlette**: ASGI web microframework
- **Uvicorn**: ASGI server

**Source**: [alternatives](https://fastapi.tiangolo.com/alternatives/)

---

## History, Design and Future

### Alternatives

The creator (Sebastián Ramírez / @tiangolo) spent years using various frameworks before creating FastAPI, taking the best ideas from each.

### Investigation

Before coding, spent months studying OpenAPI, JSON Schema, OAuth2 specs to understand their relationships, overlaps, and differences.

### Design

Designed the developer API by testing ideas in popular Python editors (PyCharm, VS Code, Jedi-based editors) covering ~80% of Python developers. Goal: minimize code duplication, maximize autocompletion and type checks.

### Requirements

Chose Pydantic for data validation (contributed to it for JSON Schema compliance) and Starlette for the web framework (also contributed to it).

### Development

By the time coding started, design was defined, requirements were ready, and standards knowledge was fresh.

### Future

FastAPI continues to evolve with community contributions and new features.

**Source**: [history-design-future](https://fastapi.tiangolo.com/history-design-future/)

---

## Benchmarks

### Benchmark hierarchy

- **Uvicorn**: ASGI server — fastest, no extra code. Compare against Daphne, Hypercorn, uWSGI.
- **Starlette**: Web microframework (uses Uvicorn) — next fastest. Compare against Sanic, Flask, Django.
- **FastAPI**: API framework (uses Starlette) — adds data validation, serialization, automatic docs. Compare against Flask-apispec, NestJS, Molten.

### Key insight

FastAPI cannot be faster than Starlette (which cannot be faster than Uvicorn) because it builds on top. However, if you didn't use FastAPI, you'd have to implement validation and serialization yourself, resulting in similar overhead. The automatic documentation doesn't add runtime overhead (generated at startup).

**Source**: [benchmarks](https://fastapi.tiangolo.com/benchmarks/)

---

## Repository Management

### Owner

Sebastián Ramírez (@tiangolo) is the creator and owner. He gives final review to PRs and makes final decisions (BDFL model).

### Team

A team of people helps manage and maintain the project, with different levels of involvement and permissions.

**Source**: [management](https://fastapi.tiangolo.com/management/)

---

## Release Notes

FastAPI maintains detailed release notes for every version from 0.1.19 to the latest (0.139.2+). Each release entry includes:

- **Features**: New functionality added
- **Fixes**: Bug fixes
- **Breaking Changes**: Changes that may require code updates
- **Refactors**: Internal code improvements
- **Upgrades**: Dependency version bumps
- **Docs**: Documentation improvements
- **Translations**: Translation updates
- **Internal**: Internal tooling and CI changes

### Notable releases

- **0.115.0** (2024-09-17): Major release with Pydantic v2 improvements
- **0.112.0** (2024-08-02): Breaking changes
- **0.109.0** (2024-01-11): Features and upgrades
- **0.106.0** (2023-12-25): Breaking changes with dependencies yield + HTTPException + Background Tasks
- **0.100.0** (2023-07-07): Pydantic v1 to v2 migration support
- **0.95.0** (2023-03-18): Highlights with Pydantic v2 support
- **0.104.0** (2023-10-18): Lifespan events, OpenAPI webhooks

**Source**: [release-notes](https://fastapi.tiangolo.com/release-notes/)

---

## Help FastAPI

### Subscribe to the newsletter

[FastAPI and friends newsletter](https://fastapi.tiangolo.com/newsletter/) — infrequent updates about news, guides, features, breaking changes, and tips.

### Follow FastAPI online

- X/Twitter: [@fastapi](https://x.com/fastapi)
- Bluesky: [@fastapi.tiangolo.com](https://bsky.app/profile/fastapi.tiangolo.com)
- LinkedIn: [FastAPI](https://www.linkedin.com/company/fastapi/)

### Star on GitHub

Star the repository at [https://github.com/fastapi/fastapi](https://github.com/fastapi/fastapi) to help others discover it.

### Watch for releases

Watch the GitHub repo (select "Releases only") to receive notifications about new versions.

### Follow the author

Sebastián Ramírez (@tiangolo) on GitHub, X/Twitter, Bluesky, and LinkedIn.

### Ask Questions

Create a discussion in [GitHub Discussions](https://github.com/fastapi/fastapi/discussions/new?category=questions) for questions and feature suggestions.

### Join the Chat

Join the [Discord chat server](https://discord.gg/VQjSZaeJmf) for community conversations. Use GitHub Discussions for questions instead.

**Source**: [help-fastapi](https://fastapi.tiangolo.com/help-fastapi/)

---

## Contributing

To contribute code to FastAPI, follow the guidelines at [tiangolo.com - Contributing](https://tiangolo.com/open-source/contributing/).

**Source**: [contributing](https://fastapi.tiangolo.com/contributing/)

---

## Translations

FastAPI docs are translated into multiple languages using LLM-assisted translation with native speaker review.

### LLM Prompt per Language

Each language has a directory in `docs/` with a `llm-prompt.md` file containing the language-specific translation prompt. Native speakers can suggest improvements to these prompts.

### Request a New Language

1. Find 2 other people willing to review translation PRs
2. Create a discussion following the template
3. Tag the other 2 people for confirmation
4. FastAPI team evaluates and makes it official
5. Docs are auto-translated, native speakers review and tweak prompts

**Source**: [translations](https://fastapi.tiangolo.com/translations/)

---

## Full Stack FastAPI Template

A production-ready full stack template using FastAPI:

- **Backend**: FastAPI, SQLModel (ORM), Pydantic
- **Database**: PostgreSQL
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Testing**: Playwright (E2E), Pytest (backend)
- **Deployment**: Docker Compose, Traefik (reverse proxy/load balancer), GitHub Actions CI/CD
- **Features**: JWT auth, secure password hashing, email password recovery, dark mode, auto-generated frontend client

**Source**: [project-generation](https://fastapi.tiangolo.com/project-generation/)

---

## External Links

The most starred GitHub repositories with the `fastapi` topic include:

- **full-stack-fastapi-template** (43,994★) — official full stack template
- **Hello-Python** (36,226★) — Python learning resources
- **serve** (21,862★) — Jina AI serving
- **HivisionIDPhotos** (21,212★) — ID photo generation
- **Douyin_TikTok_Download_API** (18,599★) — TikTok API
- **sqlmodel** (18,156★) — SQL ORM by FastAPI creator
- **fastapi-best-practices** (17,608★) — best practices guide
- **SurfSense** (15,161★) — AI search
- **awesome-fastapi** (11,478★) — curated list of FastAPI resources
- **fastapi_mcp** (11,932★) — MCP integration
- **FastUI** (8,970★) — Pydantic UI framework
- **strawberry** (4,677★) — GraphQL library
- **fastapi-users** (6,182★) — authentication system

**Source**: [external-links](https://fastapi.tiangolo.com/external-links/)

---

## FastAPI People

### Creator

Sebastián Ramírez (@tiangolo) — creator of FastAPI.

### Team

Team members with repository management permissions: @tiangolo, @YuriiMotov, @svlandeg, @alejsdev, @patrick91, @luzzodev, @Kludex.

### FastAPI Experts

Community members recognized for helping others in GitHub Discussions: @YuriiMotov, @Kludex, @jgould22, @dmontagu, @Mause, @ycd, @JarroVGIT, @euri10, @iudeen, @phy25, and many others.

### Top Contributors

Contributors who have made significant code contributions: @YuriiMotov, @alejsdev, @Kludex, @svlandeg, @dmontagu, @nilslindemann, @euri10, and hundreds of others visible on the [GitHub Contributors page](https://github.com/fastapi/fastapi/graphs/contributors).

### Sponsors

Gold, Silver, Bronze, and Individual sponsors support the project financially.

**Source**: [fastapi-people](https://fastapi.tiangolo.com/fastapi-people/)

---

## Newsletter

The [FastAPI and friends newsletter](https://fastapi.tiangolo.com/newsletter/) provides infrequent updates about:

- News about FastAPI and friends
- Guides and tutorials
- New features
- Breaking changes
- Tips and tricks

**Source**: [newsletter](https://fastapi.tiangolo.com/newsletter/)
