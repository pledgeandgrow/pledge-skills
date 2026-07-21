# Ionic Theming

> **Source:** https://ionicframework.com/docs/theming

Ionic provides a powerful theming system based on CSS custom properties (variables), platform-adaptive styling, and CSS Shadow Parts.

---

## Colors

Ionic has **nine default colors** that can be used across components. Each color is a collection of multiple properties:

| Property | Description |
|----------|-------------|
| `base` | The main color |
| `contrast` | Text/icon color on top of base |
| `shade` | Darker variant (for pressed/active states) |
| `tint` | Lighter variant (for hover states) |
| `rgb` | RGB triplet for alpha transparency |

### Default Colors

| Color | Default Base |
|-------|-------------|
| `primary` | `#3880ff` |
| `secondary` | `#3dc2ff` |
| `tertiary` | `#5260ff` |
| `success` | `#2dd36f` |
| `warning` | `#ffc409` |
| `danger` | `#eb445a` |
| `light` | `#f4f5f8` |
| `medium` | `#92949c` |
| `dark` | `#222428` |

### Modifying Colors

To change a color, set all related CSS properties:

```css
:root {
  --ion-color-secondary: #006600;
  --ion-color-secondary-rgb: 0, 102, 0;
  --ion-color-secondary-contrast: #ffffff;
  --ion-color-secondary-contrast-rgb: 255, 255, 255;
  --ion-color-secondary-shade: #005a00;
  --ion-color-secondary-tint: #1a751a;
}
```

### Adding Custom Colors

```css
:root {
  --ion-color-favorite: #69bb7b;
  --ion-color-favorite-rgb: 105, 187, 123;
  --ion-color-favorite-contrast: #ffffff;
  --ion-color-favorite-contrast-rgb: 255, 255, 255;
  --ion-color-favorite-shade: #5ca56c;
  --ion-color-favorite-tint: #78c288;
}
```

Use with: `<ion-button color="favorite">Favorite</ion-button>`

---

## Platform Standards (Adaptive Styling)

Ionic components adapt their look and behavior based on the platform. Two modes:

| Mode | Platform | Style |
|------|----------|-------|
| `ios` | iOS devices | Apple-style design |
| `md` | Android devices | Material Design |

### Setting Mode

```css
/* Global mode for all components */
:root.ios {
  --ion-text-color: #000;
}

:root.md {
  --ion-text-color: #222;
}
```

### Per-Component Mode

```html
<ion-button mode="ios">iOS Button</ion-button>
<ion-button mode="md">Material Button</ion-button>
```

---

## CSS Variables

Ionic uses CSS custom properties for all theming. Variables can be set globally or per-component.

### Global Variables

Set in `:root` selector (or `src/theme/variables.scss` in CLI projects):

```css
/* Set variables for all modes */
:root {
  --ion-background-color: #ff3700;
  --ion-font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
}

/* iOS only */
:root.ios {
  --ion-text-color: #000;
}

/* Material Design only */
:root.md {
  --ion-text-color: #222;
}
```

### Component Variables

Set variables on specific component selectors:

```css
/* All ion-button elements */
ion-button {
  --color: #222;
}

/* Specific button class */
.fancy-button {
  --background: #00ff00;
}
```

### Variables via JavaScript

```javascript
const el = document.querySelector('.fancy-button');
el.style.setProperty('--background', '#36454f');
```

### Getting Variable Values

**Using CSS:**

```css
ion-button {
  background: var(--background, var(--ion-color-primary));
}
```

**Using JavaScript:**

```javascript
const el = document.querySelector('ion-button');
const bg = getComputedStyle(el).getPropertyValue('--background');
```

---

## CSS Shadow Parts

Many Ionic components use Shadow DOM, which prevents external styling of inner elements. CSS Shadow Parts solve this by exposing inner elements for styling.

### Syntax

```css
/* Style a shadow part */
ion-button::part(native) {
  background: transparent;
  border: 1px solid var(--ion-color-primary);
}
```

### Common Shadow Parts

| Component | Part | Description |
|-----------|------|-------------|
| `ion-button` | `native` | Native button element |
| `ion-input` | `label` | Label element |
| `ion-input` | `input` | Native input element |
| `ion-modal` | `content` | Modal content container |
| `ion-toast` | `container` | Toast container |
| `ion-card` | `native` | Native card element |
| `ion-item` | `native` | Native item element |

### Example

```css
/* Style the native button inside ion-button */
ion-button::part(native) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Style the input element inside ion-input */
ion-input::part(input) {
  color: #333;
  font-size: 16px;
}
```

---

## Branding / Themes

Ionic provides application-level colors for branding. Everything from background to text color is customizable.

### Application Colors

```css
:root {
  /* Primary app colors */
  --ion-color-primary: #3880ff;
  --ion-color-primary-rgb: 56, 128, 255;

  /* App background */
  --ion-background-color: #ffffff;
  --ion-background-color-rgb: 255, 255, 255;

  /* Text colors */
  --ion-text-color: #000000;
  --ion-text-color-rgb: 0, 0, 0;

  /* Toolbar */
  --ion-toolbar-background: #ffffff;
  --ion-toolbar-color: #000000;

  /* Item background */
  --ion-item-background: #ffffff;
}
```

### Dark Mode

```css
@media (prefers-color-scheme: dark) {
  :root {
    --ion-background-color: #222428;
    --ion-text-color: #ffffff;
    --ion-toolbar-background: #1e2023;
    --ion-item-background: #1e2023;
  }
}
```

### Dark Mode with Class

```css
.ion-palette-dark {
  --ion-background-color: #222428;
  --ion-text-color: #ffffff;
  --ion-toolbar-background: #1e2023;
  --ion-item-background: #1e2023;
}
```

Toggle via JavaScript:

```javascript
document.documentElement.classList.toggle('ion-palette-dark', isDark);
```

---

## Global CSS Variables Reference

### Background

| Variable | Description |
|----------|-------------|
| `--ion-background-color` | App background color |
| `--ion-background-color-rgb` | RGB triplet |
| `--ion-background-color-step-50` to `--ion-background-color-step-900` | Color steps |

### Text

| Variable | Description |
|----------|-------------|
| `--ion-text-color` | App text color |
| `--ion-text-color-rgb` | RGB triplet |
| `--ion-text-color-step-50` to `--ion-text-color-step-900` | Color steps |

### Font

| Variable | Description |
|----------|-------------|
| `--ion-font-family` | App font family |

### Toolbar

| Variable | Description |
|----------|-------------|
| `--ion-toolbar-background` | Toolbar background |
| `--ion-toolbar-color` | Toolbar text color |

### Item

| Variable | Description |
|----------|-------------|
| `--ion-item-background` | Item background |
| `--ion-item-color` | Item text color |

### Border

| Variable | Description |
|----------|-------------|
| `--ion-border-color` | Default border color |

---

## Color Generator

Ionic provides a [Color Generator tool](https://ionicframework.com/docs/theming/color-generator) that calculates all color variants (base, contrast, shade, tint, rgb) from a single base color and generates copy-paste CSS.

---

## Stepped Colors

Ionic uses **stepped colors** — shades of the background and text colors — to imply importance and depth. When changing the background or text color, stepped colors must also be updated or some components may look broken (especially with dark palettes).

### How Stepped Colors Work

- **Text stepped colors:** Start at `#000000` and mix with the background color using increasing percentages (step-50 through step-900)
- **Background stepped colors:** Start at `#ffffff` and mix with the text color using increasing percentages

### Updating Stepped Colors

```css
:root {
  /* Background steps */
  --ion-background-color-step-50: #f2f2f2;
  --ion-background-color-step-100: #e6e6e6;
  /* ... through step-900 */

  /* Text steps */
  --ion-text-color-step-50: #0d0d0d;
  --ion-text-color-step-100: #1a1a1a;
  /* ... through step-900 */
}
```

Use the [Stepped Color Generator](https://ionicframework.com/docs/theming/themes) to auto-calculate all steps from a base color.

---

## Platform Styles (Detailed)

### Ionic Modes

| Platform | Default Mode | Style |
|----------|-------------|-------|
| iOS | `ios` | Apple iOS design language |
| Android | `md` | Material Design |
| Desktop/Browser (core) | `md` | Material Design |

The `<html>` element gets a class matching the mode: `<html class="md">` or `<html class="ios">`.

### Overriding Mode Styles

Style components for a specific mode using the mode class:

```css
/* Only apply in iOS mode */
.ios ion-badge {
  text-transform: uppercase;
}

/* Only apply in Material Design mode */
.md ion-badge {
  text-transform: none;
}

/* Mode-specific CSS variables */
.ios {
  --ion-background-color: #222;
}
```

### Setting Mode via Config

```typescript
// Angular
IonicModule.forRoot({ mode: 'ios' })

// React
setupIonicReact({ mode: 'ios' })

// Vue
createApp(App).use(IonicVue, { mode: 'ios' })
```

---

## CSS Shadow Parts (Detailed)

### Requirements for Parts

A component must meet these criteria to have shadow parts:
- It is a **Shadow DOM** component (Scoped/Light DOM components can be styled directly)
- It contains **child elements** (e.g., `ion-card-header` has no parts — all styles are on the host)
- The child elements are **not structural** (e.g., `ion-title` — customizing structural elements can break layout)

### Known Limitations

- **Browser support:** Modern browsers support `::part()`. Older browsers may not.
- **Vendor prefixed pseudo-elements:** Cannot combine `::part()` with vendor-prefixed pseudo-elements
- **Structural pseudo-classes:** Cannot use `:hover`, `:focus` etc. directly on `::part()` in all browsers
- **Chaining parts:** Cannot chain multiple `::part()` selectors

### Finding Available Parts

Each component's API page lists its CSS Shadow Parts under the "CSS Shadow Parts" heading. See individual component pages in `components.md`.

---

## Advanced Theming

### Application Variables

| Variable | Description |
|----------|-------------|
| `--ion-font-family` | App font family |
| `--ion-statusbar-padding` | Status bar padding |
| `--ion-safe-area-top` | Safe area top inset |
| `--ion-safe-area-right` | Safe area right inset |
| `--ion-safe-area-bottom` | Safe area bottom inset |
| `--ion-safe-area-left` | Safe area left inset |
| `--ion-margin` | Default margin for margin attributes |
| `--ion-padding` | Default padding for padding attributes |
| `--ion-placeholder-opacity` | Placeholder text opacity |
| `--ion-backdrop-color` | Backdrop color |
| `--ion-backdrop-opacity` | Backdrop opacity |
| `--ion-overlay-background-color` | Overlay background color |
| `--ion-box-shadow-color` | Default box shadow color |

### Grid Variables

| Variable | Description |
|----------|-------------|
| `--ion-grid-columns` | Number of grid columns (default: 12) |
| `--ion-grid-padding-xs` through `--ion-grid-padding-xl` | Grid padding by breakpoint |
| `--ion-grid-column-padding-xs` through `--ion-grid-column-padding-xl` | Column padding by breakpoint |

### The Alpha Problem

CSS `rgba()` does not accept hex colors. Ionic requires RGB variables alongside hex colors:

```css
:root {
  --ion-text-color: #a0522d;
  --ion-text-color-rgb: 160, 82, 45;  /* comma-separated, no parentheses */

  --ion-background-color: #b0c4de;
  --ion-background-color-rgb: 176, 196, 222;
}

/* Usage with alpha */
body {
  color: rgba(var(--ion-text-color-rgb), 0.25);
}
```

### Variables in Media Queries

CSS variables cannot be used inside `@media` queries. Use hardcoded values instead:

```css
/* This does NOT work */
:root { --breakpoint: 600px; }
@media (min-width: var(--breakpoint)) { }

/* Use hardcoded values instead */
@media (min-width: 600px) { }
```

### Safe Area Padding

Ionic provides safe area variables for devices with notches:

```css
:root {
  --ion-safe-area-top: env(safe-area-inset-top);
  --ion-safe-area-bottom: env(safe-area-inset-bottom);
}
```

---

## High Contrast Mode

Ionic provides a high contrast palette that meets **WCAG Level AAA** color contrast (default palette meets Level AA).

### Enabling

**Always:**

```css
:root {
  --ion-color-primary: #0000ff;
  /* ... other high contrast overrides */
}
```

**Based on system settings:**

```css
@media (prefers-contrast: more) {
  :root {
    /* high contrast overrides */
  }
}
```

**Via CSS class:**

```css
.ion-palette-high-contrast {
  /* high contrast overrides */
}
```

Toggle via JavaScript:

```javascript
document.documentElement.classList.toggle('ion-palette-high-contrast', isHighContrast);
```

### Combining with Dark Mode

High contrast can be combined with dark mode:

```css
.ion-palette-dark.ion-palette-high-contrast {
  /* dark + high contrast overrides */
}
```

---

## Global Stylesheets

Ionic provides several CSS files to include in an app:

### Required

| File | Description |
|------|-------------|
| `core.css` | Required for components to work properly. Includes app-specific styles and color property support. |

### Recommended

| File | Description |
|------|-------------|
| `structure.css` | Applies styles to `<html>`, defaults `box-sizing` to `border-box`, ensures native-like scrolling |
| `typography.css` | Changes font-family, modifies heading styles. **Required for Dynamic Font Scaling.** |
| `normalize.css` | Consistent rendering across browsers (based on Normalize.css) |

### Optional

| File | Description |
|------|-------------|
| `padding.css` | Utility classes for padding/margin |
| `float-elements.css` | Utility classes for floating elements by breakpoint |
| `text-alignment.css` | Utility classes for text alignment by breakpoint |
| `text-transformation.css` | Utility classes for text transform (uppercase, lowercase, capitalize) |
| `flex-utils.css` | Utility classes for flexbox alignment |
| `display.css` | Utility classes for hiding elements by breakpoint |

---

## CSS Utilities

Ionic provides utility classes for common CSS patterns.

### Text Modification

```html
<!-- Text alignment -->
<p class="ion-text-center">Centered</p>
<p class="ion-text-right">Right</p>

<!-- Responsive text alignment -->
<p class="ion-text-sm-left">Left on small screens</p>

<!-- Text transform -->
<span class="ion-text-uppercase">UPPERCASE</span>
<span class="ion-text-lowercase">lowercase</span>
<span class="ion-text-capitalize">Capitalized</span>
```

### Element Display

```html
<div class="ion-hide">Hidden on all screens</div>
<div class="ion-hide-sm-down">Hidden on small screens and down</div>
<div class="ion-hide-md-up">Hidden on medium screens and up</div>
```

### Content Space (Padding/Margin)

```html
<!-- Padding -->
<div class="ion-padding">All sides</div>
<div class="ion-padding-top">Top only</div>
<div class="ion-padding-horizontal">Left + Right</div>

<!-- Margin -->
<div class="ion-margin">All sides</div>
<div class="ion-margin-vertical">Top + Bottom</div>
```

### Flex Container Properties

```html
<!-- Align items -->
<div class="ion-align-items-center">Center aligned items</div>
<div class="ion-align-items-start">Start aligned items</div>

<!-- Justify content -->
<div class="ion-justify-content-center">Center justified</div>
<div class="ion-justify-content-between">Space between</div>

<!-- Flex direction -->
<div class="ion-flex-direction-column">Column direction</div>
<div class="ion-flex-direction-row">Row direction</div>

<!-- Flex wrap -->
<div class="ion-flex-wrap">Wrap enabled</div>
```

### Flex Item Properties

```html
<!-- Align self -->
<div class="ion-align-self-center">Self-centered</div>

<!-- Flex grow/shrink -->
<div class="ion-flex-grow">Grow</div>
<div class="ion-flex-shrink">Shrink</div>
```

### Ionic Breakpoints

| Breakpoint | Size |
|------------|------|
| `xs` | 0px |
| `sm` | 576px |
| `md` | 768px |
| `lg` | 992px |
| `xl` | 1200px |

Responsive classes use the format `ion-{property}-{breakpoint}-{value}`, e.g., `ion-text-md-center`.
