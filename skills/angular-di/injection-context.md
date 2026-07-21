# Injection Context

The DI system relies on a runtime context where the current injector is available. Injectors only work when you execute code within this context.

## When You Have an Injection Context

An injection context is available in the following situations:

- During construction (via the constructor) of a class instantiated by the DI system, such as an `@Injectable` or `@Component`
- In field initializers of such classes
- In the factory function specified for `useFactory` of a `Provider` or an `@Injectable`
- In the factory function specified for an `InjectionToken`
- Within a stack frame that runs in an injection context

## Stack Frame in Context

Some APIs are designed to run within an injection context. For example, router guards allow you to use `inject` within the guard function:

```typescript
const canActivateTeam: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
};
```

## Run Within an Injection Context

If you need to run a function within an injection context without already being in one, use `runInInjectionContext`. This requires access to an `EnvironmentInjector`:

```typescript
@Injectable({ providedIn: 'root' })
export class HeroService {
  private environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      inject(SomeService); // Do what you need with the injected service
    });
  }
}
```

`inject` returns an instance only if the injector can resolve the requested token.

## Asserting the Context

Angular provides `assertInInjectionContext` to verify that the current context is an injection context and throw a clear error if not:

```typescript
import {ElementRef, assertInInjectionContext, inject} from '@angular/core';

export function injectNativeElement<T extends Element>(): T {
  assertInInjectionContext(injectNativeElement);
  return inject(ElementRef).nativeElement;
}
```

Call this helper from an injection context (constructor, field initializer, provider factory, or code executed via `runInInjectionContext`):

```typescript
@Component({ /* ... */ })
export class PreviewCard {
  readonly hostEl = injectNativeElement<HTMLElement>(); // Field initializer: valid

  onAction() {
    const anotherRef = injectNativeElement<HTMLElement>(); // Fails: outside injection context
  }
}
```

## Using DI Outside of a Context

If you call `inject` or `assertInInjectionContext` outside of an injection context, Angular throws error **NG0203**.

### Other valid injection contexts

- `provideAppInitializer`
- `provideEnvironmentInitializer`
- Functional route guards
- Functional data resolvers
