# Collector Components Detailed Reference

## Component Types

The Collector has five component types, each with a specific role in the data pipeline:

| Type | Role | Distribution |
|------|------|-------------|
| **Receivers** | Collect telemetry from sources/formats | Core + Contrib |
| **Processors** | Transform, filter, enrich telemetry | Core + Contrib |
| **Exporters** | Send telemetry to backends | Core + Contrib |
| **Connectors** | Connect two pipelines (act as exporter + receiver) | Core + Contrib |
| **Extensions** | Additional capabilities (health, auth, profiling) | Core + Contrib |

Components marked with ⚠️ are unmaintained with no active codeowners.

## Configuration Structure

Collector config has two top-level sections:
1. **Component definitions** — receivers, processors, exporters, connectors, extensions
2. **Service section** — pipelines, extensions list, telemetry config

Component identifiers follow `type[/name]` format (e.g., `otlp` or `otlp/2`). Multiple instances of the same type allowed with unique identifiers.

### Example Configuration
```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:

exporters:
  otlp:
    endpoint: otelcol:4317

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
      processors: [batch]
      exporters: [otlp]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
```

### File Inclusion
Configs can include other files:
```yaml
exporters: ${file:exporters.yaml}
```

### Environment Variables
- `${env:VAR_NAME}` syntax in config
- `OTEL_COLLECTOR_*` env vars for Collector-level settings

### Configuration Providers
- `env` — environment variable provider
- `file` — file system provider
- `http` — HTTP fetch provider
- `https` — HTTPS fetch provider
- `yaml` — YAML string provider

### Authentication
Configurable per-component via authenticator extensions.

### Proxy Support
HTTP/HTTPS proxy support via standard env vars.

### Certificate Configuration
TLS certificates for secure communication between components.

### Override Settings
- Simple property: `${env:VAR}`
- Complex nested keys: supported
- Multiple values: supported
- Array values: supported

---

## Receivers (Complete List)

### Core Receivers
| Receiver | Description |
|----------|-------------|
| **OTLP** | Receives OTLP via gRPC and HTTP |
| **No-op** | Testing receiver, produces no data |

### Contrib Receivers — Infrastructure & Cloud
| Receiver | Description |
|----------|-------------|
| **Active Directory DS** | AD Domain Services metrics |
| **activedirectoryinvreceiver** | AD inventory receiver |
| **Aerospike** | Aerospike metrics |
| **Apache Web Server** | Apache HTTP server metrics |
| **Apache Spark** | Spark cluster metrics |
| **AWS CloudWatch** | CloudWatch metrics/logs |
| **AWS Container Insights** | ECS/EKS container metrics |
| **AWS ECS Container Metrics** | ECS task metrics |
| **AWS Kinesis Firehose** | Kinesis Data Firehose receiver |
| **AWS Lambda** | Lambda function receiver |
| **AWS S3** | S3 object receiver |
| **AWS X-Ray** | X-Ray trace receiver |
| **Azure Blob** | Azure Blob Storage receiver |
| **Azure Event Hub** | Azure Event Hubs receiver |
| **Azure Functions** | Azure Functions metrics |
| **Azure Monitor** | Azure Monitor metrics |
| **Carbon** | Carbon/Graphite metrics |
| **Chrony** | NTP daemon metrics |
| **Cisco OS** | Cisco device metrics |
| **Cloudflare** | Cloudflare metrics |
| **Cloud Foundry** | CF metrics |
| **CollectD** | CollectD JSON receiver |
| **CouchDB** | CouchDB metrics |
| **Datadog** | Datadog agent metrics |
| **Docker Stats** | Docker container stats |
| **Elasticsearch** | Elasticsearch cluster metrics |
| **Envoy ALS** | Envoy Access Log Service |
| **Expvar** | Go expvar metrics |
| **Faro** | Web telemetry (browser) |
| **File Log** | Read logs from files |
| **File Stats** | File system stats |
| **FlinkMetrics** | Apache Flink metrics |
| **Fluent Forward** | Fluentd/Fluentbit protocol |
| **GitHub** | GitHub API metrics |
| **GitLab** | GitLab CI/CD metrics |
| **Google Cloud Monitoring** | GCP Cloud Monitoring |
| **Google Pub/Sub** | GCP Pub/Sub |
| **Google Pub/Sub Push** | GCP Pub/Sub push endpoint |
| **Google Cloud Spanner** | Spanner database metrics |
| **HAProxy** | HAProxy metrics |
| **Host Metrics** | CPU, memory, disk, network |
| **HTTP Check** | HTTP endpoint health check |
| **Huawei Cloud CES** | Huawei Cloud metrics |
| **ICMP Check** | ICMP ping check |
| **IIS** | Microsoft IIS metrics |
| **InfluxDB** | InfluxDB metrics |
| **Jaeger** | Jaeger trace receiver |
| **JMX** | Java JMX metrics |
| **Journald** | systemd journald logs |
| **Kafka** | Kafka message receiver |
| **Kafka Metrics** | Kafka broker metrics |
| **Kubernetes Cluster** | K8s cluster metrics |
| **Kubernetes Events** | K8s events |
| **Kubernetes Objects** | K8s API objects |
| **Kubelet Stats** | Kubelet container stats |
| **Libhoney** | Honeycomb Libhoney protocol |
| **Loki** | Grafana Loki logs |
| **macOS Unified Logging** | macOS unified log |
| **Memcached** | Memcached metrics |
| **MongoDB** | MongoDB metrics |
| **MongoDB Atlas** | MongoDB Atlas API metrics |
| **MySQL** | MySQL metrics |
| **Named Pipe** | Windows named pipe logs |
| **Netflow** | Netflow network traffic |
| **NGINX** | NGINX metrics |
| **NSX-T** | VMware NSX-T metrics |
| **NTP** | NTP server metrics |
| **Oracle DB** | Oracle Database metrics |
| **osquery** | osquery results |
| **OTLP JSON File** | Read OTLP JSON from file |
| **Podman Stats** | Podman container stats |
| **PostgreSQL** | PostgreSQL metrics |
| **Pprof** | Go pprof profiles |
| **Prometheus** | Prometheus scraping |
| **Prometheus Remote Write** | Remote write receiver |
| **Pulsar** | Apache Pulsar messages |
| **Pure Storage FlashArray** | Pure Storage metrics |
| **Pure Storage FlashBlade** | Pure Storage metrics |
| **RabbitMQ** | RabbitMQ metrics |
| **Receiver Creator** | Dynamic receiver creation |
| **Redfish** | Redfish hardware metrics |
| **Redis** | Redis metrics |
| **Riak** | Riak metrics |
| **SAP HANA** | SAP HANA metrics |
| **SignalFx** | SignalFx metrics |
| **Simple Prometheus** | Simplified Prometheus |
| **SkyWalking** | Apache SkyWalking traces |
| **SNMP** | SNMP device metrics |
| **Snowflake** | Snowflake DB metrics |
| **Solace** | Solace PubSub+ metrics |
| **Splunk Enterprise** | Splunk metrics |
| **Splunk HEC** | Splunk HEC receiver |
| **SQL Query** | Generic SQL query metrics |
| **SQL Server** | Microsoft SQL Server metrics |
| **SSH Check** | SSH endpoint check |
| **StatsD** | StatsD metrics |
| **STEF** | Stream Telemetry Format |
| **Syslog** | Syslog logs |
| **Systemd** | systemd journal logs |
| **TCP Check** | TCP endpoint check |
| **TCP Log** | TCP log receiver |
| **TLS Check** | TLS certificate check |
| **UDP Log** | UDP log receiver |
| **vCenter** | VMware vCenter metrics |
| **VCR** | Version Control Receiver |
| **Wavefront** | Wavefront metrics |
| **Webhook Event** | Webhook receiver |
| **Windows Event Log** | Windows event logs |
| **Windows Perf Counters** | Windows performance counters |
| **Windows Service** | Windows service status |
| **YANG gRPC** | YANG gRPC streaming |
| **Zipkin** | Zipkin trace receiver |
| **Zookeeper** | ZooKeeper metrics |

---

## Processors (Complete List)

### Core Processors
| Processor | Description |
|-----------|-------------|
| **Batch** | Batches telemetry for efficient export |
| **Memory Limiter** | Drops data when memory limit reached |

### Contrib Processors
| Processor | Description |
|-----------|-------------|
| **Attributes** | Add/modify/delete span/log/metric attributes |
| **AWS ECS Attributes** | Adds AWS ECS metadata |
| **cardinalityguardian** | Guards against metric cardinality explosion |
| **Coralogix** | Coralogix-specific processing |
| **Cumulative to Delta** | Converts cumulative → delta temporality |
| **Delta to Cumulative** | Converts delta → cumulative temporality |
| **Delta to Rate** | Converts delta → rate |
| **Drain** | Drains telemetry from pipeline |
| **Dynamic Sampling** | Runtime-configurable sampling |
| **Filter** | Filters telemetry based on conditions |
| **GenAI Normalizer** | Normalizes GenAI semantic conventions |
| **GeoIP** | Adds geographic IP attributes |
| **Group by Attributes** | Groups telemetry by attributes |
| **Group by Trace** | Groups spans by trace ID |
| **Interval** | Aggregates at fixed intervals |
| **Isolation Forest** | Anomaly detection |
| **Kubernetes Attributes** | Adds K8s pod/namespace metadata |
| **Log DeDuplication** | Removes duplicate log records |
| **Logs Transform** | Transforms log records |
| **Lookup** | Enriches with lookup tables |
| **Metrics Generation** | Generates new metrics from existing |
| **Metric Start Time** | Adjusts metric start timestamps |
| **Metrics Transform** | Renames/scales/aggregates metrics |
| **Probabilistic Sampling** | Random sampling by percentage |
| **Redaction** | Removes sensitive attributes |
| **Remote Tap** | Remote telemetry inspection |
| **Resource Detection** | Detects host/cloud resource info |
| **Resource** | Adds/modifies resource attributes |
| **Schema** | Applies schema URL transformations |
| **Span** | Modifies span names/attributes |
| **Span Pruning** | Removes span data selectively |
| **Sumo Logic** | Sumo Logic-specific processing |
| **Tail Sampling** | Samples complete traces |
| **Transform** | OTTL-based telemetry transformation |
| **Unroll** | Unrolls nested attributes |

---

## Exporters (Complete List)

### Core Exporters
| Exporter | Description |
|----------|-------------|
| **Debug** | Prints telemetry to console |
| **No-op** | Discards all telemetry |
| **OTLP gRPC** | Exports via OTLP/gRPC |
| **OTLP HTTP** | Exports via OTLP/HTTP |

### Contrib Exporters — Backends
| Exporter | Description |
|----------|-------------|
| **Alertmanager** | Prometheus Alertmanager |
| **AlibabaCloud LogService** | Alibaba Cloud Log Service |
| **AWS CloudWatch Logs** | CloudWatch Logs |
| **AWS CloudWatch EMF** | CloudWatch Embedded Metric Format |
| **AWS Kinesis** | Kinesis Data Streams |
| **AWS S3** | S3 storage |
| **AWS X-Ray** | X-Ray tracing |
| **Azure Blob Storage** | Azure Blob |
| **Azure Data Explorer** | Azure Data Explorer (Kusto) |
| **Azure Monitor** | Azure Monitor |
| **BMC Helix** | BMC Helix |
| **Cassandra** | Cassandra database |
| **ClickHouse** | ClickHouse database |
| **Coralogix** | Coralogix platform |
| **Datadog** | Datadog platform |
| **DataSet** | DataSet platform |
| **Apache Doris** | Apache Doris |
| **Elasticsearch** | Elasticsearch |
| **Faro** | Grafana Faro (browser) |
| **File** | Write to file |
| **Google Cloud** | Google Cloud Trace/Monitoring |
| **Google Cloud Pub/Sub** | GCP Pub/Sub |
| **Google Cloud Storage** | GCS |
| **Google Cloud Managed Prometheus** | GMP |
| **Honeycomb Marker** | Honeycomb markers |
| **InfluxDB** | InfluxDB |
| **Kafka** | Kafka message export |
| **Load Balancing** | Distributes across exporters |
| **LogicMonitor** | LogicMonitor |
| **Logz.io** | Logz.io |
| **Mezmo** | Mezmo (formerly DevOps Insight) |
| **OpenSearch** | OpenSearch |
| **OpenTelemetry Arrow** | OTLP Arrow (columnar format) |
| **Prometheus** | Prometheus exposition |
| **Prometheus Remote Write** | Prometheus remote write |
| **Pulsar** | Apache Pulsar |
| **RabbitMQ** | RabbitMQ |
| **Sematext** | Sematext |
| **Sentry** | Sentry error tracking |
| **SignalFx** | SignalFx (Splunk Observability) |
| **Splunk HEC** | Splunk HTTP Event Collector |
| **STEF** | Stream Telemetry Format |
| **Sumo Logic** | Sumo Logic |
| **Syslog** | Syslog export |
| **TencentCloud LogService** | Tencent Cloud |
| **Tinybird** | Tinybird |
| **Zipkin** | Zipkin tracing |

---

## Connectors (Complete List)

| Connector | Description |
|-----------|-------------|
| **Count** | Counts telemetry items as metric |
| **Datadog** | Datadog-specific connector |
| **Exceptions** | Extracts exceptions from traces as metrics |
| **Failover** | Fails over between exporters |
| **Forward** | Forwards data between pipelines |
| **Grafana Cloud** | Grafana Cloud connector |
| **Metrics as Logs** | Converts metrics to log records |
| **OTLP JSON** | Parses OTLP JSON from logs |
| **Round-Robin** | Distributes data round-robin |
| **Routing** | Routes data based on conditions |
| **Service Graph** | Builds service dependency graph |
| **Signal to Metrics** | Converts signal data to metrics |
| **Slow SQL** | Identifies slow SQL queries |
| **Span Metrics** | Generates metrics from spans |
| **Sum** | Sums telemetry values as metric |

---

## Extensions (Complete List)

### Core Extensions
| Extension | Description |
|----------|-------------|
| **Memory Limiter** | Limits Collector memory usage |
| **zPages** | Debug pages for telemetry inspection |

### Contrib Extensions — Authentication
| Extension | Description |
|----------|-------------|
| **ACK** | Acknowledgment extension |
| **ASAP Client Auth** | Atlassian ASAP authentication |
| **AWS Proxy** | AWS proxy for API calls |
| **Azure Authenticator** | Azure AD authentication |
| **Basic Auth** | HTTP Basic authentication |
| **Bearer Token Auth** | Bearer token authentication |
| **Google Client Auth** | Google Cloud authentication |
| **Headers Setter** | Sets HTTP headers on export |
| **OAuth2 Client Credentials** | OAuth2 client credentials flow |
| **OIDC Authenticator** | OpenID Connect authentication |
| **SigV4 Authenticator** | AWS SigV4 signing |

### Contrib Extensions — Observability & Management
| Extension | Description |
|----------|-------------|
| **Cgroup Go Runtime** | cgroup-aware Go runtime |
| **Datadog** | Datadog extension |
| **Health Check** | Health check endpoint |
| **Health Check V2** | Enhanced health checks |
| **HTTP Forwarder** | HTTP request forwarding |
| **Jaeger Remote Sampling** | Jaeger remote sampling config |
| **Kubernetes Leader Elector** | K8s leader election |
| **MCP Server** | Model Context Protocol server |
| **OpAMP Agent** | OpAMP remote management |
| **Performance Profiler** | pprof profiling endpoint |
| **Remote Tap** | Remote telemetry tapping |
| **Solarwinds APM Settings** | Solarwinds APM config |
| **Sumo Logic** | Sumo Logic extension |

---

## Component Stability Levels

| Level | Description |
|-------|-------------|
| **Development** | Early stage, breaking changes expected |
| **Alpha** | Feature complete, may have bugs |
| **Beta** | Stable API, minor breaking changes possible |
| **Stable** | Production-ready, backward compatible |
| **Deprecated** | Will be removed in future |

## Distribution Inclusion

Components are included in different distributions:
- **Core** — minimal components (OTLP, Batch, Memory Limiter, Debug)
- **Contrib** — all community components
- **K8s** — Kubernetes-optimized subset
- **Custom** — built via OCB with selected components
