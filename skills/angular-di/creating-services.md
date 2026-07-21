# Creating and Using Services

## Creating a Service

### Using the Angular CLI

```bash
ng generate service CUSTOM_NAME
```

This creates a `CUSTOM_NAME.ts` file in your `src` directory.

### Manually

Add the `@Service()` decorator to a TypeScript class:

```typescript
import {Service} from '@angular/core';

@Service()
export class BasicDataStore {
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return this.data;
  }
}
```

## How Services Become Available

Services are provisioned at the root level by default. When a service is provided globally, Angular guarantees:

- **Singleton Instance** — Creates a single, shared instance for the entire application
- **Global Availability** — Automatically accessible anywhere without manual provider registration
- **Tree-shakability** — Excluded from the production bundle if never used

## @Service vs @Injectable

The `@Service()` decorator is a modern, ergonomic shorthand for `@Injectable({ providedIn: 'root' })`.

### When to use @Service

- Creating a new singleton class that uses `inject()` for its dependencies
- You want tree-shaking and automatic root provision

### When to use @Injectable

- Constructor-based dependency injection (not using `inject()`)
- Advanced provider configuration: `useClass`, `useValue`, `useExisting`, `useFactory`
- Non-root scopes such as `providedIn: 'platform'`

### Quick Reference

| Feature | @Service() | @Injectable() |
|---------|-----------|---------------|
| Root singleton by default | Yes | No (must set `providedIn`) |
| Tree-shakable | Yes | Yes (with `providedIn: 'root'`) |
| Constructor injection | No | Yes |
| useClass/useValue/useExisting/useFactory | No (only `factory`) | Yes |
| providedIn: 'platform' | No | Yes |
| factory option | Yes | No (use `useFactory`) |

## Replacing the Implementation with a Factory

If you need to control how the singleton is created (e.g., swap implementations by environment), pass a factory function. The factory runs in an injection context, so you can use `inject()` inside it.

```typescript
import {inject, InjectionToken, Service} from '@angular/core';
import {ANALYTICS_ENABLED} from './token';

@Service({
  factory: () => (inject(ANALYTICS_ENABLED) ? new GoogleAnalytics() : new Analytics()),
})
export class Analytics {
  track(event: string, payload?: Record<string, unknown>) {
    // No-op by default.
  }
}

class GoogleAnalytics extends Analytics {
  override track(event: string, payload?: Record<string, unknown>) {
    // Dispatches an analytics event to Google Analytics
  }
}
```

> **Note:** The `factory` option replaces `useClass`, `useValue`, `useExisting`, and `useFactory` options of `@Injectable`. If you need any of those, keep using `@Injectable`.

## Opting Out of Automatic Provisioning

By default, `@Service()` provides the class at the root injector. To provide it manually (e.g., scope to a specific route or component), set `autoProvided: false`:

```typescript
import {Service} from '@angular/core';

@Service({autoProvided: false})
export class AnalyticsLogger {
  trackEvent(name: string) {
    console.log('event:', name);
  }
}
```

You are then responsible for adding the service to a `providers` array, just like with a plain `@Injectable()`.

## Injecting a Service

Once you've created a service with `providedIn: 'root'`, you can inject it anywhere using `inject()`.

### Injecting into a Component

```typescript
import {Component, inject} from '@angular/core';
import {BasicDataStore} from './basic-data-store';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>{{ dataStore.getData() }}</p>
      <button (click)="dataStore.addData('More data')">Add more data</button>
    </div>
  `,
})
export class Example {
  dataStore = inject(BasicDataStore);
}
```

### Injecting into Another Service

```typescript
import {inject, Service} from '@angular/core';
import {AdvancedDataStore} from './advanced-data-store';

@Service()
export class BasicDataStore {
  private advancedDataStore = inject(AdvancedDataStore);
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data, ...this.advancedDataStore.getData()];
  }
}
```
