# Ionic UI Components

> **Source:** https://ionicframework.com/docs/api

All Ionic components are Web Components (Custom Elements) prefixed with `ion-`. They work in Angular, React, Vue, and standalone HTML.

> **Note:** `ion-slides` has been removed from Ionic Framework. Use [Swiper.js](https://swiperjs.com/) with Ionic for carousel/slider functionality. See the [Swiper + Ionic integration guide](https://swiperjs.com/element#ionic).

---

## ion-accordion

Expandable/collapsible content sections. Used inside `ion-accordion-group`.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `disabled` | `disabled` | `boolean` | `false` | Disables the accordion |
| `mode` | `mode` | `"ios" \| "md"` | — | Platform mode |
| `readonly` | `readonly` | `boolean` | `false` | Prevents toggling |
| `toggleIcon` | `toggle-icon` | `string` | `chevronDown` | Icon for toggle |
| `toggleIconSlot` | `toggle-icon-slot` | `"end" \| "start"` | `'end'` | Slot for toggle icon |
| `value` | `value` | `string` | auto-generated | Unique value for the accordion |

### Slots

- `start` — Content to the left of the header
- `end` — Content to the right of the header
- **Default** — Accordion content (hidden when collapsed)

### Example

```html
<ion-accordion-group>
  <ion-accordion value="first">
    <ion-item slot="header" lines="none">
      <ion-label>First Accordion</ion-label>
    </ion-item>
    <div slot="content">
      <p>Content for first accordion</p>
    </div>
  </ion-accordion>
  <ion-accordion value="second">
    <ion-item slot="header" lines="none">
      <ion-label>Second Accordion</ion-label>
    </ion-item>
    <div slot="content">
      <p>Content for second accordion</p>
    </div>
  </ion-accordion>
</ion-accordion-group>
```

---

## ion-button

Buttons are interactive elements that trigger actions.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `buttonType` | `button-type` | `string` | `'button'` | Type of button |
| `color` | `color` | `Color` | `undefined` | Color from palette (`primary`, `secondary`, `tertiary`, `success`, `warning`, `danger`, `light`, `medium`, `dark`) |
| `disabled` | `disabled` | `boolean` | `false` | Disables button |
| `download` | `download` | `string` | `undefined` | Download attribute |
| `expand` | `expand` | `"block" \| "full"` | `undefined` | Full-width expansion |
| `fill` | `fill` | `"clear" \| "default" \| "outline" \| "solid"` | `undefined` | Fill style |
| `form` | `form` | `HTMLFormElement \| string` | `undefined` | Associated form |
| `href` | `href` | `string` | `undefined` | URL for navigation |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `rel` | `rel` | `string` | `undefined` | Link relationship |
| `routerDirection` | `router-direction` | `"back" \| "forward" \| "root"` | `'forward'` | Router navigation direction |
| `shape` | `shape` | `"round"` | `undefined` | Button shape |
| `size` | `size` | `"default" \| "large" \| "small"` | `undefined` | Button size |
| `strong` | `strong` | `boolean` | `false` | Bold text |
| `target` | `target` | `string` | `undefined` | Link target |
| `type` | `type` | `"button" \| "reset" \| "submit"` | `'button'` | Button type |

### Slots

- `icon-only` — Icon only, no text
- `start` — Content before button text
- `end` — Content after button text
- **Default** — Button text

### Example

```html
<ion-button>Default</ion-button>
<ion-button color="primary">Primary</ion-button>
<ion-button fill="clear">Clear</ion-button>
<ion-button expand="block">Block</ion-button>
<ion-button shape="round">Round</ion-button>
<ion-button size="large">Large</ion-button>

<!-- With icon -->
<ion-button>
  <ion-icon slot="start" name="star"></ion-icon>
  Star
</ion-button>
```

---

## ion-card

Cards are containers for displaying information.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `button` | `button` | `boolean` | `false` | Makes card clickable |
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `disabled` | `disabled` | `boolean` | `false` | Disables card |
| `href` | `href` | `string` | `undefined` | URL for navigation |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `routerDirection` | `router-direction` | `"back" \| "forward" \| "root"` | `'forward'` | Router direction |
| `type` | `type` | `"button" \| "reset" \| "submit"` | `'button'` | Button type |

### Sub-components

- `ion-card-header` — Header section
- `ion-card-title` — Title text
- `ion-card-subtitle` — Subtitle text
- `ion-card-content` — Body content

### Example

```html
<ion-card>
  <ion-card-header>
    <ion-card-title>Card Title</ion-card-title>
    <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
  </ion-card-header>
  <ion-card-content>
    Card content goes here.
  </ion-card-content>
</ion-card>
```

---

## ion-input

Text input field with labels, validation, and styling.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `autocapitalize` | `autocapitalize` | `string` | `'off'` | Capitalization behavior |
| `autocomplete` | `autocomplete` | `AutocompleteTypes` | `'off'` | Autocomplete type |
| `autofocus` | `autofocus` | `boolean` | `false` | Auto-focus on load |
| `clearInput` | `clear-input` | `boolean` | `false` | Show clear button |
| `clearOnEdit` | `clear-on-edit` | `boolean` | `undefined` | Clear on edit (password) |
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `counter` | `counter` | `boolean` | `false` | Show character counter |
| `debounce` | `debounce` | `number` | `undefined` | Debounce for ionInput event (ms) |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `errorText` | `error-text` | `string` | `undefined` | Error message text |
| `fill` | `fill` | `"outline" \| "solid"` | `undefined` | Fill style |
| `helperText` | `helper-text` | `string` | `undefined` | Helper text |
| `inputmode` | `inputmode` | `Inputmode` | `undefined` | Virtual keyboard type |
| `label` | `label` | `string` | `undefined` | Label text |
| `labelPlacement` | `label-placement` | `"end" \| "fixed" \| "floating" \| "stacked" \| "start"` | `'start'` | Label position |
| `max` | `max` | `number \| string` | `undefined` | Maximum value |
| `maxlength` | `maxlength` | `number` | `undefined` | Max character length |
| `min` | `min` | `number \| string` | `undefined` | Minimum value |
| `minlength` | `minlength` | `number` | `undefined` | Min character length |
| `multiple` | `multiple` | `boolean` | `undefined` | Multiple values |
| `name` | `name` | `string` | `undefined` | Form field name |
| `pattern` | `pattern` | `string` | `undefined` | Validation pattern |
| `placeholder` | `placeholder` | `string` | `undefined` | Placeholder text |
| `readonly` | `readonly` | `boolean` | `false` | Read-only |
| `required` | `required` | `boolean` | `false` | Required field |
| `shape` | `shape` | `"round"` | `undefined` | Input shape |
| `spellcheck` | `spellcheck` | `boolean` | `false` | Spell checking |
| `step` | `step` | `number` | `undefined` | Step increment |
| `type` | `type` | `string` | `'text'` | Input type |
| `value` | `value` | `string \| number \| null` | `undefined` | Input value |

### Events

- `ionInput` — Fired on input change
- `ionChange` — Fired when value committed (blur)
- `ionBlur` — Fired on blur
- `ionFocus` — Fired on focus

### Methods

- `getInputElement()` — Returns the native `<input>` element
- `setFocus()` — Sets focus on the input

### Example

```html
<ion-input
  label="Email"
  label-placement="floating"
  type="email"
  placeholder="email@example.com"
  helper-text="Enter your email"
  error-text="Please enter a valid email"
></ion-input>

<ion-input
  label="Password"
  type="password"
  clear-input="true"
  fill="solid"
></ion-input>
```

---

## ion-textarea

Multi-line text input. Shares many properties with `ion-input`.

### Key Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `autoGrow` | `auto-grow` | `boolean` | `false` | Auto-resize to content |
| `cols` | `cols` | `number` | `undefined` | Visible columns |
| `rows` | `rows` | `number` | `undefined` | Visible rows |
| `wrap` | `wrap` | `"hard" \| "soft" \| "off"` | `'soft'` | Text wrapping |

### Example

```html
<ion-textarea
  label="Description"
  label-placement="floating"
  placeholder="Enter description..."
  auto-grow="true"
  counter="true"
  maxlength="200"
></ion-textarea>
```

---

## ion-checkbox

Checkbox input for selecting multiple options.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `alignment` | `alignment` | `"start" \| "end"` | — | Label alignment |
| `checked` | `checked` | `boolean` | `false` | Checked state |
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `errorText` | `error-text` | `string` | `undefined` | Error message |
| `helperText` | `helper-text` | `string` | `undefined` | Helper text |
| `indeterminate` | `indeterminate` | `boolean` | `false` | Indeterminate state |
| `justify` | `justify` | `"end" \| "space-between" \| "start"` | `undefined` | Label justification |
| `labelPlacement` | `label-placement` | `"end" \| "fixed" \| "floating" \| "stacked" \| "start"` | `'start'` | Label position |
| `name` | `name` | `string` | `undefined` | Form field name |
| `required` | `required` | `boolean` | `false` | Required field |
| `value` | `value` | `any` | `undefined` | Checkbox value |

### Events

- `ionChange` — Fired when checked state changes
- `ionFocus` — Fired on focus
- `ionBlur` — Fired on blur

### Example

```html
<ion-checkbox label-placement="end" justify="start">
  I agree to the terms and conditions
</ion-checkbox>
```

---

## ion-radio / ion-radio-group

Radio buttons for single selection from a group.

### ion-radio-group Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `allowEmptySelection` | `allow-empty-selection` | `boolean` | `false` | Allow deselecting |
| `compareWith` | `compare-with` | `string \| ((a, b) => boolean)` | `undefined` | Comparison function |
| `name` | `name` | `string` | `undefined` | Group name |
| `value` | `value` | `any` | `undefined` | Selected value |

### Example

```html
<ion-radio-group value="apple">
  <ion-item>
    <ion-radio slot="start" value="apple"></ion-radio>
    <ion-label>Apple</ion-label>
  </ion-item>
  <ion-item>
    <ion-radio slot="start" value="banana"></ion-radio>
    <ion-label>Banana</ion-label>
  </ion-item>
</ion-radio-group>
```

---

## ion-select

Dropdown selection component with single/multiple selection.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `cancelText` | `cancel-text` | `string` | `'Cancel'` | Cancel button text |
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `compareWith` | `compare-with` | `string \| ((a, b) => boolean)` | `undefined` | Object comparison |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `errorText` | `error-text` | `string` | `undefined` | Error message |
| `fill` | `fill` | `"outline" \| "solid"` | `undefined` | Fill style |
| `helperText` | `helper-text` | `string` | `undefined` | Helper text |
| `interface` | `interface` | `"action-sheet" \| "alert" \| "modal" \| "popover"` | `'alert'` | Selection UI type |
| `interfaceOptions` | `interface-options` | `any` | `{}` | Options for interface |
| `justify` | `justify` | `"end" \| "space-between" \| "start"` | `undefined` | Label justification |
| `label` | `label` | `string` | `undefined` | Label text |
| `labelPlacement` | `label-placement` | `"end" \| "fixed" \| "floating" \| "stacked" \| "start"` | `'start'` | Label position |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `multiple` | `multiple` | `boolean` | `false` | Multi-select |
| `name` | `name` | `string` | auto | Form field name |
| `okText` | `ok-text` | `string` | `'OK'` | OK button text |
| `placeholder` | `placeholder` | `string` | `undefined` | Placeholder text |
| `required` | `required` | `boolean` | `false` | Required field |
| `selectedText` | `selected-text` | `string` | `undefined` | Display text for selection |
| `shape` | `shape` | `"round"` | `undefined` | Select shape |
| `toggleIcon` | `toggle-icon` | `string` | `undefined` | Toggle icon |
| `value` | `value` | `any` | `undefined` | Selected value |

### Events

- `ionChange` — Fired when selection changes
- `ionCancel` — Fired when selection dismissed
- `ionDismiss` — Fired when selection dismissed
- `ionFocus` — Fired on focus
- `ionBlur` — Fired on blur

### Methods

- `open()` — Opens the select interface

### Example

```html
<ion-select label="Fruit" placeholder="Select one">
  <ion-select-option value="apple">Apple</ion-select-option>
  <ion-select-option value="banana">Banana</ion-select-option>
  <ion-select-option value="orange">Orange</ion-select-option>
</ion-select>

<!-- Multiple selection -->
<ion-select label="Toppings" multiple="true" placeholder="Select toppings">
  <ion-select-option value="cheese">Cheese</ion-select-option>
  <ion-select-option value="pepperoni">Pepperoni</ion-select-option>
</ion-select>
```

---

## ion-toggle

Binary on/off switch.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `checked` | `checked` | `boolean` | `false` | Checked state |
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `enableOnOffLabels` | `enable-on-off-labels` | `boolean` | `false` | Show on/off labels |
| `justify` | `justify` | `"end" \| "space-between" \| "start"` | `undefined` | Label justification |
| `labelPlacement` | `label-placement` | `"end" \| "fixed" \| "floating" \| "stacked" \| "start"` | `'start'` | Label position |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `name` | `name` | `string` | `undefined` | Form field name |
| `value` | `value` | `any` | `undefined` | Toggle value |

### Example

```html
<ion-toggle label-placement="end" justify="start">
  Enable notifications
</ion-toggle>
```

---

## ion-range

Range slider for selecting a value within a range.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `debounce` | `debounce` | `number` | `undefined` | Event debounce (ms) |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `dualKnobs` | `dual-knobs` | `boolean` | `false` | Dual knob mode |
| `label` | `label` | `string` | `undefined` | Label text |
| `labelPlacement` | `label-placement` | `"end" \| "fixed" \| "floating" \| "stacked" \| "start"` | `'start'` | Label position |
| `max` | `max` | `number` | `100` | Maximum value |
| `min` | `min` | `number` | `0` | Minimum value |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `name` | `name` | `string` | `undefined` | Form field name |
| `pin` | `pin` | `boolean` | `false` | Show pin with value |
| `pinFormatter` | `pin-formatter` | `(value) => string` | — | Custom pin formatter |
| `snaps` | `snaps` | `boolean` | `false` | Snap to steps |
| `step` | `step` | `number` | `1` | Step increment |
| `ticks` | `ticks` | `boolean` | `true` | Show tick marks |
| `value` | `value` | `RangeValue` | `undefined` | Current value |

### Events

- `ionChange` — Fired when value changes
- `ionKnobMoveStart` — Fired when knob drag starts
- `ionKnobMoveEnd` — Fired when knob drag ends

### Example

```html
<ion-range min="0" max="100" step="10" snaps="true" pin="true">
  <ion-icon slot="start" name="volume-low"></ion-icon>
  <ion-icon slot="end" name="volume-high"></ion-icon>
</ion-range>
```

---

## ion-item

A container for displaying information in a list — text, icons, avatars, inputs, buttons, etc.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `button` | `button` | `boolean` | `false` | Makes item clickable |
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `detail` | `detail` | `boolean` | `undefined` | Show detail arrow |
| `detailIcon` | `detail-icon` | `string` | `chevronForward` | Detail icon name |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `download` | `download` | `string` | `undefined` | Download attribute |
| `href` | `href` | `string` | `undefined` | URL for navigation |
| `lines` | `lines` | `"full" \| "inset" \| "none"` | `undefined` | Border lines |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `rel` | `rel` | `string` | `undefined` | Link relationship |
| `routerDirection` | `router-direction` | `"back" \| "forward" \| "root"` | `'forward'` | Router direction |
| `target` | `target` | `string` | `undefined` | Link target |
| `type` | `type` | `"button" \| "reset" \| "submit"` | `'button'` | Button type |

### Slots

- `start` — Left side content
- `end` — Right side content
- **Default** — Main content

### Example

```html
<ion-list>
  <ion-item>
    <ion-icon slot="start" name="person"></ion-icon>
    <ion-label>
      <h2>Jane Doe</h2>
      <p>jane@example.com</p>
    </ion-label>
    <ion-note slot="end">Online</ion-note>
  </ion-item>
  <ion-item button detail>
    <ion-label>Settings</ion-label>
  </ion-item>
</ion-list>
```

---

## ion-list

Container for displaying rows of information.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `inset` | `inset` | `boolean` | `false` | Inset list style |
| `lines` | `lines` | `"full" \| "inset" \| "none"` | `undefined` | Border lines for items |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |

### Methods

- `closeSlidingItems()` — Close all sliding items

### Example

```html
<ion-list inset="true">
  <ion-list-header>
    <ion-label>Recent</ion-label>
  </ion-list-header>
  <ion-item>
    <ion-label>Item 1</ion-label>
  </ion-item>
  <ion-item>
    <ion-label>Item 2</ion-label>
  </ion-item>
</ion-list>
```

---

## ion-modal

A modal dialog that slides in/off screen. Supports inline (recommended) and controller patterns.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `animated` | `animated` | `boolean` | `true` | Enable animations |
| `backdropBreakpoint` | `backdrop-breakpoint` | `number` | `0` | Breakpoint for backdrop activation |
| `backdropDismiss` | `backdrop-dismiss` | `boolean` | `true` | Dismiss on backdrop tap |
| `breakpoints` | `breakpoints` | `number[]` | `undefined` | Sheet modal breakpoints (e.g. `[0, 0.5, 1]`) |
| `canDismiss` | `can-dismiss` | `boolean \| ((data?, role?) => Promise<boolean>)` | `true` | Prevent dismissal |
| `enterAnimation` | — | `AnimationBuilder` | `undefined` | Custom enter animation |
| `expandToScroll` | `expand-to-scroll` | `boolean` | `true` | Expand sheet on scroll |
| `focusTrap` | `focus-trap` | `boolean` | `true` | Trap focus inside modal |
| `handle` | `handle` | `boolean` | `undefined` | Show sheet handle |
| `handleBehavior` | `handle-behavior` | `"cycle" \| "none"` | `'none'` | Handle behavior |
| `htmlAttributes` | — | `{ [key: string]: any }` | `undefined` | Additional HTML attributes |
| `initialBreakpoint` | `initial-breakpoint` | `number` | `undefined` | Initial sheet breakpoint |
| `isOpen` | `is-open` | `boolean` | `false` | Control modal visibility |
| `keepContentsMounted` | `keep-contents-mounted` | `boolean` | `false` | Keep content mounted when hidden |
| `keyboardClose` | `keyboard-close` | `boolean` | `true` | Close keyboard on dismiss |
| `leaveAnimation` | — | `AnimationBuilder` | `undefined` | Custom leave animation |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `presentingElement` | — | `HTMLElement` | `undefined` | Element for card modal presentation |
| `showBackdrop` | `show-backdrop` | `boolean` | `true` | Show backdrop |
| `trigger` | `trigger` | `string` | `undefined` | ID of trigger element |

### Events

- `ionModalDidPresent` — After modal presents
- `ionModalWillDismiss` — Before modal dismisses
- `ionModalDidDismiss` — After modal dismisses
- `ionModalWillPresent` — Before modal presents
- `ionDragStart` — Drag starts (sheet modal)
- `ionDragMove` — Drag moves (sheet modal)
- `ionDragEnd` — Drag ends (sheet modal)

### Methods

- `present()` — Presents the modal
- `dismiss(data?, role?)` — Dismisses the modal
- `onWillDismiss()` — Promise resolved before dismiss
- `onDidDismiss()` — Promise resolved after dismiss
- `getCurrentBreakpoint()` — Current sheet breakpoint
- `setCurrentBreakpoint(breakpoint)` — Set sheet breakpoint

### Example (Inline — Recommended)

```html
<ion-modal is-open="false" trigger="open-modal">
  <ion-header>
    <ion-toolbar>
      <ion-title>Modal Title</ion-title>
      <ion-buttons slot="end">
        <ion-button onclick="modal.dismiss()">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <p>Modal content</p>
  </ion-content>
</ion-modal>
```

### Sheet Modal

```html
<ion-modal
  trigger="open-sheet"
  initial-breakpoint="0.5"
  breakpoints="[0, 0.25, 0.5, 0.75, 1]"
  handle="true"
>
  <ion-content>Sheet content</ion-content>
</ion-modal>
```

---

## ion-alert

Alert dialog for presenting information and collecting user input.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `animated` | `animated` | `boolean` | `true` | Enable animations |
| `backdropDismiss` | `backdrop-dismiss` | `boolean` | `true` | Dismiss on backdrop tap |
| `buttons` | `buttons` | `(string \| AlertButton)[]` | `[]` | Alert buttons |
| `cssClass` | `css-class` | `string \| string[]` | `undefined` | Custom CSS classes |
| `enterAnimation` | — | `AnimationBuilder` | `undefined` | Custom enter animation |
| `header` | `header` | `string` | `undefined` | Alert header |
| `htmlAttributes` | — | `{ [key: string]: any }` | `undefined` | Additional HTML attributes |
| `inputs` | `inputs` | `AlertInput[]` | `[]` | Alert inputs |
| `isOpen` | `is-open` | `boolean` | `false` | Control alert visibility |
| `keyboardClose` | `keyboard-close` | `boolean` | `true` | Close keyboard on dismiss |
| `leaveAnimation` | — | `AnimationBuilder` | `undefined` | Custom leave animation |
| `message` | `message` | `IonicSafeString \| string` | `undefined` | Alert message |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `subHeader` | `sub-header` | `string` | `undefined` | Alert sub-header |
| `translucent` | `translucent` | `boolean` | `false` | Translucent backdrop (iOS) |
| `trigger` | `trigger` | `string` | `undefined` | ID of trigger element |

### Methods

- `present()` — Presents the alert
- `dismiss(data?, role?)` — Dismisses the alert
- `onWillDismiss()` — Promise resolved before dismiss
- `onDidDismiss()` — Promise resolved after dismiss

### Example

```html
<ion-alert
  is-open="true"
  header="Confirm"
  message="Are you sure you want to delete this item?"
  buttons='["Cancel", { text: "Delete", role: "destructive" }]'
></ion-alert>
```

---

## ion-toast

Subtle notification that appears over content without interrupting interaction.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `animated` | `animated` | `boolean` | `true` | Enable animations |
| `buttons` | `buttons` | `(string \| ToastButton)[]` | `[]` | Action buttons |
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `cssClass` | `css-class` | `string \| string[]` | `undefined` | Custom CSS classes |
| `duration` | `duration` | `number` | `undefined` | Display duration (ms) |
| `enterAnimation` | — | `AnimationBuilder` | `undefined` | Custom enter animation |
| `header` | `header` | `string` | `undefined` | Toast header |
| `htmlAttributes` | — | `{ [key: string]: any }` | `undefined` | Additional HTML attributes |
| `icon` | `icon` | `string` | `undefined` | Toast icon |
| `isOpen` | `is-open` | `boolean` | `false` | Control toast visibility |
| `keyboardClose` | `keyboard-close` | `boolean` | `true` | Close keyboard on dismiss |
| `layout` | `layout` | `"baseline" \| "stacked"` | `'baseline'` | Button layout |
| `leaveAnimation` | — | `AnimationBuilder` | `undefined` | Custom leave animation |
| `message` | `message` | `IonicSafeString \| string` | `undefined` | Toast message |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `position` | `position` | `"bottom" \| "middle" \| "top"` | `'bottom'` | Toast position |
| `positionAnchor` | `position-anchor` | `string` | `undefined` | Anchor element ID |
| `swipeGesture` | `swipe-gesture` | `"horizontal" \| "vertical" \| undefined` | `undefined` | Swipe to dismiss |
| `translucent` | `translucent` | `boolean` | `false` | Translucent style |
| `trigger` | `trigger` | `string` | `undefined` | ID of trigger element |

### Methods

- `present()` — Presents the toast
- `dismiss(data?, role?)` — Dismisses the toast
- `onWillDismiss()` — Promise resolved before dismiss
- `onDidDismiss()` — Promise resolved after dismiss

### Example

```html
<ion-toast
  message="Settings saved successfully"
  duration="3000"
  position="bottom"
  buttons='[{ text: "Dismiss", role: "cancel" }]'
></ion-toast>
```

---

## ion-popover

Floating UI element for presenting information or options.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `alignment` | `alignment` | `"center" \| "end" \| "start"` | `'center'` | Alignment relative to trigger |
| `animated` | `animated` | `boolean` | `true` | Enable animations |
| `arrow` | `arrow` | `boolean` | `true` | Show arrow |
| `backdropDismiss` | `backdrop-dismiss` | `boolean` | `true` | Dismiss on backdrop tap |
| `component` | — | `HTMLElement \| Function \| string` | `undefined` | Popover content component |
| `componentProps` | — | `{ [key: string]: any }` | `undefined` | Props for component |
| `dismissOnSelect` | `dismiss-on-select` | `boolean` | `false` | Dismiss on any click |
| `enterAnimation` | — | `AnimationBuilder` | `undefined` | Custom enter animation |
| `event` | — | `Event \| { x: number, y: number }` | `undefined` | Position event |
| `focusTrap` | `focus-trap` | `boolean` | `true` | Trap focus |
| `htmlAttributes` | — | `{ [key: string]: any }` | `undefined` | Additional HTML attributes |
| `isOpen` | `is-open` | `boolean` | `false` | Control popover visibility |
| `keepContentsMounted` | `keep-contents-mounted` | `boolean` | `false` | Keep content mounted |
| `keyboardClose` | `keyboard-close` | `boolean` | `true` | Close keyboard on dismiss |
| `leaveAnimation` | — | `AnimationBuilder` | `undefined` | Custom leave animation |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `reference` | `reference` | `"event" \| "trigger"` | `'trigger'` | Positioning reference |
| `showBackdrop` | `show-backdrop` | `boolean` | `true` | Show backdrop |
| `side` | `side` | `"bottom" \| "end" \| "left" \| "right" \| "start" \| "top"` | `'bottom'` | Position relative to trigger |
| `size` | `size` | `"auto" \| "cover" \| string` | `'auto'` | Popover size |
| `translucent` | `translucent` | `boolean` | `false` | Translucent style (iOS) |
| `trigger` | `trigger` | `string` | `undefined` | ID of trigger element |
| `triggerAction` | `trigger-action` | `"click" \| "hover" \| "context-menu"` | `'click'` | Trigger action |

### Methods

- `present()` — Presents the popover
- `dismiss(data?, role?)` — Dismisses the popover
- `onWillDismiss()` — Promise resolved before dismiss
- `onDidDismiss()` — Promise resolved after dismiss

### Example

```html
<ion-popover trigger="popover-trigger" side="bottom" alignment="center">
  <ion-content class="ion-padding">
    <p>Popover content</p>
  </ion-content>
</ion-popover>

<ion-button id="popover-trigger">Show Popover</ion-button>
```

---

## ion-menu

Side navigation menu that can be toggled open/closed.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `contentId` | `content-id` | `string` | `undefined` | ID of main content |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `maxEdgeStart` | `max-edge-start` | `number` | `50` | Max edge swipe distance |
| `menuId` | `menu-id` | `string` | `undefined` | Menu identifier |
| `side` | `side` | `"end" \| "start"` | `'start'` | Menu side |
| `swipeGesture` | `swipe-gesture` | `boolean` | `true` | Enable swipe gesture |
| `type` | `type` | `"overlay" \| "push" \| "reveal"` | `undefined` | Menu display type |

### Events

- `ionWillOpen` — Before menu opens
- `ionDidOpen` — After menu opens
- `ionWillClose` — Before menu closes
- `ionDidClose` — After menu closes

### Methods

- `open()` — Opens the menu
- `close()` — Closes the menu
- `toggle()` — Toggles the menu
- `setOpen(shouldOpen)` — Sets open state
- `isActive()` — Whether menu is active
- `isOpen()` — Whether menu is open

### Example

```html
<ion-menu content-id="main-content" side="start">
  <ion-header>
    <ion-toolbar>
      <ion-title>Menu</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <ion-item button>Home</ion-item>
      <ion-item button>Settings</ion-item>
    </ion-list>
  </ion-content>
</ion-menu>

<ion-content id="main-content">
  <ion-menu-button></ion-menu-button>
  Main content
</ion-content>
```

---

## ion-tabs

Tab-based navigation for top-level navigation.

### Events

- `ionTabsWillChange` — Before tab changes
- `ionTabsDidChange` — After tab changes

### Methods

- `getSelected()` — Returns selected tab
- `getTab(tab)` — Returns tab element
- `select(tab)` — Selects a tab

### Example

```html
<ion-tabs>
  <ion-tab slot="bottom" tab="home">
    <ion-router-outlet>
      <ion-route url="/home" component="home-page"></ion-route>
    </ion-router-outlet>
  </ion-tab>
  <ion-tab slot="bottom" tab="settings">
    <ion-router-outlet>
      <ion-route url="/settings" component="settings-page"></ion-route>
    </ion-router-outlet>
  </ion-tab>

  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="home">
      <ion-icon name="home"></ion-icon>
      <ion-label>Home</ion-label>
    </ion-tab-button>
    <ion-tab-button tab="settings">
      <ion-icon name="settings"></ion-icon>
      <ion-label>Settings</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
```

---

## ion-router

Router component for coordinating URL-based navigation (standalone/JavaScript).

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `root` | `root` | `string` | `undefined` | Root URL |
| `useHash` | `use-hash` | `boolean` | `true` | Use hash-based routing |

### Methods

- `push(url, direction)` — Navigate to URL
- `back()` — Navigate back

### Example

```html
<ion-router>
  <ion-route url="/" component="home-page"></ion-route>
  <ion-route url="/settings" component="settings-page"></ion-route>
  <ion-route-redirect from="/home" to="/"></ion-route-redirect>
</ion-router>
<ion-router-outlet></ion-router-outlet>
```

---

## ion-searchbar

Search input with search icon, clear button, and cancel button.

### Key Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `debounce` | `debounce` | `number` | `250` | Event debounce (ms) |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `placeholder` | `placeholder` | `string` | `'Search'` | Placeholder text |
| `searchIcon` | `search-icon` | `string` | `search` | Search icon name |
| `showCancelButton` | `show-cancel-button` | `"always" \| "focus" \| "never"` | `'never'` | Cancel button visibility |
| `showClearButton` | `show-clear-button` | `"always" \| "focus" \| "never"` | `'always'` | Clear button visibility |
| `value` | `value` | `string` | `undefined` | Search value |

### Methods

- `getInputElement()` — Returns native input element
- `setFocus()` — Sets focus on searchbar

### Events

- `ionInput` — Fired on input
- `ionChange` — Fired on value commit
- `ionCancel` — Fired on cancel
- `ionClear` — Fired on clear
- `ionFocus` / `ionBlur` — Focus events

### Example

```html
<ion-searchbar
  placeholder="Search items..."
  show-cancel-button="focus"
  debounce="500"
></ion-searchbar>
```

---

## ion-segment

Segmented control for switching between views or filtering.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `scrollable` | `scrollable` | `boolean` | `false` | Scrollable segments |
| `selectOnFocus` | `select-on-focus` | `boolean` | `false` | Select on focus |
| `swipeGesture` | `swipe-gesture` | `boolean` | `false` | Enable swipe gesture |
| `value` | `value` | `string` | `undefined` | Selected value |

### Events

- `ionChange` — Fired when selection changes

### Example

```html
<ion-segment value="all">
  <ion-segment-button value="all">
    <ion-label>All</ion-label>
  </ion-segment-button>
  <ion-segment-button value="favorites">
    <ion-label>Favorites</ion-label>
  </ion-segment-button>
</ion-segment>
```

---

## ion-refresher

Pull-to-refresh functionality for content components.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `closeDuration` | `close-duration` | `number` | `280` | Close animation duration (ms) |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `pullFactor` | `pull-factor` | `number` | `1` | Pull resistance factor |
| `pullMax` | `pull-max` | `number` | `120` | Max pull distance |
| `pullMin` | `pull-min` | `number` | `60` | Min pull distance to trigger |
| `snapbackDuration` | `snapback-duration` | `number` | `280` | Snapback animation duration (ms) |

### Events

- `ionRefresh` — Fired when refresh is triggered
- `ionPull` — Fired during pull
- `ionStart` — Fired when pull starts

### Methods

- `complete()` — Completes the refresh
- `cancel()` — Cancels the refresh
- `getProgress()` — Returns current pull progress

### Example

```html
<ion-content>
  <ion-refresher slot="fixed" id="refresher">
    <ion-refresher-content
      pulling-icon="arrow-down"
      refreshing-spinner="circular"
    ></ion-refresher-content>
  </ion-refresher>
  <ion-list>
    <!-- list items -->
  </ion-list>
</ion-content>
```

---

## ion-toolbar

Toolbar for housing information and actions, typically in headers/footers.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |

### Related Components

- `ion-header` — Top container for toolbars
- `ion-footer` — Bottom container for toolbars
- `ion-title` — Toolbar title text
- `ion-buttons` — Container for toolbar buttons

### Example

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
    <ion-title>My App</ion-title>
    <ion-buttons slot="end">
      <ion-button>
        <ion-icon slot="icon-only" name="menu"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
```

---

## ion-content

Main scrollable content area of a page.

### Key Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Background color |
| `fullscreen` | `fullscreen` | `boolean` | `false` | Extend under header/footer |
| `scrollEvents` | `scroll-events` | `boolean` | `false` | Enable scroll events |
| `scrollX` | `scroll-x` | `boolean` | `false` | Enable horizontal scroll |
| `scrollY` | `scroll-y` | `boolean` | `true` | Enable vertical scroll |

### Events (when `scrollEvents` is enabled)

- `ionScrollStart` — Scroll started
- `ionScroll` — Scrolling
- `ionScrollEnd` — Scroll ended

### Methods

- `getScrollElement()` — Returns the scroll container
- `scrollToTop(duration)` — Scrolls to top
- `scrollToBottom(duration)` — Scrolls to bottom
- `scrollByPoint(x, y, duration)` — Scrolls by offset
- `scrollToPoint(x, y, duration)` — Scrolls to point

---

## ion-grid / ion-row / ion-col

12-column responsive grid system.

### ion-grid Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `fixed` | `fixed` | `boolean` | `false` | Fixed width grid |

### ion-col Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `size` | `size` | `number \| string` | `12` | Column size (1-12) |
| `sizeXs` | `size-xs` | `number \| string` | `undefined` | Size for xs breakpoint |
| `sizeSm` | `size-sm` | `number \| string` | `undefined` | Size for sm breakpoint |
| `sizeMd` | `size-md` | `number \| string` | `undefined` | Size for md breakpoint |
| `sizeLg` | `size-lg` | `number \| string` | `undefined` | Size for lg breakpoint |
| `offset` | `offset` | `number \| string` | `undefined` | Column offset |
| `pull` | `pull` | `number \| string` | `undefined` | Column pull |
| `push` | `push` | `number \| string` | `undefined` | Column push |

### Example

```html
<ion-grid>
  <ion-row>
    <ion-col size="6">50%</ion-col>
    <ion-col size="3">25%</ion-col>
    <ion-col size="3">25%</ion-col>
  </ion-row>
  <ion-row>
    <ion-col size="12" size-md="6">Responsive</ion-col>
    <ion-col size="12" size-md="6">Responsive</ion-col>
  </ion-row>
</ion-grid>
```

---

## ion-loading

Overlay that indicates loading activity.

### Key Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `spinner` | `spinner` | `string` | `undefined` | Spinner type (`bubbles`, `circles`, `circular`, `crescent`, `dots`, `lines`, `lines-small`) |
| `message` | `message` | `string` | `undefined` | Loading message |
| `duration` | `duration` | `number` | `undefined` | Auto-dismiss duration (ms) |
| `backdropDismiss` | `backdrop-dismiss` | `boolean` | `false` | Dismiss on backdrop |
| `isOpen` | `is-open` | `boolean` | `false` | Control visibility |
| `trigger` | `trigger` | `string` | `undefined` | Trigger element ID |

### Example

```html
<ion-loading
  is-open="true"
  message="Please wait..."
  spinner="circular"
  duration="5000"
></ion-loading>
```

---

## ion-infinite-scroll

Infinite scrolling for loading more data as user scrolls.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `position` | `position` | `"bottom" \| "top"` | `'bottom'` | Scroll position |

### Events

- `ionInfinite` — Fired when scroll reaches threshold

### Methods

- `complete()` — Completes the infinite scroll loading

### Example

```html
<ion-content>
  <ion-list>
    <!-- items -->
  </ion-list>
  <ion-infinite-scroll>
    <ion-infinite-scroll-content
      loading-spinner="bubbles"
      loading-text="Loading more..."
    ></ion-infinite-scroll-content>
  </ion-infinite-scroll>
</ion-content>
```

---

## ion-progress-bar

Progress indicator bar.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `buffer` | `buffer` | `number` | `1` | Buffer value (0-1) |
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `reversed` | `reversed` | `boolean` | `false` | Reverse direction |
| `type` | `type` | `"determinate" \| "indeterminate" \| "buffer"` | `'determinate'` | Progress type |
| `value` | `value` | `number` | `0` | Progress value (0-1) |

### Example

```html
<ion-progress-bar type="determinate" value="0.5"></ion-progress-bar>
<ion-progress-bar type="indeterminate" color="primary"></ion-progress-bar>
```

---

## ion-spinner

Animated spinner for loading states.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `duration` | `duration` | `number` | `undefined` | Animation duration (ms) |
| `name` | `name` | `SpinnerNames` | `undefined` | Spinner type |
| `paused` | `paused` | `boolean` | `false` | Pause animation |

### Spinner Types

`bubbles`, `circles`, `circular`, `crescent`, `dots`, `lines`, `lines-sharp`, `lines-small`, `lines-sharp-small`

### Example

```html
<ion-spinner name="circular"></ion-spinner>
<ion-spinner name="dots" color="primary"></ion-spinner>
```

---

## ion-icon

Icon component using Ionicons icon library.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `flipRtl` | `flip-rtl` | `boolean` | `undefined` | Flip in RTL mode |
| `icon` | `icon` | `string` | `undefined` | Icon name or SVG URL |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `name` | `name` | `string` | `undefined` | Icon name (legacy) |
| `size` | `size` | `string` | `undefined` | Icon size |
| `src` | `src` | `string` | `undefined` | SVG source URL |

### Example

```html
<ion-icon name="heart"></ion-icon>
<ion-icon name="star" color="warning" size="large"></ion-icon>
<ion-icon name="ios-arrow-forward"></ion-icon>
```

---

## ion-img

Lazy-loading image component.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `alt` | `alt` | `string` | `undefined` | Alt text |
| `src` | `src` | `string` | `undefined` | Image source URL |

### Example

```html
<ion-img src="/path/to/image.jpg" alt="Description"></ion-img>
```

---

## ion-avatar / ion-thumbnail

Circular (`ion-avatar`) or square (`ion-thumbnail`) image containers.

### Example

```html
<ion-item>
  <ion-avatar slot="start">
    <img src="/path/to/avatar.jpg" />
  </ion-avatar>
  <ion-label>
    <h2>User Name</h2>
  </ion-label>
</ion-item>

<ion-item>
  <ion-thumbnail slot="start">
    <img src="/path/to/thumb.jpg" />
  </ion-thumbnail>
  <ion-label>Item with thumbnail</ion-label>
</ion-item>
```

---

## ion-badge

Small count or status descriptor.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |

### Example

```html
<ion-badge color="danger">3</ion-badge>
<ion-badge color="primary">New</ion-badge>
```

---

## ion-reorder / ion-reorder-group

Drag-and-drop reordering for list items.

### ion-reorder-group Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |

### Events

- `ionItemReorder` — Fired when items are reordered. Detail contains `from`, `to`, and `complete()` method.

### Example

```html
<ion-reorder-group disabled="false">
  <ion-item>
    <ion-label>Item 1</ion-label>
    <ion-reorder slot="end"></ion-reorder>
  </ion-item>
  <ion-item>
    <ion-label>Item 2</ion-label>
    <ion-reorder slot="end"></ion-reorder>
  </ion-item>
</ion-reorder-group>
```

---

## ion-action-sheet

Bottom sheet with action buttons.

### Key Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `buttons` | `buttons` | `(string \| ActionSheetButton)[]` | `[]` | Action buttons |
| `header` | `header` | `string` | `undefined` | Action sheet header |
| `subHeader` | `sub-header` | `string` | `undefined` | Sub-header |
| `backdropDismiss` | `backdrop-dismiss` | `boolean` | `true` | Dismiss on backdrop |
| `isOpen` | `is-open` | `boolean` | `false` | Control visibility |
| `trigger` | `trigger` | `string` | `undefined` | Trigger element ID |

### Example

```html
<ion-action-sheet
  is-open="true"
  header="Choose an action"
  buttons='[
    { text: "Delete", role: "destructive" },
    { text: "Share" },
    { text: "Cancel", role: "cancel" }
  ]'
></ion-action-sheet>
```

---

## ion-back-button

Back navigation button for toolbars.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `defaultHref` | `default-href` | `string` | `undefined` | Fallback URL |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `icon` | `icon` | `string` | `undefined` | Custom icon |
| `text` | `text` | `string` | `undefined` | Button text |

### Example

```html
<ion-toolbar>
  <ion-buttons slot="start">
    <ion-back-button default-href="/home"></ion-back-button>
  </ion-buttons>
</ion-toolbar>
```

---

## ion-split-pane

Responsive split view with side menu and main content.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `contentId` | `content-id` | `string` | `undefined` | ID of main content |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `when` | `when` | `string \| boolean` | `'md'` | Breakpoint for split view |

### Example

```html
<ion-split-pane content-id="main-content" when="lg">
  <ion-menu content-id="main-content">
    <!-- menu content -->
  </ion-menu>
  <ion-content id="main-content">
    <!-- main content -->
  </ion-content>
</ion-split-pane>
```

---

## ion-datetime

Date and time picker component. Supports calendar, wheel, and time-only presentations.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `cancelText` | `cancel-text` | `string` | `'Cancel'` | Cancel button text |
| `clearText` | `clear-text` | `string` | `'Clear'` | Clear button text |
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `dayValues` | `day-values` | `number[] \| string[] \| number \| string` | `undefined` | Days to display |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `doneText` | `done-text` | `string` | `'Done'` | Done button text |
| `firstDayOfWeek` | `first-day-of-week` | `number` | `0` | First day of week (0=Sunday) |
| `formatOptions` | `format-options` | `DatetimeFormatOptions` | — | Locale formatting options |
| `highlightedDates` | `highlighted-dates` | `string[] \| ((date) => boolean)` | `undefined` | Highlight specific dates |
| `hourCycle` | `hour-cycle` | `"h12" \| "h23"` | `undefined` | 12 or 24 hour format |
| `hourValues` | `hour-values` | `number[] \| string[] \| number \| string` | `undefined` | Hours to display |
| `isDateEnabled` | `is-date-enabled` | `(date) => boolean` | — | Enable/disable specific dates |
| `locale` | `locale` | `string` | `undefined` | Locale for formatting |
| `max` | `max` | `string` | `undefined` | Maximum selectable date |
| `min` | `min` | `string` | `undefined` | Minimum selectable date |
| `minuteValues` | `minute-values` | `number[] \| string[] \| number \| string` | `undefined` | Minutes to display |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `monthValues` | `month-values` | `number[] \| string[] \| number \| string` | `undefined` | Months to display |
| `multiple` | `multiple` | `boolean` | `false` | Allow multiple date selection |
| `name` | `name` | `string` | `undefined` | Form field name |
| `preferWheel` | `prefer-wheel` | `boolean` | `false` | Use wheel-style picker |
| `presentation` | `presentation` | `"date" \| "date-time" \| "month" \| "month-year" \| "time" \| "time-date" \| "year"` | `'date-time'` | Display presentation |
| `readonly` | `readonly` | `boolean` | `false` | Read-only |
| `showAdjacentDays` | `show-adjacent-days` | `boolean` | `false` | Show days from adjacent months |
| `showClearButton` | `show-clear-button` | `boolean` | `true` | Show clear button |
| `showDefaultButtons` | `show-default-buttons` | `boolean` | `false` | Show default Cancel/Done buttons |
| `showDefaultTimeLabel` | `show-default-time-label` | `boolean` | `true` | Show default time label |
| `showDefaultTitle` | `show-default-title` | `boolean` | `false` | Show default title |
| `size` | `size` | `"cover" \| "auto"` | `'auto'` | Datetime size |
| `value` | `value` | `string \| null` | `undefined` | Selected value (ISO 8601) |
| `yearValues` | `year-values` | `number[] \| string[] \| number \| string` | `undefined` | Years to display |

### Events

- `ionChange` — Fired when date/time changes
- `ionCancel` — Fired on cancel
- `ionFocus` / `ionBlur` — Focus events

### Methods

- `confirm()` — Confirms the selection
- `cancel()` — Cancels the selection
- `reset()` — Resets to initial value

### Example

```html
<ion-datetime
  presentation="date"
  locale="en-US"
  first-day-of-week="1"
  show-default-buttons="true"
></ion-datetime>

<!-- Time only -->
<ion-datetime presentation="time" hour-cycle="h12"></ion-datetime>

<!-- Wheel style -->
<ion-datetime prefer-wheel="true" presentation="date-time"></ion-datetime>
```

---

## ion-datetime-button

Button that opens a datetime picker in a popover or modal.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `datetime` | `datetime` | `string` | `undefined` | ID of associated ion-datetime |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |

### Example

```html
<ion-datetime-button datetime="datetime"></ion-datetime-button>

<ion-modal>
  <ion-datetime id="datetime" presentation="date-time"></ion-datetime>
</ion-modal>
```

---

## ion-nav

Navigation stack component for pushing/popping pages. Alternative to router-based navigation.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `animated` | `animated` | `boolean` | `true` | Enable animations |
| `animation` | — | `AnimationBuilder` | `undefined` | Custom animation |
| `root` | `root` | `Function \| HTMLElement \| ViewController \| string` | `undefined` | Root page component |
| `rootParams` | `root-params` | `any` | `undefined` | Params for root page |
| `swipeGesture` | `swipe-gesture` | `boolean` | `undefined` | Enable swipe-back gesture |

### Methods

- `push(component, params?, direction?)` — Push a new page
- `pop(direction?)` — Pop the top page
- `popTo(index, direction?)` — Pop to a specific index
- `popToRoot(direction?)` — Pop to root
- `setRoot(component, params?, direction?)` — Set root page
- `setPages(pages, direction?)` — Set entire nav stack
- `insert(index, component, params?)` — Insert page at index
- `getActive()` — Get active view controller
- `getByIndex(index)` — Get view by index
- `getLength()` — Get nav stack length
- `canGoBack()` — Whether can pop
- `getPrevious(view?)` — Get previous view

### Example

```html
<ion-nav root="home-page"></ion-nav>

<ion-nav-link component="detail-page" router-direction="forward">
  <ion-item button>Go to Detail</ion-item>
</ion-nav-link>
```

---

## ion-backdrop

Full-screen overlay that blocks interaction with content behind it.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `stopPropagation` | `stop-propagation` | `boolean` | `true` | Stop event propagation |
| `tappable` | `tappable` | `boolean` | `true` | Whether backdrop is tappable |
| `visible` | `visible` | `boolean` | `true` | Backdrop visibility |

### Events

- `ionBackdropTap` — Fired when backdrop is tapped

### Example

```html
<ion-backdrop tappable="true"></ion-backdrop>
```

---

## ion-skeleton-text

Placeholder loading indicator that mimics text layout.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `animated` | `animated` | `boolean` | `false` | Enable shimmer animation |

### Example

```html
<ion-list>
  <ion-item>
    <ion-avatar slot="start">
      <ion-skeleton-text></ion-skeleton-text>
    </ion-avatar>
    <ion-label>
      <h3><ion-skeleton-text style="width: 50%"></ion-skeleton-text></h3>
      <p><ion-skeleton-text style="width: 80%"></ion-skeleton-text></p>
    </ion-label>
  </ion-item>
</ion-list>
```

---

## ion-label

Label element for use inside `ion-item`.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `position` | `position` | `"fixed" \| "floating" \| "stacked"` | `undefined` | Label position |

### Example

```html
<ion-item>
  <ion-label position="floating">Name</ion-label>
  <ion-input></ion-input>
</ion-item>

<ion-item>
  <ion-label>
    <h2>Heading</h2>
    <p>Subtext</p>
  </ion-label>
</ion-item>
```

---

## ion-note

Small text element for metadata or supplementary information.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |

### Example

```html
<ion-item>
  <ion-label>Item</ion-label>
  <ion-note slot="end">12:00 PM</ion-note>
</ion-item>
```

---

## ion-text

Wrapper for applying color to text.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |

### Example

```html
<ion-text color="danger">
  <h1>Error!</h1>
  <p>Something went wrong.</p>
</ion-text>
```

---

## ion-title

Title component for toolbars. Supports collapsible large titles (iOS).

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `size` | `size` | `"large" \| "small"` | `undefined` | Title size (large = collapsible) |

### Example

```html
<ion-header>
  <ion-toolbar>
    <ion-title>My App</ion-title>
  </ion-toolbar>
</ion-header>

<!-- Collapsible large title (iOS) -->
<ion-header collapse="condense">
  <ion-toolbar>
    <ion-title size="large">My App</ion-title>
  </ion-toolbar>
</ion-header>
```

---

## ion-buttons

Container for toolbar buttons with slot-based positioning.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `collapse` | `collapse` | `boolean` | `false` | Collapse buttons on scroll (iOS large title) |

### Slots

- `start` — Left side of toolbar
- `end` — Right side of toolbar
- `primary` — Primary slot (iOS: left, MD: right)
- `secondary` — Secondary slot

### Example

```html
<ion-toolbar>
  <ion-buttons slot="start">
    <ion-back-button></ion-back-button>
  </ion-buttons>
  <ion-title>Settings</ion-title>
  <ion-buttons slot="end">
    <ion-button>Save</ion-button>
  </ion-buttons>
</ion-toolbar>
```

---

## ion-header

Top container for toolbars. Supports translucent and collapsing modes.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `collapse` | `collapse` | `"condense"` | `undefined` | Collapse mode (iOS large title) |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `translucent` | `translucent` | `boolean` | `false` | Translucent background (iOS) |

### Example

```html
<ion-header>
  <ion-toolbar>
    <ion-title>Page Title</ion-title>
  </ion-toolbar>
</ion-header>

<!-- Translucent header -->
<ion-header translucent="true">
  <ion-toolbar>
    <ion-title>Page Title</ion-title>
  </ion-toolbar>
</ion-header>

<!-- Collapsible large title -->
<ion-header collapse="condense">
  <ion-toolbar>
    <ion-title size="large">Page Title</ion-title>
  </ion-toolbar>
</ion-header>
```

---

## ion-footer

Bottom container for toolbars.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `collapse` | `collapse` | `"fade"` | `undefined` | Collapse mode (fade on scroll) |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `translucent` | `translucent` | `boolean` | `false` | Translucent background (iOS) |

### Example

```html
<ion-footer>
  <ion-toolbar>
    <ion-title>Footer</ion-title>
  </ion-toolbar>
</ion-footer>
```

---

## ion-fab

Floating Action Button container. Houses `ion-fab-button` and `ion-fab-list`.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `activated` | `activated` | `boolean` | `false` | Whether FAB list is open |
| `edge` | `edge` | `boolean` | `false` | Position at edge of content |
| `horizontal` | `horizontal` | `"center" \| "end" \| "start"` | `undefined` | Horizontal position |
| `vertical` | `vertical` | `"bottom" \| "center" \| "top"` | `undefined` | Vertical position |

### Methods

- `close()` — Closes the FAB list

### Sub-components

- `ion-fab-button` — Main FAB button
- `ion-fab-list` — List of action buttons that expand from FAB

### Example

```html
<ion-content>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button>
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="top">
      <ion-fab-button>
        <ion-icon name="document"></ion-icon>
      </ion-fab-button>
      <ion-fab-button>
        <ion-icon name="color-palette"></ion-icon>
      </ion-fab-button>
    </ion-fab-list>
  </ion-fab>
</ion-content>
```

---

## ion-item-sliding

Wrapper for `ion-item` that adds swipe-to-reveal action buttons.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |

### Events

- `ionDrag` — Fired during swipe

### Methods

- `open(side)` — Opens sliding options
- `close()` — Closes sliding options
- `closeOpened()` — Closes all opened sliding items
- `getOpenAmount()` — Current open amount in px
- `getSlidingRatio()` — Ratio of open amount

### Sub-components

- `ion-item-options` — Container for option buttons (side: `start` or `end`)
- `ion-item-option` — Individual option button

### Example

```html
<ion-item-sliding>
  <ion-item>
    <ion-label>Swipe me</ion-label>
  </ion-item>
  <ion-item-options side="end">
    <ion-item-option color="danger">
      <ion-icon slot="icon-only" name="trash"></ion-icon>
    </ion-item-option>
    <ion-item-option color="primary">
      <ion-icon slot="icon-only" name="create"></ion-icon>
    </ion-item-option>
  </ion-item-options>
</ion-item-sliding>
```

---

## ion-tab-bar / ion-tab-button

Tab bar container and individual tab buttons.

### ion-tab-bar Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `selectedTab` | `selected-tab` | `string` | `undefined` | Selected tab value |
| `translucent` | `translucent` | `boolean` | `false` | Translucent style (iOS) |

### ion-tab-button Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `download` | `download` | `string` | `undefined` | Download attribute |
| `href` | `href` | `string` | `undefined` | URL for navigation |
| `layout` | `layout` | `"icon-bottom" \| "icon-end" \| "icon-hide" \| "icon-start" \| "icon-top" \| "label-hide"` | `undefined` | Button layout |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `rel` | `rel` | `string` | `undefined` | Link relationship |
| `selected` | `selected` | `boolean` | `false` | Selected state |
| `tab` | `tab` | `string` | `undefined` | Tab value |
| `target` | `target` | `string` | `undefined` | Link target |

### Example

```html
<ion-tab-bar slot="bottom">
  <ion-tab-button tab="home">
    <ion-icon name="home"></ion-icon>
    <ion-label>Home</ion-label>
  </ion-tab-button>
  <ion-tab-button tab="search">
    <ion-icon name="search"></ion-icon>
    <ion-label>Search</ion-label>
  </ion-tab-button>
</ion-tab-bar>
```

---

## ion-route / ion-route-redirect / ion-router-outlet

### ion-route Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `beforeEnter` | — | `(() => Promise<boolean>) \| undefined` | `undefined` | Navigation guard |
| `beforeLeave` | — | `(() => Promise<boolean>) \| undefined` | `undefined` | Navigation guard |
| `component` | `component` | `Function \| HTMLElement \| string` | `undefined` | Component to render |
| `componentProps` | `component-props` | `{ [key: string]: any }` | `undefined` | Props for component |
| `url` | `url` | `string` | `undefined` | URL path |

### ion-route-redirect Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `from` | `from` | `string` | `undefined` | Source URL |
| `to` | `to` | `string` | `undefined` | Target URL |

### ion-router-outlet

Acts as a stack navigator. Renders route components with transitions.

### Example

```html
<ion-router>
  <ion-route url="/" component="home-page"></ion-route>
  <ion-route url="/profile" component="profile-page"></ion-route>
  <ion-route-redirect from="/home" to="/"></ion-route-redirect>
</ion-router>

<ion-router-outlet></ion-router-outlet>
```

---

## ion-menu-button / ion-menu-toggle

### ion-menu-button

Button that toggles a side menu.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `autoHide` | `auto-hide` | `boolean` | `true` | Hide when no menu |
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `menu` | `menu` | `string` | `undefined` | Menu ID |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `type` | `type` | `"button" \| "reset" \| "submit"` | `'button'` | Button type |

### ion-menu-toggle

Wrapper that toggles menu on click.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `autoHide` | `auto-hide` | `boolean` | `true` | Hide when no menu |
| `menu` | `menu` | `string` | `undefined` | Menu ID |

### Example

```html
<ion-toolbar>
  <ion-buttons slot="start">
    <ion-menu-button></ion-menu-button>
  </ion-buttons>
</ion-toolbar>

<!-- Menu toggle wrapper -->
<ion-menu-toggle menu="start" auto-hide="false">
  <ion-button>Toggle Menu</ion-button>
</ion-menu-toggle>
```

---

## ion-list-header

Header for grouping list items.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `lines` | `lines` | `"full" \| "inset" \| "none"` | `undefined` | Border lines |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |

### Example

```html
<ion-list>
  <ion-list-header>
    <ion-label>Section 1</ion-label>
  </ion-list-header>
  <ion-item>Item 1</ion-item>
  <ion-item>Item 2</ion-item>
</ion-list>
```

---

## ion-item-divider

Visual divider between groups of items.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `sticky` | `sticky` | `boolean` | `false` | Sticky positioning |

### Example

```html
<ion-list>
  <ion-item-divider>
    <ion-label>Group A</ion-label>
  </ion-item-divider>
  <ion-item>Item 1</ion-item>
  <ion-item-divider>
    <ion-label>Group B</ion-label>
  </ion-item-divider>
  <ion-item>Item 2</ion-item>
</ion-list>
```

---

## ion-input-password-toggle

Toggle button for showing/hiding password in `ion-input`.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `hideIcon` | `hide-icon` | `string` | `eyeOff` | Icon for hide state |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `showIcon` | `show-icon` | `string` | `eye` | Icon for show state |

### Example

```html
<ion-input type="password">
  <ion-input-password-toggle slot="end"></ion-input-password-toggle>
</ion-input>
```

---

## ion-input-otp

One-time password input component.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `color` | `color` | `Color` | `undefined` | Color from palette |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `inputmode` | `inputmode` | `"numeric" \| "text"` | `'numeric'` | Virtual keyboard type |
| `length` | `length` | `number` | `6` | Number of input boxes |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `value` | `value` | `string` | `undefined` | OTP value |

### Example

```html
<ion-input-otp length="6"></ion-input-otp>
```

---

## ion-accordion-group

Container for managing multiple `ion-accordion` elements.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `disabled` | `disabled` | `boolean` | `false` | Disable all accordions |
| `expand` | `expand` | `"compact" \| "inset"` | `'compact'` | Expansion style |
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |
| `multiple` | `multiple` | `boolean` | `false` | Allow multiple open |
| `readonly` | `readonly` | `boolean` | `false` | Read-only |
| `value` | `value` | `string \| string[]` | `undefined` | Open accordion value(s) |

### Events

- `ionChange` — Fired when accordion opens/closes

### Example

```html
<ion-accordion-group multiple="true">
  <ion-accordion value="a">
    <ion-item slot="header"><ion-label>Section A</ion-label></ion-item>
    <div slot="content">Content A</div>
  </ion-accordion>
  <ion-accordion value="b">
    <ion-item slot="header"><ion-label>Section B</ion-label></ion-item>
    <div slot="content">Content B</div>
  </ion-accordion>
</ion-accordion-group>
```

---

## ion-select-option

Option element used inside `ion-select`.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `value` | `value` | `any` | `undefined` | Option value |

### Example

```html
<ion-select>
  <ion-select-option value="apple">Apple</ion-select-option>
  <ion-select-option value="banana">Banana</ion-select-option>
</ion-select>
```

---

## ion-picker

Column-based picker component for selecting values from multiple columns. Often used inside a modal.

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `mode` | `mode` | `"ios" \| "md"` | `undefined` | Platform mode |

### Events

- `ionChange` — Fired when a column value changes

### Methods

- `dismiss()` — Dismiss the picker
- `onDidDismiss()` — Promise resolved on dismiss
- `onWillDismiss()` — Promise resolved before dismiss
- `present()` — Present the picker

### Sub-components

- `ion-picker-column` — Individual column in the picker
- `ion-picker-column-option` — Option within a column

### Example

```html
<ion-picker>
  <ion-picker-column>
    <ion-picker-column-option value="apple">Apple</ion-picker-column-option>
    <ion-picker-column-option value="banana">Banana</ion-picker-column-option>
  </ion-picker-column>
  <ion-picker-column>
    <ion-picker-column-option value="1">1</ion-picker-column-option>
    <ion-picker-column-option value="2">2</ion-picker-column-option>
  </ion-picker-column>
</ion-picker>
```
