# Queries

Queries are the primary way to read data from a GraphQL API. They start at the root Query type and traverse fields down to leaf scalar values.

## Fields

At its simplest, a GraphQL query asks for specific fields on objects:

```graphql
{
  hero {
    name
  }
}
```

Response:

```json
{
  "data": {
    "hero": {
      "name": "R2-D2"
    }
  }
}
```

Fields can return objects, allowing nested traversal:

```graphql
{
  hero {
    name
    friends {
      name
    }
  }
}
```

GraphQL queries look the same for single items or lists — the schema determines which.

## Arguments

Every field and nested object can have its own set of arguments:

```graphql
{
  human(id: "1000") {
    name
    height(unit: FOOT)
  }
}
```

Unlike REST (single set of query parameters), GraphQL allows arguments on every field:

```graphql
{
  empireHero: hero(episode: EMPIRE) {
    name
  }
  jediHero: hero(episode: JEDI) {
    name
  }
}
```

## Operation Type and Name

Using the shorthand syntax (omitting `query` keyword) works for simple queries. For production, use explicit operation type and name:

```graphql
query HeroNameAndFriends {
  hero {
    name
    friends {
      name
    }
  }
}
```

- **Operation type**: `query`, `mutation`, or `subscription`
- **Operation name**: meaningful name for debugging and server-side logging
- Operation type is required for mutations and subscriptions
- Operation name is required when sending multiple operations in one document

## Aliases

Aliases let you rename the result of a field, enabling querying the same field with different arguments:

```graphql
{
  empireHero: hero(episode: EMPIRE) {
    name
  }
  jediHero: hero(episode: JEDI) {
    name
  }
}
```

Response:

```json
{
  "data": {
    "empireHero": { "name": "Luke Skywalker" },
    "jediHero": { "name": "R2-D2" }
  }
}
```

## Variables

Variables factor dynamic values out of the query string. Three steps:

1. Replace the static value with `$variableName`
2. Declare `$variableName` in the operation
3. Pass `variableName: value` in a separate variables dictionary

```graphql
query HeroNameAndFriends($episode: Episode) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```

Variables dictionary (JSON):

```json
{
  "episode": "JEDI"
}
```

### Variable Definitions

Variable definitions are in the operation signature:

```graphql
query Hero(
  $episode: Episode
  $withFriends: Boolean!
) {
  hero(episode: $episode) {
    name
    friends @include(if: $withFriends) {
      name
    }
  }
}
```

### Default Variable Values

```graphql
query Hero($episode: Episode = JEDI) {
  hero(episode: $episode) {
    name
  }
}
```

### Variable Rules

- Must be declared in the operation
- Operation type and name required when using variables
- Never use string interpolation to construct queries from user-supplied values
- Variables can be used in fragment definitions too

## Fragments

Fragments are reusable units of fields. Useful for splitting complicated data requirements into smaller chunks:

```graphql
query HeroComparison($first: Int = 3) {
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  friendsConnection(first: $first) {
    totalCount
    edges {
      node {
        name
      }
    }
  }
}
```

### Using Variables Inside Fragments

Fragments can access variables declared in the operation:

```graphql
query UserWithFriends($friendCount: Int = 5) {
  user {
    ...userFields
  }
}

fragment userFields on User {
  name
  friends(first: $friendCount) {
    name
  }
}
```

## Inline Fragments

Used to access fields on concrete types when querying Interface or Union types:

```graphql
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    ... on Droid {
      primaryFunction
    }
    ... on Human {
      height
    }
  }
}
```

- `... on Droid` — type condition, only executes if the returned Character is a Droid
- Named fragments can also be used with type conditions

## Meta Fields

`__typename` is a meta-field available on every Object type, returning the type name:

```graphql
{
  search(text: "an") {
    __typename
    ... on Human {
      name
    }
    ... on Droid {
      name
    }
    ... on Starship {
      name
    }
  }
}
```

Response:

```json
{
  "data": {
    "search": [
      { "__typename": "Human", "name": "Han Solo" },
      { "__typename": "Human", "name": "Leia Organa" },
      { "__typename": "Starship", "name": "TIE Advanced x1" }
    ]
  }
}
```

All field names starting with `__` are reserved by GraphQL. Other meta-fields: `__schema` and `__type` (for introspection).

## Directives

Directives dynamically change the structure and shape of queries using variables.

### Built-in Directives

```graphql
query Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) {
    name
    friends @include(if: $withFriends) {
      name
    }
  }
}
```

| Directive | Description |
|-----------|-------------|
| `@include(if: Boolean)` | Include field in result only if argument is `true` |
| `@skip(if: Boolean)` | Skip field if argument is `true` |

```graphql
query Hero($episode: Episode, $skipFriends: Boolean!) {
  hero(episode: $episode) {
    name
    friends @skip(if: $skipFriends) {
      name
    }
  }
}
```

### Custom Directives

Server implementations may define additional directives:

```graphql
query {
  user {
    name @upper
    email @mask
  }
}
```

## Query Best Practices

- **Always name operations** — helps with debugging and server-side logging
- **Use variables** for dynamic values — never string interpolation
- **Use fragments** to avoid field duplication
- **Use aliases** when querying the same field with different arguments
- **Use `__typename`** when querying Union types to differentiate results
- **Use `@include`/`@skip`** for conditional fields instead of constructing different queries
