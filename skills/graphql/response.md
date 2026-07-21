# Response Format

The GraphQL specification defines the structure of responses. Three top-level keys are allowed: `data`, `errors`, and `extensions`.

## Response Structure

```json
{
  "data": { ... },
  "errors": [ ... ],
  "extensions": { ... }
}
```

| Key | Required | Description |
|-----|----------|-------------|
| `data` | One of `data` or `errors` must be present | Result of the executed operation |
| `errors` | One of `data` or `errors` must be present | Errors raised during request |
| `extensions` | Optional | Implementation-specific metadata |

Rules:
- If no errors occurred, `errors` must **not** be present
- If errors occurred before execution (request errors), `data` must **not** be present
- If errors occurred during execution (field errors), `data` may contain partial data
- At least one of `data` or `errors` will be present

## Data

The `data` key contains the result of the executed operation:

```json
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        { "name": "Luke Skywalker" },
        { "name": "Han Solo" }
      ]
    }
  }
}
```

- Shape mirrors the query
- May contain partial data if some fields errored
- Typically serialized as JSON (though spec doesn't require a specific format)

## Errors

### Error Object Format

```json
{
  "message": "String",
  "locations": [{ "line": 1, "column": 2 }],
  "path": ["field", "nestedField"],
  "extensions": {
    "code": "ERROR_CODE",
    "exception": { ... }
  }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `message` | Yes | Human-readable error description |
| `locations` | No | Where the error occurred in the document |
| `path` | No | Path to the field that errored |
| `extensions` | No | Additional implementation-specific error data |

### Types of Errors

#### Request Errors

Occur before execution begins. The `data` key is **not** included.

**Syntax errors:**

```json
{
  "errors": [
    {
      "message": "Syntax Error: Expected Name, found <EOF>",
      "locations": [{ "line": 1, "column": 20 }]
    }
  ]
}
```

**Validation errors:**

```json
{
  "errors": [
    {
      "message": "Cannot query field \"favoriteSpaceship\" on type \"Character\".",
      "locations": [{ "line": 3, "column": 5 }],
      "extensions": {
        "code": "GRAPHQL_VALIDATION_FAILED"
      }
    }
  ]
}
```

**Variable type errors:**

```json
{
  "errors": [
    {
      "message": "Variable \"$id\" of type \"String\" used in position expecting type \"ID!\".",
      "locations": [{ "line": 1, "column": 14 }]
    }
  ]
}
```

#### Field Errors

Occur during execution. The `data` key **is** included with partial data.

```graphql
mutation {
  firstShip: deleteStarship(id: "3000")
  secondShip: deleteStarship(id: "3010")
}
```

```json
{
  "data": {
    "firstShip": "3000",
    "secondShip": null
  },
  "errors": [
    {
      "message": "No starship found with ID 3010",
      "locations": [{ "line": 3, "column": 3 }],
      "path": ["secondShip"]
    }
  ]
}
```

#### Null Propagation on Field Errors

When a Non-Null field errors:

```json
{
  "data": null,
  "errors": [
    {
      "message": "Cannot return null for non-nullable field User.email.",
      "path": ["user", "email"]
    }
  ]
}
```

The null propagates up to the nearest nullable ancestor:
- If `email` is `String!` and errors → `email` is null
- Since `email` is Non-Null, null propagates to `user`
- If `user` is nullable, `user` becomes null and execution continues
- If `user` is also Non-Null, null propagates further up

#### Network Errors

Not GraphQL-specific. Occur at the transport level:
- SSL errors
- Connection timeouts
- DNS failures
- Server unreachable

These block communication before the request completes. Client libraries may offer retry logic.

## Extensions

The `extensions` key is for implementation-specific metadata:

```json
{
  "data": { ... },
  "extensions": {
    "tracing": {
      "version": 1,
      "startTime": "2024-01-01T00:00:00.000Z",
      "execution": {
        "resolvers": [
          {
            "path": ["hero"],
            "duration": 50000
          }
        ]
      }
    },
    "rateLimit": {
      "remaining": 950,
      "limit": 1000
    }
  }
}
```

Common uses:
- **Tracing/APM**: Performance metrics per resolver
- **Rate limiting**: Remaining quota
- **Cache control**: Cache hints
- **Deprecation**: Warnings about deprecated fields
- **Custom metadata**: Feature flags, experiment data

## HTTP Status Codes

### With `application/graphql-response+json` (spec-compliant)

| Scenario | Status Code |
|----------|-------------|
| Successful response with data | `2xx` |
| Partial response (data + errors) | `2xx` |
| Validation/syntax errors (no data) | `4xx` (typically `400`) |
| Server errors during execution | `4xx` or `5xx` |

### With `application/json` (legacy)

| Scenario | Status Code |
|----------|-------------|
| Successful response with data | `2xx` |
| Partial response (data + errors) | `2xx` |
| Validation/syntax errors | `2xx` (discouraged but common) or `400` |

**Key rule**: If `data` is present and not `null`, always return `2xx` — even if `errors` are present. HTTP has no "partial success" status code.

## Response Content Types

| Content-Type | Status |
|-------------|--------|
| `application/graphql-response+json` | Recommended (spec-compliant) |
| `application/json` | Legacy support |

## Complete Response Examples

### Successful Query

```json
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        { "name": "Luke Skywalker" },
        { "name": "C-3PO" }
      ]
    }
  }
}
```

### Partial Response with Field Error

```json
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": null
    }
  },
  "errors": [
    {
      "message": "Database timeout fetching friends",
      "path": ["hero", "friends"],
      "extensions": {
        "code": "DATABASE_TIMEOUT"
      }
    }
  ]
}
```

### Request Error (No Data)

```json
{
  "errors": [
    {
      "message": "Syntax Error: Expected Name, found \"}\"",
      "locations": [{ "line": 1, "column": 20 }]
    }
  ]
}
```

### Response with Extensions

```json
{
  "data": {
    "users": [
      { "id": "1", "name": "Alice" },
      { "id": "2", "name": "Bob" }
    ]
  },
  "extensions": {
    "cacheControl": {
      "version": 1,
      "hints": [
        { "path": ["users"], "maxAge": 60 }
      ]
    }
  }
}
```
