# DI Overview

## What is Dependency Injection?

Dependency Injection (DI) is a design pattern you use to organize and share code across your application by supplying dependencies to a class instead of creating them inside it. This makes different parts of the application more reusable and easier to manage.

### Benefits

- **Improved code maintainability** — Promotes clear separation of concerns, making code easier to refactor and reducing duplication
- **Scalability** — Reuse modular functionality across different parts of an application
- **Better testing** — Unit tests can use test doubles in place of real implementations

## How DI Works in Angular

A dependency is any object, value, function, or service that a class requires to work but does not create itself. You interact with the DI system in two main ways:

1. **Provide** — Make values available for injection
2. **Inject** — Ask for those values as dependencies

Common types of injected dependencies:

- **Configuration values** — Environment-specific constants, API URLs, feature flags
- **Factories** — Functions that create objects based on runtime conditions
- **Services** — Classes that provide common functionality, business logic, or state

Angular components and directives automatically participate in DI.

## What are Services?

An Angular service is a TypeScript class decorated with `@Service()`, which allows you to inject an instance of the class as a dependency. Services are the most common way of sharing data and functionality across an application.

### Common Service Types

- **Data clients** — Abstract server request details for data retrieval and mutation
- **State management** — Define state shared across multiple components or pages
- **Authentication and authorization** — Manage user auth, token storage, and access control
- **Logging and error handling** — Common API for logging or communicating error states
- **Event handling and dispatch** — Handle/dispatch events following the observer pattern
- **Utility functions** — Reusable functions like data formatting, validation, or calculations

### Service Example

```typescript
import {Service} from '@angular/core';

@Service()
export class AnalyticsLogger {
  trackEvent(category: string, value: string) {
    console.log('Analytics event logged:', {
      category,
      value,
      timestamp: new Date().toISOString(),
    });
  }
}
```

`@Service()` makes this service available throughout your entire application as a singleton. It is an ergonomic shorthand for `@Injectable({ providedIn: 'root' })`.

## Injecting Dependencies with inject()

Use Angular's `inject()` function to request dependencies.

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

## Where can inject() be used?

You can inject dependencies during construction of a component, directive, or service. The call to `inject` can appear in either the constructor or in a field initializer.

### In a Component

```typescript
@Component({/* ... */})
export class MyComponent {
  // In class field initializer
  private service = inject(MyService);

  // In constructor body
  private anotherService: MyService;
  constructor() {
    this.anotherService = inject(MyService);
  }
}
```

### In a Directive

```typescript
@Directive({...})
export class MyDirective {
  private element = inject(ElementRef);
}
```

### In a Service

```typescript
import {Service, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Service()
export class MyService {
  private http = inject(HttpClient);
}
```

### In a Route Guard

```typescript
export const authGuard = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated();
};
```

Angular uses the term "injection context" to describe any place in your code where you can call `inject`. While component, directive, and service construction is the most common, see `injection-context.md` for more details.
