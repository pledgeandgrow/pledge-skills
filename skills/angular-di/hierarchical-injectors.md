# Hierarchical Injectors

Angular has two injector hierarchies:

1. **EnvironmentInjector** — Configured via `@Service()`, `@Injectable()`, or `ApplicationConfig.providers`
2. **ElementInjector** — Created implicitly for each DOM element, configured via `@Component()` or `@Directive()` `providers`/`viewProviders`

## EnvironmentInjector

The `EnvironmentInjector` can be configured using:
- The `@Service()` decorator (tree-shakable, preferred)
- The `ApplicationConfig` providers array

### NgModule-Based Applications

For NgModule-based applications, you can provide dependencies with the `ModuleInjector` hierarchy using `@NgModule()` or `@Injectable()` annotations. The `ModuleInjector` is configured by the `@NgModule.providers` and `NgModule.imports` property — it is a flattening of all the providers arrays that can be reached by following `NgModule.imports` recursively. Child `ModuleInjector` hierarchies are created when lazy loading other `@NgModules`.

### Tree-shaking and @Service()

Using `@Service()` is preferable to the `ApplicationConfig` providers array because optimization tools can tree-shake unused services, resulting in smaller bundle sizes.

```typescript
import {Service} from '@angular/core';

@Service() // Provides this service in the root EnvironmentInjector
export class ItemService {
  name = 'telephone';
}
```

### @Injectable() vs. ApplicationConfig

If you configure an app-wide provider in `ApplicationConfig` of `bootstrapApplication`, it overrides one configured for `root` in `@Injectable()` metadata.

```typescript
providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}];
```

## Platform Injector

Above root, there are two more injectors: an additional `EnvironmentInjector` and `NullInjector()`.

```
EnvironmentInjector (configured by Angular)
  → has special things like DomSanitizer => providedIn 'platform'
root EnvironmentInjector (configured by AppConfig)
  → has things for your app => bootstrapApplication(..., AppConfig)
    NullInjector
      → always throws an error unless you use @Optional()
```

`bootstrapApplication()` creates a child injector of the platform injector. The `NullInjector()` is the top of the tree — if you reach it, you get an error unless you use `@Optional()`.

The platform injector is configured by `platformBrowserDynamic()` / `platformBrowser()`, which contains platform-specific dependencies (e.g., `DomSanitizer`). This allows multiple applications to share a platform configuration — for example, a browser has only one URL bar, no matter how many applications you have running. You can configure additional platform-specific providers using the `platformBrowser()` function.

For NgModule-based applications, configure app-wide providers in the `AppModule` providers array.

## ElementInjector

Angular creates `ElementInjector` hierarchies implicitly for each DOM element. Providing a service in `@Component()` using `providers` or `viewProviders` configures an `ElementInjector`:

```typescript
@Component({
  /* ... */
  providers: [{ provide: ItemService, useValue: { name: 'lamp' } }]
})
export class TestComponent {}
```

When the component instance is destroyed, so is that service instance.

### @Directive() and @Component()

Both directives and components can configure providers. Components and directives on the same element share an injector.

## Resolution Rules

When resolving a token for a component/directive, Angular resolves it in two phases:

1. Against its parents in the **ElementInjector** hierarchy
2. Against its parents in the **EnvironmentInjector** hierarchy

If Angular doesn't find the provider in any `ElementInjector` hierarchy, it goes back to the element where the request originated and looks in the `EnvironmentInjector` hierarchy. If still not found, it throws an error.

> For NgModule-based applications, Angular searches the `ModuleInjector` hierarchy if it cannot find a provider in the `ElementInjector` hierarchies.

If a provider is registered at different levels, the first one Angular encounters is used.

## Resolution Modifiers

Modifiers change the search behavior. Import from `@angular/core` and use in the `inject()` configuration:

### optional

Allows a service to be optional. If it can't be resolved, Angular returns `null` instead of throwing:

```typescript
export class Optional {
  public optional? = inject(OptionalService, {optional: true});
}
```

### self

Only look at the `ElementInjector` for the current component or directive:

```typescript
@Component({
  selector: 'app-self-no-data',
  providers: [{provide: FlowerService, useValue: {emoji: '🌷'}}],
})
export class Self {
  public flower = inject(FlowerService, {self: true});
}
```

Combine with `optional` to avoid errors when the service isn't available:

```typescript
export class SelfNoData {
  public leaf = inject(LeafService, {optional: true, self: true});
}
```

### skipSelf

Start the search in the parent `ElementInjector`, skipping the current one:

```typescript
@Component({
  selector: 'app-skipself',
  providers: [{provide: LeafService, useValue: {emoji: '🍁'}}],
})
export class Skipself {
  public leaf = inject(LeafService, {skipSelf: true}); // Gets parent's value 🌿
}
```

Combine with `optional` to prevent errors if the value is `null`:

```typescript
class Person {
  parent = inject(Person, {optional: true, skipSelf: true});
}
```

### host

Designate a component as the last stop in the injector tree when searching for providers:

```typescript
@Component({
  selector: 'app-host',
  providers: [{provide: FlowerService, useValue: {emoji: '🌷'}}],
})
export class Host {
  flower = inject(FlowerService, {host: true, optional: true});
}
```

### Modifier Combinations

You can combine all modifiers except:
- `host` and `self`
- `skipSelf` and `self`

### Constructor Injection Equivalents

| inject() option | Constructor decorator |
|-----------------|----------------------|
| `{optional: true}` | `@Optional()` |
| `{self: true}` | `@Self()` |
| `{skipSelf: true}` | `@SkipSelf()` |
| `{host: true}` | `@Host()` |

## Logical Structure of the Template

Understanding the `<#VIEW>` demarcation is key to understanding `providers` vs `viewProviders`:

```
<app-root>
  <#VIEW>
    <app-child>
      <#VIEW>
        …content goes here…
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>
```

## providers vs viewProviders

| Feature | `providers` | `viewProviders` |
|---------|-----------|-----------------|
| Available to component's template | Yes | Yes |
| Available to projected content (`<ng-content>`) | Yes | No |
| Logical position | On the component element | Inside the `<#VIEW>` |

### Example

```typescript
// providers: Available to content children
@Component({
  selector: 'app-parent',
  template: `<div><p>Theme: {{ themeService.theme() }}</p><ng-content /></div>`,
  providers: [ThemeStore],
})
export class ParentView {
  protected themeService = inject(ThemeStore);
}

// viewProviders: NOT available to content children
@Component({
  selector: 'app-parent-view',
  template: `<div><p>Theme: {{ themeService.theme() }}</p><ng-content /></div>`,
  viewProviders: [ThemeStore],
})
export class ParentViewOnly {
  protected themeService = inject(ThemeStore);
}
```

```typescript
@Component({
  selector: 'app-root',
  template: `
    <app-parent>
      <app-child /> <!-- Can access ThemeStore -->
    </app-parent>
    <app-parent-view>
      <app-child /> <!-- Cannot access ThemeStore -->
    </app-parent-view>
  `,
})
export class App {}
```

### When to use which

- Use `providers` when the service should be available to projected content
- Use `viewProviders` when the service should only be available to the component's template
- **Default:** Use `providers` unless you have a specific reason to restrict access

## Resolution Walk-Through with `<#VIEW>`

The `<#VIEW>` demarcation is critical for understanding how modifiers interact with `providers` vs `viewProviders`. Consider this setup:

```typescript
@Service()
export class FlowerService { emoji = '🌺'; }

@Component({
  selector: 'app-child',
  providers: [{provide: FlowerService, useValue: {emoji: '🌻'}}],
})
export class Child {
  flower = inject(FlowerService, {skipSelf: true});
}
```

### skipSelf with providers

With `skipSelf`, the `<app-child>` injector skips itself and looks for `FlowerService` at the `<app-root>` `ElementInjector`. Finding nothing there, it falls back to the `EnvironmentInjector` (root), where it finds 🌺.

```
<app-root @ApplicationConfig @Inject(FlowerService) flower=>"🌺">
  <#VIEW>
    <app-child @Provide(FlowerService="🌻")>
      <#VIEW @Inject(FlowerService, SkipSelf)=>"🌺">
        <!-- skipSelf causes search to skip app-child and find root value -->
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>
```

### skipSelf + host with providers

Adding `host` to `skipSelf` stops the search at the `<#VIEW>` boundary of `<app-child>`. Since `FlowerService` is in `providers` (on the component element, not in `<#VIEW>`), the search finds nothing and returns `null`:

```typescript
flower = inject(FlowerService, {skipSelf: true, host: true, optional: true}); // null
```

```
<app-root @ApplicationConfig @Inject(FlowerService) flower=>"🌺">
  <#VIEW>
    <!-- host stops search here with null -->
    <app-child @Provide(FlowerService="🌻")>
      <!-- skipSelf starts search here -->
      <#VIEW inject(FlowerService, {skipSelf, host, optional})=>null>
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>
```

### skipSelf with viewProviders

When a service is in `viewProviders`, it lives inside `<#VIEW>`, not on the component element. Using `skipSelf` skips the current component's `<#VIEW>` and searches upward:

```typescript
@Component({
  selector: 'app-child',
  viewProviders: [{provide: AnimalService, useValue: {emoji: '🐶'}}],
})
export class Child {
  animal = inject(AnimalService, {skipSelf: true}); // Gets 🐳 from root
}
```

```
<app-root @ApplicationConfig @Inject(AnimalService)=>"🐳">
  <#VIEW><!-- search begins here -->
    <app-child>
      <#VIEW @Provide(AnimalService="🐶") @Inject(AnimalService, SkipSelf)=>"🐳">
        <!-- skipSelf skips app-child's VIEW, finds 🐳 at root -->
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>
```

### host with viewProviders

`host` stops the search at the `<#VIEW>` boundary. Since `viewProviders` places the service inside `<#VIEW>`, `host` finds it:

```typescript
@Component({
  selector: 'app-child',
  viewProviders: [{provide: AnimalService, useValue: {emoji: '🐶'}}],
})
export class Child {
  animal = inject(AnimalService, {host: true}); // Gets 🐶
}
```

```
<app-root @ApplicationConfig @Inject(AnimalService)=>"🐳">
  <#VIEW>
    <app-child>
      <#VIEW @Provide(AnimalService="🐶") inject(AnimalService, {host: true})=>"🐶">
        <!-- host stops search here, finds 🐶 in VIEW -->
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>
```

### host + skipSelf with viewProviders

When you combine `host` + `skipSelf` with `viewProviders`, `skipSelf` starts the search at the parent, and `host` stops at the parent's `<#VIEW>`. If the parent also has `viewProviders` for the same token, it finds that value:

```typescript
// Parent provides 🦔 via viewProviders
@Component({
  selector: 'app-root',
  viewProviders: [{provide: AnimalService, useValue: {emoji: '🦔'}}],
})
export class App {}

// Child provides 🐶 via viewProviders, but skips self
@Component({
  selector: 'app-child',
  viewProviders: [{provide: AnimalService, useValue: {emoji: '🐶'}}],
})
export class Child {
  animal = inject(AnimalService, {host: true, skipSelf: true}); // Gets 🦔
}
```

```
<app-root @ApplicationConfig @Inject(AnimalService)=>"🐳">
  <#VIEW @Provide(AnimalService="🦔")>
    <!-- skipSelf starts here, host stops here -->
    <app-child>
      <#VIEW @Provide(AnimalService="🐶")
             inject(AnimalService, {skipSelf, host, optional})=>"🦔">
        <!-- skipSelf skips to app-root, host stops at app-root's VIEW, finds 🦔 -->
      </#VIEW>
    </app-child>
  </#VIEW>
</app-root>
```

### Key Takeaway: providers vs viewProviders with Modifiers

| Modifier | `providers` (on component element) | `viewProviders` (inside `<#VIEW>`) |
|----------|-----------------------------------|-------------------------------------|
| `host` alone | Finds value (search includes component element) | Finds value (search includes `<#VIEW>`) |
| `skipSelf` alone | Skips to parent, falls back to EnvironmentInjector | Skips to parent `<#VIEW>` |
| `host` + `skipSelf` | Returns `null` (skipSelf skips element, host stops at `<#VIEW>` — service is on element, not in `<#VIEW>`) | Finds parent's `viewProviders` value (skipSelf skips to parent, host stops at parent's `<#VIEW>`) |

## ElementInjector Use Cases

### Scenario: Service Isolation

Restrict a service to the component subtree where it belongs:

```typescript
@Component({
  selector: 'app-villains-list',
  providers: [VillainsService],
})
export class VillainsList {}
```

`VillainsService` is a singleton with respect to `VillainsList`. If multiple `VillainsList` instances exist, each gets its own `VillainsService`.

### Scenario: Multiple Edit Sessions

Each editing component gets its own service instance for isolated state. The tax-return-to-edit arrives via an `input` property. The service stores the original and current state, allowing save and restore operations:

```typescript
@Service({autoProvided: false})
export class HeroTaxReturnService {
  private currentTaxReturn!: HeroTaxReturn;
  private originalTaxReturn!: HeroTaxReturn;
  private heroService = inject(HeroesService);

  set taxReturn(htr: HeroTaxReturn) {
    this.originalTaxReturn = htr;
    this.currentTaxReturn = htr.clone();
  }
  get taxReturn(): HeroTaxReturn { return this.currentTaxReturn; }
  restoreTaxReturn() { this.taxReturn = this.originalTaxReturn; }
  saveTaxReturn() {
    this.taxReturn = this.currentTaxReturn;
    this.heroService.saveTaxReturn(this.currentTaxReturn).subscribe();
  }
}

@Component({
  selector: 'app-hero-tax-return',
  providers: [HeroTaxReturnService],
})
export class HeroTaxReturn {
  message = '';
  close = output<void>();
  taxReturn = input.required<HeroTaxReturn>();
  private heroTaxReturnService = inject(HeroTaxReturnService);

  constructor() {
    effect(() => {
      this.heroTaxReturnService.taxReturn = this.taxReturn();
    });
  }

  get taxReturnState(): HeroTaxReturn {
    return this.heroTaxReturnService.taxReturn;
  }

  onCanceled() {
    this.flashMessage('Canceled');
    this.heroTaxReturnService.restoreTaxReturn();
  }

  onClose() {
    this.close.emit();
  }

  onSaved() {
    this.flashMessage('Saved');
    this.heroTaxReturnService.saveTaxReturn();
  }

  flashMessage(msg: string) {
    this.message = msg;
    setTimeout(() => (this.message = ''), 500);
  }
}
```

This won't work if the service is an application-wide singleton — every component would share the same service instance, and each component would overwrite the tax return that belonged to another hero. Providing the service at the component level ensures that every instance of the component gets a private instance.

### Scenario: Specialized Providers

Substitute more specialized implementations deeper in the component tree. When resolving at the deepest component (C), its injector produces:
- An instance resolved by injector (C)
- An Engine resolved by injector (B)
- Tires resolved by the root injector (A)
