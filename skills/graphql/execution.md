# Execution

After validation passes, GraphQL executes the operation by calling resolver functions for each field. This page explains how execution works.

## Field Resolvers

Each field in a GraphQL type system has a corresponding resolver function that provides data for that field:

```graphql
type Query {
  human(id: ID!): Human
}

type Human {
  name: String
  appearsIn: [Episode]
  starships: [Starship]
}

type Starship {
  name: String
}
```

## Resolver Function Signature

In the reference implementation (JavaScript), a resolver receives four arguments:

```javascript
function resolver(parent, args, context, info) {
  // ...
}
```

| Argument | Description |
|----------|-------------|
| `parent` (aka `obj`, `root`) | The previous object (for root Query type, often not used) |
| `args` | The arguments provided to the field in the GraphQL operation |
| `context` | Value provided to every resolver — holds contextual info like current user, DB access |
| `info` | Field-specific information relevant to the current operation and schema details |

### Example Resolvers

```javascript
// Root resolver — fetches a Human by ID
function resolveHuman(parent, args, context, info) {
  return context.db.loadHumanByID(args.id)
    .then(userData => new Human(userData));
}

// Trivial resolver — reads property from parent object
function resolveHumanName(parent, args, context, info) {
  return parent.name;
}

// List resolver — loads related objects
function resolveHumanStarships(parent, args, context, info) {
  return Promise.all(
    parent.starshipIDs.map(id =>
      context.db.loadStarshipByID(id).then(shipData => new Starship(shipData))
    )
  );
}
```

## Execution Flow

```
Query.human(id: "1000")
       │
       ▼
   ┌──────────────┐
   │ resolveHuman │  ──▶ returns Human object (async)
   └──────┬───────┘
          ▼
   ┌──────────────────────────────────────────┐
   │ Human object now available               │
   │ Resolve fields concurrently:             │
   │                                          │
   │  ┌─────────────┐  ┌──────────────────┐  │
   │  │ resolveName │  │ resolveStarships │  │
   │  │   (sync)    │  │    (async)       │  │
   │  └──────┬──────┘  └────────┬─────────┘  │
   │         │                  │             │
   │    "Luke Skywalker"  [Starship, ...]     │
   │                          │               │
   │                   ┌──────┴──────┐       │
   │                   │ resolveName │       │
   │                   │  per ship   │       │
   │                   └─────────────┘       │
   └──────────────────────────────────────────┘
```

## Asynchronous Resolvers

Resolvers can return Promises (or Futures/Tasks in other languages). GraphQL waits for them with optimal concurrency:

```javascript
function resolveHuman(parent, args, context, info) {
  return context.db.loadHumanByID(args.id)
    .then(userData => new Human(userData));
}
```

- The resolver is aware of Promises, but the GraphQL query is not
- GraphQL waits for all Promises before continuing
- Fields at the same level are resolved concurrently

## Trivial Resolvers

Many fields just read a property from the parent object:

```javascript
function resolveHumanName(parent, args, context, info) {
  return parent.name;
}
```

Most GraphQL libraries let you omit trivial resolvers — if no resolver is provided, the library reads a property of the same name from the parent object.

```javascript
// No resolver needed — library auto-resolves parent.name
const resolvers = {
  Human: {
    // name: omitted — auto-resolved
    starships: (parent, args, context, info) => {
      return context.db.loadStarships(parent.starshipIDs);
    },
  },
};
```

## Scalar Coercion

The type system converts values returned by resolvers to match the schema:

```javascript
const Human = {
  appearsIn(obj) {
    return obj.appearsIn; // e.g. [4, 5, 6] (numbers)
  },
};
```

Even though the resolver returns numbers `[4, 5, 6]`, the type system knows `appearsIn` returns `[Episode]` and coerces them to the correct enum values (`NEWHOPE`, `EMPIRE`, `JEDI`).

## List Resolvers

When a field returns a list of objects, each item is resolved concurrently:

```javascript
function resolveHumanStarships(parent, args, context, info) {
  return Promise.all(
    parent.starshipIDs.map(id =>
      context.db.loadStarshipByID(id).then(shipData => new Starship(shipData))
    )
  );
}
```

- GraphQL waits for all Promises concurrently
- Then resolves fields on each Starship concurrently
- Results are placed in a key-value map matching the query shape

## Producing the Result

As each field is resolved, the value is placed into a key-value map:

```graphql
{
  human(id: "1000") {
    name
    appearsIn
    starships {
      name
    }
  }
}
```

Execution produces:

```json
{
  "data": {
    "human": {
      "name": "Luke Skywalker",
      "appearsIn": ["NEWHOPE", "EMPIRE", "JEDI"],
      "starships": [
        { "name": "X-Wing" },
        { "name": "Imperial shuttle" }
      ]
    }
  }
}
```

The result structure mirrors the original query.

## Serial vs Parallel Execution

| Operation Type | Execution |
|---------------|-----------|
| **Query** | Fields at each level execute in **parallel** |
| **Mutation** | Top-level fields execute **serially** (one after another) |
| **Subscription** | Event-driven, resolver fires when event occurs |

### Query Parallel Execution

```graphql
{
  human(id: "1000") {
    name        # ─┐
    height      #  ├── all resolved concurrently
    mass        #  │
    friends     # ─┘
  }
}
```

### Mutation Serial Execution

```graphql
mutation {
  firstShip: deleteStarship(id: "3000")  # runs first
  secondShip: deleteStarship(id: "3001") # runs after firstShip completes
}
```

## Context Object

The `context` object is shared across all resolvers in a single operation:

```javascript
// Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    user: req.auth.user,
    db: database,
    pubsub: pubsubSystem,
    dataLoaders: createDataLoaders(database),
  }),
});

// Accessible in every resolver
function resolveHuman(parent, args, context, info) {
  if (!context.user) throw new Error('Not authenticated');
  return context.db.loadHumanByID(args.id);
}
```

## The `info` Argument

The `info` argument contains field-specific execution information:

```javascript
function resolver(parent, args, context, info) {
  // info.fieldName — the name of the field being resolved
  // info.returnType — the GraphQL type being returned
  // info.parentType — the type of the parent
  // info.path — path from root to current field
  // info.schema — the GraphQL schema
  // info.operation — the AST of the operation
  // info.variableValues — variables passed to the operation
  // info.fragmentDefinitions — fragment ASTs
}
```

Advanced use cases include:
- Conditional resolution based on requested fields
- Dynamic authorization checks
- Performance monitoring per field
- DataLoader batching optimization

## Error Handling During Execution

When a resolver throws an error:

```javascript
function resolveHuman(parent, args, context, info) {
  throw new Error('Database connection failed');
}
```

- GraphQL catches the error and includes it in the `errors` array
- If the field is nullable, it returns `null` for that field
- If the field is Non-Null, the null propagates up to the nearest nullable parent
- Other fields continue executing (partial response)

```json
{
  "data": {
    "human": null
  },
  "errors": [
    {
      "message": "Database connection failed",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["human"]
    }
  ]
}
```

## Execution Summary

- Each field has a resolver function providing data from a data source
- Execution begins at root Query, Mutation, or Subscription fields
- Resolvers may execute asynchronously (Promises/Futures/Tasks)
- Scalar coercion converts resolver output to schema types
- List fields resolve each item concurrently
- Query fields execute in parallel; mutation fields execute serially
- Results mirror the query shape and are typically serialized as JSON
