# I/O

## Standard I/O Streams

```cpp
#include <iostream>
#include <iomanip>

// Output
std::cout << "Hello, World!\n";
std::cerr << "Error message\n";   // unbuffered, to stderr
std::clog << "Log message\n";     // buffered, to stderr

// Formatted output with iomanip
std::cout << std::setw(10) << 42 << '\n';           // "        42"
std::cout << std::setfill('0') << std::setw(5) << 42 << '\n';  // "00042"
std::cout << std::hex << 255 << '\n';                // "ff"
std::cout << std::hex << std::showbase << 255 << '\n'; // "0xff"
std::cout << std::oct << 8 << '\n';                  // "10"
std::cout << std::dec << 42 << '\n';                 // "42"
std::cout << std::setprecision(3) << 3.14159 << '\n'; // "3.14"
std::cout << std::fixed << std::setprecision(2) << 3.14159 << '\n'; // "3.14"
std::cout << std::scientific << 3.14159 << '\n';     // "3.141590e+00"
std::cout << std::boolalpha << true << '\n';         // "true"
std::cout << std::left << std::setw(10) << "hi" << '|';  // "hi        |"
std::cout << std::right << std::setw(10) << "hi" << '|'; // "        hi|"
std::cout << std::internal << std::setw(10) << -42 << '|'; // "-       42|"

// Input
int x;
std::cin >> x;  // read int
std::string s;
std::cin >> s;  // read word (whitespace-delimited)
std::getline(std::cin, s);  // read entire line

// Multiple input
int a, b;
std::cin >> a >> b;

// Check input success
if (std::cin >> x) { /* success */ }
else { std::cin.clear(); std::cin.ignore(); }

// Chained output
std::cout << "x = " << x << ", s = " << s << '\n';
```

## File I/O

```cpp
#include <fstream>

// Write
std::ofstream out("file.txt");
if (!out) { /* error */ }
out << "Hello, File!\n";
out << 42 << ' ' << 3.14 << '\n';
out.close();  // optional — destructor closes

// Append
std::ofstream app("file.txt", std::ios::app);
app << "appended line\n";

// Binary
std::ofstream bin("data.bin", std::ios::binary);
int data[] = {1, 2, 3, 4, 5};
bin.write(reinterpret_cast<const char*>(data), sizeof(data));
bin.close();

// Read
std::ifstream in("file.txt");
if (!in) { /* error */ }
std::string line;
while (std::getline(in, line)) {
    std::cout << line << '\n';
}

// Read all
std::string content((std::istreambuf_iterator<char>(in)),
                     std::istreambuf_iterator<char>());

// Binary read
std::ifstream binIn("data.bin", std::ios::binary);
int data[5];
binIn.read(reinterpret_cast<char*>(data), sizeof(data));

// Seek
in.seekg(0);                    // seek to beginning for reading
in.seekg(10, std::ios::cur);   // seek 10 bytes forward
in.seekg(-10, std::ios::end);  // seek 10 bytes before end
auto pos = in.tellg();          // current position

out.seekp(0);                   // seek for writing
auto pos2 = out.tellp();

// Open modes
std::ios::in      // read
std::ios::out     // write
std::ios::app     // append
std::ios::ate     // at end on open
std::ios::trunc   // truncate on open
std::ios::binary  // binary mode
// Combine: std::ios::in | std::ios::binary

// Check state
if (in.good()) { /* all good */ }
if (in.eof()) { /* end of file */ }
if (in.fail()) { /* logical error (bad format) */ }
if (in.bad()) { /* read/write error */ }
in.clear();  // clear error flags
```

## String Streams

```cpp
#include <sstream>

// ostringstream — build string
std::ostringstream oss;
oss << "x = " << 42 << ", y = " << 3.14;
std::string result = oss.str();  // "x = 42, y = 3.14"

// istringstream — parse string
std::istringstream iss("42 3.14 hello");
int i; double d; std::string s;
iss >> i >> d >> s;  // i=42, d=3.14, s="hello"

// Parse line by line
std::istringstream iss2("line1\nline2\nline3");
std::string line;
while (std::getline(iss2, line)) {
    std::cout << line << '\n';
}

// stringstream — both read and write
std::stringstream ss;
ss << 42;
int x;
ss >> x;  // x = 42

// Format with ostringstream
std::ostringstream formatted;
formatted << std::hex << std::showbase << 255;
std::string hexStr = formatted.str();  // "0xff"
```

## std::format and std::print (C++20/C++23)

```cpp
#include <format>
#include <print>

// std::format — returns formatted string
std::string s = std::format("Hello, {}! You are {} years old.", "Alice", 30);
// "Hello, Alice! You are 30 years old."

// Positional arguments
std::format("{1} before {0}", "world", "hello");  // "hello before world"

// Format specs
std::format("{:>10}", 42);     // "        42" (right-align, width 10)
std::format("{:<10}", 42);     // "42        " (left-align)
std::format("{:^10}", 42);     // "    42    " (center)
std::format("{:0>5}", 42);     // "00042" (zero-fill)
std::format("{:x}", 255);      // "ff" (hex)
std::format("{:X}", 255);      // "FF" (hex upper)
std::format("{:o}", 8);        // "10" (octal)
std::format("{:b}", 10);       // "1010" (binary)
std::format("{:#x}", 255);     // "0xff" (hex with prefix)
std::format("{:#b}", 10);      // "0b1010" (binary with prefix)
std::format("{:f}", 3.14);     // "3.140000" (fixed)
std::format("{:.2f}", 3.14159); // "3.14"
std::format("{:e}", 3.14);     // "3.140000e+00" (scientific)
std::format("{:+d}", 42);      // "+42" (always show sign)
std::format("{:*>10}", 42);    // "********42" (custom fill)

// std::print / std::println (C++23)
std::print("Hello, {}!\n", "World");
std::println("Value: {}", 42);
std::println("{:.2f}", 3.14159);
std::print(std::cerr, "Error: {}\n", msg);

// format_to — output to iterator
std::string buf;
std::format_to(std::back_inserter(buf), "{} + {} = {}", 1, 2, 3);

// vformat — runtime format string
std::string fmt = "{}, {}!";
std::string s2 = std::vformat(fmt, std::make_format_args("Hello", "World"));
```

## File System (C++17)

```cpp
#include <filesystem>
namespace fs = std::filesystem;

// Path operations
fs::path p = "/home/user/file.txt";
p.parent_path();     // "/home/user"
p.filename();        // "file.txt"
p.stem();            // "file" (filename without extension)
p.extension();       // ".txt"
p.root_name();       // "" (or "C:" on Windows)
p.root_directory();  // "/"
p.root_path();       // "/"
p.relative_path();   // "home/user/file.txt"
p.is_absolute();     // true
p.is_relative();     // false

// Path concatenation
fs::path dir = "/home/user";
fs::path file = dir / "subdir" / "file.txt";  // "/home/user/subdir/file.txt"
file /= "more";  // append

// Path from string
fs::path p2 = "hello.txt";
p2 = L"wide.txt";  // wide string
auto str = p2.string();  // convert to string
auto wstr = p2.wstring();  // convert to wide string

// Existence and type
fs::exists(p);           // true if path exists
fs::is_regular_file(p);  // true if regular file
fs::is_directory(p);     // true if directory
fs::is_symlink(p);       // true if symlink
fs::is_empty(p);         // true if empty file/dir

// File status
fs::file_status status = fs::status(p);
fs::file_type type = status.type();  // regular, directory, symlink, etc.
fs::perms permissions = status.permissions();

// Directory iteration
for (const auto& entry : fs::directory_iterator("/home/user")) {
    std::cout << entry.path() << '\n';
}

// Recursive directory iteration
for (const auto& entry : fs::recursive_directory_iterator("/home/user")) {
    std::cout << entry.path() << " (depth: " << entry.depth() << ")\n";
}

// Create/remove
fs::create_directory("newdir");
fs::create_directories("a/b/c/d");  // create all
fs::remove("file.txt");             // remove file
fs::remove_all("dir");              // remove directory tree
fs::rename("old.txt", "new.txt");
fs::copy("src.txt", "dst.txt");
fs::copy("srcdir", "dstdir", fs::copy_options::recursive);
fs::copy_file("src.txt", "dst.txt", fs::copy_options::overwrite_existing);

// Copy options
fs::copy_options::skip_existing;        // don't overwrite
fs::copy_options::overwrite_existing;   // overwrite
fs::copy_options::update_existing;      // overwrite if newer
fs::copy_options::recursive;            // copy directories recursively
fs::copy_options::copy_symlinks;        // copy symlinks as symlinks
fs::copy_options::skip_symlinks;        // skip symlinks

// Permissions
fs::permissions("file.txt", fs::perms::owner_read | fs::perms::owner_write,
                fs::perm_options::replace);

// File size
uintmax_t size = fs::file_size("file.txt");

// Current path
fs::path cwd = fs::current_path();
fs::current_path("/new/working/dir");  // change cwd

// Temp directory
fs::path tmp = fs::temp_directory_path();

// Unique path
fs::path unique = fs::unique_path();  // generates unique path (POSIX)

// Absolute/relative/canonical
fs::path abs = fs::absolute("file.txt");     // absolute path
fs::path canon = fs::canonical("file.txt");  // canonical (resolves symlinks)
fs::path rel = fs::relative("/a/b/c", "/a"); // "b/c"

// Space info
fs::space_info si = fs::space("/");
si.capacity;   // total bytes
si.free;       // free bytes
si.available;  // available to user

// Permissions values
fs::perms::owner_read | fs::perms::owner_write | fs::perms::owner_exec
fs::perms::group_read | fs::perms::group_write
fs::perms::others_read | fs::perms::others_write
```

## I/O Manipulators

```cpp
#include <iomanip>

// Persistent manipulators (affect stream until changed)
std::cout << std::hex;          // hex output
std::cout << std::dec;          // decimal output (default)
std::cout << std::oct;          // octal output
std::cout << std::boolalpha;    // print bools as "true"/"false"
std::cout << std::noboolalpha;  // print bools as 1/0
std::cout << std::showbase;     // show base prefix (0x, 0)
std::cout << std::noshowbase;
std::cout << std::showpoint;    // always show decimal point
std::cout << std::noshowpoint;
std::cout << std::uppercase;    // uppercase hex digits
std::cout << std::nouppercase;
std::cout << std::fixed;        // fixed notation
std::cout << std::scientific;   // scientific notation
std::cout << std::hexfloat;     // hex float (C++11)
std::cout << std::defaultfloat; // default float format
std::cout << std::left;         // left-align
std::cout << std::right;        // right-align (default)
std::cout << std::internal;     // internal-align (sign left, digits right)

// One-shot manipulators
std::cout << std::setw(10);     // field width (one output)
std::cout << std::setfill('0'); // fill character (persistent)
std::cout << std::setprecision(3); // precision (persistent)

// Input manipulators
std::cin >> std::hex;           // read hex
std::cin >> std::skipws;        // skip whitespace (default)
std::cin >> std::noskipws;      // don't skip whitespace

// get_money / put_money (C++11)
#include <iomanip>
std::cout << std::put_money(1234.56);  // locale-aware money format

// get_time / put_time
#include <iomanip>
std::cout << std::put_time(std::localtime(&t), "%Y-%m-%d %H:%M:%S");

// Quoted strings (C++14)
#include <iomanip>
std::string s = "hello, \"world\"";
std::cout << std::quoted(s);  // "hello, \"world\"" (with quotes and escapes)
std::cin >> std::quoted(s);   // reads quoted string, removes quotes
```
