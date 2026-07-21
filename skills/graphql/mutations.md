# Mutations

Mutations are GraphQL operations that modify data. They use the `Mutation` root operation type and are executed serially (unlike queries which execute in parallel).

## Schema Definition

```graphql
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}

input ReviewInput {
  stars: Int!
  commentary: String
}

type Review {
  id: ID!
  episode: Episode
  stars: Int!
  commentary: String
}

type Mutation {
  createReview(episode: Episode, review: ReviewInput!): Review
}
```

## Creating Data

```graphql
mutation CreateReview($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}
```

Variables:

```json
{
  "ep": "JEDI",
  "review": {
    "stars": 5,
    "commentary": "This is a great movie!"
  }
}
```

The mutation returns the created Review, allowing clients to fetch the new state.

### Resolver Example

```javascript
const Mutation = {
  createReview(_obj, args, context, _info) {
    return context.db
      .createNewReview(args.episode, args.review)
      .then(reviewData => new Review(reviewData));
  },
};
```

## Updating Data

```graphql
type Mutation {
  updateHumanName(id: ID!, name: String!): Human
}
```

```graphql
mutation UpdateHumanName($id: ID!, $name: String!) {
  updateHumanName(id: $id, name: $name) {
    id
    name
  }
}
```

### Purpose-Built Mutations

Instead of a generic `updateHuman` mutation with many nullable fields, define specific mutations:

```graphql
type Mutation {
  updateHumanName(id: ID!, name: String!): Human
  updateHumanHeight(id: ID!, height: Float!): Human
  addHumanFriend(humanId: ID!, friendId: ID!): Human
  rateFilm(filmId: ID!, rating: Int!): Film
}
```

Benefits:
- More expressive schema
- Non-Null arguments where appropriate
- No runtime logic needed to determine what to update
- Better aligned with client use cases

## Deleting Data

```graphql
type Mutation {
  deleteStarship(id: ID!): ID!
}
```

```graphql
mutation DeleteStarship($id: ID!) {
  deleteStarship(id: $id)
}
```

Common return types for delete mutations:
- The deleted entity's ID
- A payload object with details about the deletion
- A Boolean indicating success

```graphql
type DeletePayload {
  id: ID!
  success: Boolean!
  deletedAt: Date
}

type Mutation {
  deleteStarship(id: ID!): DeletePayload!
}
```

## Multiple Fields in Mutations

A mutation can contain multiple fields, just like a query. **Key difference**: mutation fields execute **serially**, not in parallel.

```graphql
mutation {
  firstShip: deleteStarship(id: "3000") {
    id
  }
  secondShip: deleteStarship(id: "3001") {
    id
  }
}
```

- `firstShip` is guaranteed to finish before `secondShip` begins
- Prevents race conditions between mutations in the same request
- **Not a transaction**: if `secondShip` fails, `firstShip` is not reverted
- No built-in way for GraphQL to revert successful portions

## Input Object Types

Used for passing complex structured data to mutations:

```graphql
input ReviewInput {
  stars: Int!
  commentary: String
  createdAt: Date
}

input UserInput {
  name: String!
  email: String!
  role: Role = USER
  preferences: PreferencesInput
}

input PreferencesInput {
  theme: Theme = LIGHT
  notifications: Boolean = true
}

type Mutation {
  createUser(input: UserInput!): User!
  createReview(episode: Episode, review: ReviewInput!): Review
}
```

### Input Type Rules

- Use `input` keyword instead of `type`
- Fields can reference other Input Object types
- Cannot mix input and output types
- Fields cannot have arguments
- Fields can have default values

## Mutation Response Patterns

### Return the Modified Entity

```graphql
type Mutation {
  updateUser(id: ID!, input: UserInput!): User
}
```

### Return a Payload Type

```graphql
type UpdateUserPayload {
  user: User
  errors: [UserError!]
}

type UserError {
  field: String
  message: String
}

type Mutation {
  updateUser(id: ID!, input: UserInput!): UpdateUserPayload!
}
```

### Return Edge for Relay-Style Connections

```graphql
type UpdateUserPayload {
  userEdge: UserEdge!
}

type UserEdge {
  node: User!
  cursor: String!
}

type Mutation {
  addUser(input: AddUserInput!): UpdateUserPayload!
}
```

## Mutation Best Practices

- **Always name mutation operations** for debugging
- **Use Input Object types** for complex arguments
- **Return the modified entity** so clients can update their cache
- **Define purpose-built mutations** instead of generic CRUD
- **Use Non-Null arguments** where the value is always required
- **Consider payload types** for errors-as-data patterns
- **Don't rely on serial execution as a transaction** — use database transactions in resolvers
- **Validate input** in resolvers, not just schema-level types
