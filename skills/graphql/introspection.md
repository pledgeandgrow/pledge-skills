# Introspection

Introspection is GraphQL's built-in ability to query the schema itself. Every GraphQL server exposes meta-fields that let clients discover what types, fields, and directives are available.

## Meta-Fields

Three reserved meta-fields are available on every GraphQL server:

| Meta-Field | Available On | Returns |
|------------|-------------|---------|
| `__typename` | Every Object type | The name of the type at that point |
| `__schema` | Root Query type | The entire schema |
| `__type` | Root Query type | A specific type by name |

All field names starting with `__` are reserved by GraphQL.

## `__typename`

Returns the name of the Object type at that point in the query:

```graphql
{
  search(text: "an") {
    __typename
    ... on Human { name }
    ... on Droid { name }
    ... on Starship { name }
  }
}
```

```json
{
  "data": {
    "search": [
      { "__typename": "Human", "name": "Han Solo" },
      { "__typename": "Droid", "name": "C-3PO" },
      { "__typename": "Starship", "name": "Millennium Falcon" }
    ]
  }
}
```

Essential for Union types where the client doesn't know which type will be returned.

## `__schema`

Query the entire schema:

### List All Types

```graphql
{
  __schema {
    types {
      name
    }
  }
}
```

```json
{
  "data": {
    "__schema": {
      "types": [
        { "name": "Query" },
        { "name": "Mutation" },
        { "name": "Character" },
        { "name": "Human" },
        { "name": "Droid" },
        { "name": "Episode" },
        { "name": "LengthUnit" },
        { "name": "Starship" },
        { "name": "Review" },
        { "name": "ReviewInput" },
        { "name": "SearchResult" },
        { "name": "Boolean" },
        { "name": "Float" },
        { "name": "ID" },
        { "name": "Int" },
        { "name": "String" },
        { "name": "__Schema" },
        { "name": "__Type" },
        { "name": "__TypeKind" },
        { "name": "__Field" },
        { "name": "__InputValue" },
        { "name": "__EnumValue" },
        { "name": "__Directive" },
        { "name": "__DirectiveLocation" }
      ]
    }
  }
}
```

### Find the Query Type

```graphql
{
  __schema {
    queryType {
      name
    }
  }
}
```

### Get All Details

```graphql
{
  __schema {
    queryType { name }
    mutationType { name }
    subscriptionType { name }
    types {
      name
      kind
      description
      fields {
        name
        description
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
        args {
          name
          description
          type {
            name
            kind
          }
          defaultValue
        }
      }
      interfaces { name }
      possibleTypes { name }
      enumValues {
        name
        description
      }
      inputFields {
        name
        type { name }
      }
    }
    directives {
      name
      description
      locations
      args {
        name
        description
        type { name }
        defaultValue
      }
    }
  }
}
```

## `__type`

Query a specific type by name:

```graphql
{
  __type(name: "Droid") {
    name
    kind
    description
    fields {
      name
      type {
        name
        kind
        ofType {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
    interfaces {
      name
    }
  }
}
```

```json
{
  "data": {
    "__type": {
      "name": "Droid",
      "kind": "OBJECT",
      "description": "A mechanical creature in the Star Wars universe.",
      "fields": [
        {
          "name": "id",
          "type": {
            "name": null,
            "kind": "NON_NULL",
            "ofType": {
              "name": "ID",
              "kind": "SCALAR"
            }
          }
        },
        {
          "name": "name",
          "type": {
            "name": null,
            "kind": "NON_NULL",
            "ofType": {
              "name": "String",
              "kind": "SCALAR"
            }
          }
        },
        {
          "name": "friends",
          "type": {
            "name": null,
            "kind": "LIST",
            "ofType": {
              "name": "Character",
              "kind": "INTERFACE"
            }
          }
        },
        {
          "name": "primaryFunction",
          "type": {
            "name": "String",
            "kind": "SCALAR",
            "ofType": null
          }
        }
      ],
      "interfaces": [
        { "name": "Character" }
      ]
    }
  }
}
```

## `__TypeKind`

The `kind` field returns a `__TypeKind` enum:

| Kind | Description |
|------|-------------|
| `SCALAR` | Scalar type (Int, String, etc.) |
| `OBJECT` | Object type |
| `INTERFACE` | Interface type |
| `UNION` | Union type |
| `ENUM` | Enum type |
| `INPUT_OBJECT` | Input object type |
| `LIST` | List wrapper type |
| `NON_NULL` | Non-Null wrapper type |

## Navigating Wrapper Types

Non-Null and List types have no `name` — use `ofType` to find the inner type:

```graphql
{
  __type(name: "Droid") {
    fields {
      name
      type {
        name        # null for NON_NULL and LIST
        kind        # NON_NULL, LIST, SCALAR, etc.
        ofType {
          name      # the actual type name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
}
```

For `id: ID!`:
- `kind`: `NON_NULL`
- `name`: `null`
- `ofType.kind`: `SCALAR`
- `ofType.name`: `ID`

For `friends: [Character]`:
- `kind`: `LIST`
- `name`: `null`
- `ofType.kind`: `INTERFACE`
- `ofType.name`: `Character`

For `appearsIn: [Episode!]!`:
- `kind`: `NON_NULL`
- `name`: `null`
- `ofType.kind`: `LIST`
- `ofType.name`: `null`
- `ofType.ofType.kind`: `NON_NULL`
- `ofType.ofType.name`: `null`
- `ofType.ofType.ofType.kind`: `SCALAR`
- `ofType.ofType.ofType.name`: `Episode`

## Introspection Types

The introspection system itself has these types:

| Type | Description |
|------|-------------|
| `__Schema` | The entire schema |
| `__Type` | A type in the schema |
| `__TypeKind` | Enum of type kinds |
| `__Field` | A field on an Object or Interface type |
| `__InputValue` | An argument or input field |
| `__EnumValue` | A value in an Enum type |
| `__Directive` | A directive in the schema |
| `__DirectiveLocation` | Enum of valid directive locations |

## Querying Documentation

Introspection can access descriptions (documentation) on types and fields:

```graphql
{
  __type(name: "Character") {
    name
    description
    fields {
      name
      description
      type {
        name
        kind
      }
    }
  }
}
```

This powers:
- **Documentation browsers** (e.g., GraphiQL, Apollo Studio)
- **IDE autocompletion**
- **Schema visualization tools**
- **Code generation** (TypeScript types, etc.)
- **Validation tooling**

## Introspection in Production

### Security Concerns

Introspection exposes your entire schema. In production:

- **Disable introspection** for public APIs if needed
- **Restrict** to authenticated users
- **Use persisted queries** to limit what clients can send
- **Hide internal fields** with custom directives

### Disabling Introspection

```javascript
// Apollo Server
import { ApolloServer } from '@apollo/server';
import { NoIntrospectionPlugin } from './plugins';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: process.env.NODE_ENV === 'production'
    ? [NoIntrospectionPlugin]
    : [],
});

// Or use validationRules
import { NoSchemaIntrospectionCustomRule } from 'graphql';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: process.env.NODE_ENV === 'production'
    ? [NoSchemaIntrospectionCustomRule]
    : [],
});
```

### When to Keep Introspection Enabled

- Internal APIs
- Development/staging environments
- APIs with authentication required
- Public APIs where schema visibility is intentional

## Common Introspection Queries

### Get All Query Fields

```graphql
{
  __schema {
    queryType {
      fields {
        name
        description
        args {
          name
          type { name kind }
        }
        type { name kind }
      }
    }
  }
}
```

### Get All Mutations

```graphql
{
  __schema {
    mutationType {
      fields {
        name
        description
        args {
          name
          type { name kind }
        }
      }
    }
  }
}
```

### Get Enum Values

```graphql
{
  __type(name: "Episode") {
    name
    kind
    enumValues {
      name
      description
    }
  }
}
```

### Get Directives

```graphql
{
  __schema {
    directives {
      name
      description
      locations
      args {
        name
        type { name }
        defaultValue
      }
    }
  }
}
```
