# Ionic Framework

> **Source:** https://ionicframework.com/docs
> **Version:** 8.x
> **License:** MIT

## Overview

Ionic is an open-source UI toolkit for building high-quality mobile and progressive web apps using web technologies (HTML, CSS, JavaScript). It focuses on the frontend UX and UI interaction of an app — controls, interactions, gestures, animations.

### Key Features

- **One codebase, running everywhere** — iOS, Android, Web, Desktop
- **Performance-focused** — hardware-accelerated transitions, minimal DOM layout
- **Clean, simple, functional design** — consistent across platforms
- **Native and Web optimized** — Web Components + Capacitor for native access
- **Framework agnostic** — Angular, React, Vue, or standalone JavaScript

### Framework Compatibility

Since v4, Ionic is built as a standalone **Web Component** library with framework integrations:

| Framework | Package | Support |
|-----------|---------|---------|
| **Angular** | `@ionic/angular` | Angular 16+ |
| **React** | `@ionic/react` | Latest React |
| **Vue** | `@ionic/vue` | Vue 3.x |
| **Standalone** | `ionic` (script include) | Any web project |

### Native Runtime

**Capacitor** (https://capacitorjs.com) is the official cross-platform runtime, enabling apps to run natively on iOS, Android, and the web with a single codebase.

## Quick Start

### Install Ionic CLI

```bash
npm install -g @ionic/cli
```

### Create an App

```bash
# Angular
ionic start myApp tabs --type angular

# React
ionic start myApp tabs --type react

# Vue
ionic start myApp tabs --type vue

# Standalone
ionic start myApp blank --type vue-standalone
```

### Run the App

```bash
cd myApp
ionic serve
```

## Architecture Overview

```
ionic/
├── @ionic/core           Web Components library (framework-agnostic)
├── @ionic/angular        Angular integration + @ionic/angular-toolkit
├── @ionic/react          React integration + react-router
├── @ionic/vue            Vue integration + vue-router
├── @ionic/cli            Command-line tooling
├── capacitor             Native cross-platform runtime
└── appflow               (optional) CI/CD + live updates service
```

## Component Categories

| Category | Components |
|----------|-----------|
| **Action Containers** | `ion-accordion`, `ion-accordion-group` |
| **Buttons** | `ion-button`, `ion-fab`, `ion-fab-button`, `ion-fab-list`, `ion-back-button` |
| **Cards** | `ion-card`, `ion-card-header`, `ion-card-title`, `ion-card-subtitle` |
| **Inputs** | `ion-input`, `ion-input-password-toggle`, `ion-input-otp`, `ion-textarea`, `ion-checkbox`, `ion-radio`, `ion-radio-group`, `ion-select`, `ion-option`, `ion-toggle`, `ion-range` |
| **Items** | `ion-item`, `ion-item-divider`, `ion-item-group`, `ion-item-sliding`, `ion-item-options`, `ion-item-option`, `ion-label`, `ion-note` |
| **Lists** | `ion-list`, `ion-list-header` |
| **Media** | `ion-avatar`, `ion-icon`, `ion-img`, `ion-thumbnail` |
| **Menu** | `ion-menu`, `ion-menu-button`, `ion-menu-toggle`, `ion-split-pane` |
| **Modal** | `ion-modal`, `ion-backdrop` |
| **Navigation** | `ion-nav`, `ion-nav-link`, `ion-router`, `ion-route`, `ion-router-outlet`, `ion-tabs`, `ion-tab-bar`, `ion-tab-button` |
| **Popover** | `ion-popover` |
| **Progress** | `ion-loading`, `ion-progress-bar`, `ion-skeleton-text`, `ion-spinner` |
| **Refresher** | `ion-refresher`, `ion-refresher-content` |
| **Reorder** | `ion-reorder`, `ion-reorder-group` |
| **Routing** | `ion-router`, `ion-route`, `ion-router-outlet`, `ion-route-redirect` |
| **Search** | `ion-searchbar` |
| **Segment** | `ion-segment`, `ion-segment-button` |
| **Toast** | `ion-toast` |
| **Toolbar** | `ion-toolbar`, `ion-header`, `ion-footer`, `ion-title`, `ion-buttons` |
| **Typography** | `ion-text`, `ion-badge` |
| **Layout** | `ion-content`, `ion-grid`, `ion-row`, `ion-col` |
| **Infinite Scroll** | `ion-infinite-scroll`, `ion-infinite-scroll-content` |
| **Alert** | `ion-alert` |
| **Action Sheet** | `ion-action-sheet` |

## Key Concepts at a Glance

| Concept | Description |
|---------|-------------|
| **Web Components** | Ionic components are standard Custom Elements, usable in any framework |
| **Adaptive Styling** | Components adapt look/behavior per platform (`ios` / `md` modes) |
| **CSS Variables** | Theming via CSS custom properties — global and per-component |
| **Colors** | 9 default colors with base/contrast/shade/tint variants |
| **Shadow DOM** | Many components use Shadow DOM; styled via CSS Shadow Parts |
| **Capacitor** | Native runtime for iOS/Android deployment |
| **Ionicons** | Open-source icon library (1000+ icons) bundled with Ionic |

## Skill Files

| File | Content |
|------|---------|
| `SKILL.md` | This file — overview, quick start, architecture, core concepts, config, keyboard, hardware back button, managing focus, web view, dynamic font scaling |
| `components.md` | All UI component APIs (55+) with properties, events, methods, slots, and examples. Includes note on ion-slides removal (use Swiper.js) |
| `theming.md` | Colors, CSS variables, platform styles, shadow parts, branding, stepped colors, advanced theming, high contrast mode, global stylesheets, CSS utilities |
| `cli.md` | Ionic CLI installation, commands, configuration, Appflow |
| `frameworks.md` | Angular, React, Vue integration guides, platform API, page lifecycle, cross-platform development, PWA, CORS troubleshooting, Capacitor |

## Core Concepts

### UI Components

Ionic Framework is a library of UI Components — reusable elements built with HTML, CSS, and JavaScript. Components are pre-built but highly customizable via CSS variables and shadow parts.

### Adaptive Styling

Components adapt their look to the platform: iOS design language on Apple devices, Material Design on Android. PWA apps default to Material Design. The platform mode is configurable per-component or globally.

### Navigation

Mobile apps use parallel, non-linear navigation (e.g., separate stacks per tab). Ionic supports this via:
- **Angular:** Angular Router with `ion-router-outlet`
- **React:** `IonReactRouter` (built on React Router)
- **Vue:** `@ionic/vue-router` (built on Vue Router)
- **Standalone:** `ion-router` + `ion-route` + `ion-router-outlet`

### Events

Ionic components use `CustomEvent` for state changes, prefixed with `ion` (e.g., `ionChange`, `ionFocus`). Standard events like `click` may behave unexpectedly with Shadow DOM retargeting — prefer Ionic's `ion*` events.

### Properties

Properties configure component behavior and appearance. They can be set as HTML attributes or programmatically. Some properties are **reactive** (update the component when changed), and some are **virtual** (computed, not settable).

### Native Access

Capacitor (or Cordova) provides access to native SDKs (camera, GPS, accelerometer, etc.) via Web Views on iOS and Android. The same codebase runs on web, iOS, and Android.

### Security

- **Sanitizing input:** Components like `ion-alert` accept HTML content. Ionic has a built-in basic sanitizer, but developers should use framework-specific sanitization (Angular's `DomSanitizer`, React's `dangerouslySetInnerHTML` caution, or `sanitize-html` package).
- **`innerHTMLTemplatesEnabled` config:** When enabled, allows HTML in `message` properties. Use with caution.
- **Content Security Policy (CSP):** Ionic is compatible with CSP. Configure via HTTP headers or meta tags.

### Troubleshooting

Common runtime issues:
- **Blank app:** Check script imports, module loading, and `setupIonicReact()` (React)
- **Directive not working:** Ensure `IonicModule` is imported (Angular)
- **Click delays:** Use `ion-button` or `tappable` attribute instead of raw click handlers
- **Angular change detection:** Ionic events trigger zone.js change detection; use `NgZone` if needed
- **Cordova plugins in browser:** Use platform checks (`Capacitor.isNativePlatform()`)

## Web View

Ionic apps run inside a Web View on native platforms:

| Platform | Web View |
|----------|----------|
| iOS | WKWebView |
| Android | Android WebView |

### CORS

Web Views enforce CORS. External services must handle cross-origin requests properly.

### File Protocol

Capacitor/Cordova apps are served via `http://` protocol. Device files accessed via `file://` must be converted:

```typescript
// Capacitor
import { Capacitor } from '@capacitor/core';
const imageUrl = Capacitor.convertFileSrc(filePath);

// Cordova
const imageUrl = window.Ionic.WebView.convertFileSrc(filePath);
```

## Dynamic Font Scaling

Ionic supports dynamic font scaling — users can choose larger/smaller text sizes on their device, and the app adjusts accordingly.

### Enabling

Enabled by default when `typography.css` is imported. The `--ion-dynamic-font` CSS variable activates it.

### Opting Out

```css
:root {
  --ion-dynamic-font: initial;
}
```

### Integrating Custom Components

Convert `px` font sizes to `rem` units:

```css
/* Before */
.my-text { font-size: 14px; }

/* After */
.my-text { font-size: 0.875rem; } /* 14px / 16px = 0.875rem */
```

Also convert `width`/`height` to `min-width`/`min-height` to accommodate larger text.

### Custom Font Family

```css
html {
  --ion-dynamic-font: var(--ion-default-dynamic-font);
  --ion-font-family: 'My Custom Font', sans-serif;
}
```

## Config

Ionic Config allows changing component properties globally across an app.

### Global Config

```typescript
// JavaScript (standalone)
window.Ionic = {
  config: {
    rippleEffect: false,
    mode: 'md',
  },
};

// Angular (NgModule)
IonicModule.forRoot({ rippleEffect: false, mode: 'md' });

// Angular (Standalone)
provideIonicAngular({ rippleEffect: false, mode: 'md' });

// React
setupIonicReact({ rippleEffect: false, mode: 'md' });

// Vue
createApp(App).use(IonicVue, { rippleEffect: false, mode: 'md' });
```

### Per-Platform Config

```typescript
import { isPlatform } from '@ionic/angular'; // or @ionic/react, @ionic/vue

IonicModule.forRoot({
  animated: !isPlatform('mobileweb'),
});
```

### Key Config Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `actionSheetEnter` / `actionSheetLeave` | `AnimationBuilder` | — | Action sheet animations |
| `alertEnter` / `alertLeave` | `AnimationBuilder` | — | Alert animations |
| `animated` | `boolean` | `true` | Enable animations globally |
| `backButtonDefaultHref` | `string` | — | Default href for back button |
| `backButtonIcon` | `string` | — | Back button icon |
| `backButtonText` | `string` | — | Back button text |
| `hardwareBackButton` | `boolean` | `true` | Enable hardware back button |
| `innerHTMLTemplatesEnabled` | `boolean` | `false` | Allow HTML in message properties |
| `loadingEnter` / `loadingLeave` | `AnimationBuilder` | — | Loading animations |
| `loadingSpinner` | `SpinnerTypes` | — | Default loading spinner |
| `logLevel` | `'OFF' \| 'ERROR' \| 'WARN'` | `'OFF'` | Log level |
| `menuIcon` | `string` | — | Menu button icon |
| `menuType` | `string` | — | Menu display type |
| `modalEnter` / `modalLeave` | `AnimationBuilder` | — | Modal animations |
| `mode` | `Mode` | platform default | `ios` or `md` |
| `navAnimation` | `AnimationBuilder` | — | Nav/router-outlet animation |
| `pickerEnter` / `pickerLeave` | `AnimationBuilder` | — | Picker animations |
| `popoverEnter` / `popoverLeave` | `AnimationBuilder` | — | Popover animations |
| `refreshingIcon` | `string` | — | Refresher icon |
| `refreshingSpinner` | `SpinnerTypes` | — | Refresher spinner |
| `rippleEffect` | `boolean` | `true` | Material ripple effect |
| `sanitizerEnabled` | `boolean` | `true` | Enable built-in sanitizer |
| `spinner` | `SpinnerTypes` | — | Default spinner |
| `statusTap` | `boolean` | `true` | Status bar tap scrolls to top |
| `swipeBackEnabled` | `boolean` | `true` | iOS swipe-back gesture |
| `tabButtonLayout` | `TabButtonLayout` | — | Tab button layout |
| `toastDuration` | `number` | — | Default toast duration |
| `toastEnter` / `toastLeave` | `AnimationBuilder` | — | Toast animations |
| `toggleOnOffLabels` | `boolean` | — | Toggle on/off labels |
| `experimentalCloseWatcher` | `boolean` | `true` | CloseWatcher API for back button |
| `focusManagerPriority` | `FocusManagerPriority[]` | — | Focus management priority |

## Keyboard

### inputmode

Specifies the virtual keyboard type for inputs:

```html
<ion-input inputmode="email"></ion-input>
<ion-input inputmode="numeric"></ion-input>
<ion-input inputmode="tel"></ion-input>
```

Use `type="email"` when the input always requires an email. Use `inputmode="email"` when the input accepts email or username.

### enterkeyhint

Specifies the enter key label:

```html
<ion-input enterkeyhint="search"></ion-input>
<ion-input enterkeyhint="go"></ion-input>
<ion-input enterkeyhint="next"></ion-input>
```

### Keyboard Lifecycle Events

- `ionKeyboardWillShow` — Keyboard about to show
- `ionKeyboardDidShow` — Keyboard shown
- `ionKeyboardWillHide` — Keyboard about to hide
- `ionKeyboardDidHide` — Keyboard hidden

## Hardware Back Button

Supported on Capacitor and Cordova for Android devices.

### Basic Usage

```typescript
// JavaScript
document.addEventListener('ionBackButton', (event) => {
  event.detail.register(10, () => {
    console.log('Handler was called!');
  });
});

// Angular
this.platform.backButton.subscribeWithPriority(10, () => { });

// React
document.addEventListener('ionBackButton', (event) => {
  event.detail.register(10, () => { });
});

// Vue
useBackButton(10, () => { });
```

### Priority

Handlers are called in priority order (highest first). If multiple handlers have the same priority, the last registered one is called. A handler can call the next handler by not preventing the default.

### Exiting the App

If no handlers are registered (or all handlers call the next handler), the app exits.

### Browser/PWA Support

Hardware back button is supported in browsers via the `popstate` event and the CloseWatcher API (experimental).

## Managing Focus

### Manual Focus Management

Use `setFocus()` on Ionic input components instead of the `autofocus` attribute:

```typescript
// Angular
ionViewDidEnter() {
  this.input.setFocus();
}

// React
useIonViewDidEnter(() => {
  input.current?.setFocus();
});

// Vue
onIonViewDidEnter(() => {
  input.value.$el.setFocus();
});
```

### Platform Restrictions

- **Android:** Requires user interaction before setting focus
- **iOS (Safari):** Interactive elements can only be focused as a result of a user gesture

### Assistive Technology Focus Management

Ionic manages focus for assistive technologies (screen readers) automatically. Configurable via `focusManagerPriority` in the Config.
