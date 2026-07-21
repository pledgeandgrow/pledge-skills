# I/O and Files

File handling, IO streams, directories, and networking in Ruby.

## File

### Reading

```ruby
# Read entire file
content = File.read("data.txt")

# Read lines
File.readlines("data.txt").each { |line| puts line }

# Read with block (auto-closes)
File.open("data.txt") do |file|
  file.each_line { |line| puts line }
end

# Read binary
File.binread("image.png")

# Read with encoding
File.read("data.txt", encoding: "utf-8")
```

### Writing

```ruby
# Write (overwrites)
File.write("output.txt", "Hello, World!")

# Append
File.write("output.txt", "More text\n", mode: "a")

# Write with block (auto-closes)
File.open("output.txt", "w") do |file|
  file.puts "Line 1"
  file.puts "Line 2"
end

# Binary write
File.binwrite("data.bin", binary_data)
```

### File methods

```ruby
File.exist?("data.txt")       # => true
File.size("data.txt")         # => 1024
File.mtime("data.txt")        # => 2024-01-15 12:00:00
File.ctime("data.txt")        # => Creation time
File.extname("data.txt")      # => ".txt"
File.basename("/path/file.txt")  # => "file.txt"
File.dirname("/path/file.txt")   # => "/path"
File.join("path", "to", "file")  # => "path/to/file"
File.split("/path/file.txt")     # => ["/path", "file.txt"]

# File operations
File.rename("old.txt", "new.txt")
File.delete("unwanted.txt")
File.copy("src.txt", "dest.txt")   # (requires 'fileutils')
File.symlink("target", "linkname")

# Checking
File.file?("data.txt")        # => true (regular file)
File.directory?("mydir")      # => true
File.symlink?("link")         # => true
File.readable?("data.txt")    # => true
File.writable?("data.txt")    # => true
File.executable?("script.rb") # => true
File.zero?("empty.txt")       # => true (empty file)
```

## FileUtils

```ruby
require 'fileutils'

FileUtils.mkdir_p("path/to/directory")  # Recursive mkdir
FileUtils.rm_rf("directory")            # Recursive remove
FileUtils.cp_r("src", "dest")           # Recursive copy
FileUtils.mv("old_name", "new_name")    # Move/rename
FileUtils.touch("new_file.txt")         # Create empty file
FileUtils.chmod(0644, "file.txt")       # Change permissions
FileUtils.ln_s("target", "link")        # Create symlink
```

## Dir

```ruby
# List directory
Dir.entries(".")               # => [".", "..", "file.txt", ...]
Dir.glob("*.rb")               # => ["app.rb", "test.rb", ...]
Dir.glob("**/*.rb")            # Recursive glob
Dir.glob("*.rb", File::FNM_DOTMATCH)  # Include dotfiles

# Iterating
Dir.foreach(".") { |entry| puts entry }
Dir["*.rb"].each { |file| puts file }

# Creating/removing
Dir.mkdir("new_directory")
Dir.rmdir("empty_directory")
Dir.mkdir_p("path/to/dir")  # (via FileUtils)

# Current directory
Dir.pwd                       # => "/home/user/project"
Dir.chdir("/other/path")      # Change directory
Dir.home                      # => "/home/user"

# Temporary directory
Dir.tmpdir                    # => "/tmp" (platform-specific)
```

## Pathname

```ruby
require 'pathname'

path = Pathname.new("/home/user/project/file.txt")

path.dirname      # => #<Pathname:/home/user/project>
path.basename     # => #<Pathname:file.txt>
path.extname      # => ".txt"
path.parent       # => #<Pathname:/home/user/project>
path.join("sub", "file.rb")  # => #<Pathname:/home/user/project/sub/file.rb>
path.exist?       # => true
path.directory?   # => false
path.file?        # => true
path.read         # Read file content
path.write("content")  # Write to file
```

## IO

```ruby
# IO is the base class for File
io = IO.new(IO.sysopen("file.txt", "r"))
io.read
io.close

# IO.select for multiplexing
readable, writable, errors = IO.select([socket1, socket2], [], [], 5)

# Pipes
read_io, write_io = IO.pipe
write_io.write("hello")
read_io.read(5)  # => "hello"

# StringIO (in-memory IO)
require 'stringio'
sio = StringIO.new("initial content")
sio.read        # => "initial content"
sio.rewind
sio.puts("more")
```

## Networking

### Net::HTTP

```ruby
require 'net/http'
require 'uri'

# GET request
uri = URI("https://api.example.com/users")
response = Net::HTTP.get(uri)
puts response  # => body as string

# GET with response object
response = Net::HTTP.get_response(uri)
response.code    # => "200"
response.body    # => response body
response['Content-Type']  # => "application/json"

# POST request
uri = URI("https://api.example.com/users")
response = Net::HTTP.post(uri, '{"name":"Alice"}', "Content-Type" => "application/json")

# Full control
uri = URI("https://api.example.com/users")
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true if uri.scheme == 'https'

request = Net::HTTP::Get.new(uri)
request['Authorization'] = "Bearer token"
request.set_form_data(name: "Alice", email: "alice@example.com")

response = http.request(request)
```

### Open3

```ruby
require 'open3'

# Capture stdout
stdout, status = Open3.capture2("echo", "hello")

# Capture stdout and stderr
stdout, stderr, status = Open3.capture3("ls", "/nonexistent")

# Capture with stdin
stdout, status = Open3.capture2("cat", stdin_data: "hello")

# Pipeline
Open3.pipeline_rw("sort", "uniq") do |stdin, stdout, wait_thrs|
  stdin.puts "banana\napple\nbanana\ncherry"
  stdin.close
  puts stdout.read
end
```

### Socket (TCP)

```ruby
require 'socket'

# TCP Client
socket = TCPSocket.new('example.com', 80)
socket.puts("GET / HTTP/1.0\r\nHost: example.com\r\n\r\n")
while line = socket.gets
  puts line
end
socket.close

# TCP Server
server = TCPServer.new('localhost', 2000)
while client = server.accept
  client.puts "Hello!"
  client.close
end

# UDP
socket = UDPSocket.new
socket.send("hello", 0, 'localhost', 1234)
```

## Best practices

1. Use `File.open` with a block for automatic cleanup
2. Use `Pathname` for complex path manipulations
3. Use `FileUtils` for file operations (cross-platform)
4. Always close IO resources (use blocks or `ensure`)
5. Use `binread`/`binwrite` for binary files
6. Set encoding explicitly when reading non-UTF-8 files
7. Use `Tempfile` for temporary files
8. Use `StringIO` for testing IO without files
