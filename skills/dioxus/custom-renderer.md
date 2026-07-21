# Custom Renderer

> **Source:** [https://dioxuslabs.com/learn/0.7/guides/depth/custom_renderer](https://dioxuslabs.com/learn/0.7/guides/depth/custom_renderer)

Dioxus is designed to be renderer-agnostic. The VirtualDOM produces mutations (templates and edits) that any renderer can apply to a target UI system.

## The Specifics

A custom renderer needs to handle:

1. **Templates** — Static UI structures with placeholders for dynamic content
2. **Mutations** — Edits applied to the UI (append, replace, remove, etc.)
3. **Node storage** — Mapping ElementIds to real nodes
4. **Event loop** — Processing user input and VirtualDOM events

## Templates

RSX is compiled into static templates with dynamic placeholders. A template contains:
- **Root nodes:** The static structure (elements, text)
- **Node paths:** Paths to dynamic nodes within the template
- **Attr paths:** Paths to dynamic attributes within the template

```rust
// This RSX:
// rsx! { h1 { "count: {x}" } }

// Generates a template like:
Template {
    name: "main.rs:1:1:0",
    roots: &[
        TemplateNode::Element {
            tag: "h1",
            namespace: None,
            attrs: &[],
            children: &[
                TemplateNode::DynamicText { id: 0 },
            ],
        }
    ],
    node_paths: &[
        &[0, 0],  // path to dynamic node with id 0
    ],
    attr_paths: &[],
}
```

The template is sent to the renderer the first time it's used. The renderer should clone the template and store it at the given id. For dynamic nodes, create placeholder nodes that can be modified later.

## Mutations

The renderer processes mutations from the VirtualDOM:

1. **LoadTemplate** — Load a root from a template, push onto stack, store with an id
2. **HydrateText** — Replace a placeholder text node with actual text
3. **AppendChildren** — Move nodes from the stack to a parent
4. **ReplaceWith** — Replace a node with a new one
5. **InsertAfter** — Insert a node after another
6. **InsertBefore** — Insert a node before another
7. **Remove** — Remove a node from the tree

### Example Mutation Flow

Starting state:
```
instructions: []
stack: [RootNode]
nodes: [RootNode]
```

After LoadTemplate:
```
instructions: [LoadTemplate { name: "main.rs:1:1:0", index: 0, id: ElementId(1) }]
stack: [RootNode, <h1>""</h1>]
nodes: [RootNode, <h1>""</h1>]
```

After HydrateText:
```
instructions: [HydrateText { path: [0, 0], value: "count: 0" }]
// The placeholder text node in <h1> is replaced with "count: 0"
```

## Node Storage

The renderer maintains:
- A **stack** for nodes being built (children are pushed, then popped to parents)
- A **node map** from `ElementId` to the actual node, for later mutations

## Event Loop

Dioxus relies on an event loop to progress the VirtualDOM. The renderer must:
1. Wait for user input events (clicks, keyboard, etc.)
2. Wait for internal VirtualDOM events (state changes, async completions)
3. Apply mutations from the VirtualDOM
4. Forward user events to the VirtualDOM

```rust
pub async fn run(&mut self) -> dioxus_core::error::Result<()> {
    let mut websys_dom = WebsysDom::new(prepare_websys_dom());
    websys_dom.stack.push(root_node);

    let mutations = self.internal_dom.rebuild();
    websys_dom.apply_mutations(mutations);

    loop {
        let user_input_future = websys_dom.wait_for_event();
        let internal_event_future = self.internal_dom.wait_for_work();

        match select(user_input_future, internal_event_future).await {
            Either::Left((_, _)) => {
                let mutations = self.internal_dom.work_with_deadline(|| false);
                websys_dom.apply_mutations(mutations);
            }
            Either::Right((event, _)) => websys_dom.handle_event(event),
        }
    }
}
```

### Event Translation

Decode real DOM events into Dioxus `UserEvent` types:

```rust
fn virtual_event_from_websys_event(event: &web_sys::Event) -> VirtualEvent {
    match event.type_().as_str() {
        "keydown" => {
            let event: web_sys::KeyboardEvent = event.clone().dyn_into().unwrap();
            UserEvent::KeyboardEvent(UserEvent {
                scope_id: None,
                priority: EventPriority::Medium,
                name: "keydown",
                element: Some(ElementId(0)),
                data: Arc::new(KeyboardData {
                    char_code: event.char_code(),
                    key: event.key(),
                    key_code: event.key_code(),
                    alt_key: event.alt_key(),
                    ctrl_key: event.ctrl_key(),
                    meta_key: event.meta_key(),
                    shift_key: event.shift_key(),
                    location: event.location(),
                    repeat: event.repeat(),
                    which: event.which(),
                })
            })
        }
        _ => todo!()
    }
}
```

## Custom Raw Elements

If you need custom elements/attributes for your renderer, you can drop in your own elements. All attributes and listeners for the HTML and SVG namespace are shuttled through helper structs that compile away.

For more information on creating custom namespaces, see the [dioxus_html crate](https://github.com/DioxusLabs/dioxus/blob/main/packages/html/README.md).

## Conclusion

With templates, mutations, node storage, and an event loop, you have the knowledge to implement a custom renderer. Possible use cases include:
- Custom desktop renderers
- Mobile renderers
- Video game UI
- Augmented reality interfaces
