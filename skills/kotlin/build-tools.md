# Build Tools

**Docs:** https://kotlinlang.org/docs/gradle.html | https://kotlinlang.org/docs/maven.html | https://kotlinlang.org/docs/compiler-reference.html

## Gradle (Kotlin DSL)

### Project Setup

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.4.0"
    // Kotlin Multiplatform
    // kotlin("multiplatform") version "2.4.0"
    // Serialization
    // kotlin("plugin.serialization") version "2.4.0"
    // KSP (Kotlin Symbol Processing)
    // id("com.google.devtools.ksp") version "2.4.0-1.0.20"
}

group = "com.example"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0")
    testImplementation(kotlin("test"))
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
}

tasks.test {
    useJUnitPlatform()
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        jvmTarget = "17"
    }
}
```

### Kotlin Gradle Plugin (KGP)

```kotlin
// settings.gradle.kts
pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}

// build.gradle.kts
plugins {
    kotlin("jvm") version "2.4.0"
    application
}

application {
    mainClass.set("com.example.MainKt")
}
```

### Compiler Options

```kotlin
// Via KotlinCompile task
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs = listOf(
            "-Xjsr305=strict",           // JSpecify/JSR-305 nullability
            "-Xcontext-receivers",       // Context receivers (experimental)
            "-Xwhen-guards",             // When guards (experimental)
            "-opt-in=kotlin.RequiresOptIn",
            "-opt-in=kotlinx.coroutines.ExperimentalCoroutinesApi",
            "-XXLanguage:+CollectionLiterals"  // Collection literals
        )
        allWarningsAsErrors = true
        progressiveMode = true
    }
}

// Via kotlin block (KGP 2.x)
kotlin {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
        freeCompilerArgs.add("-Xjsr305=strict")
        allWarningsAsErrors.set(true)
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

### Multi-Module Project

```kotlin
// settings.gradle.kts
include(":core", ":api", ":app", ":utils")

// build.gradle.kts (root)
plugins {
    kotlin("jvm") version "2.4.0" apply false
}

// core/build.gradle.kts
plugins {
    kotlin("jvm")
}

dependencies {
    implementation(project(":utils"))
}

// app/build.gradle.kts
plugins {
    kotlin("jvm")
    application
}

dependencies {
    implementation(project(":core"))
    implementation(project(":api"))
}
```

### Kotlin Multiplatform with Gradle

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "2.4.0"
}

kotlin {
    jvm()
    js(IR) { browser(); nodejs() }
    iosX64()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
        commonTest.dependencies {
            implementation(kotlin("test"))
        }
        jvmMain.dependencies {
            implementation("org.slf4j:slf4j-api:2.0.13")
        }
    }
}
```

### Android with Kotlin

```kotlin
// build.gradle.kts (module)
plugins {
    id("com.android.application") version "8.5.2"
    kotlin("android") version "2.4.0"
    // KSP for annotation processing
    id("com.google.devtools.ksp") version "2.4.0-1.0.20"
}

android {
    namespace = "com.example.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }
}

dependencies {
    implementation("androidx.compose.ui:ui:1.7.5")
    implementation("androidx.compose.material3:material3:1.3.1")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.10.1")
}
```

## Maven

### Project Setup

```xml
<!-- pom.xml -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>kotlin-app</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <properties>
        <kotlin.version>2.4.0</kotlin.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
        <dependency>
            <groupId>org.jetbrains.kotlinx</groupId>
            <artifactId>kotlinx-coroutines-core</artifactId>
            <version>1.10.1</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>${kotlin.version}</version>
                <executions>
                    <execution>
                        <id>compile</id>
                        <goals><goal>compile</goal></goals>
                        <configuration>
                            <sourceDirs>
                                <sourceDir>${project.basedir}/src/main/kotlin</sourceDir>
                                <sourceDir>${project.basedir}/src/main/java</sourceDir>
                            </sourceDirs>
                        </configuration>
                    </execution>
                    <execution>
                        <id>test-compile</id>
                        <goals><goal>test-compile</goal></goals>
                    </execution>
                </executions>
                <configuration>
                    <jvmTarget>17</jvmTarget>
                    <args>
                        <arg>-Xjsr305=strict</arg>
                    </args>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Maven Commands

```bash
mvn compile              # Compile
mvn test                 # Run tests
mvn package              # Build JAR
mvn install              # Install to local repo
mvn exec:java -Dexec.mainClass="com.example.MainKt"  # Run
```

## KSP (Kotlin Symbol Processing)

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.4.0"
    id("com.google.devtools.ksp") version "2.4.0-1.0.20"
}

dependencies {
    // KSP processors (replaces kapt for many tools)
    ksp("com.google.dagger:hilt-compiler:2.52")
    ksp("androidx.room:room-compiler:2.7.0")
    ksp("com.squareup.moshi:moshi-kotlin-codegen:1.15.1")
}
```

## kapt (Annotation Processing)

```kotlin
plugins {
    kotlin("jvm") version "2.4.0"
    kotlin("kapt") version "2.4.0"
}

dependencies {
    kapt("com.google.dagger:dagger-compiler:2.52")
    kapt("org.mapstruct:mapstruct-processor:1.6.3")
}
```

## Dokka (Documentation Generator)

```kotlin
plugins {
    kotlin("jvm") version "2.4.0"
    id("org.jetbrains.dokka") version "1.9.20"
}

// Generate docs
// ./gradlew dokkaHtml     — HTML docs
// ./gradlew dokkaJavadoc  — Javadoc format
// ./gradlew dokkaGfm      — GitHub Flavored Markdown
```

## Common Gradle Commands

```bash
# Build
./gradlew build              # Full build with tests
./gradlew assemble           # Build without tests
./gradlew compileKotlin      # Compile Kotlin only
./gradlew check              # Run all checks (tests, lint)

# Run
./gradlew run                # Run application
./gradlew test               # Run tests
./gradlew test --tests "com.example.CalculatorTest"  # Specific test

# Clean
./gradlew clean              # Clean build outputs

# Dependencies
./gradlew dependencies       # Show dependency tree
./gradlew dependencies --configuration runtimeClasspath

# Publish
./gradlew publish            # Publish to repository
./gradlew publishToMavenLocal  # Publish to local Maven repo
```

## Kotlin Compiler (kotlinc)

```bash
# Compile a file
kotlinc main.kt -include-runtime -d main.jar

# Run compiled JAR
java -jar main.jar

# Compile to class files
kotlinc main.kt -d out/

# Run class files
kotlin -cp out/ MainKt

# REPL
kotlinc

# Script (.kts)
kotlinc -script script.kts

# Version
kotlinc -version
```

## Build Performance

```kotlin
// gradle.properties
org.gradle.caching=true
org.gradle.parallel=true
org.gradle.jvmargs=-Xmx2g

# Kotlin-specific
kotlin.code.style=official
kotlin.incremental=true
kotlin.daemon.enabled=true
kotlin.daemon.jvmargs=-Xmx1g

# K2 compiler (Kotlin 2.x uses K2 by default)
kotlin.useK2=true
```

## Compiler Plugins

### All-open Compiler Plugin

Makes classes annotated with specific annotations `open` (not final), needed for frameworks like Spring that require CGLIB proxying.

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.4.0"
    kotlin("plugin.allopen") version "2.4.0"
}

allOpen {
    annotation("com.example.OpenClass")
    annotation("org.springframework.stereotype.Service")
    annotation("org.springframework.stereotype.Component")
    annotation("org.springframework.stereotype.Repository")
    annotation("org.springframework.stereotype.Controller")
}

// Spring support (preset annotations)
plugins {
    kotlin("plugin.spring") version "2.4.0"  // wraps all-open with Spring annotations
}
```

### No-arg Compiler Plugin

Generates a synthetic zero-argument constructor for annotated classes, needed for JPA entities.

```kotlin
plugins {
    kotlin("jvm") version "2.4.0"
    kotlin("plugin.noarg") version "2.4.0"
}

noArg {
    annotation("com.example.NoArg")
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.Embeddable")
    annotation("jakarta.persistence.MappedSuperclass")
}

// JPA support (preset annotations)
plugins {
    kotlin("plugin.jpa") version "2.4.0"  // wraps no-arg with JPA annotations
}
```

### Lombok Compiler Plugin

Allows Kotlin code to use Lombok-generated declarations from Java sources.

```kotlin
plugins {
    kotlin("jvm") version "2.4.0"
    kotlin("plugin.lombok") version "2.4.0"
}

lombok {
    configFile = file("lombok.config")
}

// Note: Lombok annotations cannot be used on Kotlin classes
// This plugin only lets Kotlin see Lombok-generated methods from Java classes
```

### Power-assert Compiler Plugin

Enhances assertion error messages with a diagram of intermediate values.

```kotlin
plugins {
    kotlin("jvm") version "2.4.0"
    kotlin("plugin.power-assert") version "2.4.0"
}

powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue", "kotlin.test.assertEquals")
    includedSourceSets = listOf("test")
}
```

```kotlin
// Without power-assert: "Assertion failed"
// With power-assert:
// Assertion failed
// assert(x * 2 == y + z)
//        |   |   |  | | |
//        3   6   5  3 8 5
assert(x * 2 == y + z)
```

### SAM-with-Receiver Plugin

Converts the first parameter of annotated Java SAM interface methods to a Kotlin receiver.

```kotlin
plugins {
    kotlin("jvm") version "2.4.0"
    kotlin("plugin.sam.with.receiver") version "2.4.0"
}

samWithReceiver {
    annotation("com.example.SamWithReceiver")
}
```

### Custom Compiler Plugins

```text
Kotlin compiler plugins can be:
- Frontend plugins — extend analysis, resolution, diagnostics
- Backend plugins — modify IR (Intermediate Representation) for code generation

Template: https://github.com/JetBrains/kotlin-compiler-plugin-template

Key APIs:
- IrElementTransformer — transform IR nodes
- ExtensionFunctionName — register extensions
- StorageComponentContainerContributor — extend analysis
```
