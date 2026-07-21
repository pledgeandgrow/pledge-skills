# Lazy Loading Services

Angular's `injectAsync` function lets you load a service on demand, only when it's actually needed. This is useful when a service depends on a large library or rarely used feature.

> **Important:** For lazy loading to work, the service must be auto-provided. Decorate it with either `@Injectable({ providedIn: 'root' })` or `@Service()`.

When you use `injectAsync`, the service's code is split by your bundler into a separate JavaScript chunk and downloaded the first time you ask for the instance. Once loaded, Angular resolves the service through the regular DI system.

## Lazily Injecting a Service

```typescript
import {Component, injectAsync} from '@angular/core';

@Component({
  selector: 'app-report',
  template: `<button (click)="export()">Export</button>`,
})
export class Report {
  private exporter = injectAsync(() => import('./report-exporter').then((m) => m.ReportExporter));

  async export() {
    const exporter = await this.exporter();
    exporter.export();
  }
}
```

The first call to `this.exporter()` triggers the dynamic import and resolves the service from DI. Subsequent calls reuse the same promise, so the chunk is only fetched once.

### Default Export

If the lazy-loaded service is the default export, pass the dynamic import directly — Angular unwraps the default:

```typescript
@Service()
export default class ReportExporter { /* ... */ }
```

```typescript
private exporter = injectAsync(() => import('./report-exporter'));
```

## Prefetching the Dependency

By default, the lazy chunk is only fetched when you invoke the returned function. Start the download earlier by passing a prefetch trigger:

```typescript
import {Component, injectAsync, onIdle} from '@angular/core';

@Component({ /* ... */ })
export class Report {
  private exporter = injectAsync(
    () => import('./report-exporter').then((m) => m.ReportExporter),
    { prefetch: onIdle },
  );
}
```

### onIdle with timeout

Configure `onIdle` with a maximum wait time so the prefetch always happens within a known window:

```typescript
injectAsync(loader, {prefetch: () => onIdle({timeout: 1_000})});
```

> Prefetching is opportunistic. If the user invokes the feature before the prefetch fires, Angular still loads the dependency immediately.

## Custom Prefetch Trigger

A `PrefetchTrigger` is any function that returns a Promise. The loader runs as soon as the promise resolves:

```typescript
import {PrefetchTrigger} from '@angular/core';

export function onHover(target: HTMLElement): PrefetchTrigger {
  return () => new Promise<void>((resolve) => {
    target.addEventListener('pointerenter', () => resolve(), {once: true});
  });
}
```

Usage:

```typescript
private exporter = injectAsync(
  () => import('./report-exporter').then((m) => m.ReportExporter),
  { prefetch: onHover(this.hostElement) },
);
```
