# Platforms, FaaS, and Collector Extensions

## Kubernetes

OpenTelemetry provides several tools for observing Kubernetes clusters and services.

### Components

- **OpenTelemetry Collector on Kubernetes** — deploy as DaemonSet (agent), Deployment (gateway), or Sidecar
- **OpenTelemetry Operator** — manages Collectors and auto-instrumentation
- **Helm Charts** — manage installs of Collector, Operator, and Demo
- **Target Allocator** — distributes Prometheus scrape targets across Collector instances

### Helm Charts

Add the OpenTelemetry Helm repository:
```bash
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
```

Available charts:
- **opentelemetry-collector** — deploy and manage Collector
- **opentelemetry-operator** — deploy and manage the Operator
- **opentelemetry-demo** — deploy the OTel demo

### OpenTelemetry Operator

Manages:
- OpenTelemetry Collector instances
- Auto-instrumentation of workloads

#### Installation
```bash
# Prerequisite: cert-manager must be installed
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/latest/download/opentelemetry-operator.yaml
```

#### Create a Collector instance
```yaml
apiVersion: opentelemetry.io/v1beta1
kind: OpenTelemetryCollector
metadata:
  name: simplest
spec:
  config:
    receivers:
      otlp:
        protocols:
          grpc:
            endpoint: 0.0.0.0:4317
          http:
            endpoint: 0.0.0.0:4318
    processors:
      memory_limiter:
        check_interval: 1s
        limit_percentage: 75
        spike_limit_percentage: 15
    exporters:
      debug: {}
    service:
      pipelines:
        traces:
          receivers: [otlp]
          processors: [memory_limiter]
          exporters: [debug]
```

#### Auto-instrumentation injection
The Operator can inject zero-code instrumentation for .NET, Java, Node.js, Python, and Go into application pods automatically. Configure via `Instrumentation` CRD.

#### Horizontal Pod Autoscaling
Configure HPA with OpenTelemetry Collector metrics using the `target-allocator` or custom metrics API.

#### Target Allocator
Distributes Prometheus scrape targets across all deployed Collector instances to avoid duplicate scraping.

#### Troubleshooting
Common issues: target allocator not discovering targets, Collector pods not starting, auto-instrumentation not injecting.

### Collector Deployment on Kubernetes

| Pattern | Deployment Type | Use Case |
|---------|----------------|----------|
| **DaemonSet** | Agent | One Collector per node, collects node-level telemetry |
| **Deployment** | Gateway | Centralized Collector, scales horizontally |
| **Sidecar** | Agent (per-pod) | One Collector per application pod |
| **StatefulSet** | Gateway (stateful) | For tail sampling, requires sticky routing |

---

## Functions as a Service (FaaS)

FaaS platforms have different monitoring requirements than Kubernetes or VMs due to platform quirks.

### Supported platforms
- **AWS Lambda** — OpenTelemetry Lambda layer for auto-instrumentation
- **Azure Functions** — via Application Insights / OTLP exporters
- **Google Cloud Functions** — via Cloud Trace / OTLP exporters

### AWS Lambda

#### Auto-instrumentation
OpenTelemetry provides Lambda layers for:
- **Java** — `opentelemetry-javaagent` Lambda layer
- **Python** — `opentelemetry-instrument` Lambda layer
- **Node.js** — `@opentelemetry/auto-instrumentations-node` Lambda layer

#### Lambda Collector
A Collector can run as a Lambda extension to receive telemetry and export to backends, reducing cold start impact.

#### Manual instrumentation
Use standard OTel SDK in Lambda handler code. Ensure proper context propagation across invocations.

### Community Assets
- [OpenTelemetry Lambda](https://github.com/open-telemetry/opentelemetry-lambda)
- [AWS Distro for OpenTelemetry](https://aws-otel.github.io/)

---

## Client-side Applications

### Android
- Use OpenTelemetry Swift SDK (supports iOS/macOS)
- Export via OTLP to a Collector gateway
- Consider batching and battery impact

### iOS
- Use OpenTelemetry Swift SDK
- Export via OTLP
- Consider app lifecycle and background restrictions

### Web (Browser)
- Use `@opentelemetry/sdk-trace-web`
- Web Tracer Provider with Zone context manager
- Export via OTLP/HTTP to a Collector gateway
- Consider CORS, payload size, and user privacy

---

## Building a Custom Collector (OCB)

### OpenTelemetry Collector Builder (ocb)

Assemble a custom Collector distribution with selected components.

#### Install
```bash
go install go.opentelemetry.io/collector/cmd/builder@latest
```

#### Configuration (builder-config.yaml)
```yaml
dist:
  name: otelcol-dev
  description: Basic OTel Collector distribution for Developers
  output_path: ./otelcol-dev

exporters:
  - gomod:
      go.opentelemetry.io/collector/exporter/debugexporter v0.156.0
  - gomod:
      go.opentelemetry.io/collector/exporter/otlpexporter v0.156.0

processors:
  - gomod:
      go.opentelemetry.io/collector/processor/batchprocessor v0.156.0

receivers:
  - gomod:
      go.opentelemetry.io/collector/receiver/otlpreceiver v0.156.0

providers:
  - gomod:
      go.opentelemetry.io/collector/confmap/provider/envprovider v1.48.0
  - gomod:
      go.opentelemetry.io/collector/confmap/provider/fileprovider v1.48.0
  - gomod:
      go.opentelemetry.io/collector/confmap/provider/httpprovider v1.48.0
  - gomod:
      go.opentelemetry.io/collector/confmap/provider/httpsprovider v1.48.0
  - gomod:
      go.opentelemetry.io/collector/confmap/provider/yamlprovider v1.48.0
```

#### Build
```bash
ocb --config builder-config.yaml
```

#### Containerize
Create a Dockerfile for the custom distribution:
```dockerfile
FROM alpine:latest
COPY otelcol-dev /otelcol-dev
ENTRYPOINT ["/otelcol-dev"]
```

### Manifest sections
- `dist` — distribution metadata (name, description, output path, version, go binary)
- `receivers` — list of receiver Go modules
- `processors` — list of processor Go modules
- `exporters` — list of exporter Go modules
- `connectors` — list of connector Go modules
- `extensions` — list of extension Go modules
- `providers` — configuration providers (env, file, http, https, yaml)
- `replaces` — Go module replacements for local development

### Custom component development
You can build custom receivers, processors, exporters, connectors, and extensions by implementing the appropriate interfaces and registering them with the Collector.

---

## OpAMP (Open Agent Management Protocol)

OpAMP is a protocol for managing OTel agents and Collectors remotely.

### Capabilities
- **Configuration management** — push configurations to agents
- **Agent health monitoring** — receive status reports
- **Capability reporting** — agents report supported features
- **Remote restart** — restart agents remotely

### Use cases
- Centralized management of fleet of Collectors
- Dynamic configuration updates without redeployment
- Monitoring Collector health across multiple clusters

### Implementation
- [OpAMP Specification](https://github.com/open-telemetry/opamp-spec)
- Supported in the Collector via the OpAMP server extension

---

## OpenTelemetry Demo

The OpenTelemetry Demo is a microservices-based application showcasing OTel instrumentation across multiple languages.

### Features
- 20+ microservices in different languages
- Traces, metrics, and logs correlation
- Multiple instrumentations (automatic and manual)
- Prometheus, Jaeger, Grafana integration
- Load generation frontend

### Deploy
```bash
# Via Helm
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm install my-otel-demo open-telemetry/opentelemetry-demo

# Via Docker Compose
git clone https://github.com/open-telemetry/opentelemetry-demo
cd opentelemetry-demo
docker compose up --no-build
```
