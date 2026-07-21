# Spring Boot Reference

## Overview

Spring Boot makes it easy to create stand-alone, production-grade Spring applications that you can "just run". It takes an opinionated view of the Spring platform and third-party libraries so you can get started with minimum fuss. Most Spring Boot applications need minimal Spring configuration.

**Key features:**
- Create stand-alone Spring applications
- Embed Tomcat, Jetty, or Undertow directly (no need to deploy WAR files)
- Provide opinionated 'starter' dependencies to simplify build configuration
- Automatically configure Spring and 3rd party libraries whenever possible
- Provide production-ready features such as metrics, health checks, and externalized configuration
- Absolutely no code generation and no requirement for XML configuration

**Current version**: 4.1.0 (also supports 4.0.x, 3.5.x, 3.4.x, 3.3.x)

Source: https://docs.spring.io/spring-boot/reference/

---

## Build Systems

Spring Boot strongly recommends Maven or Gradle for dependency management. Both support consuming artifacts from Maven Central.

### Dependency Management

Spring Boot manages transitive dependency versions automatically. Each Spring Boot release is tested against a specific set of dependency versions. You should not need to override versions for managed dependencies.

### Maven

Use `spring-boot-starter-parent` as the parent POM:

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.1.0</version>
</parent>
```

This provides:
- Dependency management for all Spring Boot managed dependencies
- Plugin configuration (Maven compiler plugin, resource filtering, etc.)
- Default Java version and encoding settings

### Gradle

Spring Boot supports Gradle via the `spring-boot-gradle-plugin`. Use the `dependency-management` plugin to manage transitive versions.

### Starters

Starters are convenient dependency descriptors that you include in your application. They provide a one-stop shop for all Spring and related technologies without hunting through sample code.

**Naming convention:**
- Official starters: `spring-boot-starter-*` (e.g., `spring-boot-starter-web`)
- Third-party starters: `thirdpartyproject-spring-boot-starter`

**Key starters:**

| Starter | Description |
|---------|-------------|
| `spring-boot-starter` | Core starter, auto-configuration support, logging, YAML |
| `spring-boot-starter-web` | Web applications with Spring MVC, Tomcat |
| `spring-boot-starter-data-jpa` | Spring Data JPA with Hibernate |
| `spring-boot-starter-data-mongodb` | Spring Data MongoDB |
| `spring-boot-starter-data-redis` | Spring Data Redis |
| `spring-boot-starter-security` | Spring Security |
| `spring-boot-starter-test` | Testing: JUnit Jupiter, AssertJ, Hamcrest, Mockito |
| `spring-boot-starter-actuator` | Production-ready features: metrics, health checks |
| `spring-boot-starter-amqp` | Spring AMQP and RabbitMQ |
| `spring-boot-starter-batch` | Spring Batch |
| `spring-boot-starter-validation` | Bean Validation (Hibernate Validator) |
| `spring-boot-starter-cache` | Spring Framework caching support |
| `spring-boot-starter-mail` | Java Mail and Spring Framework email |
| `spring-boot-starter-quartz` | Quartz scheduler |
| `spring-boot-starter-webflux` | Spring WebFlux with Netty |
| `spring-boot-starter-websocket` | WebSocket support with Tomcat |
| `spring-boot-starter-oauth2-client` | OAuth2/OpenID Connect client |
| `spring-boot-starter-oauth2-resource-server` | OAuth2 resource server |
| `spring-boot-starter-graphql` | Spring for GraphQL |
| `spring-boot-starter-actuator-test` | Testing actuator endpoints |

Source: https://docs.spring.io/spring-boot/reference/using/build-systems.html

---

## SpringApplication

The `SpringApplication` class provides a convenient way to bootstrap a Spring application from a `main()` method:

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

### Customizing SpringApplication

```java
SpringApplication app = new SpringApplication(MyApplication.class);
app.setBannerMode(Banner.Mode.OFF);
app.setLazyInitialization(true);
app.run(args);
```

### Fluent Builder API

```java
new SpringApplicationBuilder(MyApplication.class)
    .bannerMode(Banner.Mode.OFF)
    .lazyInitialization(true)
    .headless(false)
    .run(args);
```

### Application Availability

Spring Boot supports application availability states for Kubernetes probes:
- **Liveness State**: Tells whether the application is running
- **Readiness State**: Tells whether the application is ready to handle requests

### Application Events and Listeners

Events are published in order:
1. `ApplicationStartingEvent` - at the start of a run
2. `ApplicationEnvironmentPreparedEvent` - when Environment is known
3. `ApplicationContextInitializedEvent` - before context refresh
4. `ApplicationPreparedEvent` - after bean definitions loaded
5. `ApplicationStartedEvent` - after context refresh
6. `ApplicationReadyEvent` - when application is ready
7. `ApplicationFailedEvent` - if startup fails

### ApplicationRunner and CommandLineRunner

Execute code at startup:

```java
@Component
public class MyRunner implements CommandLineRunner {
    @Override
    public void run(String... args) {
        // startup logic
    }
}
```

### Virtual Threads

Spring Boot supports Java virtual threads (Project Loom) for improved concurrency in servlet containers. Enable with `spring.threads.virtual.enabled=true`.

### Application Startup Tracking

Spring Boot can track application startup steps for performance analysis using `BufferingApplicationStartup`.

Source: https://docs.spring.io/spring-boot/reference/features/spring-application.html

---

## Auto-configuration

Spring Boot auto-configuration attempts to automatically configure your Spring application based on jar dependencies. For example, if HSQLDB is on your classpath and you have not manually configured any database connection beans, Spring Boot auto-configures an in-memory database.

### Enabling Auto-configuration

Add `@EnableAutoConfiguration` or `@SpringBootApplication` to a `@Configuration` class:

```java
@SpringBootApplication // includes @EnableAutoConfiguration
public class MyApplication { ... }
```

### Gradually Replacing Auto-configuration

Auto-configuration is non-invasive. You can define your own beans to replace auto-configuration. Use `@ConditionalOnMissingBean` and `@ConditionalOnBean` annotations to control when auto-configuration applies.

### Disabling Specific Auto-configuration

```java
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class MyApplication { ... }
```

Or via properties:
```properties
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

### Auto-configuration Packages

`@AutoConfigurationPackage` registers the package of the annotated class for auto-configuration scanning. `@SpringBootApplication` includes this annotation.

Source: https://docs.spring.io/spring-boot/reference/using/auto-configuration.html

---

## Externalized Configuration

Spring Boot lets you externalize configuration so you can work with the same application code in different environments. Configuration sources include properties files, YAML files, environment variables, and command-line arguments.

### Property Source Order (highest to lowest precedence)

1. Default properties (`SpringApplication.setDefaultProperties`)
2. `@PropertySource` annotations on `@Configuration` classes
3. Config data (application.properties/YAML files)
4. `RandomValuePropertySource` (random.*)
5. OS environment variables
6. Java System properties
7. JNDI attributes (java:comp/env)
8. ServletContext init parameters
9. ServletConfig init parameters
10. SPRING_APPLICATION_JSON (inline JSON in env var)
11. Command line arguments
12. Test properties (@SpringBootTest)
13. @DynamicPropertySource in tests
14. @TestPropertySource in tests
15. Devtools global settings

### Accessing Configuration

```java
// Via @Value
@Value("${my.property}")
private String myProperty;

// Via Environment
@Autowired
private Environment env;
String prop = env.getProperty("my.property");

// Via @ConfigurationProperties (type-safe)
@ConfigurationProperties(prefix = "my")
public class MyProperties {
    private String property;
    // getter/setter
}
```

### Type-safe Configuration Properties

```java
@ConfigurationProperties(prefix = "server")
public class ServerProperties {
    private int port = 8080;
    private String host = "localhost";
    // getters/setters
}
```

**Constructor binding** (preferred for immutable config):

```java
@ConfigurationProperties(prefix = "server")
public record ServerProperties(int port, String host) {
}
```

### Relaxed Binding

Spring Boot uses relaxed binding for property names:
- `server.port` = `SERVER_PORT` = `serverPort` = `server_port`

### YAML Configuration

```yaml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
---
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:postgresql://prod-db:5432/mydb
```

### Profiles

Activate profiles with `spring.profiles.active`:

```properties
spring.profiles.active=dev,prod
```

Use `@Profile` on beans:
```java
@Configuration
@Profile("production")
public class ProductionConfig { ... }
```

### @ConfigurationProperties vs @Value

| Feature | @ConfigurationProperties | @Value |
|---------|------------------------|--------|
| Relaxed binding | Yes | No |
| Meta-data support | Yes | No |
| SpEL evaluation | No | Yes |
| Type-safe | Yes | No |
| Constructor binding | Yes | No |

Source: https://docs.spring.io/spring-boot/reference/features/external-config.html

---

## Production-ready Features (Actuator)

Spring Boot Actuator provides production-ready features to monitor and manage your application via HTTP endpoints or JMX. It includes auditing, health checks, and metrics gathering.

### Enabling Actuator

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `/actuator/health` | Application health information |
| `/actuator/info` | Arbitrary application info |
| `/actuator/metrics` | Metrics information |
| `/actuator/env` | Environment properties |
| `/actuator/loggers` | Logging configuration |
| `/actuator/threaddump` | Thread dump |
| `/actuator/heapdump` | Heap dump (HPROF) |
| `/actuator/beans` | All Spring beans |
| `/actuator/mappings` | URL mappings |
| `/actuator/configprops` | Configuration properties |
| `/actuator/conditions` | Auto-configuration conditions |
| `/actuator/scheduledtasks` | Scheduled tasks |
| `/actuator/sessions` | HTTP sessions |
| `/actuator/shutdown` | Graceful shutdown (disabled by default) |
| `/actuator/prometheus` | Prometheus metrics (with micrometer-registry-prometheus) |

### Endpoint Configuration

```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoints.web.exposure.exclude=env,beans
management.endpoint.health.show-details=always
management.endpoints.jmx.exposure.include=*
```

### Health Indicators

Custom health indicator:
```java
@Component
public class MyHealthIndicator implements HealthIndicator {
    @Override
    public Health health() {
        int errorCode = check();
        if (errorCode != 0) {
            return Health.down().withDetail("Error Code", errorCode).build();
        }
        return Health.up().build();
    }
}
```

### Metrics

Spring Boot uses Micrometer for metrics. Built-in meters include JVM, Tomcat, HTTP requests, and cache metrics. Custom meters:

```java
@Autowired
private MeterRegistry meterRegistry;

meterRegistry.counter("my.counter").increment();
```

Source: https://docs.spring.io/spring-boot/reference/actuator/index.html

---

## Testing

Spring Boot provides testing utilities via `spring-boot-starter-test`, which includes JUnit Jupiter, AssertJ, Hamcrest, and Mockito.

### Test Modules

- `spring-boot-test` - Core test items
- `spring-boot-test-autoconfigure` - Auto-configuration for tests
- Focused `-test` modules for specific features

### @SpringBootTest

Loads the full application context for integration testing:

```java
@SpringBootTest
class MyIntegrationTests {
    @Autowired
    private MyService myService;

    @Test
    void testService() {
        assertThat(myService.doSomething()).isEqualTo("result");
    }
}
```

### Slice Tests

Test specific layers without loading full context:

| Annotation | Description |
|-----------|-------------|
| `@WebMvcTest` | Test Spring MVC controllers |
| `@WebFluxTest` | Test Spring WebFlux controllers |
| `@DataJpaTest` | Test JPA repositories |
| `@DataRedisTest` | Test Redis repositories |
| `@JdbcTest` | Test JDBC repositories |
| `@JsonTest` | Test JSON serialization |
| `@RestClientTest` | Test REST clients |
| `@WebServiceClientTest` | Test web service clients |

### MockMvc

```java
@WebMvcTest(MyController.class)
class MyControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetEndpoint() throws Exception {
        mockMvc.perform(get("/hello"))
            .andExpect(status().isOk())
            .andExpect(content().string("Hello, Spring Boot!"));
    }
}
```

### TestContainers Integration

```java
@SpringBootTest
@Testcontainers
class MyContainerTests {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
    }
}
```

Source: https://docs.spring.io/spring-boot/reference/testing/index.html

---

## AOT and Native Image

Spring Boot supports Ahead-Of-Time (AOT) processing for GraalVM native images. AOT processing optimizes the application at build time, reducing startup time and memory footprint.

### Enabling AOT

```bash
# Maven
mvn spring-boot:process-aot

# Gradle
./gradlew processAot
```

### Native Image Build

```bash
# Maven
mvn -Pnative native:compile

# Gradle
./gradlew nativeCompile
```

### Considerations

- No runtime proxy generation (use compile-time proxies)
- No runtime bytecode generation
- Reflection must be declared via hints
- Resources must be declared via hints
- AOT processing generates optimized configuration at build time

---

## Packaging for Production

Spring Boot supports packaging applications as executable JARs with embedded servers or as WAR files for deployment to external containers.

### Container Images

Spring Boot supports building OCI (Docker) images via:
- **Cloud Native Buildpacks** - `spring-boot:build-image` (Maven) or `bootBuildImage` (Gradle)
- **Dockerfile** - Multi-stage builds with `jib` or manual Dockerfiles
- **Layered JARs** - Optimized Docker layers for faster rebuilds

### Graceful Shutdown

Spring Boot supports graceful shutdown:
```properties
server.shutdown=graceful
spring.lifecycle.timeout-per-shutdown-phase=30s
```

---

## Spring Initializr

Bootstrap projects at https://start.spring.io/ or via CLI:

```bash
# Using Spring Boot CLI
spring init --dependencies=web,data-jpa,security my-app
```

Options include:
- Build system (Maven/Gradle)
- Language (Java/Kotlin/Groovy)
- Spring Boot version
- Packaging (JAR/WAR)
- Java version
- Dependencies (starters)

---

## Developer Tools (DevTools)

Spring Boot includes `spring-boot-devtools` for development-time features:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

### Automatic Restart

Applications automatically restart whenever files on the classpath change. Uses two classloaders:
- **Base classloader** - loads third-party jars (unchanged classes)
- **Restart classloader** - loads application classes (thrown away on restart)

Trigger restart by updating classpath:
- Eclipse: save modified file
- IntelliJ IDEA: Build -> Build Project
- Maven: `mvn compile`
- Gradle: `gradle build`

Configure restart:
```properties
spring.devtools.restart.enabled=false  # disable
spring.devtools.restart.trigger-file=.reloadtrigger  # use trigger file
spring.devtools.restart.exclude=static/**,public/**  # exclude paths
spring.devtools.restart.additional-paths=src/main/java  # watch additional paths
```

### LiveReload

Embedded LiveReload server triggers browser refresh on resource changes:
```properties
spring.devtools.livereload.enabled=true
```

### Global Settings

Configure global devtools settings in `$HOME/.config/spring-boot/`:
- `spring-boot-devtools.properties`
- `spring-boot-devtools.yaml`
- `spring-boot-devtools.yml`

### Remote Applications

Remote devtools support for development on remote machines (security risk - use only on trusted networks):
```properties
spring.devtools.remote.secret=mysecret
```

Source: https://docs.spring.io/spring-boot/reference/using/devtools.html

---

## Logging

Spring Boot uses Commons Logging for internal logging. Default implementations: Logback (default), Log4j2, Java Util Logging.

### Log Levels

```properties
logging.level.org.springframework=DEBUG
logging.level.com.example=TRACE
logging.level.root=WARN
```

### Log Groups

```properties
logging.group.org.springframework=org.springframework,org.springframework.boot
logging.level.org.springframework=DEBUG
```

### File Output

```properties
logging.file.name=logs/application.log
logging.file.path=logs/
logging.logback.rollingpolicy.max-file-size=10MB
logging.logback.rollingpolicy.max-history=7
```

### Structured Logging

Spring Boot supports structured JSON logging out of the box:
```properties
logging.structured.format.console=ecs    # Elastic Common Schema
logging.structured.format.file=gelf      # Graylog Extended Log Format
logging.structured.format.console=logstash  # Logstash JSON
```

### Custom Log Configuration

- Logback: `logback-spring.xml` or `logback.xml`
- Log4j2: `log4j2-spring.xml` or `log4j2.xml`

Use `-spring` variants for Spring Boot-specific extensions (profile support, environment properties).

### Logback Extensions

Profile-specific configuration in `logback-spring.xml`:
```xml
<springProfile name="production">
    <root level="WARN"/>
</springProfile>
<springProfile name="dev">
    <root level="DEBUG"/>
</springProfile>
```

### Log4j2

To use Log4j2 instead of Logback:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-log4j2</artifactId>
</dependency>
```

Source: https://docs.spring.io/spring-boot/reference/features/logging.html

---

## Embedded Web Server

Spring Boot embeds Tomcat by default. Alternatives: Jetty, Undertow, Netty (WebFlux).

### Switching Web Server

```xml
<!-- Exclude Tomcat -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<!-- Use Jetty -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```

### Server Configuration

```properties
server.port=8080
server.address=0.0.0.0
server.servlet.context-path=/api
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=changeit
server.ssl.key-store-type=PKCS12
server.compression.enabled=true
server.compression.mime-types=text/html,text/css,application/json
server.http2.enabled=true
server.max-http-request-header-size=8KB
server.tomcat.max-threads=200
server.tomcat.accept-count=100
```

### Reactive Server (WebFlux)

```properties
server.netty.connection-timeout=10s
server.netty.idle-timeout=60s
```

---

## Database Initialization

### SQL Script Initialization

Spring Boot can automatically run SQL scripts on startup:

```properties
spring.sql.init.mode=always  # always, embedded, never
spring.sql.init.schema-locations=classpath:schema.sql
spring.sql.init.data-locations=classpath:data.sql
spring.sql.init.platform=h2
```

### JPA Schema Generation

```properties
spring.jpa.hibernate.ddl-auto=update  # none, update, create, create-drop, validate
spring.jpa.generate-ddl=true
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.hbm2ddl.auto=update
```

### Batch Data Loading

```properties
spring.sql.init.mode=always
spring.sql.init.data-locations=classpath:data.sql
spring.jpa.defer-datasource-initialization=true
```

### Using Flyway

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

```properties
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
```

### Using Liquibase

```xml
<dependency>
    <groupId>org.liquibase</groupId>
    <artifactId>liquibase-core</artifactId>
</dependency>
```

```properties
spring.liquibase.change-log=classpath:db/changelog/db.changelog-master.yaml
```

---

## JSON

Spring Boot integrates with multiple JSON libraries. **Jackson 3** is the default and preferred library. Jackson 2 support is deprecated. Also supports Gson, JSON-B, and Kotlin Serialization.

### Jackson Customization

```java
@Bean
public Jackson2ObjectMapperBuilderCustomizer customizer() {
    return builder -> builder
        .serializationInclusion(JsonInclude.Include.NON_NULL)
        .modules(new JavaTimeModule())
        .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
}
```

### Custom Serializers/Deserializers

```java
public class CustomDateSerializer extends StdSerializer<LocalDate> {
    @Override
    public void serialize(LocalDate value, JsonGenerator gen, SerializerProvider provider) {
        gen.writeString(value.format(DateTimeFormatter.ISO_DATE));
    }
}

// Register via mixin or @JsonSerialize
@JsonSerialize(using = CustomDateSerializer.class)
private LocalDate birthDate;
```

### Kotlin Serialization

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-json</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-json</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jackson</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.jetbrains.kotlinx</groupId>
    <artifactId>kotlinx-serialization-json</artifactId>
</dependency>
```

Source: https://docs.spring.io/spring-boot/reference/features/json.html

---

## Messaging

Spring Boot provides auto-configuration for JMS, AMQP (RabbitMQ), and Kafka.

### JMS (ActiveMQ, Artemis)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-artemis</artifactId>
</dependency>
```

```properties
spring.artemis.host=localhost
spring.artemis.port=61616
spring.artemis.user=admin
spring.artemis.password=admin
spring.jms.template.default-destination=orders
```

### AMQP (RabbitMQ)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

```properties
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
```

```java
@Autowired
private RabbitTemplate rabbitTemplate;

public void send(String message) {
    rabbitTemplate.convertAndSend("exchange", "routing.key", message);
}

@RabbitListener(queues = "orders")
public void receive(String message) {
    System.out.println("Received: " + message);
}
```

### Kafka

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

```properties
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.consumer.group-id=my-group
spring.kafka.consumer.auto-offset-reset=earliest
```

```java
@Autowired
private KafkaTemplate<String, String> kafkaTemplate;

public void send(String topic, String message) {
    kafkaTemplate.send(topic, message);
}

@KafkaListener(topics = "orders", groupId = "my-group")
public void receive(String message) {
    System.out.println("Received: " + message);
}
```

---

## Caching

Spring Boot auto-configures caching when a cache provider is on the classpath.

### Supported Providers

- Caffeine (default in-memory)
- Redis
- Hazelcast
- EhCache
- JCache (JSR-107)

### Enabling Caching

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
<!-- Caffeine -->
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

```java
@Configuration
@EnableCaching
public class CacheConfig { }
```

### Cache Configuration

```properties
spring.cache.type=caffeine  # auto, none, caffeine, redis, hazelcast, ehcache, jcache
spring.cache.cache-names=users,orders
spring.cache.caffeine.spec=maximumSize=500,expireAfterAccess=60s
```

### Redis Cache

```properties
spring.cache.type=redis
spring.cache.redis.time-to-live=60000
spring.cache.redis.use-key-prefix=true
spring.cache.redis.cache-null-values=false
```

---

## Spring Boot CLI

The Spring Boot CLI can be used to run Groovy scripts and bootstrap projects:

```bash
# Install CLI (SDKMAN)
sdk install springboot

# Run a Groovy script
spring run app.groovy

# Create a new project
spring init --dependencies=web,data-jpa my-app

# Package a Groovy script
spring jar my-app.jar app.groovy
```

### Groovy Script Example

```groovy
@RestController
class App {
    @GetMapping("/")
    String home() {
        "Hello from Spring Boot CLI!"
    }
}
```

Run with: `spring run app.groovy`
