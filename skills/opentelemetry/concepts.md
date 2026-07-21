# Concepts

## Signals

Signals are system outputs describing the underlying activity of the operating system and applications. OpenTelemetry currently supports:

### Traces

A trace represents the path of a request through a distributed system. Traces are composed of **spans**.

#### Span

A span represents a unit of work or operation. Spans include:
- **Name**
- **Parent span ID** (empty for root spans)
- **Start and End Timestamps**
- **Span Context** — Trace ID, Span ID, Trace Flags, Trace State (immutable)
- **Attributes** — key-value pairs with metadata (non-null string, boolean, float, int, or array of these)
- **Span Events** — structured log messages on a span, denoting meaningful singular points in time
- **Span Links** — associate one span with one or more spans (causal relationship across traces)
- **Span Status** — `Unset` (default, completed without error), `Error`, or `Ok` (explicitly marked successful)
- **Span Kind** — `Client`, `Server`, `Internal`, `Producer`, `Consumer`

#### Span Kind details

- **Client** — synchronous outgoing remote call (HTTP request, database call)
- **Server** — synchronous incoming remote call (incoming HTTP request, RPC)
- **Internal** — operation not crossing process boundary (function call, Express middleware)
- **Producer** — creation of a job processed asynchronously (job queue, event listener)
- **Consumer** — processing of a job created by a producer (may start long after producer ended)

#### Tracer Provider

A TracerProvider is a factory for Tracers. Initialized once, lifecycle matches the application. Includes Resource and Exporter initialization.

#### Tracer

A Tracer creates spans containing information about operations. Created from Tracer Providers.

#### Trace Exporters

Send traces to a consumer — stdout for debugging, the OpenTelemetry Collector, or any backend.

#### Context Propagation

Core concept enabling Distributed Tracing. Spans can be correlated and assembled into a trace regardless of where generated. Default propagator uses W3C TraceContext headers (`traceparent`).

Example `traceparent` header:
```
00-a0892f3577b34da6a3ce929d0e0e4736-f03067aa0ba902b7-01
```
Format: `<version>-<trace-id>-<parent-id>-<trace-flags>`

---

### Metrics

A metric is a measurement captured at runtime.

#### Meter Provider

Factory for Meters. Initialized once, lifecycle matches application. Includes Resource and Exporter initialization.

#### Meter

Creates metric instruments capturing measurements about a service at runtime.

#### Metric Exporter

Sends metric data to a consumer — stdout, Collector, or any backend.

#### Metric Instruments

| Instrument | Description |
|-----------|-------------|
| **Counter** | Accumulates over time (only goes up), like an odometer |
| **Async Counter** | Same as Counter, collected once per export |
| **UpDownCounter** | Accumulates but can go down (e.g., queue length) |
| **Async UpDownCounter** | Same as UpDownCounter, collected once per export |
| **Gauge** | Current value at read time (synchronous) |
| **Async Gauge** | Same as Gauge, collected once per export |
| **Histogram** | Client-side aggregation of values (e.g., request latencies) |

#### Aggregation

Technique combining many measurements into exact or estimated statistics during a time window. OTLP transports aggregated metrics. Default aggregation per instrument can be overridden using Views.

#### Views

Customize metrics output — select which instruments to process/ignore, customize aggregation and attributes.

#### Cardinality limits

Prevent unbounded attribute cardinality. Limits do not apply to temporality. Excessive cardinality can cause high memory usage.

---

### Logs

A log is a recording of an event. OpenTelemetry provides a Logs API and SDK. Events are a special type of log — all events are logs, but not all logs are events.

#### Log types

- **Structured** — key-value pairs (JSON)
- **Unstructured** — plain text
- **Semistructured** — mixed format

#### Logging components

- **Logger Provider** — factory for Loggers
- **Logger** — creates log records
- **Log Record Exporter** — sends log records to a consumer
- **Log Record** — the telemetry data emitted
- **Log Appender / Bridge** — integrates existing logging frameworks with OTel

#### Log correlation

Logs can be correlated with traces via Trace ID and Span ID embedded in log records.

---

### Baggage

Contextual information passed between signals. Baggage is key-value pairs propagated alongside context.

---

### Profiles (in development)

A recording of resource usage at the code level. Currently at the proposal stage.

---

## Context Propagation

### Context

An object containing information for sending and receiving services to correlate signals. When Service A calls Service B, Service A includes Trace ID and Span ID as context. Service B uses these to create a child span.

### Propagation

Mechanism that moves context between services and processes. Serializes/deserializes context objects. Usually handled by instrumentation libraries transparently. Default propagator: W3C TraceContext.

### Custom Context Propagation

Use the [Propagators API](https://opentelemetry.io/docs/specs/otel/context/api-propagators/) for manual propagation. Official propagators available for W3C TraceContext, W3C Baggage, B3, Jaeger, and more.

### Security best practices

- Be cautious with baggage propagation to external services
- Avoid propagating sensitive data through context

---

## Instrumentation

### Code-based

Use OTel APIs and SDKs directly in application code. Provides deeper insight and rich telemetry.

### Zero-code

Automatic instrumentation without code changes. Available for Go, .NET, Java, JavaScript, Python, PHP. Provides telemetry from libraries and runtime environment.

Both approaches can be used simultaneously.

---

## Resources

A resource represents the entity producing telemetry as resource attributes (e.g., process name, pod name, namespace, deployment name).

### SDK-provided defaults

- `service.name` — logical name of the service (default: `unknown_service`, set via `OTEL_SERVICE_NAME`)
- `telemetry.sdk.name` — `opentelemetry`
- `telemetry.sdk.language` — language of the SDK
- `telemetry.sdk.version` — SDK version

### Resource Detectors

Most SDKs provide resource detectors for automatic detection:
- Operating System, Host, Process/Runtime
- Container, Kubernetes
- Cloud-Provider-Specific attributes

### Custom resources

Set via code or `OTEL_RESOURCE_ATTRIBUTES` environment variable:
```bash
env OTEL_RESOURCE_ATTRIBUTES=deployment.environment.name=production yourApp
```

Resources are added to TracerProvider/MeterProvider at creation time and cannot be changed later.

---

## Sampling

### Terminology

- **Sampled** — trace/span is processed and exported
- **Not sampled** — trace/span is not processed or exported

### Why sampling?

Reduces observability costs without losing visibility. Representativeness — a smaller group accurately represents a larger group. High-volume systems can use 1% or lower sampling rates.

### Head Sampling

Sampling decision made as early as possible. Most common: Consistent Probability Sampling (Deterministic Sampling) based on trace ID and desired percentage.

**Pros:** Easy to understand/configure, efficient, can be done anywhere in pipeline
**Cons:** Cannot make decisions based on entire trace data (e.g., can't ensure all error traces are sampled)

### Tail Sampling

Decision made by considering all/most spans within a trace.

**Use cases:**
- Always sample traces with errors
- Sample based on overall latency
- Sample based on specific attribute values
- Different rates for different services

**Cons:**
- Difficult to implement and operate
- Requires stateful systems with large data capacity
- Often vendor-specific

### Combined approach

High-volume services may use head sampling first, then tail sampling later in the pipeline.

---

## Semantic Conventions

Standard naming scheme for common telemetry data types. Available for:

- **Trace semantic conventions** — https://opentelemetry.io/docs/specs/semconv/general/trace/
- **Metric semantic conventions** — https://opentelemetry.io/docs/specs/semconv/general/metrics/
- **Log semantic conventions** — https://opentelemetry.io/docs/specs/semconv/general/logs/
- **Profiles semantic conventions** — https://opentelemetry.io/docs/specs/semconv/general/profiles/
- **Resource semantic conventions** — https://opentelemetry.io/docs/specs/semconv/resource/

Domain-specific conventions include: HTTP, messaging (Kafka, RabbitMQ, SNS, SQS), database, FaaS, Generative AI, GraphQL, hardware, cloud providers, and more.

---

## Components

### Specification

Defines cross-language requirements:
- **API** — data types and operations for generating/correlating tracing, metrics, logging data
- **SDK** — language-specific implementation requirements (configuration, processing, exporting)
- **Data** — OTLP and vendor-agnostic semantic conventions

### Collector

Vendor-agnostic proxy receiving, processing, and exporting telemetry. Supports multiple formats (OTLP, Jaeger, Prometheus, etc.) and multiple backends.

### Language SDKs

Implement the OTel API in specific languages. Include instrumentation libraries, exporters, resource detectors, propagators, and samplers.

### Other components

- **Kubernetes Operator** — manages Collector deployments, injects auto-instrumentation
- **FaaS assets** — Lambda auto-instrumentation, Lambda Collector config
- **Helm Charts** — Collector, Demo, Operator

---

## Distributions

A distribution is a customized version of an OTel component (not a fork). Examples: vendor-specific distributions with custom exporters, distributions with additional processors.

---

## Glossary

Key terms:
- **Attribute** — key-value pair containing metadata
- **Baggage** — contextual information passed between signals
- **Context** — object with information for correlating signals
- **Distributed Tracing** — tracking requests through distributed systems
- **Execution Unit** — a process or thread
- **Exporter** — sends telemetry data to a consumer
- **Instrumentation** — code that emits signals
- **Log** — recording of an event
- **Metric** — measurement captured at runtime
- **Propagator** — mechanism moving context between services
- **Resource** — entity producing telemetry
- **Sampler** — component making sampling decisions
- **Semantic Conventions** — standard naming scheme
- **Signal** — system output (trace, metric, log)
- **Span** — unit of work or operation
- **Trace** — path of a request through a system
