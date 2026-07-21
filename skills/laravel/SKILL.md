---
name: laravel-docs
version: "Laravel 13.x"
tags:
  - laravel
  - php
  - framework
  - eloquent
  - blade
  - artisan
  - routing
  - middleware
  - queues
  - broadcasting
  - authentication
  - authorization
  - validation
  - migrations
  - seeding
  - redis
  - mongodb
  - testing
  - dusk
  - octane
  - passport
  - sanctum
  - cashier
  - horizon
  - telescope
  - scout
  - socialite
  - vite
  - livewire
  - inertia
  - reverb
  - pennant
  - pulse
  - sail
  - valet
  - fortify
  - folio
  - envoy
  - pint
  - prompts
  - precognition
  - ai
  - mcp
  - boost
description: |
  Laravel 13.x — routing, Eloquent ORM, Blade, middleware, queues, broadcasting, auth, testing, Artisan, packages.
---

# Laravel

> Laravel is a PHP web application framework with expressive, elegant syntax. The clean stack for Artisans and agents.

**Version**: Laravel 13.x  
**Documentation**: [laravel.com/docs/13.x](https://laravel.com/docs/13.x)  
**API Reference**: [api.laravel.com/docs/13.x](https://api.laravel.com/docs/13.x/index.html)  
**Changelog**: [laravel.com/docs/changelog](https://laravel.com/docs/changelog)  

## Quick Reference

| Topic | File |
|-------|------|
| Installation and Configuration (install, Herd, .env, directory structure, frontend, starter kits, deployment) | `installation-and-configuration.md` |
| Architecture Concepts (request lifecycle, service container, service providers, facades) | `architecture.md` |
| Routing and Controllers (routing, middleware, CSRF, controllers, requests, responses) | `routing-and-controllers.md` |
| Views, Blade, and Frontend (views, Blade templates, components, layouts, Vite, URL generation, session) | `views-and-blade.md` |
| Validation, Error Handling, and Logging (form requests, validation rules, exceptions, log channels) | `validation-errors-logging.md` |
| Database and Eloquent ORM (DB config, query builder, pagination, migrations, seeding, Redis, MongoDB, Eloquent models, soft deletes, scopes, events, observers) | `database-and-eloquent.md` |
| Eloquent Relationships, Collections, and Resources (relationships, polymorphic, eager loading, collections, mutators/casts, API resources, serialization, factories) | `eloquent-relationships.md` |
| Security (authentication, authorization, gates, policies, email verification, encryption, hashing, password reset) | `security.md` |
| Artisan Console, Helpers, and Collections (Artisan commands, Tinker, helper functions, string/array helpers, collections, lazy collections) | `artisan-helpers-collections.md` |
| Events, Broadcasting, and Notifications (events, listeners, subscribers, Reverb/Pusher broadcasting, channels, notifications, mail templates) | `events-broadcasting-notifications.md` |
| Queues, Task Scheduling, and Background Jobs (job queues, dispatching, chaining, batching, job middleware, supervisor, task scheduling, concurrency, context, processes) | `queues-scheduling.md` |
| Mail, File Storage, Cache, and Rate Limiting (mailables, Markdown mail, filesystem/S3, cache stores, cache locks, rate limiters) | `mail-cache-storage.md` |
| HTTP Client, Localization, Strings, Images, and Search (HTTP client, concurrent requests, localization/i18n, fluent strings, image manipulation, Scout search) | `http-localization-search.md` |
| Testing (PHPUnit/Pest, HTTP tests, console tests, Dusk browser tests, database testing, mocking, time manipulation) | `testing.md` |
| Package Development and Contracts (package structure, service providers, publishing, contracts reference) | `packages-and-contracts.md` |
| AI, MCP, and Boost (AI SDK, Model Context Protocol, Laravel Boost, agentic development) | `ai-mcp-boost.md` |
| Laravel Packages (Cashier Stripe/Paddle, Dusk, Envoy, Fortify, Folio, Homestead, Horizon, Mix, Octane, Passport, Pennant, Pint, Precognition, Prompts, Pulse, Reverb, Sail, Sanctum, Scout, Socialite, Telescope, Valet) | `packages.md` |

## Core Concepts

- **Prologue**: Release Notes, Upgrade Guide, Contribution Guide
- **Getting Started**: Installation, Configuration, Agentic Development, Directory Structure, Frontend, Starter Kits, Deployment
- **Architecture Concepts**: Request Lifecycle, Service Container, Service Providers, Facades
- **The Basics**: Routing, Middleware, CSRF Protection, Controllers, Requests, Responses, Views, Blade Templates, Asset Bundling (Vite), URL Generation, Session, Validation, Error Handling, Logging
- **Digging Deeper**: Artisan Console, Broadcasting, Cache, Collections, Concurrency, Context, Contracts, Events, File Storage, Helpers, HTTP Client, Images, Localization, Mail, Notifications, Package Development, Processes, Queues, Rate Limiting, Search, Strings, Task Scheduling
- **Security**: Authentication, Authorization, Email Verification, Encryption, Hashing, Password Reset
- **Database**: Getting Started, Query Builder, Pagination, Migrations, Seeding, Redis, MongoDB
- **Eloquent ORM**: Getting Started, Relationships, Collections, Mutators/Casts, API Resources, Serialization, Factories
- **AI**: AI SDK, MCP, Boost
- **Testing**: Getting Started, HTTP Tests, Console Tests, Browser Tests (Dusk), Database Testing, Mocking
- **Packages**: Cashier (Stripe), Cashier (Paddle), Dusk, Envoy, Fortify, Folio, Homestead, Horizon, Mix, Octane, Passport, Pennant, Pint, Precognition, Prompts, Pulse, Reverb, Sail, Sanctum, Scout, Socialite, Telescope, Valet

## Official Documentation Sources

- [Installation](https://laravel.com/docs/13.x/installation) — Setup, Herd, IDE support, AI
- [Configuration](https://laravel.com/docs/13.x/configuration) — Environment, caching, maintenance mode
- [Agentic Development](https://laravel.com/docs/13.x/ai) — AI-powered development
- [Directory Structure](https://laravel.com/docs/13.x/structure) — App structure
- [Frontend](https://laravel.com/docs/13.x/frontend) — Vite, Livewire, Inertia
- [Starter Kits](https://laravel.com/docs/13.x/starter-kits) — Breeze, Jetstream
- [Deployment](https://laravel.com/docs/13.x/deployment) — Forge, Vapor, Nginx
- [Request Lifecycle](https://laravel.com/docs/13.x/lifecycle) — Request flow
- [Service Container](https://laravel.com/docs/13.x/container) — DI container
- [Service Providers](https://laravel.com/docs/13.x/providers) — Bootstrapping
- [Facades](https://laravel.com/docs/13.x/facades) — Static-like interface
- [Routing](https://laravel.com/docs/13.x/routing) — Route definitions
- [Middleware](https://laravel.com/docs/13.x/middleware) — HTTP filters
- [CSRF Protection](https://laravel.com/docs/13.x/csrf) — Cross-site request forgery
- [Controllers](https://laravel.com/docs/13.x/controllers) — Request handlers
- [Requests](https://laravel.com/docs/13.x/requests) — Input handling
- [Responses](https://laravel.com/docs/13.x/responses) — HTTP responses
- [Views](https://laravel.com/docs/13.x/views) — View rendering
- [Blade Templates](https://laravel.com/docs/13.x/blade) — Template engine
- [Asset Bundling](https://laravel.com/docs/13.x/vite) — Vite integration
- [URL Generation](https://laravel.com/docs/13.x/urls) — URL helpers
- [Session](https://laravel.com/docs/13.x/session) — Session management
- [Validation](https://laravel.com/docs/13.x/validation) — Form validation
- [Error Handling](https://laravel.com/docs/13.x/errors) — Exception handling
- [Logging](https://laravel.com/docs/13.x/logging) — Log channels
- [Artisan Console](https://laravel.com/docs/13.x/artisan) — CLI commands
- [Broadcasting](https://laravel.com/docs/13.x/broadcasting) — WebSockets
- [Cache](https://laravel.com/docs/13.x/cache) — Cache stores
- [Collections](https://laravel.com/docs/13.x/collections) — Collection methods
- [Concurrency](https://laravel.com/docs/13.x/concurrency) — Concurrent tasks
- [Context](https://laravel.com/docs/13.x/context) — Shared context
- [Contracts](https://laravel.com/docs/13.x/contracts) — Service contracts
- [Events](https://laravel.com/docs/13.x/events) — Event system
- [File Storage](https://laravel.com/docs/13.x/filesystem) — Filesystem/S3
- [Helpers](https://laravel.com/docs/13.x/helpers) — Helper functions
- [HTTP Client](https://laravel.com/docs/13.x/http-client) — HTTP requests
- [Images](https://laravel.com/docs/13.x/images) — Image manipulation
- [Localization](https://laravel.com/docs/13.x/localization) — i18n
- [Mail](https://laravel.com/docs/13.x/mail) — Email sending
- [Notifications](https://laravel.com/docs/13.x/notifications) — Multi-channel notifications
- [Package Development](https://laravel.com/docs/13.x/packages) — Package authoring
- [Processes](https://laravel.com/docs/13.x/processes) — Process management
- [Queues](https://laravel.com/docs/13.x/queues) — Job queues
- [Rate Limiting](https://laravel.com/docs/13.x/rate-limiting) — Throttling
- [Search](https://laravel.com/docs/13.x/search) — Full-text search
- [Strings](https://laravel.com/docs/13.x/strings) — String helpers
- [Task Scheduling](https://laravel.com/docs/13.x/scheduling) — Cron scheduling
- [Authentication](https://laravel.com/docs/13.x/authentication) — Auth system
- [Authorization](https://laravel.com/docs/13.x/authorization) — Gates, policies
- [Email Verification](https://laravel.com/docs/13.x/verification) — Email verification
- [Encryption](https://laravel.com/docs/13.x/encryption) — Encryption
- [Hashing](https://laravel.com/docs/13.x/hashing) — Password hashing
- [Password Reset](https://laravel.com/docs/13.x/passwords) — Password reset
- [Database](https://laravel.com/docs/13.x/database) — DB configuration
- [Query Builder](https://laravel.com/docs/13.x/queries) — Query builder
- [Pagination](https://laravel.com/docs/13.x/pagination) — Pagination
- [Migrations](https://laravel.com/docs/13.x/migrations) — Schema migrations
- [Seeding](https://laravel.com/docs/13.x/seeding) — Database seeding
- [Redis](https://laravel.com/docs/13.x/redis) — Redis usage
- [MongoDB](https://laravel.com/docs/13.x/mongodb) — MongoDB support
- [Eloquent: Getting Started](https://laravel.com/docs/13.x/eloquent) — ORM basics
- [Eloquent: Relationships](https://laravel.com/docs/13.x/eloquent-relationships) — Model relationships
- [Eloquent: Collections](https://laravel.com/docs/13.x/eloquent-collections) — Eloquent collections
- [Eloquent: Mutators/Casts](https://laravel.com/docs/13.x/eloquent-mutators) — Accessors, mutators, casts
- [Eloquent: API Resources](https://laravel.com/docs/13.x/eloquent-resources) — API transformation
- [Eloquent: Serialization](https://laravel.com/docs/13.x/eloquent-serialization) — JSON serialization
- [Eloquent: Factories](https://laravel.com/docs/13.x/eloquent-factories) — Model factories
- [AI SDK](https://laravel.com/docs/13.x/ai-sdk) — AI integration
- [MCP](https://laravel.com/docs/13.x/mcp) — Model Context Protocol
- [Boost](https://laravel.com/docs/13.x/boost) — AI development tool
- [Testing](https://laravel.com/docs/13.x/testing) — Testing basics
- [HTTP Tests](https://laravel.com/docs/13.x/http-tests) — HTTP testing
- [Console Tests](https://laravel.com/docs/13.x/console-tests) — Console testing
- [Browser Tests (Dusk)](https://laravel.com/docs/13.x/dusk) — Browser testing
- [Database Testing](https://laravel.com/docs/13.x/database-testing) — DB testing
- [Mocking](https://laravel.com/docs/13.x/mocking) — Mocking in tests
- [Cashier (Stripe)](https://laravel.com/docs/13.x/billing) — Stripe billing
- [Cashier (Paddle)](https://laravel.com/docs/13.x/cashier-paddle) — Paddle billing
- [Envoy](https://laravel.com/docs/13.x/envoy) — SSH task runner
- [Fortify](https://laravel.com/docs/13.x/fortify) — Auth backend
- [Folio](https://laravel.com/docs/13.x/folio) — File-based routing
- [Homestead](https://laravel.com/docs/13.x/homestead) — Vagrant dev env
- [Horizon](https://laravel.com/docs/13.x/horizon) — Queue monitor
- [Mix](https://laravel.com/docs/13.x/mix) — Legacy asset bundling
- [Octane](https://laravel.com/docs/13.x/octane) — High-performance server
- [Passport](https://laravel.com/docs/13.x/passport) — OAuth2 server
- [Pennant](https://laravel.com/docs/13.x/pennant) — Feature flags
- [Pint](https://laravel.com/docs/13.x/pint) — Code style fixer
- [Precognition](https://laravel.com/docs/13.x/precognition) — Live validation
- [Prompts](https://laravel.com/docs/13.x/prompts) — CLI prompts
- [Pulse](https://laravel.com/docs/13.x/pulse) — Performance monitoring
- [Reverb](https://laravel.com/docs/13.x/reverb) — WebSocket server
- [Sail](https://laravel.com/docs/13.x/sail) — Docker dev env
- [Sanctum](https://laravel.com/docs/13.x/sanctum) — API tokens
- [Scout](https://laravel.com/docs/13.x/scout) — Full-text search
- [Socialite](https://laravel.com/docs/13.x/socialite) — OAuth auth
- [Telescope](https://laravel.com/docs/13.x/telescope) — Debug assistant
- [Valet](https://laravel.com/docs/13.x/valet) — macOS dev env
- [Release Notes](https://laravel.com/docs/13.x/releases) — Releases
- [Upgrade Guide](https://laravel.com/docs/13.x/upgrade) — Upgrading
- [Contribution Guide](https://laravel.com/docs/13.x/contributions) — Contributing
