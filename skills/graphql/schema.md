# Schemas and Types

Every GraphQL service defines a set of types that completely describe the set of possible data you can query on that service. Requests are validated and executed against that schema.

## Schema Definition Language (SDL)

GraphQL uses a language-agnostic SDL to describe schemas:

```graphql
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

Reading the type:
- `Character` — GraphQL Object type
- `name`, `appearsIn` — fields on the type
- `String` — built-in Scalar type (leaf value)
- `String!` — Non-Null type (always returns a value)
- `[Episode!]!` — List of Non-Null Episode objects (always returns an array, every item is an Episode)

## Object Types and Fields

The most basic components of a GraphQL schema:

```graphql
type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}
```

### Arguments

Every field can have zero or more arguments. All arguments are named (no positional arguments):

```graphql
type Query {
  human(id: ID!): Human
}
```

Arguments can be:
- **Required**: `id: ID!` (Non-Null)
- **Optional with default**: `unit: LengthUnit = METER`

## Root Operation Types

Every schema has entry points called root operation types:

```graphql
schema {
  query: MyQueryType
  mutation: MyMutationType
  subscription: MySubscriptionType
}
```

- **Query** — required, entry point for read operations
- **Mutation** — optional, entry point for write operations
- **Subscription** — optional, entry point for real-time operations

By default, these are named `Query`, `Mutation`, and `Subscription`, but you can customize the names using the `schema` keyword.

```graphql
type Query {
  droid(id: ID!): Droid
  hero(episode: Episode): Character
}
```

## Scalar Types

Scalars are the leaf values of a query. GraphQL comes with built-in scalars:

| Scalar | Description |
|--------|-------------|
| `Int` | Signed 32-bit integer |
| `Float` | Signed double-precision floating-point |
| `String` | UTF-8 character sequence |
| `Boolean` | `true` or `false` |
| `ID` | Unique identifier (serialized as String, not human-readable) |

### Custom Scalars

```graphql
scalar Date
scalar JSON
scalar UUID
scalar DateTime
scalar URL
```

The implementation defines how custom scalars are serialized, deserialized, and validated.

## Enum Types

Enums are scalars restricted to a particular set of allowed values:

```graphql
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

```graphql
enum LengthUnit {
  METER
  FOOT
}
```

## Type Modifiers

Types are nullable and singular by default. Two modifiers change this:

### Non-Null (`!`)

```graphql
type User {
  id: ID!          # always returns a value, never null
  name: String!    # always returns a value
  email: String    # may return null
}
```

### List (`[]`)

```graphql
type User {
  friends: [User]       # may be null, items may be null
  tags: [String!]!      # always an array, every item is a non-null String
}
```

### Combination Table

| Type | Nullable? | List? | Items Nullable? |
|------|-----------|-------|-----------------|
| `String` | Yes | No | N/A |
| `String!` | No | No | N/A |
| `[String]` | Yes | Yes | Yes |
| `[String!]` | Yes | Yes | No |
| `[String]!` | No | Yes | Yes |
| `[String!]!` | No | Yes | No |

## Interface Types

Interfaces define a set of fields that implementing types must include:

```graphql
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}

type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}

type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}
```

Interfaces can implement other interfaces:

```graphql
interface Node {
  id: ID!
}

interface Character implements Node {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}
```

Note: Interfaces may not implement themselves or contain cyclic references.

## Union Types

Unions allow returning one of several object types, but unlike interfaces, they share no common fields:

```graphql
union SearchResult = Human | Droid | Starship
```

Union members must be concrete Object types (not interfaces or other unions).

To query union fields, use inline fragments:

```graphql
{
  search(text: "an") {
    __typename
    ... on Human {
      name
      height
    }
    ... on Droid {
      name
      primaryFunction
    }
    ... on Starship {
      name
      length
    }
  }
}
```

## Input Object Types

For passing complex objects as arguments (especially in mutations):

```graphql
input ReviewInput {
  stars: Int!
  commentary: String
  createdAt: Date
}

type Mutation {
  createReview(episode: Episode, review: ReviewInput!): Review
}
```

Rules for input types:
- Fields can reference other Input Object types
- Cannot mix input and output types
- Input Object fields cannot have arguments
- Use `input` keyword instead of `type`

## Directives

Directives modify schema parts using `@` followed by a name:

### Built-in Directives

```graphql
# @deprecated — marks a field or enum value as deprecated
type User {
  fullName: String
  name: String @deprecated(reason: "Use `fullName`.")
}

# Directive definition
directive @deprecated(
  reason: String = "No longer supported"
) on FIELD_DEFINITION | ENUM_VALUE
```

### Custom Directives

```graphql
directive @auth(requires: Role = ADMIN) on FIELD_DEFINITION
directive @upper on FIELD_DEFINITION
directive @deprecated on FIELD_DEFINITION | ENUM_VALUE

enum Role {
  ADMIN
  USER
  GUEST
}

type Query {
  adminData: String @auth(requires: ADMIN)
  publicData: String
}
```

## Documentation

### Descriptions

Use triple quotes for multi-line descriptions:

```graphql
"""
Represents a character in the Star Wars trilogy.
"""
type Character {
  """The name of the character"""
  name: String!

  """The episodes this character appears in"""
  appearsIn: [Episode!]!
}
```

### Comments

Single-line comments use `#`:

```graphql
# This is a comment
type Query {
  # Field comment
  hello: String
}
```

## Complete Schema Example

```graphql
schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

type Query {
  hero(episode: Episode = EMPIRE): Character
  human(id: ID!): Human
  droid(id: ID!): Droid
  starship(id: ID!): Starship
  search(text: String!): [SearchResult]
}

type Mutation {
  createReview(episode: Episode, review: ReviewInput!): Review
  updateHumanName(id: ID!, name: String!): Human
  deleteStarship(id: ID!): ID!
}

type Subscription {
  reviewCreated: Review
  humanFriendsUpdated(id: ID!): Human
}

enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}

enum LengthUnit {
  METER
  FOOT
}

interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}

type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
  height(unit: LengthUnit = METER): Float
}

type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}

type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
  coordinates: [[Float!]!]
}

union SearchResult = Human | Droid | Starship

type Review {
  id: ID!
  episode: Episode
  stars: Int!
  commentary: String
  createdAt: Date
}

input ReviewInput {
  stars: Int!
  commentary: String
  createdAt: Date
}

scalar Date
```
