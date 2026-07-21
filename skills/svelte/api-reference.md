# Svelte 5 — API Reference

> Source: [svelte](https://svelte.dev/docs/svelte/svelte) | [svelte/action](https://svelte.dev/docs/svelte/svelte-action) | [svelte/animate](https://svelte.dev/docs/svelte/svelte-animate) | [svelte/attachments](https://svelte.dev/docs/svelte/svelte-attachments) | [svelte/compiler](https://svelte.dev/docs/svelte/svelte-compiler) | [svelte/easing](https://svelte.dev/docs/svelte/svelte-easing) | [svelte/events](https://svelte.dev/docs/svelte/svelte-events) | [svelte/legacy](https://svelte.dev/docs/svelte/svelte-legacy) | [svelte/motion](https://svelte.dev/docs/svelte/svelte-motion) | [svelte/reactivity](https://svelte.dev/docs/svelte/svelte-reactivity) | [svelte/server](https://svelte.dev/docs/svelte/svelte-server) | [svelte/store](https://svelte.dev/docs/svelte/svelte-store) | [svelte/transition](https://svelte.dev/docs/svelte/svelte-transition) | [Compiler Errors](https://svelte.dev/docs/svelte/compiler-errors) | [Compiler Warnings](https://svelte.dev/docs/svelte/compiler-warnings) | [Runtime Errors](https://svelte.dev/docs/svelte/runtime-errors) | [Runtime Warnings](https://svelte.dev/docs/svelte/runtime-warnings)

## svelte

### Component APIs

| Export | Description |
|--------|-------------|
| `mount(Component, options)` | Mount a component to a DOM element |
| `unmount(component)` | Unmount a mounted component |
| `hydrate(Component, options)` | Hydrate server-rendered HTML |
| `render(Component, options)` | SSR: render component to string (from `svelte/server`) |
| `flushSync(fn)` | Flush all pending effects synchronously |
| `tick()` | Promise that resolves after DOM updates |
| `untrack(fn)` | Run function without tracking dependencies |
| `fork()` | Create a new async tracking context |
| `settled()` | Wait for all async operations to settle |
| `getAbortSignal()` | Get an AbortSignal for the current reactive scope |

### Lifecycle

| Export | Description |
|--------|-------------|
| `onMount(fn)` | Run after component mounts (browser only) |
| `onDestroy(fn)` | Run when component is destroyed |
| `beforeUpdate(fn)` | Deprecated — run before DOM update |
| `afterUpdate(fn)` | Deprecated — run after DOM update |

### Context

| Export | Description |
|--------|-------------|
| `createContext<T>()` | Create a `[get, set]` context pair (5.40+) |
| `setContext(key, value)` | Set context value for descendants |
| `getContext(key)` | Get context value from ancestors |
| `hasContext(key)` | Check if context key exists |
| `getAllContexts()` | Get all context entries |

### Types

| Export | Description |
|--------|-------------|
| `Component` | Type for Svelte 5 components |
| `ComponentConstructorOptions` | Legacy component constructor options |
| `SvelteComponent` | Legacy component base class |
| `SvelteComponentTyped` | Deprecated typed component base |
| `Snippet` | Type for snippet functions |
| `ComponentProps<T>` | Extract props type from component |
| `ComponentEvents<T>` | Deprecated — extract events type |
| `ComponentType<T>` | Deprecated — component constructor type |
| `EventDispatcher` | Deprecated — event dispatcher type |
| `MountOptions` | Options for `mount()` |
| `Fork` | Type for async fork context |
| `ComponentInternals` | Internal component type |

### Other

| Export | Description |
|--------|-------------|
| `createEventDispatcher()` | Deprecated — create event dispatcher (Svelte 4) |
| `createRawSnippet(fn)` | Create snippet programmatically |
| `hydratable(data)` | Mark data as hydratable |

See: [svelte](https://svelte.dev/docs/svelte/svelte)

## svelte/action

Types for actions (superseded by attachments).

| Export | Description |
|--------|-------------|
| `Action<P, A>` | Action type with parameters and attributes |
| `ActionReturn<P>` | Return type of action with `update`/`destroy` |

See: [svelte/action](https://svelte.dev/docs/svelte/svelte-action)

## svelte/animate

| Export | Description |
|--------|-------------|
| `flip(node, { from, to }, params)` | FLIP animation for list reordering |
| `AnimationConfig` | Type for animation config |
| `FlipParams` | Type for flip params (delay, duration, easing) |

See: [svelte/animate](https://svelte.dev/docs/svelte/svelte-animate)

## svelte/attachments

| Export | Description |
|--------|-------------|
| `createAttachmentKey()` | Create a unique attachment key |
| `fromAction(action)` | Convert a Svelte 4 action to attachment |
| `Attachment` | Type for attachment objects |

See: [svelte/attachments](https://svelte.dev/docs/svelte/svelte-attachments)

## svelte/compiler

| Export | Description |
|--------|-------------|
| `VERSION` | Current Svelte compiler version |
| `compile(source, options)` | Compile Svelte component source to JS |
| `compileModule(source, options)` | Compile `.svelte.js`/`.svelte.ts` module |
| `migrate(source, { migration })` | Migrate code (e.g. svelte-5 migration) |
| `parse(source, options)` | Parse component to AST |
| `parseCss(source)` | Parse CSS from component |
| `preprocess(source, preprocessor, options)` | Run preprocessors on component |
| `print(ast, options)` | Print AST back to source code |
| `walk(ast, visitors)` | Walk AST with visitor functions |

### Types

| Export | Description |
|--------|-------------|
| `CompileOptions` | Options for `compile()` |
| `ModuleCompileOptions` | Options for `compileModule()` |
| `CompileResult` | Result of compilation |
| `CompileError` | Compilation error type |
| `Warning` | Warning type |
| `AST` | AST node types |
| `Processed` | Result of preprocessing |
| `Preprocessor` / `PreprocessorGroup` | Preprocessor types |
| `MarkupPreprocessor` | Markup preprocessor type |

See: [svelte/compiler](https://svelte.dev/docs/svelte/svelte-compiler)

## svelte/easing

30 easing functions:

| Category | Functions |
|----------|-----------|
| **Back** | `backIn`, `backInOut`, `backOut` |
| **Bounce** | `bounceIn`, `bounceInOut`, `bounceOut` |
| **Circ** | `circIn`, `circInOut`, `circOut` |
| **Cubic** | `cubicIn`, `cubicInOut`, `cubicOut` |
| **Elastic** | `elasticIn`, `elasticInOut`, `elasticOut` |
| **Expo** | `expoIn`, `expoInOut`, `expoOut` |
| **Linear** | `linear` |
| **Quad** | `quadIn`, `quadInOut`, `quadOut` |
| **Quart** | `quartIn`, `quartInOut`, `quartOut` |
| **Quint** | `quintIn`, `quintInOut`, `quintOut` |
| **Sine** | `sineIn`, `sineInOut`, `sineOut` |

See: [svelte/easing](https://svelte.dev/docs/svelte/svelte-easing)

## svelte/events

| Export | Description |
|--------|-------------|
| `on(target, type, handler, options)` | Add event listener with automatic cleanup |

See: [svelte/events](https://svelte.dev/docs/svelte/svelte-events)

## svelte/legacy

Legacy exports for Svelte 4 compatibility:

| Export | Description |
|--------|-------------|
| `asClassComponent(component)` | Wrap as class component |
| `createBubbler()` | Create event bubbling function |
| `createClassComponent(Component, options)` | Create class-style component |
| `run(fn)` | Run legacy reactive block |
| `handlers` | Event modifier handlers |
| `nonpassive` / `once` / `passive` / `preventDefault` / `self` / `stopImmediatePropagation` / `stopPropagation` / `trusted` | Event modifiers |
| `LegacyComponentType` | Type for legacy components |

See: [svelte/legacy](https://svelte.dev/docs/svelte/svelte-legacy)

## svelte/motion

### spring

```js
import { spring } from 'svelte/motion';
const values = spring({ x: 0, y: 0 }, { stiffness: 0.15, damping: 0.8 });
values.set({ x: 100, y: 50 });
```

### tweened

```js
import { tweened } from 'svelte/motion';
const progress = tweened(0, { duration: 400, easing: cubicOut });
progress.set(1);
```

### prefersReducedMotion

```js
import { prefersReducedMotion } from 'svelte/motion';
const reduced = prefersReducedMotion();
// $reduced === true if user prefers reduced motion
```

### Types

`Spring`, `SpringOptions`, `SpringUpdateOptions`, `Tween`, `TweenOptions`, `Tweened`, `Updater`

See: [svelte/motion](https://svelte.dev/docs/svelte/svelte-motion)

## svelte/reactivity

Reactive built-in classes that work with runes:

| Export | Description |
|--------|-------------|
| `MediaQuery(query)` | Reactive media query |
| `SvelteDate()` | Reactive Date |
| `SvelteMap()` | Reactive Map |
| `SvelteSet()` | Reactive Set |
| `SvelteURL()` | Reactive URL |
| `SvelteURLSearchParams()` | Reactive URLSearchParams |
| `createSubscriber(subscribe)` | Create reactive subscriber for external state |

### svelte/reactivity/window

Reactive window properties: `devicePixelRatio`, `innerHeight`, `innerWidth`, `online`, `outerHeight`, `outerWidth`, `screenLeft`, `screenTop`, `scrollX`, `scrollY`

See: [svelte/reactivity](https://svelte.dev/docs/svelte/svelte-reactivity)

## svelte/server

| Export | Description |
|--------|-------------|
| `render(Component, options)` | Render component to HTML string |

See: [svelte/server](https://svelte.dev/docs/svelte/svelte-server)

## svelte/store

| Export | Description |
|--------|-------------|
| `writable(value, start)` | Create writable store |
| `readable(value, start)` | Create readable store |
| `derived(stores, fn, initial)` | Create derived store |
| `readonly(store)` | Make store read-only |
| `get(store)` | Get current store value |
| `fromStore(store)` | Convert store to runes-compatible |
| `toStore(state)` | Convert runes state to store |

### Types

`Readable`, `Writable`, `StartStopNotifier`, `Subscriber`, `Unsubscriber`, `Updater`

See: [svelte/store](https://svelte.dev/docs/svelte/svelte-store)

## svelte/transition

### Built-in Transitions

| Export | Parameters |
|--------|------------|
| `fade(node, params)` | `delay`, `duration`, `easing` |
| `fly(node, params)` | `delay`, `duration`, `easing`, `x`, `y`, `opacity` |
| `slide(node, params)` | `delay`, `duration`, `easing`, `axis` |
| `blur(node, params)` | `delay`, `duration`, `easing`, `opacity`, `amount` |
| `scale(node, params)` | `delay`, `duration`, `easing`, `start`, `opacity` |
| `draw(node, params)` | `delay`, `duration`, `easing`, `speed` |
| `crossfade({ fallback, ... })` | Returns `in` and `out` transition functions |

### Types

`TransitionConfig`, `BlurParams`, `FadeParams`, `FlyParams`, `SlideParams`, `ScaleParams`, `DrawParams`, `CrossfadeParams`, `EasingFunction`

See: [svelte/transition](https://svelte.dev/docs/svelte/svelte-transition)

## Compiler Errors

100+ compiler error codes including:

`animation_duplicate`, `animation_invalid_placement`, `animation_missing_key`, `attribute_duplicate`, `attribute_empty_shorthand`, `bind_group_invalid_expression`, `bind_invalid_target`, `bindable_invalid_location`, `block_duplicate_clause`, `block_invalid_continuation_placement`, `block_unclosed`, `component_invalid_directive`, `const_tag_cycle`, `const_tag_invalid_placement`, `css_empty_declaration`, `css_global_invalid_selector`, `css_selector_invalid`, `debug_tag_invalid_arguments`, `directive_invalid_value`, `directive_missing_name`, `dollar_prefix_invalid`, `duplicate_class_field`, `each_key_without_as`, `effect_invalid_placement`, `element_invalid_closing_tag`, `element_unclosed`, `event_handler_invalid_component_modifier`, `expected_attribute_value`, `expected_block_type`, `expected_token`, `export_undefined`, `global_reference_invalid`, `host_invalid_placement`, `illegal_await_expression`, `import_svelte_internal_forbidden`, `invalid_arguments_usage`, `js_parse_error`, `legacy_export_invalid`, `legacy_props_invalid`, `legacy_reactive_statement_invalid`, `mixed_event_handler_syntaxes`, `module_illegal_default_export`, `node_invalid_placement`, `options_invalid_value`, `options_removed`, `props_duplicate`, `props_illegal_name`, `props_invalid_placement`, `reactive_declaration_cycle`, `render_tag_invalid_expression`, `rune_invalid_arguments`, `rune_invalid_name`, `rune_invalid_usage`, `rune_missing_parentheses`, `rune_removed`, `rune_renamed`, `script_duplicate`, `slot_attribute_invalid`, `slot_element_invalid_attribute`, `snippet_conflict`, `snippet_invalid_export`, `state_field_duplicate`, `state_invalid_export`, `state_invalid_placement`, `store_invalid_subscription`, `style_directive_invalid_modifier`, `svelte_body_illegal_attribute`, `svelte_boundary_invalid_attribute`, `svelte_component_missing_this`, `svelte_element_missing_this`, `svelte_head_illegal_attribute`, `svelte_meta_invalid_placement`, `svelte_options_invalid_attribute`, `tag_invalid_name`, `transition_conflict`, `transition_duplicate`, `void_element_invalid_content`

See: [Compiler Errors](https://svelte.dev/docs/svelte/compiler-errors)

## Compiler Warnings

100+ compiler warning codes including:

**A11y warnings**: `a11y_accesskey`, `a11y_aria_attributes`, `a11y_autofocus`, `a11y_click_events_have_key_events`, `a11y_distracting_elements`, `a11y_hidden`, `a11y_img_redundant_alt`, `a11y_incorrect_aria_attribute_type`, `a11y_interactive_supports_focus`, `a11y_label_has_associated_control`, `a11y_media_has_caption`, `a11y_misplaced_role`, `a11y_missing_attribute`, `a11y_missing_content`, `a11y_no_abstract_role`, `a11y_no_noninteractive_tabindex`, `a11y_no_redundant_roles`, `a11y_positive_tabindex`, `a11y_role_has_required_aria_props`, `a11y_unknown_aria_attribute`, `a11y_unknown_role`

**Other warnings**: `attribute_avoid_is`, `attribute_global_event_reference`, `attribute_illegal_colon`, `attribute_invalid_property_name`, `attribute_quoted`, `bidirectional_control_characters`, `block_empty`, `component_name_lowercase`, `css_unused_selector`, `element_invalid_self_closing_tag`, `event_directive_deprecated`, `export_let_unused`, `legacy_code`, `legacy_component_creation`, `non_reactive_update`, `options_deprecated_accessors`, `perf_avoid_inline_class`, `perf_avoid_nested_class`, `reactive_declaration_invalid_placement`, `script_context_deprecated`, `slot_element_deprecated`, `state_referenced_locally`, `store_rune_conflict`, `svelte_component_deprecated`, `svelte_self_deprecated`

See: [Compiler Warnings](https://svelte.dev/docs/svelte/compiler-warnings)

## Runtime Errors

### Client Errors

`async_derived_orphan`, `bind_invalid_checkbox_value`, `bind_invalid_export`, `bind_not_bindable`, `component_api_changed`, `component_api_invalid_new`, `derived_references_self`, `each_key_duplicate`, `each_key_volatile`, `effect_in_teardown`, `effect_in_unowned_derived`, `effect_orphan`, `effect_pending_outside_reaction`, `effect_update_depth_exceeded`, `flush_sync_in_effect`, `fork_discarded`, `fork_timing`, `get_abort_signal_outside_reaction`, `hydration_failed`, `invalid_snippet`, `lifecycle_legacy_only`, `props_invalid_value`, `props_rest_readonly`, `rune_outside_svelte`, `set_context_after_init`, `state_descriptors_fixed`, `state_prototype_fixed`, `state_unsafe_mutation`, `svelte_boundary_reset_onerror`

### Server Errors

`async_local_storage_unavailable`, `await_invalid`, `dynamic_element_invalid_tag`, `html_deprecated`, `hydratable_clobbering`, `hydratable_serialization_failed`, `invalid_csp`, `invalid_id_prefix`, `lifecycle_function_unavailable`, `server_context_required`

### Shared Errors

`experimental_async_required`, `invalid_default_snippet`, `invalid_snippet_arguments`, `invariant_violation`, `lifecycle_outside_component`, `missing_context`, `snippet_without_render_tag`, `store_invalid_shape`, `svelte_element_invalid_this_value`

See: [Runtime Errors](https://svelte.dev/docs/svelte/runtime-errors)

## Runtime Warnings

### Client Warnings

`assignment_value_stale`, `await_reactivity_loss`, `await_waterfall`, `binding_property_non_reactive`, `console_log_state`, `derived_inert`, `event_handler_invalid`, `hydration_mismatch`, `invalid_raw_snippet_render`, `lifecycle_double_unmount`, `ownership_invalid_binding`, `ownership_invalid_mutation`, `select_multiple_invalid_value`, `state_proxy_equality_mismatch`, `state_proxy_unmount`, `svelte_boundary_reset_noop`, `transition_slide_display`

### Shared Warnings

`dynamic_void_element_content`, `state_snapshot_uncloneable`

See: [Runtime Warnings](https://svelte.dev/docs/svelte/runtime-warnings)

**Source**: [svelte](https://svelte.dev/docs/svelte/svelte) | [svelte/action](https://svelte.dev/docs/svelte/svelte-action) | [svelte/animate](https://svelte.dev/docs/svelte/svelte-animate) | [svelte/attachments](https://svelte.dev/docs/svelte/svelte-attachments) | [svelte/compiler](https://svelte.dev/docs/svelte/svelte-compiler) | [svelte/easing](https://svelte.dev/docs/svelte/svelte-easing) | [svelte/events](https://svelte.dev/docs/svelte/svelte-events) | [svelte/legacy](https://svelte.dev/docs/svelte/svelte-legacy) | [svelte/motion](https://svelte.dev/docs/svelte/svelte-motion) | [svelte/reactivity](https://svelte.dev/docs/svelte/svelte-reactivity) | [svelte/reactivity/window](https://svelte.dev/docs/svelte/svelte-reactivity-window) | [svelte/server](https://svelte.dev/docs/svelte/svelte-server) | [svelte/store](https://svelte.dev/docs/svelte/svelte-store) | [svelte/transition](https://svelte.dev/docs/svelte/svelte-transition) | [Compiler Errors](https://svelte.dev/docs/svelte/compiler-errors) | [Compiler Warnings](https://svelte.dev/docs/svelte/compiler-warnings) | [Runtime Errors](https://svelte.dev/docs/svelte/runtime-errors) | [Runtime Warnings](https://svelte.dev/docs/svelte/runtime-warnings)
