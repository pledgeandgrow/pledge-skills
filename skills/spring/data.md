# Spring Data Reference

## Overview

Spring Data provides a consistent, repository-based programming model for data access across a wide range of persistence stores. It significantly reduces boilerplate code for data access layers.

**Supported modules:**
- Spring Data JPA (Hibernate, EclipseLink)
- Spring Data MongoDB
- Spring Data Redis
- Spring Data JDBC / R2DBC
- Spring Data Elasticsearch
- Spring Data Cassandra
- Spring Data Couchbase
- Spring Data Neo4j
- Spring Data LDAP
- Spring Data KeyValue
- Spring Data REST (HATEOAS repositories)
- Spring Data Envers (audit/revision tracking)

Source: https://docs.spring.io/spring-data/jpa/reference/

---

## Core Concepts

### Repository Interface Hierarchy

The central interface in Spring Data is `Repository<T, ID>`. It acts as a marker interface to capture the domain type and ID type.

```
Repository<T, ID>
├── CrudRepository<T, ID>
│   ├── ListCrudRepository<T, ID>
│   └── JpaRepository<T, ID> (JPA-specific)
├── PagingAndSortingRepository<T, ID>
│   └── ListPagingAndSortingRepository<T, ID>
└── ReactiveCrudRepository<T, ID> (reactive)
    └── ReactiveSortingRepository<T, ID>
```

### CrudRepository

```java
public interface CrudRepository<T, ID> extends Repository<T, ID> {
    <S extends T> S save(S entity);
    Optional<T> findById(ID primaryKey);
    Iterable<T> findAll();
    long count();
    void delete(T entity);
    boolean existsById(ID primaryKey);
}
```

### ListCrudRepository

Same as `CrudRepository` but returns `List<T>` instead of `Iterable<T>`.

### PagingAndSortingRepository

```java
public interface PagingAndSortingRepository<T, ID> extends Repository<T, ID> {
    Iterable<T> findAll(Sort sort);
    Page<T> findAll(Pageable pageable);
}
```

### Pagination Example

```java
// Access second page with 20 items
PagingAndSortingRepository<User, Long> repository = // ...
Page<User> users = repository.findAll(PageRequest.of(1, 20));

// With sorting
Page<User> users = repository.findAll(
    PageRequest.of(1, 20, Sort.by("name").ascending())
);
```

Source: https://docs.spring.io/spring-data/jpa/reference/repositories/core-concepts.html

---

## Spring Data JPA

Spring Data JPA provides repository support for the Jakarta Persistence API (JPA). It eases development of applications with a consistent programming model that need to access JPA data sources.

### Entity Definition

```java
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String email;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // constructors, getters, setters
}
```

### Repository Interface

```java
public interface UserRepository extends JpaRepository<User, Long> {

    // Derived query methods
    Optional<User> findByUsername(String username);
    List<User> findByEmailContaining(String emailFragment);
    List<User> findByActiveTrue();
    Page<User> findByActiveTrue(Pageable pageable);

    // Multiple conditions
    List<User> findByUsernameAndEmail(String username, String email);
    List<User> findByUsernameOrEmail(String username, String email);
    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<User> findByOrdersIsEmpty();

    // Sorting
    List<User> findByActiveTrueOrderByUsernameAsc();

    // Distinct
    List<User> findDistinctByActiveTrue();
}
```

### Query Methods - Keywords

| Keyword | Example | SQL Equivalent |
|---------|---------|----------------|
| `And` | `findByLastnameAndFirstname` | `WHERE lastname = ? AND firstname = ?` |
| `Or` | `findByLastnameOrFirstname` | `WHERE lastname = ? OR firstname = ?` |
| `Between` | `findByCreatedAtBetween` | `WHERE createdAt BETWEEN ? AND ?` |
| `LessThan` | `findByAgeLessThan` | `WHERE age < ?` |
| `LessThanEqual` | `findByAgeLessThanEqual` | `WHERE age <= ?` |
| `GreaterThan` | `findByAgeGreaterThan` | `WHERE age > ?` |
| `GreaterThanEqual` | `findByAgeGreaterThanEqual` | `WHERE age >= ?` |
| `After` | `findByCreatedAtAfter` | `WHERE createdAt > ?` |
| `Before` | `findByCreatedAtBefore` | `WHERE createdAt < ?` |
| `IsNull` | `findByEmailIsNull` | `WHERE email IS NULL` |
| `IsNotNull` | `findByEmailIsNotNull` | `WHERE email IS NOT NULL` |
| `Like` | `findByUsernameLike` | `WHERE username LIKE ?` |
| `NotLike` | `findByUsernameNotLike` | `WHERE username NOT LIKE ?` |
| `StartingWith` | `findByUsernameStartingWith` | `WHERE username LIKE ?%` |
| `EndingWith` | `findByUsernameEndingWith` | `WHERE username LIKE %?` |
| `Containing` | `findByUsernameContaining` | `WHERE username LIKE %?%` |
| `OrderBy` | `findByUsernameOrderByCreatedAtDesc` | `ORDER BY createdAt DESC` |
| `Not` | `findByUsernameNot` | `WHERE username != ?` |
| `In` | `findByUsernameIn` | `WHERE username IN (?)` |
| `NotIn` | `findByUsernameNotIn` | `WHERE username NOT IN (?)` |
| `True` | `findByActiveTrue` | `WHERE active = true` |
| `False` | `findByActiveFalse` | `WHERE active = false` |
| `IgnoreCase` | `findByUsernameIgnoreCase` | `WHERE UPPER(username) = UPPER(?)` |
| `Sort` | `findByUsername(Sort sort)` | With dynamic sorting |
| `Pageable` | `findByUsername(Pageable pageable)` | With pagination |

### @Query - Custom Queries

```java
public interface UserRepository extends JpaRepository<User, Long> {

    // JPQL
    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsernameCustom(@Param("username") String username);

    // Native SQL
    @Query(value = "SELECT * FROM users WHERE email LIKE %:domain%",
           nativeQuery = true)
    List<User> findByEmailDomain(@Param("domain") String domain);

    // Modifying queries
    @Modifying
    @Query("UPDATE User u SET u.active = false WHERE u.lastLogin < :date")
    int deactivateInactiveUsers(@Param("date") LocalDateTime date);

    // Count
    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true")
    long countActiveUsers();
}
```

### Sorting

```java
// Static sort
List<User> users = userRepository.findAll(Sort.by("username").ascending());

// Multiple sorts
List<User> users = userRepository.findAll(
    Sort.by("lastName").ascending().and(Sort.by("firstName").descending())
);

// Dynamic sort with JPA
@Query("SELECT u FROM User u WHERE u.active = :active")
List<User> findUsers(@Param("active") boolean active, Sort sort);
```

### Projections

```java
// Interface-based projection
public interface UserProjection {
    String getUsername();
    String getEmail();
}

public interface UserRepository extends JpaRepository<User, Long> {
    Collection<UserProjection> findByActiveTrue();
}

// DTO projection (class-based)
public record UserDto(String username, String email) {}

@Query("SELECT new com.example.dto.UserDto(u.username, u.email) FROM User u WHERE u.active = true")
List<UserDto> findAllActiveDtos();
```

### Specifications (Criteria API)

```java
public class UserSpecifications {

    public static Specification<User> hasUsername(String username) {
        return (root, query, cb) -> cb.equal(root.get("username"), username);
    }

    public static Specification<User> isActive(boolean active) {
        return (root, query, cb) -> cb.equal(root.get("active"), active);
    }
}

public interface UserRepository extends JpaRepository<User, Long>,
        JpaSpecificationExecutor<User> {
}

// Usage
List<User> users = userRepository.findAll(
    Specification.where(UserSpecifications.hasUsername("john"))
        .and(UserSpecifications.isActive(true))
);
```

### Query by Example (QBE)

```java
public interface UserRepository extends JpaRepository<User, Long>,
        QueryByExampleExecutor<User> {
}

// Usage
User probe = new User();
probe.setActive(true);
probe.setEmail("@example.com");

ExampleMatcher matcher = ExampleMatcher.matching()
    .withMatcher("email", ExampleMatcher.GenericPropertyMatchers.contains())
    .withIgnorePaths("id", "createdAt");

Example<User> example = Example.of(probe, matcher);
List<User> users = userRepository.findAll(example);
```

### Custom Repository Implementations

```java
// Custom interface
public interface CustomUserRepository {
    List<User> findCustomUsers(String filter);
}

// Implementation
public class CustomUserRepositoryImpl implements CustomUserRepository {
    @PersistenceContext
    private EntityManager em;

    @Override
    public List<User> findCustomUsers(String filter) {
        // custom logic with EntityManager
        return em.createQuery("...", User.class).getResultList();
    }
}

// Combine with standard repository
public interface UserRepository extends JpaRepository<User, Long>, CustomUserRepository {
}
```

### Auditing

```java
@EntityListeners(AuditingEntityListener.class)
@Entity
public class User {
    @CreatedDate
    private LocalDateTime createdAt;

    @CreatedBy
    private String createdBy;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @LastModifiedBy
    private String updatedBy;
}

// Enable auditing
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaConfig {
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.of(SecurityContextHolder.getContext()
            .getAuthentication().getName());
    }
}
```

### Envers (Revision/Audit Tracking)

```java
@Entity
@Audited
public class User {
    @Id
    @GeneratedValue
    private Long id;
    private String username;
    private String email;
}

public interface UserRepository extends JpaRepository<User, Long>,
        RevisionRepository<User, Long, Integer> {
}

// Query revisions
List<Revision<Integer, User>> revisions = userRepository.findRevisions(id).getContent();
```

Source: https://docs.spring.io/spring-data/jpa/reference/jpa.html

---

## Spring Data MongoDB

```java
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    @CreatedDate
    private LocalDateTime createdAt;
    // getters/setters
}

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    List<User> findByEmailContaining(String fragment);

    @Query("{ 'active': true, 'age': { $gt: ?0 } }")
    List<User> findActiveUsersOlderThan(int age);
}
```

### Reactive MongoDB

```java
public interface ReactiveUserRepository extends ReactiveMongoRepository<User, String> {
    Mono<User> findByUsername(String username);
    Flux<User> findByActiveTrue();
}
```

---

## Spring Data Redis

```java
@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    // Redis-specific
}

// RedisTemplate
@Autowired
private RedisTemplate<String, Object> redisTemplate;

public void cacheUser(User user) {
    redisTemplate.opsForValue().set("user:" + user.getId(), user, 10, TimeUnit.MINUTES);
}

public User getCachedUser(Long id) {
    return (User) redisTemplate.opsForValue().get("user:" + id);
}
```

### Pub/Sub

```java
// Publisher
redisTemplate.convertAndSend("user-events", "User created: " + user.getId());

// Listener
@Component
public class UserEventListener implements MessageListener {
    @Override
    public void onMessage(Message message, byte[] pattern) {
        System.out.println("Received: " + new String(message.getBody()));
    }
}
```

---

## Spring Data REST

Spring Data REST automatically exposes repository methods as REST endpoints:

```java
@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public interface UserRepository extends JpaRepository<User, Long> {
    // Automatically exposed as REST endpoints
}
```

**Generated endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | /users | List all (paginated) |
| GET | /users/{id} | Get one |
| POST | /users | Create |
| PUT | /users/{id} | Replace |
| PATCH | /users/{id} | Update |
| DELETE | /users/{id} | Delete |
| GET | /users/search | List search endpoints |
| GET | /users/search/findByUsername?username=... | Custom query |

### Customizing Exposure

```java
@RepositoryRestResource(
    collectionResourceRel = "users",
    path = "users",
    exported = true
)
public interface UserRepository extends JpaRepository<User, Long> {

    @RestResource(path = "by-username", rel = "findByUsername")
    Optional<User> findByUsername(@Param("username") String username);

    // Hide a method
    @Override
    @RestResource(exported = false)
    void delete(User entity);
}
```

### Projection Exposures

```java
@RepositoryRestResource(excerptProjection = UserSummary.class)
public interface UserRepository extends JpaRepository<User, Long> { }

@Projection(name = "summary", types = User.class)
public interface UserSummary {
    String getUsername();
    String getEmail();
}
```

---

## Spring Data JDBC

Lightweight alternative to JPA without Hibernate session management:

```java
@Table("users")
public class User {
    @Id
    private Long id;
    private String username;
    private String email;
    // getters/setters
}

public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByActive(boolean active);
}
```

### R2DBC (Reactive Relational Database)

```java
public interface UserRepository extends R2dbcRepository<User, Long> {
    Mono<User> findByUsername(String username);
    Flux<User> findByActive(boolean active);
}
```

---

## Transaction Management with Spring Data

```java
@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void transferData(Long fromId, Long toId) {
        // All operations in one transaction
    }
}
```

---

## Best Practices

- **Use constructor injection** for repositories into services
- **Prefer derived query methods** over @Query when possible
- **Use @Query for complex queries** that can't be expressed with derived methods
- **Use Specifications** for dynamic, composable query conditions
- **Use projections** to limit fetched columns for read-only operations
- **Enable auditing** for createdAt/updatedAt tracking
- **Use @Transactional(readOnly = true)** for read operations to enable optimizations
- **Use Pageable** for large result sets to avoid loading everything into memory
- **Use @EntityGraph** to solve N+1 query problems
- **Index frequently queried fields** in derived query methods
- **Use batch operations** for bulk inserts/updates
- **Close resources properly** - Spring manages this for repository methods

---

## Named Queries

Spring Data JPA supports using JPA named queries defined via `@NamedQuery` or XML.

### Annotation-based Named Queries

```java
@Entity
@NamedQuery(
    name = "User.findByActive",
    query = "SELECT u FROM User u WHERE u.active = :active"
)
public class User { ... }
```

### Using Named Queries in Repository

```java
public interface UserRepository extends JpaRepository<User, Long> {
    // Automatically uses "User.findByActive" named query
    List<User> findByActive(@Param("active") boolean active);
}
```

### XML Named Queries

```xml
<!-- orm.xml -->
<named-query name="User.findByEmail">
    <query>SELECT u FROM User u WHERE u.email = :email</query>
</named-query>
```

### NamedNativeQuery

```java
@Entity
@NamedNativeQuery(
    name = "User.findByEmailDomainNative",
    query = "SELECT * FROM users WHERE email LIKE ?1",
    resultClass = User.class
)
public class User { ... }
```

Source: https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html

---

## Entity Graphs (N+1 Solution)

`@EntityGraph` solves N+1 query problems by specifying fetch profiles.

### Named Entity Graph

```java
@Entity
@NamedEntityGraph(
    name = "User.detail",
    attributeNodes = @NamedAttributeNode("orders")
)
public class User {
    @Id
    private Long id;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders;
}
```

### Using Entity Graph in Repository

```java
public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(value = "User.detail", type = EntityGraphType.LOAD)
    User findByUsername(String username);
}
```

### Ad Hoc Entity Graph

```java
public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = {"orders", "profile"})
    User findByUsername(String username);
}
```

### EntityGraph Types

| Type | Description |
|------|-------------|
| `EntityGraphType.FETCH` | Only specified attributes are fetched (lazy for others) |
| `EntityGraphType.LOAD` | Specified attributes fetched eagerly, others use default settings |

Source: https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html

---

## Scrolling Large Query Results

For large datasets, Spring Data provides scrolling as a lighter alternative to pagination.

### Offset-Based Scrolling

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Window<User> findFirst10ByLastnameOrderByFirstname(String lastname, ScrollPosition position);
}

// Usage
Window<User> users = userRepository.findFirst10ByLastnameOrderByFirstname(
    "Doe", ScrollPosition.offset());
do {
    for (User u : users) {
        // consume user
    }
    if (users.isLast() || users.isEmpty()) break;
    users = userRepository.findFirst10ByLastnameOrderByFirstname(
        "Doe", users.positionAt(users.size() - 1));
} while (!users.isEmpty());
```

### Keyset-Based Scrolling (More Efficient)

Keyset scrolling leverages database indexes, avoiding the performance issues of offset-based retrieval:

```java
Window<User> users = userRepository.findFirst10ByLastnameOrderByFirstname(
    "Doe", ScrollPosition.keyset());
```

### WindowIterator (Simplified Scrolling)

```java
WindowIterator<User> users = WindowIterator.of(position ->
    userRepository.findFirst10ByLastnameOrderByFirstname("Doe", position))
    .startingAt(ScrollPosition.offset());

while (users.hasNext()) {
    User u = users.next();
    // consume user
}
```

### Limit and Top/First Keywords

```java
// Static limiting
List<User> findTop10ByActiveTrue();
List<User> findFirst5ByOrderByCreatedAtDesc();

// Dynamic limiting
List<User> findByActive(boolean active, Limit limit);
List<User> findByActive(boolean active, Sort sort);
```

Source: https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html

---

## Query Hints and Comments

### Query Hints

```java
public interface UserRepository extends JpaRepository<User, Long> {

    @QueryHints(
        @QueryHint(name = "org.hibernate.fetchSize", value = "50"),
        @QueryHint(name = "org.hibernate.readOnly", value = "true")
    )
    List<User> findByActive(boolean active);
}
```

### Adding Comments to Queries

```java
@Query("SELECT u FROM User u WHERE u.active = :active")
@QueryHints(@QueryHint(name = "org.hibernate.comment", value = "Find active users"))
List<User> findByActive(@Param("active") boolean active);
```

---

## MongoDB Aggregations, GridFS, Text Search, Change Streams

### Aggregation Pipeline

```java
@Autowired
private MongoTemplate mongoTemplate;

public List<Document> aggregateUsers() {
    Aggregation aggregation = Aggregation.newAggregation(
        Aggregation.match(Criteria.where("active").is(true)),
        Aggregation.group("department")
            .count().as("count")
            .avg("salary").as("avgSalary"),
        Aggregation.sort(Sort.Direction.DESC, "count")
    );
    AggregationResults<Document> results = mongoTemplate.aggregate(
        aggregation, "users", Document.class);
    return results.getMappedResults();
}
```

### Text Search

```java
// Define text index
@Document(collection = "users")
@CompoundIndex(name = "text_idx", def = "{'name': 'text', 'email': 'text'}")
public class User { ... }

// Search
List<User> users = userRepository.findAll(TextCriteria.forDefaultLanguage()
    .matching("john"));
```

### GridFS (Large File Storage)

```java
@Autowired
private GridFsTemplate gridFsTemplate;

// Store
ObjectId fileId = gridFsTemplate.store(
    inputStream, "filename.pdf", "application/pdf");

// Retrieve
GridFSFile file = gridFsTemplate.findOne(
    Query.query(Criteria.where("_id").is(fileId)));
InputStream stream = gridFsTemplate.getResource(file).getInputStream();
```

### Change Streams (Reactive)

```java
@Autowired
private ReactiveMongoTemplate mongoTemplate;

public Flux<ChangeStreamEvent<User>> watchUsers() {
    return mongoTemplate.changeStream(User.class)
        .listenCollection("users")
        .filter(event -> event.getOperationType() == OperationType.INSERT)
        .toFlux();
}
```

---

## Redis Clustering and Sessions

### Redis Cluster

```java
@Bean
public LettuceConnectionFactory redisConnectionFactory() {
    RedisClusterConfiguration config = new RedisClusterConfiguration()
        .clusterNode("host1", 6379)
        .clusterNode("host2", 6379)
        .clusterNode("host3", 6379);
    return new LettuceConnectionFactory(config);
}
```

### Redis Configuration

```properties
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.data.redis.password=secret
spring.data.redis.lettuce.pool.max-active=8
spring.data.redis.lettuce.pool.max-idle=4
spring.data.redis.timeout=2000ms
```

### Spring Session with Redis

```xml
<dependency>
    <groupId>org.springframework.session</groupId>
    <artifactId>spring-session-data-redis</artifactId>
</dependency>
```

```java
@Configuration
@EnableRedisHttpSession
public class SessionConfig { }
```

---

## Spring Data Commons: Repository Fragments and Composition

Repository fragments allow composing repository functionality from multiple interfaces.

### Fragment Interface

```java
public interface CustomUserRepository {
    List<User> findCustomUsers(String filter);
}

// Fragment implementation
public class CustomUserRepositoryImpl implements CustomUserRepository {
    @PersistenceContext
    private EntityManager em;

    @Override
    public List<User> findCustomUsers(String filter) {
        return em.createQuery("...", User.class).getResultList();
    }
}
```

### Composing Repository with Fragments

```java
// Combine standard + custom + base
public interface UserRepository extends
        JpaRepository<User, Long>,
        CustomUserRepository,
        QuerydslPredicateExecutor<User> {
}
```

### Reactive Fragments

```java
public interface ReactiveCustomUserRepository {
    Flux<User> findCustomUsers(String filter);
}

public interface ReactiveUserRepository extends
        ReactiveCrudRepository<User, String>,
        ReactiveCustomUserRepository {
}
```

---

## Spring Data REST: HAL Browser, Security, CORS

### HAL Browser

Add HAL Browser dependency for a web UI to browse REST endpoints:

```xml
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-rest-hal-explorer</artifactId>
</dependency>
```

Access at: `http://localhost:8080/` (root URL)

### Security for REST Endpoints

```java
@Configuration
@EnableWebSecurity
public class RestSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(HttpMethod.GET, "/users/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }
}
```

### CORS for REST Repositories

```java
@RepositoryRestResource(collectionResourceRel = "users", path = "users")
@CrossOrigin(origins = "http://localhost:3000")
public interface UserRepository extends JpaRepository<User, Long> { }
```

Global CORS:
```java
@Configuration
public class RestCorsConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(
            RepositoryRestConfiguration config, CorsRegistry cors) {
        cors.addMapping("/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowCredentials(true);
    }
}
```

### REST Projection with Excerpt

```java
@Projection(name = "summary", types = User.class)
public interface UserSummary {
    String getUsername();
    String getEmail();
    @Value("#{target.orders.size()}")
    Integer getOrderCount();
}

@RepositoryRestResource(excerptProjection = UserSummary.class)
public interface UserRepository extends JpaRepository<User, Long> { }
```

---

## Spring Data Web Support

### Pageable Handler Method Argument Resolver

Spring Data automatically resolves `Pageable` and `Sort` from request parameters:

```java
@GetMapping("/users")
public Page<User> getUsers(Pageable pageable) {
    return userRepository.findAll(pageable);
}
```

Request: `GET /users?page=0&size=20&sort=name,asc&sort=createdAt,desc`

### Customizing Default Pageable

```properties
spring.data.web.pageable.default-page-size=20
spring.data.web.pageable.max-page-size=100
spring.data.web.pageable.page-parameter=page
spring.data.web.pageable.size-parameter=size
spring.data.web.sort.sort-parameter=sort
```

### JSON Representation of Page

Spring Data provides custom JSON serialization for `Page<T>` that includes:
- `content` - the actual data
- `pageable` - pagination metadata
- `totalElements` - total count
- `totalPages` - total pages
- `number` - current page number
- `size` - page size
- `first` / `last` - whether first/last page
- `sort` - sort information
- `numberOfElements` - elements in current page

### Querydsl Web Support

```java
@GetMapping("/users")
public Page<User> getUsers(Predicate predicate, Pageable pageable) {
    return userRepository.findAll(predicate, pageable);
}
```

Request: `GET /users?firstname=John&active=true`

---

## Repository Populators

Spring Data can populate repositories on startup from JSON or XML files.

### JSON Populator

```xml
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-jpa</artifactId>
</dependency>
```

Create `data.json` in `src/main/resources/`:
```json
[
  { "_class": "com.example.User", "username": "john", "email": "john@example.com", "active": true },
  { "_class": "com.example.User", "username": "jane", "email": "jane@example.com", "active": true }
]
```

```java
@Bean
public Jackson2RepositoryPopulatorFactoryBean repositoryPopulator() {
    Jackson2RepositoryPopulatorFactoryBean factory = new Jackson2RepositoryPopulatorFactoryBean();
    factory.setResources(new Resource[]{new ClassPathResource("data.json")});
    return factory;
}
```

Source: https://docs.spring.io/spring-data/jpa/reference/repositories/core-extensions.html
