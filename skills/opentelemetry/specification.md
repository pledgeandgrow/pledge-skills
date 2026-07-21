# OpenTelemetry Specification Detailed Reference

## Specification Version: 1.59.0

## Structure

The specification is organized into these sections:

### Overview & Principles
- **Overview** — purpose, scope, and relationship to implementations
- **Glossary** — standardized terminology
- **Core Principles** — design decisions and trade-offs
- **Versioning and Stability** — maturity levels: Development, Alpha, Beta, Stable, Deprecated
- **Library Guidelines** — package layout, error handling, self-observability
- **Performance** — performance guidelines for SDK implementations

### API Specification

#### Context
- **Propagators** — interface for serializing/deserializing context across process boundaries
  - TextMapPropagator: inject/extract context into text-based carriers
  - Composite propagators: chain multiple propagators
- **Environment Variable Carriers** — standard env var-based context propagation
- **Baggage API** — mechanism for propagating key-value context across services
  - Baggage: entries with key, value, metadata
  - Baggage operations: get, set, remove, get_all
  - Propagation: via W3C Baggage format

#### Tracing API (Stable)
- **TracerProvider** — entry point, creates Tracers
  - Operations: getTracer, shutdown
- **Tracer** — creates Spans
  - Operations: startSpan, startSpanFromContext
- **Span** — represents a single operation
  - Properties: name, SpanContext, parent, SpanKind, start/end timestamps, attributes, links, events, status
  - Operations: setAttribute, addEvent, setStatus, end, recordError, updateName
  - Span lifetime: created → configured → ended → exported
- **SpanContext** — immutable identification
  - Fields: traceId, spanId, traceFlags, traceState, isRemote
  - IsValid: traceId/spanId non-zero
- **SpanKind** — Client, Server, Internal, Producer, Consumer
- **Link** — reference to another SpanContext
- **Status** — Unset, Ok, Error (with optional description)

#### Metrics API (Stable)
- **MeterProvider** — entry point, creates Meters
- **Meter** — creates Instruments
- **Instruments**:
  - **Counter** (synchronous) — monotonic increasing, add() method
  - **Asynchronous Counter** (ObservableCounter) — callback-based, monotonic
  - **UpDownCounter** (synchronous) — non-monotonic, add() method
  - **Asynchronous UpDownCounter** (ObservableUpDownCounter) — callback-based, non-monotonic
  - **Histogram** (synchronous) — records values with explicit bucket boundaries, record() method
  - **Gauge** (synchronous) — records current value, record() method
  - **Asynchronous Gauge** (ObservableGauge) — callback-based, current value
- **Instrument characteristics**: name, kind, unit, description, advisory parameters
- **Measurement** — value + attributes reported by instruments
- **Multiple-instrument callbacks** — single callback observing multiple instruments

#### Logs API (Stable)
- **LoggerProvider** — entry point, creates Loggers
  - Operations: getLogger, shutdown
- **Logger** — emits LogRecords
  - Operations: emit (LogRecord), enabled (severity check)
- **Optional parameters**: severity, body, attributes, context, timestamp, observedTimestamp, incidentAttributes

### SDK Specification

#### Tracing SDK (Stable)
- **TracerProvider** — manages Tracers, configuration, shutdown
  - TracerConfig + TracerConfigurator (Development)
  - ForceFlush operation
- **Sampling** — controls noise and overhead
  - **IsRecording** flag — if false, span discards all tracing data
  - **Sampled** flag in TraceFlags — propagated to child spans
  - **Sampler** interface: ShouldSample(SamplingParams) → SamplingResult
  - **Built-in samplers**:
    - AlwaysOn — samples all spans
    - AlwaysOff — samples no spans
    - TraceIdRatioBased — samples fraction based on trace ID
    - ParentBased — delegates to parent's sampling decision
    - ParentBased(AlwaysOn) — default sampler
  - **SamplingResult**: Decision (RecordAndSample / RecordOnly / Drop) + attributes + traceState
- **Span Limits** — max attributes, max events, max links, max attribute value length
- **ID Generators** — generates traceId and spanId (must be random)
- **Span Processor** — hooks for span start/end
  - **Simple Span Processor** — forwards spans synchronously to exporter
  - **Batch Span Processor** — batches spans and sends to exporter in bulk
  - Custom span processors allowed
- **Span Exporter** — sends spans to backend
  - Export(spans) → ExportResult
  - Shutdown, ForceFlush operations

#### Metrics SDK (Mixed stability)
- **MeterProvider** — manages Meters, Resource, Views
  - **View** — customizes metric output (name, description, aggregation, attribute keys)
  - **Aggregation** — how measurements are combined:
    - Default: Sum for counters, LastValue for gauges, ExplicitBucketHistogram for histograms
    - Explicit bucket histogram: boundaries, record min/max/sum/count
  - **Cardinality limits** — limits on attribute set size
- **Meter** — creates instruments with config
  - Duplicate instrument registration handling
  - Instrument name/unit/description/advisory parameters
- **Attribute limits** — max attribute count, max value length
- **Exemplar** — preserves specific measurements with trace context
  - ExemplarFilter: AlwaysOn, TraceBased
  - ExemplarReservoir: stores exemplars
- **MetricReader** — reads metrics from SDK
  - Operations: collect, shutdown, forceFlush
  - **Periodic exporting MetricReader** — exports at intervals
- **MetricExporter** — sends metrics to backend
  - Push Metric Exporter — triggered by MetricReader
  - Pull Metric Exporter — exposes metrics for scraping
- **MetricProducer** — produces metric data
- **MetricFilter** — filters metric data

#### Logs SDK
- **LoggerProvider** — manages Loggers, Resource, configuration
- **LogRecordProcessor** — processes log records
  - Simple LogRecord Processor — synchronous
  - Batch LogRecord Processor — batched
- **LogRecordExporter** — sends log records to backend

#### Resource SDK
- **Resource** — entity producing telemetry
  - Created via Resource.create(attributes)
  - Resource detectors: host, OS, container, Kubernetes, cloud provider
  - Default attributes: service.name, service.version, telemetry.sdk.*

#### Configuration
- **Environment variables** — standard OTEL_* variables
- **Programmatic configuration** — SDK builder patterns
- **Configuration types**: TracerProvider, MeterProvider, LoggerProvider

### Data Specification

#### Semantic Conventions
- Standard attribute names, types, and meanings
- Domains: General, CI/CD, Cloud Providers, CloudEvents, Database, Exceptions, FaaS, Feature Flags, Generative AI, GraphQL, HTTP, Messaging, Object Stores, RPC, System
- By signal: Events, Logs, Metrics, Profiles, Resource, Trace

#### Protocol (OTLP)
- Protobuf-based encoding
- gRPC and HTTP/1.1 transports
- Data types: traces, metrics, logs, profiles
- Export, import, and streaming patterns

#### Metrics Data Model
- Gauge, Sum, Histogram, ExponentialHistogram, Summary
- Temporality: cumulative, delta
- Aggregation temporality

#### Logs Data Model
- **Log and Event Record fields**:
  - **Timestamp** — when the event occurred
  - **ObservedTimestamp** — when the log was observed by the system
  - **Trace Context** — traceId, spanId, flags (correlate with traces)
  - **Severity** — severityNumber, severityText (TRACE, DEBUG, INFO, WARN, ERROR, FATAL)
  - **Body** — main log message (any value type)
  - **Resource** — entity producing the log
  - **InstrumentationScope** — instrumentation library info
  - **Attributes** — additional key-value pairs
  - **EventName** — optional event name for structured events
- **Field kinds**: required, recommended, optional, conditional
- **Example mappings**: syslog, JSON, Log4j, Zap, etc.

#### Profiles
- Profile mappings to OTLP data model (in development)

### Compatibility
- **OpenCensus** — migration path and bridge
- **OpenTracing** — migration path and bridge
- **Prometheus and OpenMetrics** — metric mapping
- **Trace Context in non-OTLP Log Formats** — embedding trace context in non-OTLP logs

### Notation Conventions
- Keywords: MUST, MUST NOT, REQUIRED, SHOULD, SHOULD NOT, RECOMMENDED, MAY, OPTIONAL
- Interpreted per BCP 14 (RFC 2119, RFC 8174) when in all capitals

---

## Semantic Conventions Detailed Reference (v1.43.0)

### Domains

| Domain | Status | Description |
|--------|--------|-------------|
| **General** | Stable | Common attributes for all signals: service, telemetry, network, thread, code |
| **CI/CD** | Development | Pipeline, build, deployment attributes |
| **Cloud Providers** | Development | AWS, Azure, GCP resource attributes |
| **CloudEvents** | Development | CloudEvents specification attributes |
| **Database** | Stable | DB operations: system, operation, statement, table, connection |
| **Exceptions** | Stable | Exception type, message, stacktrace |
| **FaaS** | Development | Function triggers, invocations, cold starts |
| **Feature Flags** | Development | Flag evaluation attributes |
| **Generative AI** | Development | Moved to separate repo: semantic-conventions-genai |
| **GraphQL** | Development | Operation type, document, operation name |
| **HTTP** | Mixed | HTTP method, status, URL, flavor, client/server |
| **Messaging** | Stable | System, destination, operation, message ID |
| **Object Stores** | Development | Bucket, region, operation |
| **RPC** | Stable | System, service, method |
| **System** | Development | CPU, memory, disk, network, process, filesystem |

### By Signal

| Signal | Description |
|--------|-------------|
| **Events** | Event name, domain, attributes |
| **Logs** | Log severity, body, trace context correlation |
| **Metrics** | Metric names, units, descriptions, instrument types |
| **Profiles** | Profile type, sample types, frame info |
| **Resource** | service.name, service.version, host.*, os.*, container.*, k8s.*, cloud.* |
| **Trace** | Span names, kind, status, attributes per domain |

### HTTP Semantic Conventions (Mixed)
- **Opt-in mechanism**: `OTEL_SEMCONV_STABILITY_OPT_IN` env var
  - `http` — emit new stable conventions only
  - `http/dup` — emit both old and new conventions
  - Default: continue emitting old conventions
- **HTTP Spans**: client/server span attributes (http.request.method, http.response.status_code, url.full, server.address, etc.)
- **HTTP Metrics**: http.server.request.duration, http.client.request.duration
- **HTTP Exceptions**: exception.type, exception.message, exception.stacktrace

### Resource Attributes (Stable)
| Attribute | Description |
|-----------|-------------|
| `service.name` | Name of the service (required) |
| `service.version` | Version of the service |
| `service.namespace` | Namespace for service grouping |
| `service.instance.id` | Unique instance ID |
| `host.name` | Hostname |
| `host.id` | Unique host ID |
| `os.type` | Operating system type |
| `os.name` | OS name |
| `os.version` | OS version |
| `container.name` | Container name |
| `container.id` | Container ID |
| `k8s.namespace.name` | Kubernetes namespace |
| `k8s.pod.name` | Pod name |
| `k8s.pod.uid` | Pod UID |
| `cloud.provider` | Cloud provider name |
| `cloud.account.id` | Cloud account ID |
| `cloud.region` | Cloud region |
| `telemetry.sdk.name` | SDK name (opentelemetry) |
| `telemetry.sdk.language` | SDK language |
| `telemetry.sdk.version` | SDK version |

### Database Semantic Conventions (Mixed — Stable spans)
**Opt-in**: `OTEL_SEMCONV_STABILITY_OPT_IN` = `database` | `database/dup`

**DB Span Attributes (Stable)**:
| Attribute | Requirement Level | Description |
|-----------|-------------------|-------------|
| `db.system.name` | Required | Database system (other_sql, softwareag.adabas, actian.ingres, etc.) |
| `db.collection.name` | Conditionally Required | Collection/table name (e.g., public.users, customers) |
| `db.namespace` | Conditionally Required | Database namespace (e.g., customers, test.users) |
| `db.operation.name` | Conditionally Required | Operation name (e.g., findAndModify, HMSET, SELECT) |
| `db.response.status_code` | Conditionally Required | Response status code (e.g., 102, ORA-17002, 08P01, 404) |
| `error.type` | Conditionally Required | Error type (e.g., timeout, java.net.UnknownHostException) |
| `server.port` | Conditionally Required | Database server port |
| `db.operation.batch.size` | Recommended | Batch size (e.g., 2, 3, 4) |
| `db.query.summary` | Recommended | Sanitized query summary (e.g., SELECT wuser_table) |
| `db.query.text` | Recommended | Query text with parameter placeholders (e.g., SELECT * FROM wuser_table where username = ?) |
| `db.stored_procedure.name` | Recommended | Stored procedure name (e.g., GetCustomer) |
| `network.peer.address` | Recommended | Network peer address (e.g., 10.1.2.80, /tmp/my.sock) |
| `network.peer.port` | Recommended | Network peer port |
| `server.address` | Recommended | Database server address |

**Span kind**: CLIENT (or INTERNAL for in-memory DBs)
**Span name**: `{db.operation.name}` or `{db.collection.name}` or `{db.system.name}`

**Technology-specific DB semconv**:
- AWS DynamoDB
- Cassandra
- Azure Cosmos DB
- CouchDB
- Elasticsearch
- HBase
- MongoDB
- MSSQL
- MySQL
- Oracle
- PostgreSQL
- Redis
- SQL Server

**DB Metrics**: `db.client.operation.duration` (histogram)
**DB Exceptions**: `exception.type`, `exception.message`, `exception.stacktrace`

### Messaging Semantic Conventions (Development)
**Opt-in**: `OTEL_SEMCONV_STABILITY_OPT_IN` = `messaging` | `messaging/dup`

**Messaging Span Attributes**:
| Attribute | Requirement Level | Description |
|-----------|-------------------|-------------|
| `messaging.operation.name` | Required | Operation (ack, nack, send) |
| `messaging.system` | Required | System (activemq, aws.sns, aws_sqs, kafka, rabbitmq, etc.) |
| `error.type` | Conditionally Required | Error type |
| `messaging.batch.message_count` | Conditionally Required | Batch message count |
| `messaging.consumer.group.name` | Conditionally Required | Consumer group (e.g., my-group, indexer) |
| `messaging.destination.anonymous` | Conditionally Required | Whether destination is anonymous |
| `messaging.destination.name` | Conditionally Required | Destination name (e.g., MyQueue, MyTopic) |
| `messaging.destination.subscription.name` | Conditionally Required | Subscription name |
| `messaging.destination.template` | Conditionally Required | Destination template (e.g., /customers/{customerId}) |
| `messaging.destination.temporary` | Conditionally Required | Whether destination is temporary |
| `messaging.operation.type` | Conditionally Required | Operation type (create, send, receive) |
| `server.address` | Conditionally Required | Server address |
| `messaging.client.id` | Recommended | Client ID (e.g., client-5) |
| `messaging.destination.partition.id` | Recommended | Partition ID |
| `messaging.message.conversation_id` | Recommended | Conversation ID |
| `messaging.message.id` | Recommended | Message ID (e.g., 452a7c7c7c7048c2f887f61572b18fc2) |
| `network.peer.address` | Recommended | Network peer address |
| `network.peer.port` | Recommended | Network peer port |

**Attribute namespaces**:
- `messaging.message.*` — per-message attributes
- `messaging.destination.*` — destination attributes
- `messaging.batch.*` — batch operation attributes
- `messaging.consumer.*` — consumer attributes
- `messaging.{system}.*` — system-specific attributes

**Span kind**: PRODUCER (send/create), CONSUMER (receive/process)
**Trace structure**: Producer span → Create span (optional) → Process span (consumer)

**Technology-specific messaging semconv**:
- Apache Kafka
- RabbitMQ
- Apache RocketMQ
- Amazon SNS
- Amazon SQS

### RPC Semantic Conventions (Release Candidate)
**Opt-in**: `OTEL_SEMCONV_STABILITY_OPT_IN` = `rpc` | `rpc/dup`

**RPC Span Attributes**:
| Attribute | Description |
|-----------|-------------|
| `rpc.system` | RPC system (grpc, connect, dubbo, jsonrpc) |
| `rpc.service` | Service name |
| `rpc.method` | Method name |
| `server.address` | Server address |
| `server.port` | Server port |
| `network.peer.address` | Network peer address |
| `network.peer.port` | Network peer port |

**Technology-specific RPC semconv**:
- Connect RPC
- Apache Dubbo
- gRPC
- JSON-RPC

**RPC Metrics**: `rpc.server.duration`, `rpc.client.duration`
**RPC Exceptions**: `exception.type`, `exception.message`, `exception.stacktrace`

### FaaS Semantic Conventions (Development)
**Signals**: FaaS Spans, FaaS Metrics, FaaS Exceptions
**Technology-specific**: AWS Lambda

**Key FaaS Span Attributes**:
| Attribute | Description |
|-----------|-------------|
| `faas.trigger` | Trigger type (http, pubsub, timer, datasource) |
| `faas.invocation_id` | Invocation ID |
| `faas.coldstart` | Whether this was a cold start |
| `faas.trigger.name` | Trigger name |
| `faas.trigger.message_id` | Trigger message ID |

### System Semantic Conventions (Development)
**Sub-domains**:
- **System metrics**: CPU, memory, disk, network, filesystem
- **Container metrics**: CPU, memory, disk usage per container
- **K8s metrics**: pod/container/deployment/namespace metrics
- **OpenShift metrics**: OpenShift-specific metrics
- **Hardware metrics**: temperature, power, fan, voltage
- **Process metrics**: CPU, memory, disk I/O per process
- **Runtime Environment metrics**: Go, JVM, V8, Python, .NET runtime metrics

### CI/CD Semantic Conventions (Release Candidate)
**Signals**: CI/CD Spans, CI/CD Metrics, CI/CD Logs

**Key attributes**:
| Attribute | Description |
|-----------|-------------|
| `cicd.pipeline.name` | Pipeline name |
| `cicd.pipeline.run.id` | Pipeline run ID |
| `cicd.task.name` | Task name |
| `cicd.task.run.id` | Task run ID |
| `cicd.task.type` | Task type (build, test, deploy) |
| `cicd.result` | Result (success, failure, canceled) |

### Cloud Providers Semantic Conventions (Development)
**Technology-specific**: AWS SDK client spans

**Key attributes**:
| Attribute | Description |
|-----------|-------------|
| `rpc.system` | `aws-api` |
| `rpc.service` | AWS service name |
| `rpc.method` | AWS API method |
| `aws.request.id` | AWS request ID |

### CloudEvents Semantic Conventions (Development)
**Signals**: CloudEvents Spans (modeling CloudEvents as spans)

**Key attributes**:
| Attribute | Description |
|-----------|-------------|
| `cloudevents.id` | Event ID |
| `cloudevents.source` | Event source |
| `cloudevents.type` | Event type |
| `cloudevents.spec_version` | CloudEvents spec version |

### Object Stores Semantic Conventions (Development)
**Technology-specific**: AWS S3 client spans

### Feature Flags Semantic Conventions (Development)
**Signals**: Feature Flags in Events

**Key attributes**:
| Attribute | Description |
|-----------|-------------|
| `feature_flag.key` | Flag key |
| `feature_flag.provider.name` | Provider name |
| `feature_flag.variant` | Variant name |
| `feature_flag.reason` | Evaluation reason |

### GraphQL Semantic Conventions (Development)
**Signals**: GraphQL server spans

**Key attributes**:
| Attribute | Description |
|-----------|-------------|
| `graphql.operation.name` | Operation name |
| `graphql.operation.type` | Operation type (query, mutation, subscription) |
| `graphql.document` | GraphQL document |
