# Optimizing Client Application Size with Lightweight Injection Tokens

This pattern is recommended for **library developers** to ensure proper tree-shaking of unused components and services.

## The Problem: When Tokens Are Retained

Consider a library with a `LibCard` component that optionally uses `LibHeader`:

```typescript
@Component({ selector: 'lib-header', … })
class LibHeader {}

@Component({ selector: 'lib-card', … })
class LibCard {
  readonly header = contentChild(LibHeader);
}
```

`LibCard` contains two references to `LibHeader`:
1. **Type position** — `Signal<LibHeader|undefined>` (erased by compiler, no impact on tree-shaking)
2. **Value position** — `contentChild(LibHeader)` (kept at runtime, prevents tree-shaking)

Even if the application never uses `<lib-header>`, the compiler retains the `LibHeader` token in the value position, preventing tree-shaking.

## When to Use the Lightweight Injection Token Pattern

The tree-shaking problem arises when a component is used as an injection token in:
- The value position of a content query (`contentChild` / `contentChildren`)
- The `inject` function

```typescript
class App {
  private readonly other = inject(CustomOther, {optional: true});
  readonly header = contentChild(CustomOther);
}
```

Both uses cause retention of `CustomOther`, preventing tree-shaking.

## Using Lightweight Injection Tokens

The pattern uses a small abstract class as an injection token, with the actual implementation provided separately. The abstract class is retained but is small and has no material impact on bundle size.

```typescript
// 1. Define a lightweight token (abstract class)
abstract class LibHeaderToken {
  abstract doSomething(): void;
}

// 2. Implement the token in the actual component
@Component({
  selector: 'lib-header',
  providers: [{provide: LibHeaderToken, useExisting: LibHeader}],
  …,
})
class LibHeader extends LibHeaderToken {
  doSomething(): void {
    // Concrete implementation
  }
}

// 3. Query using the lightweight token, not the component
@Component({
  selector: 'lib-card',
  …,
})
class LibCard implements AfterContentInit {
  readonly header = contentChild(LibHeaderToken);

  ngAfterContentInit(): void {
    if (this.header() !== undefined) {
      this.header()!.doSomething();
    }
  }
}
```

### How It Works

- `LibCard` no longer refers to `LibHeader` in either type or value position
- Full tree-shaking of `LibHeader` can take place
- `LibHeaderToken` is retained but is only a class declaration with no concrete implementation
- The parent can communicate with the child in a type-safe manner via abstract methods

## Pattern Summary

1. A **lightweight injection token** represented as an abstract class
2. A **component definition** that implements the abstract class
3. **Injection** of the lightweight token using `contentChild` or `contentChildren`
4. A **provider** in the implementation that associates the token with the implementation

## Naming Convention

Lightweight injection tokens are only useful with components. The recommended style is to use the component base name with the suffix `Token`:

- Component: `LibHeader`
- Token: `LibHeaderToken`
