# Defining Dependency Providers

Angular provides two ways to make services available for injection:

1. **Automatic provision** — Using `providedIn` in `@Injectable`, the `@Service` decorator, or a factory in `InjectionToken` configuration
2. **Manual provision** — Using the `providers` array in components, directives, routes, or application config

## Automatic Provision for Non-Class Dependencies

### What is an InjectionToken?

An `InjectionToken` is an object that Angular's DI system uses to uniquely identify values for injection. Think of it as a special key for storing and retrieving any type of value.

```typescript
import {InjectionToken} from '@angular/core';

// Create a token for a string value
export const API_URL = new InjectionToken<string>('api.url');

// Create a token for a function
export const LOGGER = new InjectionToken<(msg: string) => void>('logger.function');

// Create a token for a complex type
export interface Config {
  apiUrl: string;
  timeout: number;
}
export const CONFIG_TOKEN = new InjectionToken<Config>('app.config');
```

> The string parameter is a description for debugging only. Angular identifies tokens by object reference, not by description.

### InjectionToken with providedIn: 'root'

An `InjectionToken` with a `factory` results in `providedIn: 'root'` by default.

```typescript
import {InjectionToken} from '@angular/core';

export interface AppConfig {
  apiUrl: string;
  version: string;
  features: Record<string, boolean>;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config', {
  providedIn: 'root',
  factory: () => ({
    apiUrl: 'https://api.example.com',
    version: '1.0.0',
    features: {
      darkMode: true,
      analytics: false,
    },
  }),
});

// No need to add to providers array - available everywhere!
@Component({
  selector: 'app-header',
  template: `<h1>Version: {{ config.version }}</h1>`,
})
export class Header {
  config = inject(APP_CONFIG); // Automatically available
}
```

### When to use InjectionToken with factory functions

Ideal when you can't use a class but need to provide dependencies globally:

```typescript
// Logger function with dependencies
export const LOGGER_FN = new InjectionToken<LoggerFn>('logger.function', {
  providedIn: 'root',
  factory: () => {
    const config = inject(APP_CONFIG);
    return (level: string, message: string) => {
      if (config.features.logging !== false) {
        console[level](`[${new Date().toISOString()}] ${message}`);
      }
    };
  },
});

// Browser APIs as tokens
export const LOCAL_STORAGE = new InjectionToken<Storage>('localStorage', {
  factory: () => window.localStorage,
});

export const SESSION_STORAGE = new InjectionToken<Storage>('sessionStorage', {
  providedIn: 'root',
  factory: () => window.sessionStorage,
});

// Feature flags with runtime logic
export const FEATURE_FLAGS = new InjectionToken<Map<string, boolean>>('feature.flags', {
  providedIn: 'root',
  factory: () => {
    const flags = new Map<string, boolean>();
    const urlParams = new URLSearchParams(window.location.search);
    const enableBeta = urlParams.get('beta') === 'true';
    flags.set('betaFeatures', enableBeta);
    flags.set('darkMode', true);
    flags.set('newDashboard', false);
    return flags;
  },
});
```

Advantages:
- No manual provider configuration needed
- Tree-shakeable — only included if used
- Type-safe with full TypeScript support
- Factory functions can use `inject()` to access other dependencies

## Understanding Manual Provider Configuration

Manual configuration through the `providers` array is useful when:

1. The service doesn't have `providedIn`
2. You want a new instance at the component/directive level
3. You need runtime configuration
4. You're providing non-class values

### Example: Service without providedIn

```typescript
@Injectable()
export class LocalDataStore {
  private data: string[] = [];
  addData(item: string) { this.data.push(item); }
}

@Component({
  selector: 'app-example',
  providers: [LocalDataStore], // Required: no providedIn
  template: `...`,
})
export class Example {
  dataStore = inject(LocalDataStore);
}
```

### Example: Creating Component-Specific Instances

```typescript
@Injectable({providedIn: 'root'})
export class DataStore {
  private data: ListItem[] = [];
}

@Component({
  selector: 'app-isolated',
  providers: [DataStore], // Creates new instance instead of root singleton
  template: `...`,
})
export class Isolated {
  dataStore = inject(DataStore); // Component-specific instance
}
```

## Injector Hierarchy in Angular

Angular's DI system is hierarchical. When a component requests a dependency, Angular starts with that component's injector and walks up the tree until it finds a provider. Each component can have its own injector, forming a hierarchy that mirrors the component tree.

This hierarchy enables:
- **Scoped instances** — Different parts of the app can have different instances
- **Override behavior** — Child components can override parent providers
- **Memory efficiency** — Services are only instantiated where needed

## Declaring a Provider

### Provider Configuration Object

Every provider has two parts:
1. **Provider identifier** (key) — set via the `provide` property
2. **Value** — configured with one of: `useClass`, `useValue`, `useFactory`, `useExisting`

```typescript
// Shorthand
providers: [LocalService]

// Full syntax
providers: [{provide: LocalService, useClass: LocalService}]
```

### Provider Identifiers

#### Class names

```typescript
providers: [{provide: LocalService, useClass: LocalService}]
// Shorthand: providers: [LocalService]
```

#### Injection tokens

```typescript
export const DATA_SERVICE_TOKEN = new InjectionToken<DataService>('DataService');

@Component({
  providers: [{provide: DATA_SERVICE_TOKEN, useClass: LocalDataService}],
})
export class Example {
  private dataService = inject(DATA_SERVICE_TOKEN);
}
```

> TypeScript interfaces cannot be used for injection — they don't exist at runtime. Always use `InjectionToken` instead.

### Provider Value Types

#### useClass

Provides a JavaScript class as a dependency:

```typescript
// Shorthand
providers: [DataService];
// Different implementation
providers: [{provide: DataService, useClass: MockDataService}];
// Conditional
providers: [
  { provide: StorageService, useClass: environment.production ? CloudStorageService : LocalStorageService },
];
```

Practical example — Logger substitution:

```typescript
@Injectable()
export class Logger {
  log(message: string) { console.log(message); }
}

@Injectable()
export class EvenBetterLogger extends Logger {
  private userService = inject(UserService);
  override log(message: string) {
    const name = this.userService.user.name;
    super.log(`Message to ${name}: ${message}`);
  }
}

@Component({
  providers: [
    UserService,
    {provide: Logger, useClass: EvenBetterLogger},
  ],
})
export class Example {
  private logger = inject(Logger); // Gets EvenBetterLogger instance
}
```

#### useValue

Provides any JavaScript data type as a static value:

```typescript
providers: [
  {provide: API_URL_TOKEN, useValue: 'https://api.example.com'},
  {provide: MAX_RETRIES_TOKEN, useValue: 3},
  {provide: FEATURE_FLAGS_TOKEN, useValue: {darkMode: true, beta: false}},
];
```

> TypeScript types and interfaces cannot serve as dependency values — they exist only at compile-time.

Practical example — Application configuration:

```typescript
export interface AppConfig {
  apiUrl: string;
  appTitle: string;
  features: { darkMode: boolean; analytics: boolean };
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

const appConfig: AppConfig = {
  apiUrl: 'https://api.example.com',
  appTitle: 'My Application',
  features: { darkMode: true, analytics: false },
};

bootstrapApplication(AppComponent, {
  providers: [{provide: APP_CONFIG, useValue: appConfig}],
});

@Component({
  selector: 'app-header',
  template: `<h1>{{ title }}</h1>`,
})
export class Header {
  private config = inject(APP_CONFIG);
  title = this.config.appTitle;
}
```

#### useFactory

Provides a function that generates a value for injection:

```typescript
export const loggerFactory = (config: AppConfig) => {
  return new LoggerService(config.logLevel, config.endpoint);
};

providers: [
  {
    provide: LoggerService,
    useFactory: loggerFactory,
    deps: [APP_CONFIG],
  },
];
```

With optional dependencies:

```typescript
import {Optional} from '@angular/core';

providers: [
  {
    provide: MyService,
    useFactory: (required: RequiredService, optional?: OptionalService) => {
      return new MyService(required, optional || new DefaultService());
    },
    deps: [RequiredService, [new Optional(), OptionalService]],
  },
];
```

Practical example — Configuration-based API client with rate limiting:

```typescript
class ApiClient {
  constructor(
    private http: HttpClient,
    private baseUrl: string,
    private rateLimitMs: number,
  ) {}

  async fetchData(endpoint: string) {
    await this.applyRateLimit();
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }

  private async applyRateLimit() {
    return new Promise((resolve) => setTimeout(resolve, this.rateLimitMs));
  }
}

const apiClientFactory = () => {
  const http = inject(HttpClient);
  const userService = inject(UserService);
  const baseUrl = userService.getApiBaseUrl();
  const rateLimitMs = userService.getRateLimit();
  return new ApiClient(http, baseUrl, rateLimitMs);
};

export const apiClientProvider = {
  provide: ApiClient,
  useFactory: apiClientFactory,
};

@Component({
  selector: 'app-dashboard',
  providers: [apiClientProvider],
})
export class Dashboard {
  private apiClient = inject(ApiClient);
}
```

#### useExisting

Creates an alias for an already-defined provider. Both tokens return the same instance:

```typescript
providers: [
  NewLogger,                              // The actual service
  {provide: OldLogger, useExisting: NewLogger}, // The alias
];
```

> Don't confuse `useExisting` with `useClass`. `useClass` creates separate instances; `useExisting` returns the same singleton.

### Multiple Providers

Use `multi: true` when multiple providers contribute values to the same token:

```typescript
export const INTERCEPTOR_TOKEN = new InjectionToken<Interceptor[]>('interceptors');

providers: [
  {provide: INTERCEPTOR_TOKEN, useClass: AuthInterceptor, multi: true},
  {provide: INTERCEPTOR_TOKEN, useClass: LoggingInterceptor, multi: true},
  {provide: INTERCEPTOR_TOKEN, useClass: RetryInterceptor, multi: true},
];
```

Injecting `INTERCEPTOR_TOKEN` returns an array of all three interceptor instances.

## Where Can You Specify Providers?

### Application Bootstrap

Use in `bootstrapApplication` for global singletons:

```typescript
bootstrapApplication(App, {
  providers: [
    {provide: API_BASE_URL, useValue: 'https://api.example.com'},
    {provide: INTERCEPTOR_TOKEN, useClass: AuthInterceptor, multi: true},
    LoggingService,
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
  ],
});
```

Use bootstrap (instead of `providedIn: 'root'`) when:
- The provider has side-effects (e.g., installing the client-side router)
- The provider requires configuration (e.g., routes)
- Using Angular's `provideSomething` pattern (e.g., `provideRouter`, `provideHttpClient`)

**Benefits:** Single instance reduces memory usage; available everywhere without additional setup; easier to manage global state.

**Drawbacks:** Always included in your JavaScript bundle, even if the value is never injected; cannot be easily customized per feature; harder to test individual components in isolation.

### Component or Directive Providers

Use for component-specific state, isolated instances, or reusable components:

```typescript
@Component({
  selector: 'app-advanced-form',
  providers: [
    FormValidationService,
    {provide: FORM_CONFIG, useValue: {strictMode: true}},
  ],
})
export class AdvancedForm {}

@Component({
  selector: 'app-modal',
  providers: [ModalStateService],
})
export class Modal {}
```

**Benefits:** Better encapsulation and isolation; easier to test components individually; multiple instances can coexist with different configurations.

**Drawbacks:** New instance created for each component (higher memory usage); no shared state between components; must be provided wherever needed; always included in the same JavaScript bundle as the component or directive, even if the value is never injected.

> If multiple directives on the same element provide the same token, one will win, but which one is undefined.

### Route Providers

Use for feature-specific services and lazy-loaded dependencies:

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    providers: [
      AdminService,
      {provide: FEATURE_FLAGS, useValue: {adminMode: true}},
    ],
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'shop',
    providers: [ShoppingCartService, PaymentService],
    loadChildren: () => import('./shop/shop.routes'),
  },
];
```

Services provided at the route level are available to all components and directives within that route, as well as to its guards and resolvers. Since these services are instantiated independently of the route's components, they do not have direct access to route-specific information.

## Library Author Patterns

### The provide Pattern

Export functions that return provider configurations:

```typescript
import {InjectionToken, Provider, inject} from '@angular/core';

export interface AnalyticsConfig {
  trackingId: string;
  enableDebugMode?: boolean;
  anonymizeIp?: boolean;
}

const ANALYTICS_CONFIG = new InjectionToken<AnalyticsConfig>('analytics.config');

export class AnalyticsService {
  private config = inject(ANALYTICS_CONFIG);
  track(event: string, properties?: any) { /* ... */ }
}

export function provideAnalytics(config: AnalyticsConfig): Provider[] {
  return [
    {provide: ANALYTICS_CONFIG, useValue: config},
    AnalyticsService,
  ];
}

// Usage
bootstrapApplication(App, {
  providers: [
    provideAnalytics({ trackingId: 'GA-12345', enableDebugMode: !environment.production }),
  ],
});
```

### Advanced Provider Patterns with Features

```typescript
export interface HttpFeature {
  kind: HttpFeatures;
  providers: Provider[];
}

export function provideHttpClient(config?: HttpConfig, ...features: HttpFeature[]): Provider[] {
  const providers: Provider[] = [
    {provide: HTTP_CONFIG, useValue: config || {}},
    {provide: HTTP_FEATURES, useValue: new Set(features.map((f) => f.kind))},
    HttpClientService,
  ];
  features.forEach((feature) => {
    providers.push(...feature.providers);
  });
  return providers;
}

export function withInterceptors(...interceptors: any[]): HttpFeature {
  return {
    kind: HttpFeatures.Interceptors,
    providers: interceptors.map((interceptor) => ({
      provide: INTERCEPTOR_TOKEN, useClass: interceptor, multi: true,
    })),
  };
}

export function withCaching(): HttpFeature { /* ... */ }
export function withRetry(config: RetryConfig): HttpFeature { /* ... */ }

// Consumer usage
bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      {baseUrl: 'https://api.example.com'},
      withInterceptors(AuthInterceptor, LoggingInterceptor),
      withCaching(),
      withRetry({maxAttempts: 3, delayMs: 1000}),
    ),
  ],
});
```

### Why use provider functions?

1. **Encapsulation** — Internal tokens remain private
2. **Type safety** — TypeScript ensures correct configuration
3. **Flexibility** — Compose features with `with*` pattern
4. **Future-proofing** — Internal implementation can change without breaking consumers
5. **Consistency** — Aligns with Angular's own patterns (`provideRouter`, `provideHttpClient`)
