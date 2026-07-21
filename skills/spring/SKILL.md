---
name: spring-ecosystem-docs
version: "4.1.0"
tags:
  - spring
  - spring boot
  - spring framework
  - spring security
  - spring data
  - java
  - kotlin
  - ioc
  - dependency injection
  - aop
  - auto-configuration
  - actuator
  - web mvc
  - webflux
  - reactive
  - jpa
  - hibernate
  - mongodb
  - redis
  - oauth2
  - jwt
  - authentication
  - authorization
  - csrf
  - repository pattern
  - rest api
  - microservices
  - enterprise
  - graalvm
  - native image
description: |
  Spring Boot 4.x + Framework 7.x — auto-configuration, DI, AOP, MVC, WebFlux, Security, Data JPA/MongoDB/Redis.
---

# Spring Framework Ecosystem

## Overview

Spring is the most widely-used Java application framework for building enterprise applications. It provides comprehensive infrastructure support for developing Java applications, with a focus on inversion of control (IoC), dependency injection (DI), aspect-oriented programming (AOP), and modular project structure.

The Spring ecosystem consists of multiple projects that build on the Spring Framework core:

- **Spring Boot** - Stand-alone, production-grade applications with auto-configuration and embedded servers
- **Spring Framework** - Core IoC container, AOP, web MVC, WebFlux, data access, testing
- **Spring Security** - Authentication, authorization, OAuth2, CSRF, session management
- **Spring Data** - Repository abstractions for JPA, MongoDB, Redis, JDBC, REST, and more

## Key Concepts

- **Inversion of Control (IoC)** - Objects define their dependencies through constructor arguments, factory methods, or setters; the container injects them
- **Dependency Injection (DI)** - The Spring container manages bean lifecycle and wires dependencies
- **Beans** - Objects managed by the Spring IoC container
- **ApplicationContext** - The central interface for configuration and bean management
- **Auto-configuration** - Spring Boot automatically configures beans based on classpath dependencies
- **Starters** - Opinionated dependency descriptors that simplify build configuration
- **Actuator** - Production-ready features: health checks, metrics, monitoring via HTTP/JMX
- **Externalized Configuration** - Properties/YAML files, environment variables, command-line args
- **AOP** - Cross-cutting concerns like transactions, logging, security via aspects
- **Spring MVC** - Servlet-stack web framework with annotation-based controllers
- **Spring WebFlux** - Reactive-stack web framework built on Reactor
- **Repository abstraction** - Spring Data's pattern for data access with minimal boilerplate

## Project Structure

A typical Spring Boot application:

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring Boot!";
    }
}
```

Kotlin equivalent:

```kotlin
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.*

@SpringBootApplication
class MyApplication

fun main(args: Array<String>) {
    runApplication<MyApplication>(*args)
}
```

## Spring Ecosystem Architecture

```
Spring Framework (Core)
├── IoC Container (ApplicationContext, BeanFactory)
├── AOP (Aspects, Pointcuts, Advice)
├── Spring MVC (Servlet-stack web)
├── Spring WebFlux (Reactive-stack web)
├── Data Access (JDBC, Transactions, O/R Mapping)
├── Testing (TestContext, MockMvc, WebTestClient)
└── Integration (REST, JMS, JMX, Scheduling, Caching)

Spring Boot
├── Auto-configuration (@EnableAutoConfiguration)
├── Starters (spring-boot-starter-*)
├── Embedded Servers (Tomcat, Jetty, Undertow)
├── Actuator (Health, Metrics, Info endpoints)
├── Externalized Configuration (Properties, YAML, Profiles)
├── Spring Initializr (start.spring.io)
└── AOT/Native Image (GraalVM)

Spring Security
├── Authentication (Forms, Basic, JWT, OAuth2)
├── Authorization (URL-based, Method-level)
├── CSRF Protection
├── Session Management
├── OAuth2 Client & Resource Server
└── Reactive Security (WebFlux)

Spring Data
├── Spring Data JPA (Hibernate, EclipseLink)
├── Spring Data MongoDB
├── Spring Data Redis
├── Spring Data JDBC/R2DBC
├── Spring Data REST (HATEOAS repositories)
├── Spring Data Commons (Repository, CrudRepository, PagingAndSortingRepository)
└── Spring Data Envers (Audit/revision tracking)
```

## Skill File Index

| File | Topics | Lines |
|------|--------|-------|
| `SKILL.md` | Overview, architecture, concepts, index | ~120 |
| `boot.md` | Spring Boot: starters, auto-configuration, SpringApplication, externalized config, actuator, testing, AOT/native | ~350 |
| `framework.md` | IoC container, beans, DI, AOP, Spring MVC, WebFlux, data access, transactions, testing, SpEL | ~400 |
| `security.md` | Authentication, authorization, OAuth2, CSRF, sessions, method security, reactive security | ~300 |
| `data.md` | Repository abstraction, CrudRepository, JPA repositories, query methods, MongoDB, Redis, REST, pagination | ~300 |

## Official Documentation

- **Spring Boot**: https://docs.spring.io/spring-boot/reference/
- **Spring Framework**: https://docs.spring.io/spring-framework/reference/
- **Spring Security**: https://docs.spring.io/spring-security/reference/
- **Spring Data JPA**: https://docs.spring.io/spring-data/jpa/reference/
- **Spring Data Commons**: https://docs.spring.io/spring-data/jpa/reference/data-commons/
- **Spring Initializr**: https://start.spring.io/
- **Spring Guides**: https://spring.io/guides
- **Spring Academy**: https://spring.academy/
