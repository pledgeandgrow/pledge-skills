---
name: angular-di-docs
version: "22.x"
tags:
  - angular
  - dependency-injection
  - di
  - services
  - inject
  - providers
  - injection-tokens
  - hierarchical-injectors
  - angular-core
description: |
  Angular v22 Dependency Injection — DI overview, creating and using services with @Service
  and @Injectable, defining dependency providers (InjectionToken, useClass, useValue,
  useFactory, useExisting, multi providers), injection context and runInInjectionContext,
  hierarchical injectors (EnvironmentInjector, ElementInjector, resolution modifiers:
  optional, self, skipSelf, host), providers vs viewProviders, lazy loading services with
  injectAsync, lightweight injection tokens for library optimization, DI in action
  (ElementRef, HOST_TAG_NAME, forwardRef), and debugging/troubleshooting DI (common
  pitfalls, error reference, debugging workflow). Use whenever the user mentions Angular
  DI, dependency injection, services, providers, InjectionToken, inject(), hierarchical
  injectors, or needs help with Angular service architecture.
---

# Angular Dependency Injection Expert (v22)

**Official Documentation:** https://angular.dev/guide/di
**GitHub:** https://github.com/angular/angular

## What is Angular DI?

Dependency Injection (DI) is a design pattern that organizes and shares code across an Angular application by supplying dependencies to a class instead of creating them inside it. Angular's DI system lets you provide values (services, configs, factories) and inject them where needed.

## Quick Reference

| Topic | File |
|------|------|
| DI Overview (concepts, inject(), @Service) | `overview.md` |
| Creating and Using Services (@Service vs @Injectable, factory, autoProvided) | `creating-services.md` |
| Defining Dependency Providers (InjectionToken, useClass/useValue/useFactory/useExisting, multi, provider locations, library patterns) | `providers.md` |
| Injection Context (valid contexts, runInInjectionContext, assertInInjectionContext) | `injection-context.md` |
| Hierarchical Injectors (EnvironmentInjector, ElementInjector, resolution rules, modifiers, providers vs viewProviders) | `hierarchical-injectors.md` |
| Lazy Loading Services (injectAsync, prefetching, custom triggers) | `lazy-loading.md` |
| Lightweight Injection Tokens (tree-shaking optimization for libraries) | `lightweight-tokens.md` |
| DI in Action (ElementRef, HOST_TAG_NAME, forwardRef, circular deps) | `di-in-action.md` |
| Debugging and Troubleshooting DI (common pitfalls, error reference, workflow) | `debugging.md` |

## Core Concepts

- **@Service()** — Modern shorthand for `@Injectable({ providedIn: 'root' })`. Creates a tree-shakable singleton.
- **inject()** — Function to request dependencies. Must be called in an injection context (constructor, field initializer, factory, or `runInInjectionContext`).
- **InjectionToken** — Unique object reference for non-class dependencies (configs, functions, primitives).
- **Hierarchical Injectors** — Angular has two injector trees: `EnvironmentInjector` (app/route level) and `ElementInjector` (component/DOM level).
- **Resolution Modifiers** — `optional`, `self`, `skipSelf`, `host` control how Angular searches the injector tree.

## Basic Service Example

```typescript
import {Service} from '@angular/core';

@Service()
export class AnalyticsLogger {
  trackEvent(category: string, value: string) {
    console.log('Analytics event logged:', { category, value, timestamp: new Date().toISOString() });
  }
}
```

## Basic Injection Example

```typescript
import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AnalyticsLogger} from './analytics-logger';

@Component({
  selector: 'app-navbar',
  template: `<a href="#" (click)="navigateToDetail($event)">Detail Page</a>`,
})
export class Navbar {
  private router = inject(Router);
  private analytics = inject(AnalyticsLogger);

  navigateToDetail(event: Event) {
    event.preventDefault();
    this.analytics.trackEvent('navigation', '/details');
    this.router.navigate(['/details']);
  }
}
```

## Key APIs

- `inject(Token, options?)` — Inject a dependency (options: `optional`, `self`, `skipSelf`, `host`)
- `injectAsync(loader, options?)` — Lazily load a service on demand
- `runInInjectionContext(injector, fn)` — Run code in an injection context
- `assertInInjectionContext(fnRef)` — Verify injection context, throw clear error if not
- `forwardRef(fn)` — Resolve circular references in class declarations
- `InjectionToken<T>(description, options?)` — Create a token for non-class dependencies
