# API Reference

## OTLP Protocol (v1.10.0)

The OpenTelemetry Protocol (OTLP) describes the encoding, transport, and delivery mechanism of telemetry data between sources, collectors, and backends.

### Transport

OTLP supports two transports:

#### OTLP/gRPC

- Uses gRPC as transport
- Default port: 4317
- Supports gzip and no compression
- Bidirectional streaming
- Most SDKs default to gRPC

#### OTLP/HTTP

- Uses HTTP POST with Protobuf payloads
- Default port: 4318
- Endpoints: `/v1/traces`, `/v1/metrics`, `/v1/logs`
- Supports gzip and no compression
- Content-Type: `application/x-protobuf`
- Also supports JSON encoding with `Content-Type: application/json`

### Export request/response

OTLP is request/response style. The primary request type is `Export`:
- Client sends `ExportRequest` containing telemetry data
- Server responds with `ExportResponse` (success or failure)
- Server returns `OK` (0) or error status codes

### Compression

All server components MUST support:
- `none` — no compression
- `gzip` — Gzip compression

### Multi-destination exporting

Clients can export to multiple destinations. Each destination gets its own exporter configuration.

---

## Language SDK APIs

### Common API surface

All language SDKs implement the same conceptual API:

#### Tracing API

- **TracerProvider** — factory for Tracers
- **Tracer** — creates spans
- **Span** — unit of work with start/end, attributes, events, links, status
- **SpanContext** — immutable (Trace ID, Span ID, Trace Flags, Trace State)
- **Context** — propagation carrier

#### Metrics API

- **MeterProvider** — factory for Meters
- **Meter** — creates instruments
- **Instruments** — Counter, UpDownCounter, Gauge, Histogram (sync); ObservableCounter, ObservableUpDownCounter, ObservableGauge (async)

#### Logs API

- **LoggerProvider** — factory for Loggers
- **Logger** — emits log records
- **LogRecord** — structured log entry

#### Baggage API

- **Baggage** — key-value entries propagated across services

#### Context API

- **Context** — execution-scoped data container
- **Propagators** — inject/extract context to/from carriers (HTTP headers, etc.)

### Environment Variables

Common across all SDKs:

| Variable | Description |
|-----------|-------------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP endpoint URL |
| `OTEL_EXPORTER_OTLP_HEADERS` | Headers for OTLP exporter |
| `OTEL_SERVICE_NAME` | Service name resource attribute |
| `OTEL_RESOURCE_ATTRIBUTES` | Custom resource attributes (key=value,...) |
| `OTEL_TRACES_EXPORTER` | Traces exporter (otlp, jaeger, zipkin, none) |
| `OTEL_METRICS_EXPORTER` | Metrics exporter (otlp, prometheus, none) |
| `OTEL_LOGS_EXPORTER` | Logs exporter (otlp, none) |
| `OTEL_PROPAGATORS` | Propagators (tracecontext, baggage, b3, jaeger) |
| `OTEL_TRACES_SAMPLER` | Sampler (parentbased_always_on, parentbased_traceidratio, always_on, traceidratio) |
| `OTEL_TRACES_SAMPLER_ARG` | Sampler argument (e.g., ratio) |
| `OTEL_BSP_SCHEDULE_DELAY` | Batch span processor delay (ms) |
| `OTEL_BSP_MAX_EXPORT_BATCH_SIZE` | Max batch size for span export |
| `OTEL_EXPORTER_OTLP_INSECURE` | Disable TLS (true/false) |

---

## Zero-code Instrumentation

### Go

- **Compile-time instrumentation**: Build-time code injection via `go build -tags=otel`
- **Auto SDK**: Automatic SDK initialization
- Getting started: `go get go.opentelemetry.io/otel/auto`

### .NET

- Auto-instrumentation via NuGet packages or standalone agent
- Getting started: `dotnet add package OpenTelemetry.AutoInstrumentation`
- Supports traces, metrics, logs

### Java

- **Agent**: JAR-based agent attached via `-javaagent`
  ```bash
  java -javaagent:opentelemetry-javaagent.jar -jar myapp.jar
  ```
- **Spring Boot Starter**: Dependency-based, no agent JAR needed
  ```xml
  <dependency>
    <groupId>io.opentelemetry.instrumentation</groupId>
    <artifactId>opentelemetry-spring-boot-starter</artifactId>
  </dependency>
  ```
- Supports 100+ libraries/frameworks automatically

### JavaScript (Node.js)

- `@opentelemetry/auto-instrumentations-node` package
- Run with `--require @opentelemetry/auto-instrumentations-node/register`

### Python

- `opentelemetry-instrument` command-line tool
- Auto-instruments common libraries (Flask, Django, requests, etc.)
  ```bash
  pip install opentelemetry-distro opentelemetry-exporter-otlp
  opentelemetry-bootstrap -a install
  opentelemetry-instrument python myapp.py
  ```

### PHP

- Extension-based auto-instrumentation

### OpenTelemetry eBPF Instrumentation (OBI)

- Kernel-level auto-instrumentation using eBPF
- Configure via YAML, supports export modes, service discovery, sampling

---

## Migration Guides

### From OpenTracing

OpenTelemetry was created as a merger of OpenTracing and OpenCensus. Migration guide: https://opentelemetry.io/docs/compatibility/migration/opentracing/

Key changes:
- Tracer → TracerProvider + Tracer
- SpanBuilder → Tracer.spanBuilder()
- Span.context() → SpanContext
- Tags → Attributes
- Logs → Span Events

### From OpenCensus

Migration guide: https://opentelemetry.io/docs/compatibility/migration/opencensus/

Key changes:
- Stats → Metrics API
- Tracer → OTel Tracer
- Exporters → OTel Exporters (OTLP recommended)

### From Jaeger Client

Jaeger client libraries are deprecated. Jaeger backend supports OTLP since v1.35. Migrate SDKs and Collectors from Jaeger exporter to OTLP exporter.

### From Prometheus

Prometheus compatibility and migration: https://opentelemetry.io/docs/compatibility/prometheus/

Key points:
- OTel Collector can scrape Prometheus endpoints
- Prometheus exporter can expose OTel metrics in Prometheus format
- Metric name and label mapping conventions

---

## Semantic Conventions Reference

### Available domains

| Domain | Path |
|--------|------|
| HTTP | `/specs/semconv/http/` |
| Messaging | `/specs/semconv/messaging/` |
| Database | `/specs/semconv/database/` |
| FaaS | `/specs/semconv/faas/` |
| Generative AI | `/specs/semconv/gen-ai/` |
| GraphQL | `/specs/semconv/graphql/` |
| Hardware | `/specs/semconv/hardware/` |
| Cloud providers | `/specs/semconv/cloud/` |
| Resource | `/specs/semconv/resource/` |
| Feature flags | `/specs/semconv/feature-flags/` |
| CI/CD | `/specs/semconv/cicd/` |
| System | `/specs/semconv/system/` |
| Network | `/specs/semconv/network/` |
| Process | `/specs/semconv/process/` |
| Kubernetes | `/specs/semconv/k8s/` |
| Container | `/specs/semconv/container/` |

### Attribute naming rules

- Use dot notation for namespaced attributes (e.g., `http.request.method`)
- Keys must be non-null string values
- Values: non-null string, boolean, floating point, integer, or array of these

### Stability levels

Semantic conventions have stability levels: **stable**, **experimental**, **deprecated**. Use stable conventions in production.

---

## Specification

### Overview

The OTel specification (v1.59.0) defines:

- **API** — data types and operations for generating/correlating telemetry
- **SDK** — requirements for language-specific implementations
- **Data** — OTLP and semantic conventions
- **Configuration** — configuration types and environment variables

### Key specification areas

| Area | Status |
|------|--------|
| Traces API | Stable |
| Traces SDK | Stable |
| Metrics API | Stable |
| Metrics SDK | Stable |
| Logs API | Stable |
| Logs SDK | Stable |
| Baggage API | Stable |
| Context Propagation | Stable |
| OTLP | Stable (v1.10.0) |
| Semantic Conventions | v1.43.0 |
| Profiles | In development |
| Entities | In development |

### Configuration types

- **Environment variables** — standard env vars across all SDKs
- **Programmatic** — language-specific configuration APIs
- **Declarative** — YAML/JSON configuration files (Java agent, Collector)

---

## Compatibility

### OpenCensus

OTel provides bridge support for OpenCensus in some languages. The Collector can receive OpenCensus data.

### OpenTracing

OTel provides bridge adapters for OpenTracing API in some languages.

### Prometheus and OpenMetrics

- Collector Prometheus receiver scrapes Prometheus endpoints
- OTLP metrics can be exported as Prometheus metrics
- Name and label mapping conventions defined in spec

### Trace Context in non-OTLP Log Formats

Specifications for embedding trace context in standard log formats (JSON, syslog, etc.).

---

## OpAMP

OpAMP (Open Agent Management Protocol) is a protocol for managing OTel agents and collectors remotely. Supports configuration management, agent health monitoring, and capability reporting.
