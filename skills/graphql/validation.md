# Validation

Before execution, GraphQL validates every query against the schema. If a query is invalid, it is rejected before any resolvers run.

## When Validation Happens

```
Client sends query
       │
       ▼
   ┌────────┐
   │ Parse  │  ──▶ Parse error? → Return error (no execution)
   └────┬───┘
        ▼
   ┌──────────┐
   │ Validate │  ──▶ Validation error? → Return error (no execution)
   └────┬─────┘
        ▼
   ┌──────────┐
   │ Execute  │  ──▶ Field error? → Return partial data + errors
   └──────────┘
```

## Validation Rules

The GraphQL specification defines numerous validation rules. Here are the key ones:

### 1. Requesting Non-Existent Fields

A field must be defined on the relevant type:

```graphql
# INVALID — favoriteSpaceship doesn't exist on Character
{
  hero {
    favoriteSpaceship
  }
}
```

### 2. Selection Sets on Leaf Fields

Non-scalar/enum fields require a selection set:

```graphql
# INVALID — Character is an object type, needs sub-fields
{
  hero
}
```

```graphql
# VALID
{
  hero {
    name
  }
}
```

Scalar/enum fields cannot have selection sets:

```graphql
# INVALID — name is a String (scalar), can't have sub-fields
{
  hero {
    name {
      first
    }
  }
}
```

### 3. Fragments for Abstract Types

When querying Interface or Union types, you can only request shared fields directly. Type-specific fields require fragments:

```graphql
# INVALID — primaryFunction is on Droid, not on Character
{
  hero {
    name
    primaryFunction
  }
}
```

```graphql
# VALID — inline fragment with type condition
{
  hero {
    name
    ... on Droid {
      primaryFunction
    }
  }
}
```

```graphql
# VALID — named fragment
{
  hero {
    name
    ...droidFields
  }
}

fragment droidFields on Droid {
  primaryFunction
}
```

### 4. Cyclic Fragment Spreads

Fragments cannot refer to themselves directly or indirectly:

```graphql
# INVALID — cyclic fragment
fragment cyclicFragment on Character {
  name
  ...cyclicFragment
}
```

```graphql
# INVALID — indirect cycle
fragment fragmentA on Character {
  name
  ...fragmentB
}

fragment fragmentB on Character {
  name
  ...fragmentA
}
```

### 5. Variable Type Compatibility

Variables must match the type of their corresponding arguments:

```graphql
# INVALID — $episode is String but hero expects Episode
query ($episode: String) {
  hero(episode: $episode) {
    name
  }
}
```

```graphql
# VALID
query ($episode: Episode) {
  hero(episode: $episode) {
    name
  }
}
```

### 6. Required Arguments

Non-Null arguments must be provided:

```graphql
# INVALID — id is required (ID!)
{
  human {
    name
  }
}
```

```graphql
# VALID
{
  human(id: "1000") {
    name
  }
}
```

### 7. Unknown Directives

Only defined directives can be used:

```graphql
# INVALID — @custom not defined
{
  hero @custom {
    name
  }
}
```

### 8. Directive Locations

Directives must be used in valid locations:

```graphql
# INVALID — @include can't be on a type definition
type User @include(if: true) {
  name: String
}
```

## Validation Error Format

```json
{
  "errors": [
    {
      "message": "Cannot query field \"favoriteSpaceship\" on type \"Character\".",
      "locations": [
        {
          "line": 3,
          "column": 5
        }
      ],
      "extensions": {
        "code": "GRAPHQL_VALIDATION_FAILED"
      }
    }
  ]
}
```

Note: When a validation error occurs, the `data` key is **not** included in the response because execution never begins.

## Common Validation Scenarios

### Missing Required Argument

```graphql
# Schema: type Query { human(id: ID!): Human }

# INVALID
query { human { name } }

# VALID
query { human(id: "1000") { name } }
```

### Wrong Enum Value

```graphql
# Schema: enum Episode { NEWHOPE EMPIRE JEDI }

# INVALID
query { hero(episode: CLONE_WARS) { name } }

# VALID
query { hero(episode: EMPIRE) { name } }
```

### Fragment on Wrong Type

```graphql
# INVALID — fragment on Starship can't be spread inside Character
{
  hero {
    ...starshipFields
  }
}

fragment starshipFields on Starship {
  name
  length
}
```

### Variable Not Declared

```graphql
# INVALID — $episode used but not declared
query GetHero {
  hero(episode: $episode) {
    name
  }
}
```

```graphql
# VALID
query GetHero($episode: Episode) {
  hero(episode: $episode) {
    name
  }
}
```

## List of All Spec Validation Rules

The GraphQL specification includes these validation rules (among others):

1. **Executable Definitions** — only executable definitions allowed in operations
2. **Operation Name Uniqueness** — multiple operations must have unique names
3. **Field Selection Merging** — same fields with same args merge into one
4. **Arguments of Correct Type** — arguments match their types
5. **Variables Are Input Types** — variables must be input types
6. **Leaf Field Selections** — scalars/enums must be leaf, objects need selection sets
7. **Fragments on Composite Types** — fragments can only be on unions/interfaces/objects
8. **Variables in Allowed Position** — variable types must be compatible
9. **No Undefined Variables** — all variables must be declared
10. **No Unused Variables** — all declared variables must be used
11. **No Undefined Fragments** — all referenced fragments must exist
12. **No Unused Fragments** — all defined fragments must be used
13. **Fragments Must Be Used** — fragment spreads must be valid
14. **Fragment Name Uniqueness** — fragment names must be unique
15. **Possible Fragment Spreads** — fragment type must be applicable
16. **No Cyclic Fragments** — no fragment cycles
17. **Unique Argument Names** — no duplicate arguments
18. **Unique Directive Names** — no duplicate directives per location
19. **Known Directives** — only defined directives
20. **Directives in Valid Locations** — directives used where allowed
21. **Variables as Function Arguments** — variable usage rules
22. **Scalar/Enum Leaf Rule** — composite types need sub-selections
23. **Input Object Field Names** — input fields must exist
24. **Input Object Field Uniqueness** — no duplicate input fields
