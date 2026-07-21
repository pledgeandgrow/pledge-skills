# Debugging and Troubleshooting DI

## Common Pitfalls and Solutions

### Services Not Available Where Expected

#### Provider Scope Mismatch

When you provide a service in a component's `providers` array, it's only available to that component and its children. Parent and sibling components cannot access it.

```typescript
// ❌ Child provides the service
@Component({
  selector: 'app-child',
  providers: [DataStore],
})
export class ChildView {}

// ❌ Parent tries to inject it — ERROR
@Component({
  selector: 'app-parent',
  template: '<app-child />',
})
export class ParentView {
  private dataService = inject(DataStore); // Not available to parent
}
```

**Solution:** Provide at root for shared services:

```typescript
@Service()
export class DataStore { // Available everywhere }
```

#### Services and Lazy-Loaded Routes

Services provided in a lazy-loaded route's `providers` array are only available after the route loads. Eager-loaded components cannot access them.

**Solution:** Use `@Service()` for services shared across lazy boundaries.

### Multiple Instances Instead of Singletons

When you add a service to a component's `providers` array, Angular creates a new instance per component instance.

```typescript
@Component({ selector: 'app-profile', providers: [UserClient] })
export class UserProfile {
  private userService = inject(UserClient); // New instance
}

@Component({ selector: 'app-settings', providers: [UserClient] })
export class UserSettings {
  private userService = inject(UserClient); // Different instance!
}
```

**Solution:** Use `@Service()` for singletons:

```typescript
@Service()
export class UserClient { // Single instance shared across all components }
```

#### When Multiple Instances Are Intentional

```typescript
@Injectable()
export class FormStateStore {
  private formData = signal({});
  setData(data: any) { this.formData.set(data); }
  getData() { return this.formData(); }
}

@Component({
  selector: 'app-user-form',
  providers: [FormStateStore], // Each form gets its own state
})
export class UserForm {
  private formState = inject(FormStateStore);
}
```

### Incorrect inject() Usage

#### Using inject() in Lifecycle Hooks

`inject()` only works during class construction. Calling it in `ngOnInit()`, `ngAfterViewInit()`, or `ngOnDestroy()` throws an error.

```typescript
// ❌ ERROR
export class UserProfile {
  ngOnInit() {
    const userService = inject(UserClient); // Not an injection context
  }
}
```

**Solution:** Capture dependencies in field initializers:

```typescript
// ✅ Correct
export class UserProfile {
  private userService = inject(UserClient);
  userName = this.userService.getUser().name;
}
```

#### Using the Injector for Deferred Injection

When you need services outside an injection context, capture the `Injector` and use `injector.get()`:

```typescript
export class UserProfile {
  private injector = inject(Injector);

  delayedLoad() {
    setTimeout(() => {
      const userService = this.injector.get(UserClient);
      console.log(userService.getUser());
    }, 1000);
  }
}
```

#### Using runInInjectionContext for Callbacks

```typescript
export class DataLoader {
  private injector = inject(Injector);
  onLoad = input<() => void>();

  load() {
    const callback = this.onLoad();
    if (callback) {
      this.injector.runInInjectionContext(callback);
    }
  }
}
```

> Always capture dependencies at the class level when possible. Use `injector.get()` for simple deferred retrieval, and `runInInjectionContext()` only when external code needs to call `inject()`.

### providers vs viewProviders Confusion

- **providers:** Available to the component's template AND projected content (`<ng-content>`)
- **viewProviders:** Only available to the component's template, NOT to projected content

```typescript
@Component({
  selector: 'app-parent',
  template: `<div><ng-content /></div>`,
  providers: [ThemeStore], // Available to content children
})
export class ParentView {}

@Component({
  selector: 'app-parent-view',
  template: `<div><ng-content /></div>`,
  viewProviders: [ThemeStore], // NOT available to content children
})
export class ParentViewOnly {}
```

### InjectionToken Issues

#### Token Identity Confusion

Each `InjectionToken` instance is a unique object. Two tokens with the same description string are different objects.

```typescript
// ❌ Creating a new token with same description
const APP_CONFIG = new InjectionToken<AppConfig>('app config'); // Different object!
```

**Solution:** Import the same token instance from a shared file. Never create multiple `InjectionToken` instances with the same description.

#### Can't Inject Interfaces

TypeScript interfaces don't exist at runtime. Use `InjectionToken` instead:

```typescript
// ❌ Won't work
interface UserConfig { name: string; }
export class UserProfile {
  constructor(private config: UserConfig) {} // Error
}

// ✅ Use InjectionToken
export const USER_CONFIG = new InjectionToken<UserConfig>('user configuration');

@Component({ /* ... */ })
export class UserProfile {
  protected config = inject(USER_CONFIG);
}
```

### Circular Dependencies

Circular dependencies occur when services inject each other. Resolution strategies (in order of preference):

1. **Restructure** — Extract shared logic to a third service
2. **Use events** — Replace direct dependencies with event-based communication (e.g., `Subject`)
3. **Lazy injection** — Use `Injector.get()` to defer one dependency (last resort)

> Do NOT use `forwardRef()` for service circular dependencies — it only solves circular imports in standalone component configurations.

## Debugging Dependency Resolution

### Understanding the Resolution Process

Angular searches in this order:
1. **Element injector** — The current component or directive
2. **Parent element injectors** — Up the DOM tree
3. **Environment injector** — The route or application injector
4. **NullInjector** — Throws `NullInjectorError` if not found

### Using Angular DevTools

Angular DevTools includes an injector tree inspector. Use it to answer:
- Is the service provided?
- At what level? (component, route, or application)
- Multiple instances? (likely provided in component `providers` instead of root)

### Logging Service Creation

```typescript
@Service()
export class UserClient {
  constructor() {
    console.log('UserClient created');
    console.trace(); // Shows call stack
  }
}
```

### Checking Service Availability

```typescript
@Component({ selector: 'app-debug', template: '<p>Debug</p>' })
export class DebugView {
  private userService = inject(UserClient, {optional: true});

  constructor() {
    if (this.userService) {
      console.log('UserClient available:', this.userService);
    } else {
      console.warn('UserClient NOT available');
      console.trace();
    }
  }
}
```

### Debugging Workflow

1. **Read the error message** — Identify error code, dependency path, failed token
2. **Check the basics** — `@Service()` or `@Injectable()`? `providedIn` set? Imports correct?
3. **Verify injection context** — Is `inject()` called in a valid context? Check for async issues
4. **Use debugging tools** — Angular DevTools, console logs, optional injection
5. **Simplify and isolate** — Remove dependencies one by one, test in minimal component

## DI Error Reference

### NullInjectorError: No provider for [Service]

Angular cannot find a provider in the injector hierarchy. The error includes a dependency path:

```
NullInjectorError: No provider for UserClient!
Dependency path: App -> AuthClient -> UserClient
```

Common causes:
- Missing `@Service()` or `@Injectable()` decorator
- Missing `providedIn` configuration
- Missing service import

### NG0203: inject() must be called from an injection context

Occurs when `inject()` is called outside a valid context (lifecycle hooks, after `await`, in callbacks, outside construction).

**Solutions:**
1. Capture dependencies in field initializers: `private userService = inject(UserClient)`
2. Use `runInInjectionContext()` for callbacks
3. Pass dependencies as parameters instead of injecting inside callbacks

### NG0200: Circular dependency detected

```
NG0200: Circular dependency in DI detected for AuthClient
Dependency path: AuthClient -> UserClient -> AuthClient
```

Resolution:
1. Restructure — Extract shared logic to a third service
2. Use events — Replace direct dependencies with event-based communication
3. Lazy injection — Use `Injector.get()` (last resort)

### Other DI Error Codes

- **NG0204** — Related to `@Injectable()`
- **NG0205** — Related to DI configuration
- **NG0207** — Related to `provideHttpClient()`
