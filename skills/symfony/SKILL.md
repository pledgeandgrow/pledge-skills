# Symfony

> Symfony is a set of reusable PHP components and a PHP framework for web applications. It provides a full-stack framework, standalone components, and a philosophy of best practices.

**Version**: Symfony 8.x (current)  
**Documentation**: [symfony.com/doc](https://symfony.com/doc)  
**GitHub**: [github.com/symfony/symfony](https://github.com/symfony/symfony)  

## Quick Reference

| Topic | File |
|-------|------|
| Getting Started (Setup & installation, creating pages, routing: attributes/YAML/PHP, route parameters, validation, groups, sub-domains, localized routes, generating URLs, signing URIs, controllers: base controller, request object, MapQueryParameter, MapRequestPayload, session, flash messages, JSON response, streaming, early hints, templates/Twig: templating language, naming, linking, assets, inheritance, includes, embedding, global variables, output escaping, Twig extensions, configuration: files, formats, parameters, environments, env vars, .env files, secrets) | `getting-started.md` |
| Architecture & Services (Requests/Responses, Kernel, service container: fetching services, autowiring, injecting services/config, binding, parameters, public/private, tags, importing, manual wiring, abstract services, service decoration, lazy services, subscribers, linting, adapters, events: listeners, subscribers, attributes, core kernel events, custom events, bundles: creating, structure, registering, reusable bundles, contracts) | `architecture.md` |
| Database, Forms & Validation (Doctrine ORM: installation, configuration, entities, field types, migrations, persisting, fetching, EntityValueResolver, updating, deleting, query builder, DQL, SQL, relationships, testing, extensions; Forms: installation, form types, building, creating in controllers/classes, rendering, processing, options, guessing, unmapped fields, multiple buttons, form events, themes; Validation: installation, basics, constraints by category: basic/string/comparison/number/date/choice/file/collection/Doctrine, groups, custom constraints, debugging) | `database-forms-validation.md` |
| Security (User class, user provider, password hashing, firewall configuration, authenticating: form login, JSON login, HTTP basic, login link, access tokens, X.509, remote users, login throttling, custom auth behavior, login programmatically, logout, fetching user, access control, roles, voters, security events, password hashing: configuration, migration, algorithms, CSRF: forms, login, manual tokens, stateless, LDAP: configuration, user provider, authentication) | `security.md` |
| Advanced Topics (Console: commands, arguments/options, output, tables, progress, testing; Mailer: transport, messages, Twig, attachments, images, CSS inlining, multiple transports, async, debugging; Messenger: messages/handlers, transports, routing, consuming, supervisor, retries, transport config: AMQP/Doctrine/Redis/SQS/In-Memory, envelopes, stamps, multiple buses; Scheduler: recurring messages, cron/periodical triggers, consuming; Notifier: channels: SMS/chat/email/push/desktop, sending; Serializer: serialize/deserialize, groups, ignoring, name conversion, circular refs, depth, normalizers; Translation: basics, templates, translatable objects, providers, locale handling, extraction; HTTP Client: requests, auth, streaming, concurrent, scoping, testing; Sessions: usage, flash, storage: Redis/database/MongoDB; Cache: pools, tags, clearing; Logging: Monolog, handlers; Workflow: configuration, events, guards, marking stores; Webhook: consuming, sending) | `advanced-topics.md` |
| Frontend, Production & Ecosystem (Frontend: AssetMapper, importmaps, CSS/Tailwind/Sass, deploying, Symfony UX/Stimulus, Webpack Encore, WebLink/preloading/early hints; Deployment: basics, tasks, PaaS/Upsun; Performance: checklists, OPcache, profiling: Blackfire/Stopwatch; HTTP Cache: reverse proxy, expiration/validation, invalidation, ESI; Symfony AI; Best Practices: project/config/business logic/controllers/templates/forms/i18n/security/assets/tests; Contributing: bugs, environment, proposing changes, tests, docs; Reference Documents: configuration, forms, validation, formats; Create Your Own Framework; Symfony Components list) | `frontend-production.md` |
| Testing & Errors (Testing: unit/integration/application/E2E tests, installation, environment, mocking, database config, making requests, interacting with response, assertions: response/browser/crawler/mailer/notifier/http/console, Panther E2E; Error Pages: overriding templates, 404/500, non-HTML formats, custom ErrorController, kernel.exception event, dumping static pages) | `testing-and-errors.md` |

## Core Concepts

- **What is Symfony**: PHP framework + set of reusable components + philosophy + community
- **HTTP Kernel**: Request -> Router -> Controller -> Response lifecycle
- **Service Container**: Dependency injection with autowiring, autoconfiguration, and service tags
- **Events**: Event dispatcher with listeners and subscribers for extensibility
- **Bundles**: Reusable packages that add features to applications
- **Routing**: Attribute-based, YAML, or PHP route definitions with parameters, validation, groups
- **Controllers**: PHP functions that return Response objects, with AbstractController helpers
- **Templates**: Twig templating with inheritance, includes, and extensions
- **Doctrine ORM**: Database abstraction with entities, migrations, repositories, query builder, DQL
- **Forms**: Form types, data transformation, validation, theming, events
- **Validation**: Constraint-based validation with attributes, YAML, or PHP
- **Security**: Authentication (form login, JSON, HTTP basic, tokens, LDAP), authorization (roles, voters), password hashing, CSRF
- **Console**: CLI commands with arguments, options, output formatting, testing
- **Mailer**: Email sending with Twig integration, attachments, multiple transports
- **Messenger**: Message bus with sync/async handling, transports (AMQP, Redis, Doctrine, SQS), retries
- **Scheduler**: Cron-based task scheduling with recurring messages
- **Notifier**: Multi-channel notifications (SMS, chat, email, push, desktop)
- **Serializer**: Object serialization/deserialization with groups, normalizers, encoders
- **Translation**: i18n with translation files, providers, locale handling
- **HTTP Client**: Low-level HTTP client with sync/async, streaming, concurrent requests
- **Cache**: PSR-6 compatible caching with pools, tags, adapters
- **Workflow**: State machines and workflows with events, guards, transitions
- **AssetMapper**: Modern JS/CSS management without bundlers
- **Symfony UX**: PHP-driven JavaScript components with Stimulus

## Official Documentation Sources

- [Symfony Documentation](https://symfony.com/doc) — Main documentation index
- [Setup / Installation](https://symfony.com/doc/current/setup.html) — Installation and setup
- [Creating Pages](https://symfony.com/doc/current/page_creation.html) — First page tutorial
- [Routing](https://symfony.com/doc/current/routing.html) — Routing reference
- [Controllers](https://symfony.com/doc/current/controller.html) — Controller reference
- [Templates / Twig](https://symfony.com/doc/current/templates.html) — Twig templating
- [Configuration / Env Vars](https://symfony.com/doc/current/configuration.html) — Configuration
- [Service Container](https://symfony.com/doc/current/service_container.html) — DI and services
- [Events](https://symfony.com/doc/current/event_dispatcher.html) — Event dispatcher
- [Bundles](https://symfony.com/doc/current/bundles.html) — Bundle system
- [Databases / Doctrine](https://symfony.com/doc/current/doctrine.html) — Doctrine ORM
- [Forms](https://symfony.com/doc/current/forms.html) — Form handling
- [Validation](https://symfony.com/doc/current/validation.html) — Validation reference
- [Testing](https://symfony.com/doc/current/testing.html) — Testing guide
- [Sessions](https://symfony.com/doc/current/session.html) — Session management
- [Cache](https://symfony.com/doc/current/cache.html) — Cache component
- [Logging](https://symfony.com/doc/current/logging.html) — Logging with Monolog
- [Errors / Debugging](https://symfony.com/doc/current/controller/error_pages.html) — Error pages
- [Console](https://symfony.com/doc/current/console.html) — Console commands
- [Mailer](https://symfony.com/doc/current/mailer.html) — Email sending
- [Messenger](https://symfony.com/doc/current/messenger.html) — Message queues
- [Scheduler](https://symfony.com/doc/current/scheduler.html) — Task scheduling
- [Notifier](https://symfony.com/doc/current/notifier.html) — Notifications
- [Serializer](https://symfony.com/doc/current/serializer.html) — Serialization
- [Translation](https://symfony.com/doc/current/translation.html) — i18n
- [Security](https://symfony.com/doc/current/security.html) — Security guide
- [Passwords](https://symfony.com/doc/current/security/passwords.html) — Password hashing
- [CSRF](https://symfony.com/doc/current/security/csrf.html) — CSRF protection
- [LDAP](https://symfony.com/doc/current/security/ldap.html) — LDAP authentication
- [HTTP Client](https://symfony.com/doc/current/http_client.html) — HTTP client
- [Workflow](https://symfony.com/doc/current/workflow.html) — Workflow component
- [Webhook](https://symfony.com/doc/current/webhook.html) — Webhook component
- [Frontend](https://symfony.com/doc/current/frontend.html) — Frontend tools
- [AssetMapper](https://symfony.com/doc/current/frontend/asset_mapper.html) — Asset management
- [WebLink](https://symfony.com/doc/current/web_link.html) — Resource hints
- [Deployment](https://symfony.com/doc/current/deployment.html) — Deployment guide
- [Performance](https://symfony.com/doc/current/performance.html) — Performance optimization
- [HTTP Cache](https://symfony.com/doc/current/http_cache.html) — HTTP caching
- [Symfony AI](https://symfony.com/doc/current/ai/index.html) — AI integration
- [Best Practices](https://symfony.com/doc/current/best_practices.html) — Best practices
- [Contributing Code](https://symfony.com/doc/current/contributing/code/index.html) — Contributing
- [Create Your Own Framework](https://symfony.com/doc/current/create_framework/index.html) — Framework tutorial
- [Reference Documents](https://symfony.com/doc/current/reference/index.html) — Configuration reference
