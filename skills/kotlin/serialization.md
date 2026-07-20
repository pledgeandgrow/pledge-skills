# Serialization

**Docs:** https://kotlinlang.org/docs/serialization.html | https://github.com/Kotlin/kotlinx.serialization

## Setup

```kotlin
// build.gradle.kts
plugins {
    kotlin("plugin.serialization") version "2.4.0"
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0")
    // For ProtoBuf
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-protobuf:1.8.0")
    // For CBOR
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-cbor:1.8.0")
    // For HOCON
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-hocon:1.8.0")
    // For Properties
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-properties:1.8.0")
}
```

## @Serializable

```kotlin
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

@Serializable
data class User(
    val id: Long,
    val name: String,
    val email: String,
    val age: Int = 0
)

// Serialize
val user = User(1, "Alice", "alice@mail.com", 30)
val json = Json.encodeToString(user)
// {"id":1,"name":"Alice","email":"alice@mail.com","age":30}

// Deserialize
val decoded = Json.decodeFromString<User>(json)
// User(id=1, name=Alice, email=alice@mail.com, age=30)
```

## JSON Configuration

```kotlin
// Custom Json instance
val json = Json {
    ignoreUnknownKeys = true       // ignore unknown fields in input
    encodeDefaults = true          // include default values in output
    explicitNulls = false          // omit null values in output
    prettyPrint = true             // pretty-print output
    prettyPrintIndent = "  "       // indent string
    coerceInputValues = true       // coerce invalid values to default
    allowStructuredMapKeys = true  // allow complex map keys
    classDiscriminator = "#class"  // polymorphism discriminator key
}

val pretty = json.encodeToString(user)
// {
//   "id": 1,
//   "name": "Alice",
//   "email": "alice@mail.com",
//   "age": 30
// }
```

## Optional and Nullable Fields

```kotlin
@Serializable
data class Config(
    val host: String,                    // required
    val port: Int = 8080,                // optional with default
    val debug: Boolean = false,          // optional with default
    val apiKey: String? = null,          // nullable, optional
    val features: List<String> = emptyList()  // default empty
)

// Missing fields use defaults (with ignoreUnknownKeys)
val config = Json { ignoreUnknownKeys = true }
    .decodeFromString<Config>("""{"host":"localhost"}""")
// Config(host=localhost, port=8080, debug=false, apiKey=null, features=[])
```

## @SerialName

```kotlin
@Serializable
data class User(
    @SerialName("user_id") val id: Long,
    @SerialName("full_name") val name: String,
    @SerialName("email_address") val email: String
)

// JSON uses the serial names
// {"user_id":1,"full_name":"Alice","email_address":"alice@mail.com"}
```

## @Transient

```kotlin
@Serializable
data class User(
    val id: Long,
    val name: String,
    @Transient val cachedData: String = ""  // not serialized
)
```

## @SerialInfo (Custom Annotations)

```kotlin
@SerialInfo
annotation class MinLength(val value: Int)

@Serializable
data class Password(
    @MinLength(8) val value: String
)
```

## Polymorphic Serialization

### Sealed Class

```kotlin
@Serializable
sealed class Response {
    @Serializable
    @SerialName("success")
    data class Success(val data: String) : Response()

    @Serializable
    @SerialName("error")
    data class Error(val message: String, val code: Int) : Response()
}

val response: Response = Response.Success("Hello")
val json = Json.encodeToString(response)
// {"type":"success","data":"Hello"}

val decoded = Json.decodeFromString<Response>(json)
// Response.Success(data=Hello)
```

### Open Polymorphism

```kotlin
@Serializable
abstract class Animal {
    abstract val name: String
}

@Serializable
@SerialName("dog")
data class Dog(override val name: String, val breed: String) : Animal()

@Serializable
@SerialName("cat")
data class Cat(override val name: String, val indoor: Boolean) : Animal()

// Register subclasses
val json = Json {
    serializersModule = SerializersModule {
        polymorphic(Animal::class) {
            subclass(Dog::class)
            subclass(Cat::class)
        }
    }
}

val animal: Animal = Dog("Rex", "Labrador")
val encoded = json.encodeToString(animal)
// {"type":"dog","name":"Rex","breed":"Labrador"}
```

## Custom Serializers

```kotlin
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.descriptors.*
import kotlinx.serialization.encoding.*

// Object serializer
object DateAsLongSerializer : KSerializer<Date> {
    override val descriptor = PrimitiveSerialDescriptor("Date", PrimitiveKind.LONG)

    override fun serialize(encoder: Encoder, value: Date) {
        encoder.encodeLong(value.time)
    }

    override fun deserialize(decoder: Decoder): Date {
        return Date(decoder.decodeLong())
    }
}

// Usage
@Serializable
data class Event(
    val name: String,
    @Serializable(with = DateAsLongSerializer::class) val date: Date
)
```

### Custom Serializer with Composite Structure

```kotlin
object ColorSerializer : KSerializer<Color> {
    override val descriptor = buildClassSerialDescriptor("Color") {
        element<Int>("r")
        element<Int>("g")
        element<Int>("b")
    }

    override fun serialize(encoder: Encoder, value: Color) {
        encoder.encodeStructure(descriptor) {
            encodeIntElement(descriptor, 0, value.r)
            encodeIntElement(descriptor, 1, value.g)
            encodeIntElement(descriptor, 2, value.b)
        }
    }

    override fun deserialize(decoder: Decoder): Color {
        return decoder.decodeStructure(descriptor) {
            var r = 0; var g = 0; var b = 0
            while (true) {
                when (val index = decodeElementIndex(descriptor)) {
                    0 -> r = decodeIntElement(descriptor, 0)
                    1 -> g = decodeIntElement(descriptor, 1)
                    2 -> b = decodeIntElement(descriptor, 2)
                    CompositeDecoder.DECODE_DONE -> break
                    else -> error("Unexpected index: $index")
                }
            }
            Color(r, g, b)
        }
    }
}
```

## Collections and Maps

```kotlin
@Serializable
data class Library(
    val books: List<Book>,
    val byAuthor: Map<String, List<Book>>,
    val tags: Set<String>
)

@Serializable
data class Book(val title: String, val author: String)

val lib = Library(
    books = listOf(Book("Kotlin", "JetBrains")),
    byAuthor = mapOf("JetBrains" to listOf(Book("Kotlin", "JetBrains"))),
    tags = setOf("programming", "kotlin")
)

val json = Json.encodeToString(lib)
```

## Generic Serializable Classes

```kotlin
@Serializable
data class Box<T>(val content: T)

val box = Box(User(1, "Alice", "alice@mail.com"))
val json = Json.encodeToString(box)
// {"content":{"id":1,"name":"Alice","email":"alice@mail.com"}}

// Deserialize generic
val decoded = Json.decodeFromString<Box<User>>(json)
```

## ProtoBuf Format

```kotlin
import kotlinx.serialization.protobuf.ProtoBuf

@Serializable
data class User(val id: Long, val name: String)

val user = User(1, "Alice")
val bytes = ProtoBuf.encodeToByteArray(user)
val decoded = ProtoBuf.decodeFromByteArray<User>(bytes)
```

## JsonElement (Dynamic JSON)

```kotlin
import kotlinx.serialization.json.*

// Parse to JsonElement (no schema needed)
val element = Json.parseToJsonElement("""{"name":"Alice","age":30,"tags":["a","b"]}""")

// Navigate
val name = element.jsonObject["name"]!!.jsonPrimitive.content  // "Alice"
val age = element.jsonObject["age"]!!.jsonPrimitive.int        // 30
val tags = element.jsonObject["tags"]!!.jsonArray.map { it.jsonPrimitive.content }
// ["a", "b"]

// Build JSON dynamically
val json = buildJsonObject {
    put("name", "Alice")
    put("age", 30)
    put("active", true)
    putJsonArray("tags") {
        add("kotlin")
        add("programming")
    }
    putJsonObject("address") {
        put("city", "NYC")
        put("zip", "10001")
    }
}
```

## Streaming JSON

```kotlin
// Decode from stream
val stream = ByteArrayInputStream(jsonString.toByteArray())
val user = Json.decodeFromString<User>(stream.readBytes().toString(Charsets.UTF_8))

// Encode to stream
val output = ByteArrayOutputStream()
output.write(Json.encodeToString(user).toByteArray())
```

## Supported Formats

| Format | Artifact | Description |
|--------|----------|-------------|
| JSON | `kotlinx-serialization-json` | Human-readable, web standard |
| ProtoBuf | `kotlinx-serialization-protobuf` | Binary, compact, schema-less |
| CBOR | `kotlinx-serialization-cbor` | Binary, RFC 8949 |
| HOCON | `kotlinx-serialization-hocon` | Human-readable config |
| Properties | `kotlinx-serialization-properties` | Java .properties format |
