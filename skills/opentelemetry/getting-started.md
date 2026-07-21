# Getting Started

## What is OpenTelemetry?

OpenTelemetry (OTel) is a vendor-neutral open source Observability framework for instrumenting, generating, collecting, and exporting telemetry data such as traces, metrics, and logs.

### What is observability?

Observability is the ability to understand the internal state of a system by examining its outputs. In software, this is typically achieved by analyzing telemetry data — traces, metrics, and logs. A system must be **instrumented** (code must emit signals) to be observable.

### Why OpenTelemetry?

With cloud computing, microservices, and complex business requirements, observability is more important than ever. OTel follows two key principles:

1. **You own the data you generate** — no vendor lock-in
2. **Single set of APIs and conventions** — learn once, use everywhere

### Main components

- A **specification** for all components
- A standard **protocol** (OTLP) defining the shape of telemetry data
- **Semantic conventions** — standard naming scheme
- **APIs** defining how to generate telemetry data
- **Language SDKs** implementing the specification
- A **library ecosystem** for instrumenting common libraries/frameworks
- **Automatic instrumentation** components (zero-code)
- The **OpenTelemetry Collector** — proxy for receiving, processing, exporting
- **Operator for Kubernetes**, Helm Charts, FaaS community assets

### Extensibility

OTel is designed to be extensible at nearly every level:
- Add a receiver to the Collector for custom sources
- Load custom instrumentation libraries into an SDK
- Create a distribution tailored to a specific use case
- Create a new exporter for a custom backend
- Create a custom propagator for nonstandard context propagation

---

## Observability Primer

### Reliability and metrics

- **Telemetry** — data emitted from a system (traces, metrics, logs)
- **Reliability** — "Is the service doing what users expect?"
- **Metrics** — aggregations over time of numeric data (error rate, CPU, request rate)
- **SLI** (Service Level Indicator) — measurement of a service's behavior from the user's perspective
- **SLO** (Service Level Objective) — attaching SLIs to business value to communicate reliability

### Distributed tracing

Distributed tracing lets you observe requests as they propagate through distributed systems. Essential for systems with nondeterministic problems or too complex to reproduce locally.

Key components:
- **Logs** — timestamped text records (structured or unstructured)
- **Spans** — unit of work or operation (building blocks of traces)
- **Traces** — path of a request through a distributed system (composed of spans)

---

## Getting Started Paths

### By role

- **Dev** — instrument code, generate telemetry: https://opentelemetry.io/docs/getting-started/dev/
- **Ops** — deploy and manage Collector, configure backends: https://opentelemetry.io/docs/getting-started/ops/

### Official demo

Try the [OpenTelemetry demo](https://opentelemetry.io/ecosystem/demo/) to see observability with OTel in action.

---

## Language SDKs

OpenTelemetry provides code instrumentation SDKs for:

| Language | Status | Zero-code |
|----------|--------|-----------|
| **Go** | Stable (traces, metrics, logs) | Yes (compile-time, Auto SDK) |
| **.NET** | Stable (traces, metrics, logs) | Yes |
| **Java** | Stable (traces, metrics, logs) | Yes (agent, Spring Boot starter) |
| **JavaScript** | Stable (traces, metrics), Logs in development | Yes |
| **Python** | Stable (traces, metrics, logs) | Yes |
| **PHP** | Stable (traces), Metrics/Logs in development | Yes |
| **Ruby** | Stable (traces), Metrics in development | No |
| **Rust** | Stable (traces), Metrics in development | No |
| **Swift** | Stable (traces, metrics, logs) | No |
| **Kotlin** | Stable (traces) | No |
| **C++** | Stable (traces, metrics, logs) | No |

For most languages, a global TracerProvider/MeterProvider is initialized once. The SDK lifecycle matches the application lifecycle.

### API references

- [Go](https://pkg.go.dev/go.opentelemetry.io/otel)
- [Java](https://io.opentelemetry.io/docs/javadoc/)
- [Python](https://opentelemetry.io/docs/languages/python/api/)
- [JavaScript](https://open-telemetry.github.io/opentelemetry-js/)
- [.NET](https://github.com/open-telemetry/opentelemetry-dotnet)
- [Ruby](https://www.rubydoc.info/gems/opentelemetry-sdk)
- [Rust](https://docs.rs/opentelemetry/latest/opentelemetry/)
- [Swift](https://swiftpackageindex.com/open-telemetry/opentelemetry-swift)
- [PHP](https://github.com/open-telemetry/opentelemetry-php)
- [C++](https://github.com/open-telemetry/opentelemetry-cpp)
- [Kotlin](https://github.com/open-telemetry/opentelemetry-java-instrumentation)

---

## Instrumentation Approaches

### Code-based (Manual)

Use OTel APIs and SDKs to instrument application code directly. Provides deeper insight and rich telemetry from the application itself.

### Zero-code (Automatic)

Generate telemetry without code changes. Available for Go, .NET, Java, JavaScript, Python, PHP. Provides rich telemetry from libraries and runtime environment.

Both approaches can be used simultaneously.

### Kubernetes Operator

The OpenTelemetry Operator for Kubernetes can inject zero-code instrumentation for .NET, Java, Node.js, Python, or Go into applications automatically.
