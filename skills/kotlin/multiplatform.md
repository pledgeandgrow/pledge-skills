# Kotlin Multiplatform (KMP)

**Docs:** https://kotlinlang.org/docs/multiplatform.html | https://kotlinlang.org/docs/multiplatform/share-logic.html | https://kotlinlang.org/docs/multiplatform/expect-actual.html

## Overview

Kotlin Multiplatform (KMP) lets you share business logic across platforms while keeping platform-specific UI and APIs separate. Shared code compiles to JVM, JS, Native, and Wasm targets.

## Project Structure

```
my-app/
├── shared/
│   ├── build.gradle.kts
│   └── src/
│       ├── commonMain/          # Shared code
│       │   └── kotlin/
│       ├── androidMain/         # Android-specific
│       │   └── kotlin/
│       ├── iosMain/             # iOS-specific
│       │   └── kotlin/
│       ├── jsMain/              # JS-specific
│       │   └── kotlin/
│       └── jvmMain/             # JVM-specific
│           └── kotlin/
├── androidApp/                  # Android application
├── iosApp/                      # iOS application
└── build.gradle.kts
```

## Gradle Configuration

```kotlin
// shared/build.gradle.kts
plugins {
    kotlin("multiplatform")
}

kotlin {
    // Targets
    androidTarget {
        compilations.all {
            kotlinOptions { jvmTarget = "17" }
        }
    }

    iosX64()
    iosArm64()
    iosSimulatorArm64()

    jvm("desktop")

    js(IR) {
        browser()
        nodejs()
    }

    // Source sets
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
            implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0")
        }

        androidMain.dependencies {
            implementation("androidx.core:core-ktx:1.13.1")
        }

        iosMain.dependencies {
            // iOS-specific dependencies
        }
    }
}
```

## expect/actual Mechanism

```kotlin
// commonMain — declare expected API
expect class PlatformDate() {
    fun toIsoString(): String
}

expect fun getPlatformName(): String

expect object FileSystem {
    fun read(path: String): ByteArray
    fun write(path: String, data: ByteArray)
}

// androidMain — actual implementation
actual class PlatformDate {
    actual fun toIsoString(): String {
        return java.text.SimpleDateFormat("yyyy-MM-dd").format(java.util.Date())
    }
}

actual fun getPlatformName(): String = "Android"

actual object FileSystem {
    actual fun read(path: String): ByteArray = java.io.File(path).readBytes()
    actual fun write(path: String, data: ByteArray) {
        java.io.File(path).writeBytes(data)
    }
}

// iosMain — actual implementation
import platform.Foundation.*

actual class PlatformDate {
    actual fun toIsoString(): String {
        return NSDate().description
    }
}

actual fun getPlatformName(): String = "iOS"

actual object FileSystem {
    actual fun read(path: String): ByteArray {
        // NSFileManager-based implementation
        return NSData(contentsOfFile = path)!!.toByteArray()
    }
    actual fun write(path: String, data: ByteArray) {
        // ...
    }
}
```

## expect/actual with Interfaces

```kotlin
// commonMain
expect interface TimeProvider {
    fun now(): Long
}

// Better approach — interface in common, factory via expect/actual
interface TimeProvider {
    fun now(): Long
}

expect fun createTimeProvider(): TimeProvider

// androidMain
actual fun createTimeProvider(): TimeProvider = object : TimeProvider {
    override fun now() = System.currentTimeMillis()
}

// iosMain
actual fun createTimeProvider(): TimeProvider = object : TimeProvider {
    override fun now() = platform.Foundation.NSDate().timeIntervalSince1970.toLong() * 1000
}
```

## Sharing Code

### Common Code

```kotlin
// commonMain/kotlin/SharedLogic.kt
class Greeting {
    fun greet(): String {
        return "Hello from ${getPlatformName()}!"
    }
}

// Data models — shared across platforms
data class User(val id: String, val name: String, val email: String)

// Business logic — shared
class UserRepository {
    private val users = mutableMapOf<String, User>()

    fun save(user: User) {
        users[user.id] = user
    }

    fun find(id: String): User? = users[id]
}
```

### Platform-Specific UI

```kotlin
// Android — uses Compose or Views
// androidApp/src/main/kotlin/MainActivity.kt
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val greeting = Greeting()
        setContent {
            Text(text = greeting.greet())
        }
    }
}

// iOS — uses SwiftUI
// iosApp/iOSApp.swift
struct ContentView: View {
    let greeting = Greeting()
    var body: some View {
        Text(greeting.greet())
    }
}
```

## Intermediate Source Sets

```kotlin
// Share code between specific platforms (e.g., iOS + macOS = appleMain)
kotlin {
    iosX64()
    iosArm64()
    iosSimulatorArm64()
    macosX64()
    macosArm64()

    sourceSets {
        val appleMain by creating {
            dependsOn(commonMain)
            // Apple-specific shared code
        }

        val iosMain by getting {
            dependsOn(appleMain)
        }

        val macosMain by getting {
            dependsOn(appleMain)
        }
    }
}
```

## Kotlin/Native (iOS, macOS, Linux, Windows)

```kotlin
// Access native APIs
import platform.Foundation.NSDate
import platform.Foundation.NSUserDefaults
import platform.UIKit.UIDevice

class IOSDeviceInfo {
    fun deviceModel(): String {
        return UIDevice.currentDevice.model
    }

    fun savePreference(key: String, value: String) {
        NSUserDefaults.standardUserDefaults.setObject(value, forKey = key)
    }
}
```

## Kotlin/Wasm

```kotlin
// WebAssembly target
kotlin {
    wasmJs {
        browser()
    }
}

// Access Web APIs
import org.w3c.dom.*

fun manipulateDOM() {
    val element = document.getElementById("app")
    element?.innerHTML = "<h1>Hello from Kotlin/Wasm</h1>"
}
```

## C Interop (Kotlin/Native)

**Docs:** https://kotlinlang.org/docs/native-c-interop.html

```kotlin
// build.gradle.kts — define cinterop def file
kotlin {
    linuxX64("linux") {
        compilations.getByName("main") {
            cinterops {
                val libcurl by creating {
                    defFile("src/nativeInterop/cinterop/libcurl.def")
                    // .def file example:
                    // headers = curl/curl.h
                    // compilerOpts = -I/usr/include
                    // linkerOpts = -lcurl
                }
            }
        }
    }
}

// Use C library from Kotlin
import libcurl.*

fun fetchUrl(url: String): String {
    val handle = curl_easy_init()
    try {
        curl_easy_setopt(handle, CURLOPT_URL, url)
        // ... use C API
        return "response"
    } finally {
        curl_easy_cleanup(handle)
    }
}

// Memory allocation with native heap
import kotlinx.cinterop.*

fun allocateMemory() {
    val ptr = nativeHeap.alloc<IntVar>(10)  // 10 ints
    try {
        ptr[0] = 42
    } finally {
        nativeHeap.free(ptr)
    }
}

// Scope-local pointers (auto-freed)
fun scopedAlloc() = memScoped {
    val buffer = allocArray<ByteVar>(256)
    // buffer freed automatically at end of scope
}

// Pinning objects for C interop
fun pinExample() {
    val array = ByteArray(100)
    array.usePinned { pinned ->
        val ptr = pinned.addressOf(0)
        // pass ptr to C function
    }
}
```

## Kotlin/JS

```kotlin
// build.gradle.kts
kotlin {
    js {
        browser {
            testTask {
                useKarma {
                    useChromeHeadless()
                }
            }
        }
        nodejs()
        binaries.executable()  // generate executable JS
    }
}

// Export Kotlin declarations to JavaScript
@JsExport
fun greet(name: String): String = "Hello, $name!"

@JsExport
class Calculator {
    fun add(a: Int, b: Int): Int = a + b
}

// Use JavaScript from Kotlin
external fun consoleLog(message: String)

external object JSON {
    fun parse(text: String): dynamic
    fun stringify(value: dynamic): String
}

// js() function — inline JavaScript
fun jsExample(): Int = js("1 + 2")

// Type-safe plain JS objects (Kotlin 2.0+)
external interface JsUser {
    var name: String
    var age: Int
}

fun createUser(): JsUser = js("{ name: 'Alice', age: 30 }")

// Dynamic type — no compile-time checks
fun dynamicExample(): dynamic {
    val obj: dynamic = js("({ x: 1, y: 2 })")
    return obj.x + obj.y  // dynamic access
}
```

## KMP Libraries

```kotlin
// Common dependencies available across platforms
sourceSets {
    commonMain.dependencies {
        // Coroutines
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")

        // Serialization
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0")

        // DateTime
        implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.6.2")

        // Ktor (HTTP client)
        implementation("io.ktor:ktor-client-core:3.1.0")

        // SQLDelight
        implementation("app.cash.sqldelight:runtime:2.0.2")
    }

    androidMain.dependencies {
        implementation("io.ktor:ktor-client-android:3.1.0")
    }

    iosMain.dependencies {
        implementation("io.ktor:ktor-client-darwin:3.1.0")
    }
}
```

## Compose Multiplatform

```kotlin
// Share UI across platforms with Compose
plugins {
    kotlin("multiplatform")
    id("org.jetbrains.compose") version "1.7.0"
}

kotlin {
    androidTarget()
    iosX64()
    iosArm64()
    iosSimulatorArm64()
    jvm("desktop")

    sourceSets {
        commonMain.dependencies {
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material3)
        }
    }
}

// Shared UI code
@Composable
fun SharedApp() {
    var text by remember { mutableStateOf("Hello, KMP!") }
    Column {
        Text(text)
        Button(onClick = { text = "Clicked!" }) {
            Text("Click me")
        }
    }
}
```

## Testing in KMP

```kotlin
sourceSets {
    val commonTest.dependencies {
        implementation(kotlin("test"))
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.10.1")
    }

    val androidTest.dependencies {
        implementation("junit:junit:4.13.2")
    }
}

// commonTest
class CommonTest {
    @Test
    fun testSharedLogic() {
        val greeting = Greeting()
        assertTrue(greeting.greet().isNotEmpty())
    }
}
```

## Creating a KMP Project

```bash
# Using Kotlin Multiplatform wizard
# https://kmp.jetbrains.com/

# Or with Gradle
gradle init --type kotlin-multiplatform

# Or with the KMP plugin for IntelliJ IDEA / Android Studio
# New Project > Kotlin Multiplatform
```

## Target Hierarchy

```
commonMain
├── jvmMain
│   ├── androidMain
│   └── desktopMain
├── nativeMain
│   ├── appleMain
│   │   ├── iosMain
│   │   │   ├── iosArm64Main
│   │   │   ├── iosX64Main
│   │   │   └── iosSimulatorArm64Main
│   │   └── macosMain
│   └── linuxMain
├── jsMain
└── wasmJsMain
```

## Best Practices

- Share business logic, data models, and API clients in `commonMain`
- Keep UI platform-specific (or use Compose Multiplatform)
- Use `expect/actual` for platform-specific APIs
- Prefer interfaces + factory functions over `expect class` when possible
- Use intermediate source sets for platform families (apple, jvm, etc.)
- Use KMP-compatible libraries (kotlinx.coroutines, kotlinx.serialization, Ktor, SQLDelight)

## Kotlin/Native Memory Management

**Docs:** https://kotlinlang.org/docs/native-memory-manager.html

```kotlin
// Kotlin/Native uses automatic memory management (since 1.7)
// No manual memory management needed — GC handles object lifecycle

// Garbage collector
// - Enabled by default
// - Can be manually triggered
kotlin.native.internal.GC.collect()

// Monitor GC performance (Apple platforms)
// Use Xcode Instruments — look for "Kotlin/Native GC" signposts

// Disable GC (for specific use cases)
// -Xgc=noop  — compile flag

// Memory consumption
// - Adjust heap size: -Xmemory-manager=trace
// - Monitor: set KN_MEMORY_MANAGER_LOGGING=INFO env var

// Object graph constraints (relaxed since 1.7.20)
// - Global properties can reference any object
// - Objects can cross thread boundaries freely
// - No more "Incorrect dereference" errors for typical code

// Autorelease pools (Apple platforms)
import kotlinx.cinterop.*

fun useAutoreleasePool() = memScoped {
    // Resources in this scope are auto-released
}

// Thread safety
// - Kotlin/Native uses a single thread for global state by default
// - Use @SharedImmutable for frozen global data
@SharedImmutable
val globalConfig = mapOf("key" to "value")  // safe across threads
```
