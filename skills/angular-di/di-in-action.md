# DI in Action

## Inject the Component's DOM Element

Angular exposes the underlying DOM element of a `@Component` or `@Directive` through injection using the `ElementRef` token:

```typescript
import {Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private element = inject(ElementRef);

  update() {
    this.element.nativeElement.style.color = 'red';
  }
}
```

## Inject the Host Element's Tag Name

To get the tag name of a host element, inject it using the `HOST_TAG_NAME` token:

```typescript
import {Directive, HOST_TAG_NAME, inject} from '@angular/core';

@Directive({
  selector: '[roleButton]',
})
export class RoleButtonDirective {
  private tagName = inject(HOST_TAG_NAME);

  onAction() {
    switch (this.tagName) {
      case 'button':
        // Handle button action
        break;
      case 'a':
        // Handle anchor action
        break;
      default:
        // Handle other elements
        break;
    }
  }
}
```

> If the host element might not have a tag name (e.g., `ng-container` or `ng-template`), make the injection optional: `inject(HOST_TAG_NAME, {optional: true})`.

## Resolve Circular Dependencies with a Forward Reference

In TypeScript, the order of class declarations matters. You cannot reference a class directly until you define it. The Angular `forwardRef()` function creates an indirect reference that Angular can resolve later.

This is useful when a class makes a reference to itself in its providers array (which must appear before the class definition):

```typescript
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
```

> **Note:** Do not use `forwardRef()` for service circular dependencies — it only solves circular imports in standalone component configurations. For service circular dependencies, see the debugging guide.
