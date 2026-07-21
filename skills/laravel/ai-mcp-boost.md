# AI, MCP, and Boost

Laravel's AI SDK, Model Context Protocol (MCP) integration, and Laravel Boost.

## AI SDK

### Overview

Laravel's AI SDK provides a unified interface for interacting with AI providers (OpenAI, Anthropic, etc.) within Laravel applications.

### Installation

```bash
composer require laravel/ai-sdk
```

### Configuration

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your-api-key
# Or
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-api-key
```

```php
// config/ai.php
return [
    'default' => env('AI_PROVIDER', 'openai'),

    'providers' => [
        'openai' => [
            'driver' => 'openai',
            'api_key' => env('OPENAI_API_KEY'),
            'model' => 'gpt-4o',
        ],
        'anthropic' => [
            'driver' => 'anthropic',
            'api_key' => env('ANTHROPIC_API_KEY'),
            'model' => 'claude-3-5-sonnet-20241022',
        ],
    ],
];
```

### Using the AI SDK

```php
use Illuminate\Support\Facades\AI;

// Generate text
$response = AI::text()
    ->withPrompt('Write a welcome email for new users')
    ->generate();

echo $response->content;

// With system prompt
$response = AI::text()
    ->withSystemPrompt('You are a helpful assistant')
    ->withPrompt('Explain Laravel service container')
    ->generate();

// With conversation
$response = AI::text()
    ->withMessages([
        ['role' => 'system', 'content' => 'You are a coding assistant'],
        ['role' => 'user', 'content' => 'How do I create a migration?'],
    ])
    ->generate();

// Stream response
AI::text()
    ->withPrompt('Write a long article')
    ->stream(function ($chunk) {
        echo $chunk;
    });

// With model selection
$response = AI::text()
    ->withModel('gpt-4o-mini')
    ->withPrompt('Quick summary')
    ->generate();

// Using structured output
$response = AI::text()
    ->withPrompt('Generate a user profile')
    ->withSchema([
        'name' => 'string',
        'email' => 'string',
        'bio' => 'string',
    ])
    ->generate();

$data = $response->structured();
```

### Embeddings

```php
// Generate embeddings
$embedding = AI::embeddings()
    ->withInput('Laravel is a PHP framework')
    ->generate();

$vector = $embedding->vector;
```

### Tool Calling

```php
use Laravel\AI\Tools\Tool;

$response = AI::text()
    ->withPrompt('What is the weather in Paris?')
    ->withTools([
        Tool::make('get_weather', 'Get weather for a city')
            ->withParameter('city', 'string', 'The city name')
            ->using(function ($city) {
                return getWeatherData($city);
            }),
    ])
    ->generate();
```

## MCP (Model Context Protocol)

### Overview

MCP (Model Context Protocol) allows Laravel applications to expose tools, resources, and prompts to AI assistants and agents. Laravel 13.x includes built-in MCP support.

### Configuration

```bash
composer require laravel/mcp
```

```php
// config/mcp.php
return [
    'server' => [
        'name' => 'laravel-app',
        'version' => '1.0',
    ],

    'tools' => [
        'database_query' => \App\MCP\Tools\DatabaseQueryTool::class,
        'send_email' => \App\MCP\Tools\SendEmailTool::class,
    ],

    'resources' => [
        'users' => \App\MCP\Resources\UsersResource::class,
    ],
];
```

### Defining MCP Tools

```php
namespace App\MCP\Tools;

use Laravel\MCP\Tool;

class DatabaseQueryTool extends Tool
{
    public function name(): string
    {
        return 'database_query';
    }

    public function description(): string
    {
        return 'Execute a read-only database query';
    }

    public function parameters(): array
    {
        return [
            'query' => [
                'type' => 'string',
                'description' => 'The SQL query to execute',
                'required' => true,
            ],
        ];
    }

    public function handle(array $arguments): mixed
    {
        // Only allow SELECT queries
        $query = $arguments['query'];
        if (! str_starts_with(strtolower(trim($query)), 'select')) {
            return ['error' => 'Only SELECT queries are allowed'];
        }

        return DB::select($query);
    }
}
```

### Defining MCP Resources

```php
namespace App\MCP\Resources;

use Laravel\MCP\Resource;

class UsersResource extends Resource
{
    public function uri(): string
    {
        return 'users://list';
    }

    public function name(): string
    {
        return 'Users List';
    }

    public function description(): string
    {
        return 'List all users in the system';
    }

    public function mimeType(): string
    {
        return 'application/json';
    }

    public function read(): string
    {
        return User::all()->toJson();
    }
}
```

### Starting MCP Server

```bash
# Start MCP server
php artisan mcp:serve

# With specific transport
php artisan mcp:serve --transport=stdio
php artisan mcp:serve --transport=http
```

### MCP Integration with AI Assistants

Laravel MCP allows AI assistants (like Claude) to:
- Query your application's database
- Execute Artisan commands
- Read and modify Eloquent models
- Send notifications
- Access application resources
- Use application-defined tools

## Boost

### Overview

Laravel Boost is an AI-powered development tool that enhances the Laravel development experience by providing intelligent code generation, debugging assistance, and documentation lookup.

### Installation

```bash
composer require laravel/boost --dev
```

### Using Boost

```bash
# Generate code with AI
php artisan boost:make Model --prompt="Blog post with comments and tags"

# Debug with AI
php artisan boost:debug "Why is my queue not processing?"

# Explain code
php artisan boost:explain app/Services/PaymentService.php

# Generate tests
php artisan boost:test app/Http/Controllers/UserController.php

# Refactor code
php artisan boost:refactor app/Models/User.php --suggestion="Use enums for status"
```

### Boost Configuration

```php
// config/boost.php
return [
    'provider' => env('BOOST_PROVIDER', 'openai'),
    'model' => env('BOOST_MODEL', 'gpt-4o'),
    'api_key' => env('BOOST_API_KEY'),
    'max_tokens' => 4096,
    'temperature' => 0.7,
];
```

### Boost in Development Workflow

```bash
# Generate a full CRUD scaffold with AI
php artisan boost:scaffold Post --fields="title:string,body:text,published_at:datetime"

# Generate migration with AI
php artisan boost:migration "Add soft deletes to orders table"

# Generate factory with AI
php artisan boost:factory User --count=10

# Generate API routes
php artisan boost:routes "Resource routes for Post model with auth middleware"
```

### Agentic Development

Laravel 13.x supports agentic development patterns:

```php
// Define an AI agent workflow
class ContentModerationAgent
{
    public function handle(Comment $comment): void
    {
        // Use AI to analyze content
        $analysis = AI::text()
            ->withSystemPrompt('You are a content moderation assistant')
            ->withPrompt("Analyze this comment for spam: {$comment->body}")
            ->withSchema([
                'is_spam' => 'boolean',
                'confidence' => 'float',
                'reason' => 'string',
            ])
            ->generate();

        $result = $analysis->structured();

        if ($result['is_spam']) {
            $comment->markAsSpam($result['reason']);
            event(new SpamDetected($comment, $result));
        }
    }
}
```

### AI-Powered Artisan Commands

```php
// In routes/console.php
use Illuminate\Support\Facades\Artisan;

Artisan::command('ai:ask {question}', function ($question) {
    $response = AI::text()
        ->withSystemPrompt('You are a Laravel expert assistant')
        ->withPrompt($question)
        ->generate();

    $this->info($response->content);
})->describe('Ask an AI assistant about Laravel');
```

## Best Practices

1. Use the AI SDK for AI-powered features in your application
2. Use MCP to expose your application's capabilities to AI assistants
3. Use Boost for AI-assisted development (code generation, debugging)
4. Always validate AI-generated code before deploying
5. Use structured output (`withSchema()`) for reliable AI responses
6. Use tool calling for AI agents that need to interact with external services
7. Keep API keys in environment variables — never commit them
8. Use streaming for long AI responses to improve UX
9. Implement proper error handling for AI API failures
10. Use system prompts to define AI behavior and constraints
