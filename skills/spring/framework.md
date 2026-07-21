# Spring Framework Reference

## Overview

The Spring Framework provides comprehensive infrastructure support for Java applications. It is the foundation of the entire Spring ecosystem.

**Documentation sections:**
- **Core** - IoC Container, Events, Resources, i18n, Validation, Data Binding, Type Conversion, SpEL, AOP, AOT
- **Testing** - Mock Objects, TestContext Framework, Spring MVC Test, WebTestClient
- **Data Access** - Transactions, DAO Support, JDBC, R2DBC, O/R Mapping, XML Marshalling
- **Web Servlet** - Spring MVC, WebSocket, SockJS, STOMP Messaging
- **Web Reactive** - Spring WebFlux, WebClient, WebSocket, RSocket
- **Integration** - REST Clients, JMS, JCA, JMX, Email, Tasks, Scheduling, Caching, Observability
- **Languages** - Kotlin, Groovy, Dynamic Languages

**Current version**: 7.0.8 (also supports 6.2.x)

Source: https://docs.spring.io/spring-framework/reference/

---

## The IoC Container

The heart of Spring is the Inversion of Control (IoC) container. It manages beans (objects), their lifecycle, and dependencies.

### ApplicationContext

`ApplicationContext` is the central interface for configuration. Implementations:
- `AnnotationConfigApplicationContext` - Java-based configuration
- `ClassPathXmlApplicationContext` - XML configuration
- `GenericWebApplicationContext` - web application context

### Bean Definition

Beans are defined via:
- `@Component` and stereotype annotations
- `@Bean` methods in `@Configuration` classes
- XML `<bean>` elements
- Component scanning

### Stereotype Annotations

| Annotation | Purpose |
|-----------|---------|
| `@Component` | Generic Spring component |
| `@Controller` | Web MVC controller |
| `@RestController` | REST controller (@Controller + @ResponseBody) |
| `@Service` | Service layer |
| `@Repository` | Data access layer (adds exception translation) |
| `@Configuration` | Configuration class with @Bean methods |

### Dependency Injection

**Constructor injection** (recommended):
```java
@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

**Setter injection**:
```java
@Service
public class UserService {
    private UserRepository repository;

    @Autowired
    public void setRepository(UserRepository repository) {
        this.repository = repository;
    }
}
```

**Field injection** (not recommended):
```java
@Service
public class UserService {
    @Autowired
    private UserRepository repository;
}
```

### @Bean Methods

```java
@Configuration
public class AppConfig {

    @Bean
    public UserService userService(UserRepository repo) {
        return new UserService(repo);
    }

    @Bean
    @Profile("production")
    public DataSource dataSource() {
        return new HikariDataSource();
    }
}
```

### Bean Scopes

| Scope | Description |
|-------|-------------|
| `singleton` | One instance per container (default) |
| `prototype` | New instance every time |
| `request` | One per HTTP request (web) |
| `session` | One per HTTP session (web) |
| `application` | One per ServletContext (web) |
| `websocket` | One per WebSocket session |

### Bean Lifecycle

1. Instantiation
2. Populate properties (DI)
3. BeanNameAware, BeanFactoryAware, ApplicationContextAware
4. BeanPostProcessor (before initialization)
5. InitializingBean.afterPropertiesSet() / @PostConstruct
6. BeanPostProcessor (after initialization)
7. Bean in use
8. DisposableBean.destroy() / @PreDestroy

### @Autowired

- Resolves dependencies by type
- Use `@Qualifier` for multiple candidates
- Optional with `@Autowired(required = false)` or `Optional<T>`
- Can be used on constructors, setters, fields, methods

```java
@Service
public class OrderService {
    private final PaymentProcessor processor;

    @Autowired
    public OrderService(@Qualifier("creditCardProcessor") PaymentProcessor processor) {
        this.processor = processor;
    }
}
```

### @Qualifier

Disambiguates beans when multiple candidates exist:

```java
@Component("creditCardProcessor")
public class CreditCardProcessor implements PaymentProcessor { ... }

@Component("paypalProcessor")
public class PaypalProcessor implements PaymentProcessor { ... }
```

### @Primary

Marks a bean as preferred when multiple candidates exist:

```java
@Primary
@Bean
public PaymentProcessor creditCardProcessor() { ... }
```

### Lazy Initialization

```java
@Lazy
@Service
public class ExpensiveService { ... }
```

Or globally: `spring.main.lazy-initialization=true`

### Events

```java
// Define event
public class OrderCreatedEvent extends ApplicationEvent {
    private final Order order;
    public OrderCreatedEvent(Object source, Order order) {
        super(source);
        this.order = order;
    }
    public Order getOrder() { return order; }
}

// Publish event
@Autowired
private ApplicationEventPublisher publisher;
publisher.publishEvent(new OrderCreatedEvent(this, order));

// Listen to event
@EventListener
public void handleOrderCreated(OrderCreatedEvent event) {
    // handle event
}
```

**Built-in events:**
- `ContextRefreshedEvent`
- `ContextStartedEvent`
- `ContextStoppedEvent`
- `ContextClosedEvent`
- `RequestHandledEvent`

### Resources

Spring provides unified resource handling:
- `Resource` interface for low-level resources
- `@Value("classpath:config.xml")` for injecting resources
- `ResourceLoader` for loading resources

```java
@Value("classpath:data.txt")
private Resource dataFile;
```

### Validation

```java
// Bean Validation (JSR-380)
public class User {
    @NotBlank
    private String name;

    @Email
    private String email;

    @Min(18)
    private int age;
}

// Manual validation
@Autowired
private Validator validator;

Set<ConstraintViolation<User>> violations = validator.validate(user);
```

### Data Binding and Type Conversion

Spring provides `DataBinder` for binding properties to objects and `Converter` / `Formatter` for type conversion:

```java
@Component
public class StringToLocalDateConverter implements Converter<String, LocalDate> {
    @Override
    public LocalDate convert(String source) {
        return LocalDate.parse(source);
    }
}
```

### Spring Expression Language (SpEL)

```java
@Value("#{systemProperties['user.home']}")
private String userHome;

@Value("#{T(java.lang.Math).random() * 100}")
private double randomValue;

@Value("#{userService.getDefaultUser().name}")
private String defaultUserName;
```

Source: https://docs.spring.io/spring-framework/reference/core/beans.html

---

## Aspect-Oriented Programming (AOP)

AOP complements OOP by modularizing cross-cutting concerns (transactions, logging, security). The unit of modularity in AOP is the aspect.

### AOP Concepts

| Term | Description |
|------|-------------|
| Aspect | Module of cross-cutting concern |
| Join point | Point where advice can be applied |
| Advice | Action taken at a join point |
| Pointcut | Expression matching join points |
| Target object | Object being advised |
| Weaving | Linking aspects with target objects |
| Introduction | Adding methods/fields to advised types |

### Advice Types

| Advice | Description |
|--------|-------------|
| `@Before` | Before join point execution |
| `@After` | After join point (finally) |
| `@AfterReturning` | After successful return |
| `@AfterThrowing` | After throwing exception |
| `@Around` | Surrounds join point (full control) |

### @AspectJ Style

```java
@Aspect
@Component
public class LoggingAspect {

    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("Before: " + joinPoint.getSignature().getName());
    }

    @Around("execution(* com.example.service.*.*(..))")
    public Object logAround(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = pjp.proceed();
        long duration = System.currentTimeMillis() - start;
        System.out.println(pjp.getSignature() + " took " + duration + "ms");
        return result;
    }

    @AfterReturning(
        pointcut = "execution(* com.example.service.OrderService.placeOrder(..))",
        returning = "result")
    public void afterReturning(JoinPoint jp, Object result) {
        // handle successful return
    }
}
```

### Pointcut Expressions

```
execution(public * com.example.service.*.*(..))     // all public methods in service package
execution(* com.example..*.*(..))                    // all methods in com.example and subpackages
execution(* save*(..))                                // all methods starting with 'save'
execution(* com.example.service.UserService.*(..))   // all methods in UserService
@annotation(org.springframework.transaction.annotation.Transactional)  // annotated methods
bean(*Service)                                        // beans ending with 'Service'
```

### Declarative Transaction Management

```java
@Service
@Transactional
public class OrderService {

    @Transactional(readOnly = true)
    public Order findById(Long id) { ... }

    @Transactional(isolation = Isolation.READ_COMMITTED,
                   propagation = Propagation.REQUIRED,
                   rollbackFor = {InsufficientFundsException.class})
    public void placeOrder(Order order) { ... }
}
```

**Propagation types:**
- `REQUIRED` - Join existing or create new (default)
- `REQUIRES_NEW` - Always create new
- `NESTED` - Nested transaction
- `SUPPORTS` - Join if exists, else non-transactional
- `NOT_SUPPORTED` - Non-transactional
- `MANDATORY` - Must exist
- `NEVER` - Must not exist

Source: https://docs.spring.io/spring-framework/reference/core/aop.html

---

## Spring MVC (Web Servlet Stack)

Spring MVC is the Servlet-stack web framework with annotation-based controllers.

### Controller

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@Valid @RequestBody User user) {
        return userService.save(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        return userService.update(id, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

### Request Mapping Annotations

| Annotation | HTTP Method |
|-----------|-------------|
| `@GetMapping` | GET |
| `@PostMapping` | POST |
| `@PutMapping` | PUT |
| `@PatchMapping` | PATCH |
| `@DeleteMapping` | DELETE |

### Handler Mappings

- `@RequestMapping` - URL path, method, params, headers, consumes, produces
- `@PathVariable` - Extract URL path variables
- `@RequestParam` - Extract query parameters
- `@RequestBody` - Bind request body (JSON/XML)
- `@RequestHeader` - Extract headers
- `@CookieValue` - Extract cookies
- `@ModelAttribute` - Bind form data to object
- `@SessionAttribute` - Access session attributes

### Exception Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse("NOT_FOUND", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        return ResponseEntity.badRequest().body(new ErrorResponse("VALIDATION_FAILED", errors));
    }
}
```

### CORS Support

```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class MyController { ... }

// Global CORS
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowCredentials(true);
    }
}
```

### Interceptors

```java
@Component
public class LoggingInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        System.out.println("Request: " + req.getMethod() + " " + req.getRequestURI());
        return true;
    }
}
```

### View Resolvers and Content Negotiation

Spring MVC supports Thymeleaf, FreeMarker, JSP, and JSON/XML via content negotiation. `@ResponseBody` / `@RestController` returns data directly (JSON via Jackson).

Source: https://docs.spring.io/spring-framework/reference/web.html

---

## Spring WebFlux (Reactive Stack)

Spring WebFlux is the reactive-stack web framework built on Reactor, supporting non-blocking servers like Netty.

### Reactive Controller

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public Flux<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<User>> getUser(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<User> createUser(@Valid @RequestBody Mono<User> user) {
        return userService.save(user);
    }
}
```

### WebClient

Reactive HTTP client:

```java
@Autowired
private WebClient webClient;

public Mono<User> getUser(Long id) {
    return webClient.get()
        .uri("/api/users/{id}", id)
        .retrieve()
        .bodyToMono(User.class);
}

public Flux<User> getAllUsers() {
    return webClient.get()
        .uri("/api/users")
        .retrieve()
        .bodyToFlux(User.class);
}
```

### Functional Routing

```java
@Configuration
public class RoutingConfig {

    @Bean
    public RouterFunction<ServerResponse> route(UserHandler handler) {
        return RouterFunctions.route()
            .GET("/api/users", handler::getAllUsers)
            .GET("/api/users/{id}", handler::getUser)
            .POST("/api/users", handler::createUser)
            .build();
    }
}
```

### Reactor Types

- `Mono<T>` - 0 or 1 element
- `Flux<T>` - 0 to N elements
- Operators: `map`, `filter`, `flatMap`, `concat`, `merge`, `zip`, `delay`, `retry`, `onErrorResume`

Source: https://docs.spring.io/spring-framework/reference/web-reactive.html

---

## Data Access

Spring Framework provides comprehensive data access support including transaction management, JDBC, R2DBC, and O/R mapping (JPA/Hibernate).

### Transaction Management

Spring provides declarative and programmatic transaction management:

```java
// Programmatic
@Autowired
private TransactionTemplate transactionTemplate;

transactionTemplate.execute(status -> {
    accountRepository.withdraw(fromId, amount);
    accountRepository.deposit(toId, amount);
    return null;
});

// Declarative (via @Transactional - see AOP section)
```

### JDBC

```java
@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Optional<User> findById(Long id) {
        return jdbcTemplate.queryForObject(
            "SELECT id, name, email FROM users WHERE id = ?",
            (rs, rowNum) -> new User(rs.getLong("id"), rs.getString("name"), rs.getString("email")),
            id
        );
    }

    public List<User> findAll() {
        return jdbcTemplate.query(
            "SELECT id, name, email FROM users",
            (rs, rowNum) -> new User(rs.getLong("id"), rs.getString("name"), rs.getString("email"))
        );
    }

    public void save(User user) {
        jdbcTemplate.update("INSERT INTO users (name, email) VALUES (?, ?)",
            user.getName(), user.getEmail());
    }
}
```

### R2DBC (Reactive Database Access)

```java
@Repository
public class UserRepository {

    @Autowired
    private DatabaseClient databaseClient;

    public Flux<User> findAll() {
        return databaseClient.sql("SELECT id, name, email FROM users")
            .map((row, meta) -> new User(row.get("id", Long.class),
                row.get("name", String.class), row.get("email", String.class)))
            .all();
    }

    public Mono<User> findById(Long id) {
        return databaseClient.sql("SELECT id, name, email FROM users WHERE id = :id")
            .bind("id", id)
            .map((row, meta) -> new User(row.get("id", Long.class),
                row.get("name", String.class), row.get("email", String.class)))
            .one();
    }
}
```

Source: https://docs.spring.io/spring-framework/reference/data-access.html

---

## Testing

### TestContext Framework

```java
@SpringBootTest
class MyTests {
    @Autowired
    private MyService service;

    @Test
    void contextLoads() {
        assertThat(service).isNotNull();
    }
}
```

### MockMvc

```java
@WebMvcTest(MyController.class)
class MyControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MyService service;

    @Test
    void testGet() throws Exception {
        when(service.findById(1L)).thenReturn(Optional.of(new User(1L, "John")));

        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("John"));
    }
}
```

### WebTestClient (Reactive)

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MyReactiveTests {
    @Autowired
    private WebTestClient webTestClient;

    @Test
    void testGet() {
        webTestClient.get().uri("/api/users")
            .exchange()
            .expectStatus().isOk()
            .expectBodyList(User.class).hasSize(3);
    }
}
```

### @TestConfiguration

```java
@TestConfiguration
public class TestConfig {
    @Bean
    public MyService myService() {
        return new MyServiceMock();
    }
}
```

Source: https://docs.spring.io/spring-framework/reference/testing.html

---

## Integration

### REST Clients

**RestClient** (synchronous, Spring 6.1+):
```java
@Autowired
private RestClient restClient;

User user = restClient.get()
    .uri("/api/users/{id}", 1)
    .retrieve()
    .body(User.class);
```

**RestTemplate** (legacy synchronous):
```java
@Autowired
private RestTemplate restTemplate;

User user = restTemplate.getForObject("/api/users/{id}", User.class, 1);
```

### Caching

```java
@Service
public class UserService {

    @Cacheable("users")
    public User findById(Long id) { ... }

    @CacheEvict(value = "users", key = "#id")
    public void delete(Long id) { ... }

    @CachePut(value = "users", key = "#user.id")
    public User update(User user) { ... }
}
```

### Scheduling

```java
@Service
public class ScheduledTasks {

    @Scheduled(fixedRate = 5000)
    public void everyFiveSeconds() { ... }

    @Scheduled(cron = "0 0 2 * * ?")
    public void dailyAt2AM() { ... }
}
```

### JMX

Spring auto-detects beans annotated with `@ManagedResource` and exposes them as JMX MBeans.

### Email

```java
@Autowired
private JavaMailSender mailSender;

public void sendEmail() {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo("user@example.com");
    message.setSubject("Subject");
    message.setText("Content");
    mailSender.send(message);
}
```

---

## Internationalization (i18n)

Spring provides `MessageSource` for internationalization support.

### Configuration

```java
@Configuration
public class I18nConfig {

    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource source = new ReloadableResourceBundleMessageSource();
        source.setBasename("classpath:messages");
        source.setDefaultEncoding("UTF-8");
        source.setCacheSeconds(3600);
        return source;
    }

    @Bean
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver resolver = new AcceptHeaderLocaleResolver();
        resolver.setDefaultLocale(Locale.ENGLISH);
        return resolver;
    }
}
```

### Message Files

- `messages.properties` (default)
- `messages_fr.properties` (French)
- `messages_de.properties` (German)

### Usage

```java
@Autowired
private MessageSource messageSource;

String message = messageSource.getMessage("greeting", null, Locale.FRENCH);
```

### In Thymeleaf

```html
<p th:text="#{greeting}">Hello</p>
```

### Locale Interceptor

```java
@Bean
public LocaleChangeInterceptor localeChangeInterceptor() {
    LocaleChangeInterceptor interceptor = new LocaleChangeInterceptor();
    interceptor.setParamName("lang");
    return interceptor;
}

@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(localeChangeInterceptor());
}
```

Source: https://docs.spring.io/spring-framework/reference/core/beans/context-introduction.html

---

## WebSocket Support

Spring supports WebSocket messaging on the Servlet stack, including raw WebSocket, SockJS (WebSocket emulation), and STOMP (sub-protocol over WebSocket).

### Raw WebSocket

```java
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(myHandler(), "/ws").setAllowedOrigins("*");
    }

    @Bean
    public WebSocketHandler myHandler() {
        return new MyWebSocketHandler();
    }
}

public class MyWebSocketHandler extends TextWebSocketHandler {
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        String payload = message.getPayload();
        session.sendMessage(new TextMessage("Echo: " + payload));
    }
}
```

### SockJS Fallback

For browsers without WebSocket support, SockJS provides emulation:

```java
registry.addHandler(myHandler(), "/ws").withSockJS();
```

### STOMP Messaging

```java
@Configuration
@EnableWebSocketMessageBroker
public class StompConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-stomp").withSockJS();
    }
}

@Controller
public class ChatController {

    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public ChatMessage send(ChatMessage message) {
        return message;
    }
}
```

### Reactive WebSocket

```java
@Configuration
public class ReactiveWebSocketConfig {

    @Bean
    public HandlerMapping webSocketHandlerMapping() {
        Map<String, WebSocketHandler> map = new HashMap<>();
        map.put("/ws", new MyReactiveWebSocketHandler());
        SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();
        mapping.setOrder(1);
        mapping.setUrlMap(map);
        return mapping;
    }
}
```

Source: https://docs.spring.io/spring-framework/reference/web/websocket.html

---

## View Technologies

Spring MVC supports multiple view technologies through `ViewResolver` implementations.

### Thymeleaf

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title th:text="${title}">Title</title>
</head>
<body>
    <h1 th:text="${message}">Hello</h1>
    <ul>
        <li th:each="user : ${users}" th:text="${user.name}">User Name</li>
    </ul>
    <form th:action="@{/submit}" th:object="${user}" method="post">
        <input type="text" th:field="*{name}" />
        <button type="submit">Submit</button>
    </form>
</body>
</html>
```

### FreeMarker

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-freemarker</artifactId>
</dependency>
```

Templates in `src/main/resources/templates/` with `.ftl` extension.

### JSP

JSP views require WAR packaging and `src/main/webapp/WEB-INF/views/` directory.

### JSON / XML Content Negotiation

```java
@GetMapping(value = "/users/{id}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
public ResponseEntity<User> getUser(@PathVariable Long id) {
    return ResponseEntity.ok(userService.findById(id).orElseThrow());
}
```

---

## File Uploads

### Multipart File Upload

```java
@PostMapping("/upload")
public String handleUpload(@RequestParam("file") MultipartFile file) {
    if (!file.isEmpty()) {
        String filename = file.getOriginalFilename();
        try {
            byte[] bytes = file.getBytes();
            // save file
        } catch (IOException e) {
            return "Failed to upload: " + e.getMessage();
        }
    }
    return "Upload successful";
}
```

### Configuration

```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
spring.servlet.multipart.enabled=true
spring.servlet.multipart.location=/tmp
```

### Multiple File Upload

```java
@PostMapping("/upload-multiple")
public String handleMultipleUpload(@RequestParam("files") MultipartFile[] files) {
    for (MultipartFile file : files) {
        // process each file
    }
    return "Upload successful";
}
```

### Reactive File Upload (WebFlux)

```java
@PostMapping("/upload")
public Mono<String> upload(@RequestPart("file") Flux<FilePart> fileParts) {
    return fileParts.flatMap(part -> part.content()
        .map(DataBuffer::asInputStream)
        .map(/* process */))
        .then(Mono.just("Upload successful"));
}
```

---

## JMS (Java Message Service)

Spring provides JMS integration via `JmsTemplate` for message production and synchronous receipt, and message-listener containers for asynchronous receipt (Message-Driven POJOs).

### JmsTemplate

```java
@Autowired
private JmsTemplate jmsTemplate;

public void sendMessage(String destination, String message) {
    jmsTemplate.convertAndSend(destination, message);
}

public String receiveMessage(String destination) {
    return (String) jmsTemplate.receiveAndConvert(destination);
}
```

### Message-Driven POJO (MDP)

```java
@Component
public class OrderMessageListener implements MessageListener {
    @Override
    public void onMessage(Message message) {
        TextMessage textMessage = (TextMessage) message;
        // process message
    }
}
```

### @JmsListener

```java
@JmsListener(destination = "orders")
public void processOrder(Order order) {
    // process order
}
```

### Message Converter

```java
@Bean
public MessageConverter jacksonMessageConverter() {
    MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
    converter.setTargetType(MessageType.TEXT);
    converter.setTypeIdPropertyName("_type");
    return converter;
}
```

### JMS Transactions

```java
@Bean
public JmsTransactionManager jmsTransactionManager(ConnectionFactory connectionFactory) {
    return new JmsTransactionManager(connectionFactory);
}
```

Source: https://docs.spring.io/spring-framework/reference/integration/jms.html

---

## Kotlin Support

Spring Framework provides first-class support for Kotlin, allowing developers to write Kotlin applications almost as if Spring was a native Kotlin framework.

### Kotlin-Specific Features

- **Extension functions** for `RestTemplate`, `BeanFactory`, etc.
- **Reified type parameters** for inline functions
- **Kotlin coroutines** support in WebFlux, data access, and testing
- **Null safety** support in `@RequestParam`, `@PathVariable`, etc.
- **Data classes** as `@ConfigurationProperties`
- **Kotlin DSL** for routing and configuration

### Coroutines in WebFlux

```kotlin
@RestController
class UserController(val service: UserService) {

    @GetMapping("/users/{id}")
    suspend fun getUser(@PathVariable id: Long): User {
        return service.findById(id)
    }

    @GetMapping("/users")
    fun getAllUsers(): Flow<User> {
        return service.findAll()
    }

    @PostMapping("/users")
    suspend fun createUser(@RequestBody user: User): User {
        return service.save(user)
    }
}
```

### Kotlin DSL Routing

```kotlin
@Configuration
class RoutingConfig {

    @Bean
    fun route(handler: UserHandler) = router {
        "/api".nest {
            GET("/users", handler::getAllUsers)
            GET("/users/{id}", handler::getUser)
            POST("/users", handler::createUser)
        }
    }
}
```

### Data Class Configuration Properties

```kotlin
@ConfigurationProperties(prefix = "app")
data class AppProperties(
    val name: String,
    val port: Int = 8080,
    val features: List<String> = emptyList()
)
```

Source: https://docs.spring.io/spring-framework/reference/languages/kotlin.html

---

## Observability

Spring Framework integrates with Micrometer for observability (metrics, tracing, logging).

### Metrics

```java
@Autowired
private MeterRegistry meterRegistry;

// Counter
meterRegistry.counter("orders.created").increment();

// Timer
Timer.Sample sample = Timer.start(meterRegistry);
// ... business logic
sample.stop(meterRegistry.timer("orders.processing.time"));

// Gauge
meterRegistry.gauge("cache.size", cache, c -> c.size());
```

### Tracing

Spring Boot auto-configures Micrometer Tracing with:
- **OpenTelemetry** - OTLP exporter, Zipkin, Jaeger
- **OpenZipkin Brave** - Zipkin

```properties
management.tracing.sampling.probability=1.0
management.tracing.enabled=true
management.endpoints.web.exposure.include=health,info,metrics,prometheus
```

### Custom Spans

```java
@Observed(name = "user.lookup", contextName = "userId")
public User findById(Long id) {
    return userRepository.findById(id).orElseThrow();
}

// Or manual
@Autowired
private ObservationRegistry observationRegistry;

Observation.createNotStarted("user.lookup", observationRegistry)
    .lowCardinalityKeyValue("userId", id.toString())
    .observe(() -> userRepository.findById(id));
```

---

## RSocket

Spring Framework provides RSocket support for reactive, binary protocol communication.

### RSocket Server

```java
@Controller
public class RSocketController {

    @MessageMapping("user.{id}")
    public Mono<User> getUser(@DestinationVariable Long id) {
        return userService.findById(id);
    }

    @MessageMapping("users")
    public Flux<User> getAllUsers() {
        return userService.findAll();
    }

    @MessageMapping("user.create")
    @ConnectMapping
    public Mono<User> createUser(User user) {
        return userService.save(user);
    }
}
```

### RSocket Client

```java
@Bean
public RSocketRequester rsocketRequester(RSocketRequester.Builder builder) {
    return builder.tcp("localhost", 7000);
}

// Usage
@Autowired
private RSocketRequester requester;

public Mono<User> getUser(Long id) {
    return requester.route("user.{id}")
        .data(id)
        .retrieveMono(User.class);
}
```

---

## JMX (Java Management Extensions)

Spring's JMX support provides transparent integration of Spring applications into JMX infrastructure.

### Core Features

- **Automatic registration** of any Spring bean as a JMX MBean
- **Flexible management interface** control for beans
- **Declarative remote exposure** of MBeans via JSR-160 connectors
- **Simple proxying** of local and remote MBean resources

### Exporting Beans to JMX

```java
@Configuration
public class JmxConfig {

    @Bean
    public MBeanExporter mBeanExporter(ApplicationContext context) {
        MBeanExporter exporter = new MBeanExporter();
        Map<String, Object> beans = new HashMap<>();
        beans.put("bean:name=statsBean", statsService());
        exporter.setBeans(beans);
        return exporter;
    }
}
```

### Using Annotations

```java
@ManagedResource(objectName = "bean:name=statsService",
    description = "Application statistics")
public class StatsService {

    @ManagedAttribute(description = "Total requests")
    public long getTotalRequests() { return totalRequests; }

    @ManagedOperation(description = "Reset counters")
    public void reset() { totalRequests = 0; }
}
```

### Remote JMX

```java
@Bean
public ConnectorServerFactoryBean connectorServerFactoryBean() {
    ConnectorServerFactoryBean factory = new ConnectorServerFactoryBean();
    factory.setObjectName("service:jmx:jmxmp://localhost:9875");
    return factory;
}
```

### Spring Boot Actuator JMX

Spring Boot exposes actuator endpoints over JMX by default:
```properties
management.endpoints.jmx.exposure.include=*
management.endpoints.jmx.domain=com.example
```

Source: https://docs.spring.io/spring-framework/reference/integration/jmx.html

---

## XML Marshalling (OXM)

Spring provides Object-XML Mapping (O-X mapping) for converting XML documents to and from Java objects.

### Marshaller and Unmarshaller

```java
public interface Marshaller {
    void marshal(Object graph, Result result) throws XmlMappingException;
}

public interface Unmarshaller {
    Object unmarshal(Source source) throws XmlMappingException;
}
```

### JAXB (Jaxb2Marshaller)

```java
@Bean
public Jaxb2Marshaller jaxb2Marshaller() {
    Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
    marshaller.setContextPath("com.example.xml");
    marshaller.setSchema(new ClassPathResource("schema.xsd"));
    return marshaller;
}

// Usage
@Autowired
private Jaxb2Marshaller marshaller;

// Marshal
StringWriter writer = new StringWriter();
marshaller.marshal(object, new StreamResult(writer));
String xml = writer.toString();

// Unmarshal
Object result = marshaller.unmarshal(new StreamSource(new StringReader(xml)));
```

### XML Configuration Namespace

```xml
<oxm:jaxb2-marshaller id="marshaller" contextPath="com.example.xml"/>
<oxm:jibx-marshaller id="jibxMarshaller" targetClass="com.example.Order"/>
```

### Supported OXM Implementations

| Implementation | Class |
|----------------|-------|
| JAXB 2 | `Jaxb2Marshaller` |
| JiBX | `JibxMarshaller` |
| XStream | `XStreamMarshaller` |

### Using with Spring MVC

```java
@GetMapping(value = "/users/{id}", produces = MediaType.APPLICATION_XML_VALUE)
public ResponseEntity<User> getUserXml(@PathVariable Long id) {
    return ResponseEntity.ok(userService.findById(id));
}
```

Source: https://docs.spring.io/spring-framework/reference/data-access/oxm.html

---

## JVM Checkpoint Restore (Project CRaC)

Spring Framework integrates with checkpoint/restore (Project CRaC) to reduce startup and warmup times.

### Requirements

- A checkpoint/restore enabled JVM (Linux only)
- `org.crac:crac` library (version 1.4.0+) on classpath
- JVM parameters: `-XX:CRaCCheckpointTo=PATH` or `-XX:CRaCRestoreFrom=PATH`

### On-Demand Checkpoint/Restore

```bash
# Start application
java -XX:CRaCCheckpointTo=./cr ./myapp.jar

# Trigger checkpoint (from another terminal)
jcmd <pid> JDK.checkpoint

# Restore from checkpoint
java -XX:CRaCRestoreFrom=./cr
```

### Automatic Checkpoint at Startup

Spring can automatically create a checkpoint when the application is fully initialized:

```properties
# Spring Boot
management.endpoint.checkpoint.enabled=true
```

### Lifecycle Integration

Checkpoint/restore aligns with Spring's `Lifecycle` contract:
- **Before checkpoint** - beans receive `org.crac.Resource` notifications
- **After restore** - beans are notified to re-establish connections

```java
@Component
public class MyResource implements org.crac.Resource {
    @Override
    public void beforeCheckpoint(Context<? super String> context) {
        // close connections, release resources
    }

    @Override
    public void afterRestore(Context<? super String> context) {
        // re-establish connections
    }
}
```

### Spring Boot Auto-Configuration

Spring Boot auto-configures CRaC support when the `org.crac:crac` library is detected:

```xml
<dependency>
    <groupId>org.crac</groupId>
    <artifactId>crac</artifactId>
    <version>1.4.0</version>
</dependency>
```

Source: https://docs.spring.io/spring-framework/reference/integration/checkpoint-restore.html

---

## Groovy Bean Definition DSL

Spring supports Apache Groovy for dynamic bean configuration using a concise DSL.

### Groovy Bean Definition DSL

```groovy
import org.springframework.beans.factory.groovy.GroovyBeanDefinitionReader

def reader = new GroovyBeanDefinitionReader(applicationContext)

reader.beans {
    dataSource(org.apache.commons.dbcp2.BasicDataSource) {
        driverClassName = "org.h2.Driver"
        url = "jdbc:h2:mem:test"
        username = "sa"
        password = ""
    }

    userRepository(com.example.UserRepository, dataSource) { }

    userService(com.example.UserService) {
        userRepository = ref('userRepository')
        cacheTimeout = 5000
    }
}
```

### Using with ApplicationContext

```java
GenericApplicationContext context = new GenericApplicationContext();
GroovyBeanDefinitionReader reader = new GroovyBeanDefinitionReader(context);
reader.loadBeanDefinitions("classpath:beans.groovy");
context.refresh();
```

### Groovy Beans in Spring Boot

Spring Boot can use Groovy DSL configuration alongside Java config:

```groovy
@Configuration
class GroovyConfig {

    @Bean
    UserService userService(UserRepository repo) {
        new UserService(repository: repo, timeout: 5000)
    }
}
```

### Benefits

- **Concise syntax** - less boilerplate than XML
- **Dynamic** - can use Groovy expressions and logic
- **Type-safe** - optional static typing
- **Seamless integration** - works with existing Spring infrastructure

Source: https://docs.spring.io/spring-framework/reference/languages/groovy.html

---

## JCA (J2EE Connector Architecture)

Spring provides JCA support for integrating with EIS (Enterprise Information Systems) via resource adapters.

### CciTemplate

```java
@Autowired
private CciTemplate cciTemplate;

public Record executeInteraction(Record input) {
    return cciTemplate.execute(new RecordCreator() {
        @Override
        public Record createRecord(RecordFactory recordFactory) {
            return recordFactory.createMappedRecord("input");
        }
    }, new RecordExtractor<Record>() {
        @Override
        public Record extractData(Record record) {
            return record;
        }
    });
}
```

### Configuration

```java
@Bean
public CciTemplate cciTemplate(ConnectionFactory connectionFactory) {
    return new CciTemplate(connectionFactory);
}

@Bean
public ConnectionFactory connectionFactory() {
    // Configure JCA connection factory
    // Typically obtained from JNDI in application server
}
```

### Message-Driven POJO with JCA

Spring supports JCA-based message-driven POJOs as an alternative to JMS MDPs:

```java
@MessageDriven(
    activationSpec = @ActivationSpec(
        propertyName = "destination",
        propertyValue = "queue/orders"
    )
)
public class OrderMessageEndpoint implements MessageEndpoint {
    public void onMessage(Message message) {
        // process message
    }
}
```

### JCA vs JMS

| Feature | JCA | JMS |
|---------|-----|-----|
| Transaction | JCA-managed | JmsTransactionManager |
| Resource adapter | Required | Not needed |
| Application server | Typically required | Not required |
| Use case | EIS integration | Messaging |
