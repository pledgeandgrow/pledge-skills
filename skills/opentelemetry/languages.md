# Language SDKs Detailed Reference

## Go

### Status
- Traces: Stable | Metrics: Stable | Logs: Stable (experimental)

### Packages
```bash
go get go.opentelemetry.io/otel
go get go.opentelemetry.io/otel/sdk
go get go.opentelemetry.io/otel/exporters/stdout/stdouttrace
go get go.opentelemetry.io/otel/exporters/stdout/stdoutmetric
go get go.opentelemetry.io/otel/exporters/stdout/stdoutlog
go get go.opentelemetry.io/otel/exporters/otlp/otlptrace
go get go.opentelemetry.io/otel/exporters/otlp/otlpmetric
```

### SDK Initialization

```go
package main

import (
  "context"
  "errors"
  "time"

  "go.opentelemetry.io/otel"
  "go.opentelemetry.io/otel/exporters/stdout/stdoutlog"
  "go.opentelemetry.io/otel/exporters/stdout/stdoutmetric"
  "go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
  "go.opentelemetry.io/otel/log/global"
  "go.opentelemetry.io/otel/propagation"
  "go.opentelemetry.io/otel/sdk/log"
  "go.opentelemetry.io/otel/sdk/metric"
  "go.opentelemetry.io/otel/sdk/trace"
)

func setupOTelSDK(ctx context.Context) (func(context.Context) error, error) {
  var shutdownFuncs []func(context.Context) error

  shutdown := func(ctx context.Context) error {
    var err error
    for _, fn := range shutdownFuncs {
      err = errors.Join(err, fn(ctx))
    }
    shutdownFuncs = nil
    return err
  }

  handleErr := func(inErr error) {
    err = errors.Join(inErr, shutdown(ctx))
  }

  // Set up propagator
  prop := propagation.NewCompositeTextMapPropagator(
    propagation.TraceContext{},
    propagation.Baggage{},
  )
  otel.SetTextMapPropagator(prop)

  // Set up trace provider
  traceExporter, err := stdouttrace.New(stdouttrace.WithPrettyPrint())
  if err != nil { handleErr(err); return shutdown, err }
  tracerProvider := trace.NewTracerProvider(
    trace.WithBatcher(traceExporter,
      trace.WithBatchTimeout(time.Second)),
  )
  shutdownFuncs = append(shutdownFuncs, tracerProvider.Shutdown)
  otel.SetTracerProvider(tracerProvider)

  // Set up meter provider
  metricExporter, err := stdoutmetric.New(stdoutmetric.WithPrettyPrint())
  if err != nil { handleErr(err); return shutdown, err }
  meterProvider := metric.NewMeterProvider(
    metric.WithReader(metric.NewPeriodicReader(metricExporter,
      metric.WithInterval(3*time.Second))),
  )
  shutdownFuncs = append(shutdownFuncs, meterProvider.Shutdown)
  otel.SetMeterProvider(meterProvider)

  // Set up logger provider
  logExporter, err := stdoutlog.New(stdoutlog.WithPrettyPrint())
  if err != nil { handleErr(err); return shutdown, err }
  loggerProvider := log.NewLoggerProvider(
    log.WithProcessor(log.NewBatchProcessor(logExporter)),
  )
  shutdownFuncs = append(shutdownFuncs, loggerProvider.Shutdown)
  global.SetLoggerProvider(loggerProvider)

  return shutdown, nil
}
```

### Custom Instrumentation

```go
const name = "my-app"
var (
  tracer = otel.Tracer(name)
  meter  = otel.Meter(name)
)

func myHandler(w http.ResponseWriter, r *http.Request) {
  ctx, span := tracer.Start(r.Context(), "my-operation")
  defer span.End()

  roll := 1 + rand.Intn(6)
  rollValueAttr := attribute.Int("roll.value", roll)
  span.SetAttributes(rollValueAttr)

  rollCnt.Add(ctx, 1, metric.WithAttributes(rollValueAttr))
  // ...
}
```

### Run
```bash
export OTEL_RESOURCE_ATTRIBUTES="service.name=dice,service.version=0.1.0"
go run .
```

### Documentation sections
- Getting Started, Instrumentation, Using instrumentation libraries
- Exporters, Sampling, Context propagation
- Resources, SDK configuration, API reference
- Examples, Registry

### Repository
- [opentelemetry-go](https://github.com/open-telemetry/opentelemetry-go)
- [opentelemetry-go-contrib](https://github.com/open-telemetry/opentelemetry-go-contrib)

---

## Python

### Status
- Traces: Stable | Metrics: Stable | Logs: Development

### Version support
Python 3.10+

### Installation
```bash
pip install opentelemetry-api
pip install opentelemetry-sdk
pip install opentelemetry-distro  # includes API, SDK, bootstrap, instrument
```

### Zero-code instrumentation
```bash
pip install opentelemetry-distro opentelemetry-exporter-otlp
opentelemetry-bootstrap -a install  # auto-install instrumentations
opentelemetry-instrument python myapp.py
```

### Manual instrumentation
```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporters.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Configure exporter
span_processor = BatchSpanProcessor(OTLPSpanExporter())
trace.get_tracer_provider().add_span_processor(span_processor)

# Create spans
with tracer.start_as_current_span("my-operation"):
    # do work
    pass
```

### Extension packages
```bash
pip install opentelemetry-exporter-{exporter}
pip install opentelemetry-instrumentation-{instrumentation}
```

### Repositories
- [opentelemetry-python](https://github.com/open-telemetry/opentelemetry-python)
- [opentelemetry-python-contrib](https://github.com/open-telemetry/opentelemetry-python-contrib)

---

## Java

### Status
- Traces: Stable | Metrics: Stable | Logs: Stable

### Zero-code instrumentation (Agent)
```bash
# Download agent
curl -L -O https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar

# Run with agent
export JAVA_TOOL_OPTIONS="-javaagent:PATH/TO/opentelemetry-javaagent.jar"
export OTEL_TRACES_EXPORTER=console
export OTEL_METRICS_EXPORTER=console
export OTEL_LOGS_EXPORTER=console
java -jar myapp.jar
```

### Spring Boot Starter
```xml
<dependency>
  <groupId>io.opentelemetry.instrumentation</groupId>
  <artifactId>opentelemetry-spring-boot-starter</artifactId>
</dependency>
```

### Manual instrumentation
```java
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.trace.Tracer;

Tracer tracer = GlobalOpenTelemetry.getTracer("my-app");
Span span = tracer.spanBuilder("my-operation").startSpan();
try (Scope scope = span.makeCurrent()) {
    // do work
} finally {
    span.end();
}
```

### Configuration
- Environment variables (`OTEL_*`)
- System properties (`-Dotel.*`)
- Agent configuration file (`OTEL_JAVAAGENT_CONFIGURATION_FILE`)

### Supports 100+ libraries/frameworks automatically
- Spring Boot, Spring MVC, JAX-RS, Servlet
- HTTP clients (OkHttp, Apache HttpClient, Java HTTP Client)
- JDBC, MongoDB, Redis, Cassandra
- Kafka, RabbitMQ, JMS
- gRPC, AWS SDK, Azure SDK

### Repository
- [opentelemetry-java](https://github.com/open-telemetry/opentelemetry-java)
- [opentelemetry-java-instrumentation](https://github.com/open-telemetry/opentelemetry-java-instrumentation)

---

## JavaScript (Node.js & Browser)

### Status
- Traces: Stable | Metrics: Stable | Logs: Development

### Installation
```bash
npm install @opentelemetry/api
npm install @opentelemetry/sdk-node
npm install @opentelemetry/exporter-trace-otlp-http
```

### Node.js SDK setup
```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getResourceDetectors } = require('@opentelemetry/resources');

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  resourceDetectors: getResourceDetectors(),
});

sdk.start();
```

### Zero-code instrumentation
```bash
npm install @opentelemetry/auto-instrumentations-node
node --require @opentelemetry/auto-instrumentations-node/register app.js
```

### Browser instrumentation
Use `@opentelemetry/sdk-trace-web` with Web Tracer Provider.

### Repositories
- [opentelemetry-js](https://github.com/open-telemetry/opentelemetry-js)
- [opentelemetry-js-contrib](https://github.com/open-telemetry/opentelemetry-js-contrib)

---

## .NET

### Status
- Traces: Stable | Metrics: Stable | Logs: Stable

### Version support
All officially supported .NET and .NET Framework versions (except .NET Framework 3.5 SP1)

### Installation
```bash
dotnet add package OpenTelemetry
dotnet add package OpenTelemetry.Exporter.Console
dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
dotnet add package OpenTelemetry.Extensions.Hosting
```

### ASP.NET Core setup
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddOtlpExporter());

builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddOtlpExporter());

var app = builder.Build();
app.Run();
```

### Zero-code instrumentation
Available via `OpenTelemetry.AutoInstrumentation` NuGet package or standalone agent.

### Repository
- [opentelemetry-dotnet](https://github.com/open-telemetry/opentelemetry-dotnet)
- [opentelemetry-dotnet-instrumentation](https://github.com/open-telemetry/opentelemetry-dotnet-instrumentation)

---

## PHP

### Status
- Traces: Stable | Metrics: Development | Logs: Development

### Zero-code instrumentation
Extension-based auto-instrumentation available.

### Repository
- [opentelemetry-php](https://github.com/open-telemetry/opentelemetry-php)

---

## Ruby

### Status
- Traces: Stable | Metrics: Development | Logs: Development

### Installation
```ruby
gem 'opentelemetry-sdk'
```

### Setup
```ruby
require 'opentelemetry/sdk'

OpenTelemetry::SDK.configure do |c|
  c.service_name = 'my-app'
  c.add_span_processor(
    OpenTelemetry::SDK::Trace::Export::BatchSpanProcessor.new(
      exporter: OpenTelemetry::Exporter::OTLP::Exporter.new
    )
  )
end
```

### Adopters
Dropbox DocSend, Fulcrum, GitHub, Heroku, Puppet, Shopify, TableCheck, Uplight

### Repository
- [opentelemetry-ruby](https://github.com/open-telemetry/opentelemetry-ruby)

---

## Rust

### Status
- Traces: Beta | Metrics: Beta | Logs: Beta

### Crates
| Crate | Description |
|-------|-------------|
| `opentelemetry` | Core crate |
| `opentelemetry-api` | API only |
| `opentelemetry-sdk` | SDK implementation |
| `opentelemetry-otlp` | OTLP exporter |
| `opentelemetry-jaeger` | Jaeger exporter |
| `opentelemetry-zipkin` | Zipkin exporter |
| `opentelemetry-prometheus` | Prometheus exporter |
| `opentelemetry-semantic-conventions` | Semantic conventions |
| `opentelemetry-aws` | AWS resource detectors |
| `opentelemetry-datadog` | Datadog exporter |
| `opentelemetry-stackdriver` | Stackdriver exporter |
| `opentelemetry-http` | HTTP integration |

### Setup
```rust
use opentelemetry::trace::Tracer;

let tracer = opentelemetry_otlp::new_pipeline()
    .tracing()
    .with_exporter(opentelemetry_otlp::new_exporter().tonic())
    .install_simple()?;
```

### Repository
- [opentelemetry-rust](https://github.com/open-telemetry/opentelemetry-rust)

---

## Swift

### Status
- Traces: Stable | Metrics: Development | Logs: Development

### Supports iOS, macOS, server-side Swift

### Repository
- [opentelemetry-swift](https://github.com/open-telemetry/opentelemetry-swift)

---

## Kotlin

### Status
- Traces: Stable

### Uses Java SDK with Kotlin extensions

### Repository
- [opentelemetry-java-instrumentation](https://github.com/open-telemetry/opentelemetry-java-instrumentation)

---

## C++

### Status
- Traces: Stable | Metrics: Stable | Logs: Stable

### Repository
- [opentelemetry-cpp](https://github.com/open-telemetry/opentelemetry-cpp)

---

## Cross-Language Common Patterns

### Provider initialization
All SDKs follow the same pattern:
1. Create exporter(s)
2. Create provider with exporter and resource
3. Set as global provider
4. Register shutdown hook

### Resource configuration
All SDKs support:
- `OTEL_SERVICE_NAME` environment variable
- `OTEL_RESOURCE_ATTRIBUTES` environment variable
- Programmatic resource creation
- Resource detectors (host, OS, container, Kubernetes, cloud)

### Exporter configuration
All SDKs support:
- `OTEL_EXPORTER_OTLP_ENDPOINT`
- `OTEL_EXPORTER_OTLP_HEADERS`
- `OTEL_EXPORTER_OTLP_INSECURE`
- Per-signal exporter selection (`OTEL_TRACES_EXPORTER`, etc.)

### Propagator configuration
All SDKs support:
- `OTEL_PROPAGATORS` environment variable
- Default: `tracecontext,baggage` (W3C)
- Available: `tracecontext`, `baggage`, `b3`, `jaeger`

### Sampler configuration
All SDKs support:
- `OTEL_TRACES_SAMPLER` environment variable
- Common samplers: `parentbased_always_on`, `parentbased_traceidratio`, `always_on`, `traceidratio`
- `OTEL_TRACES_SAMPLER_ARG` for sampler-specific arguments
