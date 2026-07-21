# OpenTelemetry

## Overview

OpenTelemetry (OTel) is a vendor-neutral, open-source observability framework for instrumenting, generating, collecting, and exporting telemetry data — traces, metrics, and logs. It is an industry standard supported by 90+ observability vendors, integrated by many libraries/services/apps, and adopted by numerous end users.

OpenTelemetry was created as a merger of OpenTracing and OpenCensus.

## Key Principles

1. **You own the data you generate** — no vendor lock-in
2. **Single set of APIs and conventions** — learn once, use everywhere

## Main Components

- **Specification** — cross-language requirements for all implementations (API, SDK, Data/OTLP, Semantic Conventions)
- **OTLP Protocol** — defines the shape of telemetry data transport (gRPC + HTTP/Protobuf)
- **Semantic Conventions** — standard naming scheme for common telemetry data types
- **Language SDKs** — implement the specification, APIs, and export of telemetry data (Go, .NET, Java, JavaScript, Python, PHP, Ruby, Rust, Swift, Kotlin, C++)
- **Instrumentation Libraries** — auto-instrument common libraries and frameworks
- **Zero-code Instrumentation** — generate telemetry without code changes (Go, .NET, Java, JavaScript, Python, PHP)
- **OpenTelemetry Collector** — vendor-agnostic proxy that receives, processes, and exports telemetry data
- **OpenTelemetry Operator for Kubernetes** — injects zero-code instrumentation, manages Collector deployments
- **Helm Charts** — Collector, Demo, Operator charts for Kubernetes

## Signals

| Signal | Description |
|--------|-------------|
| **Traces** | Path of a request through your application |
| **Metrics** | Measurements captured at runtime |
| **Logs** | Recordings of events |
| **Baggage** | Contextual information passed between signals |
| **Profiles** | Resource usage at code level (in development) |

## Quick Reference

### Core Concepts
- **Observability** — understanding internal state of a system from its outputs
- **Context Propagation** — mechanism that moves context between services/processes (W3C TraceContext default)
- **Instrumentation** — code emitting signals (code-based or zero-code)
- **Resources** — entity producing telemetry (service name, pod, container, etc.)
- **Sampling** — reducing telemetry volume while maintaining representativeness

### Collector Components
- **Receivers** — collect telemetry from various sources/formats
- **Processors** — transform, filter, enrich telemetry data
- **Exporters** — send telemetry to observability backends
- **Connectors** — join two pipelines (act as both exporter and receiver)
- **Extensions** — additional capabilities (health checks, pprof, zpages)

### Deployment Patterns
- **Agent** — Collector runs alongside application (sidecar/DaemonSet)
- **Gateway** — Collector runs as standalone service (cluster/datacenter/region level)
- **Agent-to-Gateway** — two-tiered: agents forward to central gateway

## Documentation Structure

| File | Content |
|------|---------|
| `getting-started.md` | What is OTel, observability primer, getting started paths, language SDKs overview |
| `concepts.md` | Signals (traces, metrics, logs, baggage), context propagation, instrumentation, resources, sampling, semantic conventions, components, glossary |
| `collector.md` | Collector overview, quick start, configuration, components (receivers/processors/exporters/connectors/extensions), deployment patterns, scaling, distributions |
| `api.md` | OTLP protocol specification, language SDK APIs, zero-code instrumentation, migration guides, semantic conventions reference |
| `languages.md` | Per-language SDK detailed reference: Go, Python, Java, JavaScript, .NET, PHP, Ruby, Rust, Swift, Kotlin, C++ — status, installation, SDK setup, manual/zero-code instrumentation, code examples, repositories, cross-language common patterns |
| `platforms.md` | Kubernetes (Operator, Helm Charts, deployment patterns, target allocator, HPA, auto-instrumentation injection), FaaS (AWS Lambda, Azure, GCP), client-side apps (Android, iOS, Web), building custom Collector with OCB, OpAMP, OpenTelemetry Demo |
| `specification.md` | OTel specification v1.59.0 detailed reference: API spec (context, tracing, metrics, logs), SDK spec (tracing, metrics, logs, resource, configuration), data spec (OTLP, metrics/logs data models, semantic conventions), compatibility (OpenCensus, OpenTracing, Prometheus), semantic conventions v1.43.0 with all domains and attribute tables |
| `collector-components.md` | Complete Collector components reference: all receivers (90+), processors (35+), exporters (45+), connectors (15), extensions (25+) with descriptions, configuration structure, file inclusion, env vars, auth, certificates, component stability levels, distribution inclusion |
| `getting-started-guides.md` | Per-language getting started tutorials: Go (SDK init, otel.go, custom spans), Python (opentelemetry-distro, auto-instrument, manual), Java (javaagent, env vars, manual), JavaScript/Node.js (sdk-node, auto-instrumentations, manual), JavaScript/Browser (sdk-trace-web, document-load, parcel), .NET (NuGet packages, Program.cs setup, OTLP export), cross-language patterns, environment variables table |

## Official Documentation

- **Docs home**: https://opentelemetry.io/docs/
- **Specification**: https://opentelemetry.io/docs/specs/otel/
- **OTLP**: https://opentelemetry.io/docs/specs/otlp/
- **Semantic Conventions**: https://opentelemetry.io/docs/specs/semconv/
- **Collector**: https://opentelemetry.io/docs/collector/
- **Languages**: https://opentelemetry.io/docs/languages/
- **Zero-code**: https://opentelemetry.io/docs/zero-code/
- **Registry**: https://opentelemetry.io/ecosystem/registry/
