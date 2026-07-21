# OpenTelemetry Getting Started Guides (Per-Language Tutorials)

All guides use a simple dice-rolling HTTP application. Each guide covers: prerequisites, example app setup, instrumentation (manual and/or zero-code), running, and exporting to console or Collector.

---

## Go — Getting Started

### Prerequisites
- Go 1.21+ installed
- `go.opentelemetry.io/otel` packages

### Example Application
Create a simple HTTP server with a `/rolldice` endpoint.

### Initialize the SDK (`otel.go`)
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
        err := errors.Join(inErr, shutdown(ctx))
        // handle err
    }

    // Set up propagator
    prop := propagation.NewCompositeTextMapPropagator(
        propagation.TraceContext{},
        propagation.Baggage{},
    )
    otel.SetTextMapPropagator(prop)

    // Set up trace provider
    traceExporter, _ := stdouttrace.New(stdouttrace.WithPrettyPrint())
    tracerProvider := trace.NewTracerProvider(
        trace.WithBatcher(traceExporter,
            trace.WithBatchTimeout(time.Second)),
    )
    shutdownFuncs = append(shutdownFuncs, tracerProvider.Shutdown)
    otel.SetTracerProvider(tracerProvider)

    // Set up meter provider
    metricExporter, _ := stdoutmetric.New(stdoutmetric.WithPrettyPrint())
    meterProvider := metric.NewMeterProvider(
        metric.WithReader(metric.NewPeriodicReader(metricExporter,
            metric.WithInterval(3*time.Second))),
    )
    shutdownFuncs = append(shutdownFuncs, meterProvider.Shutdown)
    otel.SetMeterProvider(meterProvider)

    // Set up logger provider
    logExporter, _ := stdoutlog.New(stdoutlog.WithPrettyPrint())
    loggerProvider := log.NewLoggerProvider(
        log.WithProcessor(log.NewBatchProcessor(logExporter)),
    )
    shutdownFuncs = append(shutdownFuncs, loggerProvider.Shutdown)
    global.SetLoggerProvider(loggerProvider)

    return shutdown, nil
}
```

### Instrument the HTTP Server
Use `otelhttp.NewHandler` to wrap HTTP handlers for automatic trace generation.

### Add Custom Instrumentation
```go
tracer := otel.Tracer("dice-roller")
ctx, span := tracer.Start(ctx, "roll")
defer span.End()
// custom logic
span.SetAttributes(attribute.Int("dice.value", value))
```

### Run
```bash
go run .
curl localhost:8080/rolldice
```

### Export to Collector
Replace stdout exporters with OTLP exporters:
```go
otlptracehttp.New(ctx, otlptracehttp.WithEndpoint("localhost:4318"))
```

---

## Python — Getting Started

### Prerequisites
- Python 3.9+
- `pip install opentelemetry-distro`

### Zero-Code Instrumentation
```bash
pip install opentelemetry-distro
opentelemetry-bootstrap -a install
```

### Run with Auto-Instrumentation
```bash
opentelemetry-instrument \
  --traces_exporter console \
  --metrics_exporter console \
  --logs_exporter console \
  --service_name dice-server \
  python app.py
```

### Add Manual Instrumentation
```python
from opentelemetry import trace

tracer = trace.get_tracer("dice-roller")
with tracer.start_as_current_span("roll") as span:
    value = random.randint(1, 6)
    span.set_attribute("dice.value", value)
```

### Export to Collector
```bash
opentelemetry-instrument \
  --traces_exporter otlp \
  --metrics_exporter otlp \
  --exporter_otlp_endpoint http://localhost:4318 \
  python app.py
```

---

## Java — Getting Started

### Prerequisites
- Java 8+
- Gradle or Maven
- Download `opentelemetry-javaagent.jar`

### Zero-Code Instrumentation (Java Agent)
```bash
curl -L -O https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar

export JAVA_TOOL_OPTIONS="-javaagent:PATH/TO/opentelemetry-javaagent.jar"
export OTEL_TRACES_EXPORTER=console
export OTEL_METRICS_EXPORTER=console
export OTEL_LOGS_EXPORTER=console
export OTEL_METRIC_EXPORT_INTERVAL=15000

java -jar ./build/libs/java-simple.jar
```

### Add Manual Instrumentation
```java
import io.opentelemetry.api.trace.Tracer;

private static final Tracer tracer =
    GlobalOpenTelemetry.getTracer("dice-roller");

Span span = tracer.spanBuilder("roll").startSpan();
try (Scope scope = span.makeCurrent()) {
    int value = random.nextInt(6) + 1;
    span.setAttribute("dice.value", value);
} finally {
    span.end();
}
```

### Export to Collector
```bash
export OTEL_TRACES_EXPORTER=otlp
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

---

## JavaScript (Node.js) — Getting Started

### Prerequisites
- Node.js 14+
- npm

### Install Dependencies
```bash
npm init -y
npm install @opentelemetry/api \
  @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/exporter-metrics-otlp-http
```

### Setup (tracing.js)
```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({ url: 'http://localhost:4318/v1/traces' }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({ url: 'http://localhost:4318/v1/metrics' }),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

### Run
```bash
node --require ./tracing.js app.js
curl localhost:8080/rolldice
```

### Add Manual Instrumentation
```javascript
const { trace } = require('@opentelemetry/api');
const tracer = trace.getTracer('dice-roller');
const span = tracer.startSpan('roll');
span.setAttribute('dice.value', value);
span.end();
```

---

## JavaScript (Browser) — Getting Started

### Prerequisites
- Node.js 14+
- Parcel bundler

### Install Dependencies
```bash
npm init -y
npm install @opentelemetry/api \
  @opentelemetry/sdk-trace-web \
  @opentelemetry/instrumentation-document-load \
  @opentelemetry/context-zone
```

### Setup (document-load.ts)
```javascript
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

const provider = new WebTracerProvider();
provider.register({
    contextManager: new ZoneContextManager(),
});

registerInstrumentations({
    instrumentations: [new DocumentLoadInstrumentation()],
});
```

### Add Exporter
```javascript
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';

const exporter = new OTLPTraceExporter({ url: 'http://localhost:4318/v1/traces' });
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
```

### Build & Run
```bash
npx parcel index.html
# Open http://localhost:1234
```

---

## .NET (ASP.NET Core) — Getting Started

### Prerequisites
- .NET 8+
- Visual Studio or `dotnet` CLI

### Install NuGet Packages
```bash
dotnet add package OpenTelemetry.Extensions.Hosting
dotnet add package OpenTelemetry.Instrumentation.AspNetCore
dotnet add package OpenTelemetry.Exporter.Console
```

### Setup (Program.cs)
```csharp
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

const string serviceName = "roll-dice";

builder.Logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(
        ResourceBuilder.CreateDefault().AddService(serviceName))
        .AddConsoleExporter();
});

builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService(serviceName))
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddConsoleExporter())
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddConsoleExporter());

var app = builder.Build();
app.Run();
```

### Run
```bash
dotnet run
curl localhost:8080/rolldice
```

### Export to Collector
Replace `AddConsoleExporter()` with:
```csharp
.AddOtlpExporter(options =>
{
    options.Endpoint = new Uri("http://localhost:4318");
})
```

### Add Manual Instrumentation
```csharp
using OpenTelemetry.Trace;

var tracer = provider.GetTracer("dice-roller");
using var span = tracer.StartActiveSpan("roll");
span.SetAttribute("dice.value", value);
```

---

## Cross-Language Patterns

### Common Steps
1. **Install SDK** — language-specific package
2. **Initialize providers** — TracerProvider, MeterProvider, LoggerProvider
3. **Configure exporters** — console (dev) or OTLP (production)
4. **Set propagator** — W3C TraceContext + Baggage
5. **Instrument** — auto-instrumentation packages or manual spans
6. **Run** — start app, send requests, observe telemetry
7. **Export to Collector** — switch exporter endpoint from console to OTLP

### Environment Variables (All Languages)
| Variable | Description |
|----------|-------------|
| `OTEL_SERVICE_NAME` | Service name |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP endpoint (e.g., http://localhost:4318) |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | `grpc` or `http/protobuf` |
| `OTEL_TRACES_EXPORTER` | `console`, `otlp`, `none` |
| `OTEL_METRICS_EXPORTER` | `console`, `otlp`, `none` |
| `OTEL_LOGS_EXPORTER` | `console`, `otlp`, `none` |
| `OTEL_PROPAGATORS` | `tracecontext,baggage` (default) |
| `OTEL_RESOURCE_ATTRIBUTES` | Key-value resource attributes |
| `OTEL_SAMPLER_PARENT_BASED` | Enable parent-based sampling (default true) |
| `OTEL_SAMPLER_TRACEIDRATIO` | Trace ID ratio (0.0-1.0) |
