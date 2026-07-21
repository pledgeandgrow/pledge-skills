# Terraform — Expressions & Functions

## Expressions

Expressions represent values, either literally or by referencing and combining other values.

### Types

Terraform supports the following primitive and complex types:

| Category | Types |
|----------|-------|
| Primitive | `string`, `number`, `bool` |
| Collection | `list(...)`, `set(...)`, `map(...)`, `tuple(...)` |
| Structural | `object(...)`, `any`, `none`/`null` |

### Literals

```hcl
# String
"hello world"

# Number
42
3.14

# Boolean
true
false

# List
["a", "b", "c"]

# Map
{ name = "web", port = 80 }

# Null
null
```

### Operators

| Category | Operators |
|----------|-----------|
| Arithmetic | `+`, `-`, `*`, `/`, `%` |
| Comparison | `==`, `!=`, `<`, `>`, `<=`, `>=` |
| Logical | `&&`, `\|\|`, `!` |
| Conditional | `condition ? true_val : false_val` |

### References

```hcl
var.instance_type               # Input variable
local.common_tags               # Local value
aws_instance.web.id             # Resource attribute
data.aws_ami.ubuntu.id          # Data source attribute
module.vpc.vpc_id               # Module output
path.module                     # Current module path
path.root                       # Root module path
path.cwd                        # Current working directory
terraform.workspace             # Current workspace name
each.key, each.value            # for_each iteration
count.index                     # count iteration
self                            # Within provisioner/connection blocks
```

### Conditional Expressions

```hcl
var.environment == "prod" ? 3 : 1
```

### For Expressions

Transform complex type values:

```hcl
# List comprehension
[for s in var.list : upper(s)]
[for i, v in var.list : "${i}: ${v}"]

# Map comprehension
{ for k, v in var.map : k => upper(v) }
{ for k, v in var.map : k => v if v != "" }

# Filtering
[for s in var.list : s if s != ""]
```

### Splat Expressions

Extract simpler collections from complex expressions:

```hcl
# Full splat
var.instances[*].id

# Legacy splat
var.instances.*.id

# Tuple attributes
aws_instance.web[*].id
```

### Dynamic Blocks

Create multiple repeatable nested blocks:

```hcl
resource "aws_security_group" "example" {
  name = "example"

  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.from_port
      to_port     = ingress.value.to_port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }
}
```

### Type Constraints

```hcl
string
number
bool
list(string)
map(any)
set(number)
object({
  name = string
  port = number
})
tuple([string, number, bool])
any
```

### Version Constraints

```hcl
~> 5.0      # >= 5.0.0, < 6.0.0
>= 1.0      # >= 1.0
<= 2.5      # <= 2.5
~> 5.40.0   # >= 5.40.0, < 5.41.0
```

---

## Built-in Functions

Terraform includes built-in functions for transforming and combining values. Functions are called with `function_name(args...)`.

### Numeric Functions

| Function | Description |
|----------|-------------|
| `ceil(x)` | Ceiling |
| `floor(x)` | Floor |
| `log(x, base)` | Logarithm |
| `max(...)` | Maximum |
| `min(...)` | Minimum |
| `parseint(str, base)` | Parse integer |
| `pow(x, y)` | Power |
| `signum(x)` | Sign (-1, 0, 1) |

### String Functions

| Function | Description |
|----------|-------------|
| `chomp(str)` | Remove trailing newlines |
| `endswith(str, suffix)` | Check suffix |
| `format(fmt, ...)` | Format string |
| `formatlist(fmt, ...)` | Format list |
| `indent(spaces, str)` | Indent lines |
| `join(sep, list)` | Join list with separator |
| `lower(str)` | Lowercase |
| `regex(pattern, str)` | Regex match |
| `regexall(pattern, str)` | All regex matches |
| `replace(str, substr, replacement)` | Replace substring |
| `split(sep, str)` | Split string |
| `startswith(str, prefix)` | Check prefix |
| `strcontains(str, substr)` | Check contains |
| `strrev(str)` | Reverse string |
| `substr(str, offset, length)` | Substring |
| `templatestring(str, vars)` | Template string |
| `title(str)` | Title case |
| `trim(str, cutset)` | Trim characters |
| `trimprefix(str, prefix)` | Remove prefix |
| `trimsuffix(str, suffix)` | Remove suffix |
| `trimspace(str)` | Trim whitespace |
| `upper(str)` | Uppercase |

### Collection Functions

| Function | Description |
|----------|-------------|
| `alltrue(list)` | All elements true |
| `anytrue(list)` | Any element true |
| `chunklist(list, size)` | Split into chunks |
| `coalesce(...)` | First non-null value |
| `coalescelist(...)` | First non-empty list |
| `compact(list)` | Remove empty strings |
| `concat(...)` | Concatenate lists |
| `contains(list, value)` | Check membership |
| `distinct(list)` | Remove duplicates |
| `element(list, index)` | Element by index |
| `flatten(list)` | Flatten nested lists |
| `index(list, value)` | Index of value |
| `keys(map)` | Map keys |
| `length(coll)` | Collection length |
| `lookup(map, key, default)` | Map lookup |
| `matchkeys(list, keys, searchset)` | Match keys |
| `merge(...)` | Merge maps |
| `one(list)` | Single element or null |
| `range(...)` | Generate number range |
| `reverse(list)` | Reverse list |
| `setintersection(...)` | Set intersection |
| `setproduct(...)` | Cartesian product |
| `setsubtract(a, b)` | Set difference |
| `setunion(...)` | Set union |
| `slice(list, start, end)` | Slice list |
| `sort(list)` | Sort strings |
| `sum(list)` | Sum numbers |
| `transpose(map)` | Transpose map |
| `values(map)` | Map values |
| `zipmap(keys, values)` | Create map from lists |

### Encoding Functions

| Function | Description |
|----------|-------------|
| `base64decode(str)` | Decode Base64 |
| `base64encode(str)` | Encode Base64 |
| `base64gzip(str)` | Gzip + Base64 |
| `csvdecode(str)` | Parse CSV |
| `jsondecode(str)` | Parse JSON |
| `jsonencode(val)` | Encode JSON |
| `textdecodebase64(str, encoding)` | Decode with encoding |
| `textencodebase64(str, encoding)` | Encode with encoding |
| `urlencode(str)` | URL encode |
| `yamldecode(str)` | Parse YAML |
| `yamlencode(val)` | Encode YAML |

### Filesystem Functions

| Function | Description |
|----------|-------------|
| `abspath(path)` | Absolute path |
| `basename(path)` | File name |
| `dirname(path)` | Directory name |
| `pathexpand(path)` | Expand `~` |
| `file(path)` | Read file |
| `fileexists(path)` | Check file exists |
| `fileset(dir, pattern)` | List matching files |
| `filebase64(path)` | Read file as Base64 |
| `templatefile(path, vars)` | Template file |

### Date and Time Functions

| Function | Description |
|----------|-------------|
| `formatdate(spec, timestamp)` | Format date |
| `plantimestamp()` | Plan timestamp |
| `timeadd(timestamp, duration)` | Add duration |
| `timecmp(a, b)` | Compare timestamps |
| `timestamp()` | Current timestamp |

### Hash and Crypto Functions

| Function | Description |
|----------|-------------|
| `base64sha256(str)` | Base64 SHA-256 |
| `base64sha512(str)` | Base64 SHA-512 |
| `bcrypt(str)` | Bcrypt hash |
| `filebase64sha256(path)` | File Base64 SHA-256 |
| `filebase64sha512(path)` | File Base64 SHA-512 |
| `filemd5(path)` | File MD5 |
| `filesha1(path)` | File SHA-1 |
| `filesha256(path)` | File SHA-256 |
| `filesha512(path)` | File SHA-512 |
| `md5(str)` | MD5 hash |
| `rsadecrypt(ciphertext, key)` | RSA decrypt |
| `sha1(str)` | SHA-1 hash |
| `sha256(str)` | SHA-256 hash |
| `sha512(str)` | SHA-512 hash |
| `uuid()` | Random UUID |
| `uuidv5(namespace, name)` | UUID v5 |

### IP Network Functions

| Function | Description |
|----------|-------------|
| `cidrhost(prefix, hostnum)` | Host address in CIDR |
| `cidrnetmask(prefix)` | Netmask from CIDR |
| `cidrsubnet(prefix, newbits, netnum)` | Subnet within CIDR |
| `cidrsubnets(prefix, newbits...)` | Multiple subnets |

### Type Conversion Functions

| Function | Description |
|----------|-------------|
| `can(expr)` | Try expression, return bool |
| `ephemeralasnull(val)` | Return null for ephemeral |
| `issensitive(val)` | Check if sensitive |
| `nonsensitive(val)` | Remove sensitive marking |
| `sensitive(val)` | Mark as sensitive |
| `tobool(val)` | Convert to bool |
| `tolist(val)` | Convert to list |
| `tomap(val)` | Convert to map |
| `tonumber(val)` | Convert to number |
| `toset(val)` | Convert to set |
| `tostring(val)` | Convert to string |
| `try(...)` | First successful expression |
| `type(val)` | Type of value |

### Terraform-specific Functions

| Function | Description |
|----------|-------------|
| `terraform.workspace` | Current workspace |
| `terraform.env` | Current workspace (deprecated alias) |

---

## Function Calls

```hcl
# Single argument
upper("hello")

# Multiple arguments
format("%s-%d", "web", 80)

# Variadic arguments
concat(["a"], ["b"], ["c"])
```

### Experimenting with functions

Use the Terraform console:
```bash
terraform console
> upper("hello")
"HELLO"
> cidrsubnet("10.0.0.0/16", 8, 1)
"10.0.1.0/24"
```

**Source**: [Expressions](https://developer.hashicorp.com/terraform/language/expressions) | [Functions](https://developer.hashicorp.com/terraform/language/functions)
