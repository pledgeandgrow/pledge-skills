# OpenTelemetry Collector

## Overview

The OpenTelemetry Collector is a vendor-agnostic proxy that receives, processes, and exports telemetry data. It removes the need to run multiple agents/collectors, supports open source data formats (OTLP, Jaeger, Prometheus, Fluent Bit, etc.), and sends to one or more backends.

### Objectives

- **Usability** — reasonable defaults, supports popular protocols, runs out of the box
- **Performance** — highly stable and performant under varying loads
- **Observability** — an exemplar of an observable service
- **Extensibility** — customizable without touching core code
- **Unification** — single codebase, deployable as agent or collector, supports traces/metrics/logs

### When to use a Collector

For getting started, sending data directly to a backend works well. For production, a Collector is recommended to offload data quickly and handle retries, batching, encryption, and sensitive data filtering. The default OTLP exporters in each language assume a local collector endpoint.

### Status

Core Collector components have mixed stability levels. Each component documents its stability in its README. Support includes critical bug fixes and security issues based on support policies.

---

## Quick Start

### Prerequisites

- Docker (or compatible container runtime)
- Go (latest two minor versions)
- `GOBIN` environment variable set

### Setup

```bash
# Set GOBIN if not set
export GOBIN=${GOBIN:-$(go env GOPATH)/bin}

# Pull the Collector Docker image
docker pull otel/opentelemetry-collector:0.156.0

# Install telemetrygen for simulating telemetry
go install github.com/open-telemetry/opentelemetry-collector-contrib/cmd/telemetrygen@latest
```

### Generate and collect telemetry

```bash
# Start the Collector
docker run \
  -p 127.0.0.1:4317:4317 \
  -p 127.0.0.1:4318:4318 \
  -p 127.0.0.1:55679:55679 \
  otel/opentelemetry-collector:0.156.0 \
  2>&1 | tee collector-output.txt
```

Ports:
- **4317** — OTLP over gRPC (default for most SDKs)
- **4318** — OTLP over HTTP
- **55679** — ZPages debug UI

```bash
# Generate traces
$GOBIN/telemetrygen traces --otlp-insecure --traces 3

# View traces at http://localhost:55679/debug/tracez
```

---

## Installation

### Docker
```bash
docker pull otel/opentelemetry-collector:0.156.0
```

### Kubernetes
Use Helm charts or the Operator. See [Helm Charts](https://opentelemetry.io/docs/platforms/kubernetes/helm/).

### Binary
Available for Linux, macOS, Windows. Download from [GitHub releases](https://github.com/open-telemetry/opentelemetry-collector/releases).

---

## Configuration

### Configuration structure

Four classes of pipeline components:
1. **Receivers** — collect telemetry data
2. **Processors** — transform, filter, enrich
3. **Exporters** — send to backends
4. **Connectors** — join two pipelines

Plus **Extensions** for additional capabilities.

Components are identified by `type[/name]` format (e.g., `otlp` or `otlp/2`). Components must be enabled in the `service` section.

### Example configuration

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  otlp_grpc:
    endpoint: otelcol:4317
    sending_queue:
      batch:

extensions:
  health_check:
    endpoint: 0.0.0.0:13133
  pprof:
    endpoint: 0.0.0.0:1777
  zpages:
    endpoint: 0.0.0.0:55679

service:
  extensions: [health_check, pprof, zpages]
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlp_grpc]
    metrics:
      receivers: [otlp]
      exporters: [otlp_grpc]
    logs:
      receivers: [otlp]
      exporters: [otlp_grpc]
```

### Multiple instances of same type

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
  otlp/2:
    protocols:
      grpc:
        endpoint: 0.0.0.0:55690

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlp_grpc]
    traces/2:
      receivers: [otlp/2]
      exporters: [otlp_grpc/2]
```

### File includes

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
exporters: ${file:exporters.yaml}
service:
  extensions: []
  pipelines:
    traces:
      receivers: [otlp]
      processors: []
      exporters: [otlp_grpc]
```

### Service section

Three subsections:
- **Extensions** — list of enabled extensions
- **Pelines** — define data flow (receivers → processors → exporters)
- **Telemetry** — Collector's own observability settings

### Environment variables

Use `${env:VARIABLE_NAME}` syntax in configuration.

### Authentication

Configure per-exporter or per-receiver authentication using authenticator extensions.

### Certificates

Configure TLS certificates for secure communication.

---

## Components

### Receivers

Collect telemetry data from various sources and formats. Common receivers:

| Receiver | Description |
|----------|-------------|
| **OTLP** | Receives OTLP over gRPC/HTTP |
| **Jaeger** | Receives Jaeger trace data |
| **Prometheus** | Scrapes Prometheus metrics |
| **Zipkin** | Receives Zipkin trace data |
| **filelog** | Reads logs from files |
| **hostmetrics** | Collects host metrics (CPU, memory, disk, network) |
| **k8scluster** | Collects Kubernetes cluster metrics |
| **k8sobjects** | Collects Kubernetes object events |

### Processors

Transform, filter, and enrich telemetry data. Common processors:

| Processor | Description |
|-----------|-------------|
| **batch** | Batches telemetry data for efficient export |
| **memory_limiter** | Limits memory usage, drops data when threshold exceeded |
| **filter** | Filters telemetry data based on conditions |
| **attributes** | Modifies span/log/metric attributes |
| **resource** | Modifies resource attributes |
| **tail_sampling** | Samples traces based on entire trace content |
| **probabilistic_sampler** | Head sampling based on probability |
| **spanmetrics** | Generates metrics from span data (connector) |
| **transform** | OTTL-based transformations |

### Exporters

Send telemetry data to backends. Common exporters:

| Exporter | Description |
|-----------|-------------|
| **OTLP** | Sends OTLP over gRPC/HTTP |
| **Prometheus** | Exports metrics to Prometheus |
| **Jaeger** | Sends traces to Jaeger (deprecated, use OTLP) |
| **Zipkin** | Sends traces to Zipkin |
| **debug** | Prints telemetry to stdout (replaces logging exporter) |
| **file** | Writes telemetry to files |
| **OTLP HTTP** | Sends OTLP over HTTP |

### Connectors

Join two pipelines, acting as both exporter and receiver. Can summarize, replicate, or route data.

Example (count connector — traces to metrics):
```yaml
connectors:
  count:
    spanevents:
      my.prod.event.count:
        description: The number of span events from my prod environment.
        conditions:
          - 'attributes["env"] == "prod"'
          - 'name == "prodevent"'

service:
  pipelines:
    traces:
      receivers: [foo]
      exporters: [count]
    metrics:
      receivers: [count]
      exporters: [bar]
```

### Extensions

Optional components expanding Collector capabilities:
- **health_check** — health monitoring endpoint
- **pprof** — Go pprof profiling endpoint
- **zpages** — built-in debug UI
- **basicauth** — basic authentication
- **oauth2client** — OAuth2 authentication
- **file_storage** — file-based storage for retries

---

## Deployment Patterns

### Agent pattern

Collector runs alongside the application or on the same host (sidecar, DaemonSet).

```
App/SDK → Collector (local) → Backend(s)
```

**Pros:** Offloads data quickly, local processing, retries
**Cons:** Resource overhead per host

### Gateway pattern

Collector runs as a standalone service (cluster/datacenter/region level). Applications send to a central OTLP endpoint.

```
App/SDK → Gateway Collector(s) → Backend(s)
```

**Load balancing:** Use out-of-the-box load balancer or the load-balancing exporter for trace-aware routing.

**Use case for load-balancing exporter:** Route all spans for a trace to the same Collector for tail sampling.

**Pros:** Centralized configuration, fewer connections to backends
**Cons:** Single point of failure (mitigate with multiple instances), network hop

### Agent-to-Gateway pattern

Two-tiered: agents forward to central gateway.

```
App/SDK → Agent Collector → Gateway Collector → Backend(s)
```

### No Collector

SDKs export directly to backends. Good for development, small-scale environments.

---

## Scaling the Collector

### Performance considerations

- Use batch processor for efficient export
- Configure memory_limiter to prevent OOM
- Tune sending_queue and retry settings
- Use multiple Collector instances behind a load balancer
- Monitor Collector's own telemetry (self-observability)

### Multi-backend scenarios

Configure multiple exporters in a single pipeline or use multiple pipelines.

---

## Distributions

### Core vs Contrib

- **Core distribution** (`otel/opentelemetry-collector`) — essential components
- **Contrib distribution** (`otel/opentelemetry-collector-contrib`) — includes community-contributed components

### Building custom Collector

Use the [OpenTelemetry Collector Builder](https://github.com/open-telemetry/opentelemetry-collector-builder) to create a custom distribution with selected components.

---

## Transforming Telemetry

Use the **Transform processor** with OTTL (OpenTelemetry Transformation Language) to modify telemetry data.

---

## Internal Telemetry

The Collector observes itself using its own telemetry pipeline. Configure in the `service.telemetry` section.

---

## Troubleshooting

- **ZPages** — debug UI at `http://localhost:55679/debug/tracez`
- **pprof** — Go profiling at `http://localhost:1777/debug/pprof`
- **Health check** — `http://localhost:13133/`
- **Collector logs** — check stdout or configured log output
- **Component not found** — ensure component is in your distribution

---

## Resiliency

The Collector provides resiliency through:
- Sending queues with persistent storage
- Retry mechanisms for failed exports
- Memory limiting to prevent OOM
- Health checks for orchestration

---

## Blueprints and Reference Implementations

Real-world deployment examples:
- [Adobe](https://opentelemetry.io/docs/collector/blueprints/adobe/)
- [Mastodon](https://opentelemetry.io/docs/collector/blueprints/mastodon/)
- [Skyscanner](https://opentelemetry.io/docs/collector/blueprints/skyscanner/)
