# jQuery — Guides & Advanced

## Events

### jQuery Event Basics

jQuery provides simple methods for attaching event handlers to selections. When an event occurs, the provided function is executed. Inside the function, `this` refers to the DOM element that initiated the event.

```javascript
// Basic event binding
$( "button" ).on( "click", function( event ) {
  console.log( "Button clicked!" );
});
```

The event handling function receives an event object that can be used to determine the nature of the event and prevent default behavior:

```javascript
$( "a" ).on( "click", function( event ) {
  event.preventDefault();
  console.log( "Link clicked, default prevented" );
});
```

### Introducing Events

Browser events propagate (bubble) from the deepest, innermost element up to the document. jQuery normalizes this behavior across browsers, including patching events like `change` and `submit` that don't natively bubble in some older browsers.

### Handling Events

#### Direct Binding

The handler is called every time an event occurs on the selected elements:

```javascript
$( "p" ).on( "click", function() {
  console.log( "Paragraph clicked" );
});
```

#### Delegated Binding

The handler is only called for descendants matching the selector — works for elements added later:

```javascript
$( "#container" ).on( "click", "button.dynamic", function() {
  console.log( "Dynamic button clicked" );
});
```

Delegated handlers are more efficient for large sets. Instead of binding 1,000 handlers:

```javascript
// Inefficient: binds to 1,000 rows
$( "#dataTable tbody tr" ).on( "click", function() {
  console.log( $( this ).text() );
});

// Efficient: one delegated handler
$( "#dataTable tbody" ).on( "click", "tr", function() {
  console.log( $( this ).text() );
});
```

### Inside the Event Handling Function

Inside the handler, `this` is the raw DOM element. Use `$( this )` to access jQuery methods:

```javascript
$( "li" ).on( "click", function() {
  $( this ).addClass( "selected" ).siblings().removeClass( "selected" );
});
```

### Understanding Event Delegation

Event delegation leverages event bubbling:
1. Event fires on the actual target (e.g., a `<tr>`)
2. Event bubbles up to the element where the handler is attached (e.g., `<tbody>`)
3. jQuery checks if the target matches the selector in the delegated handler
4. If it matches, the handler runs with `this` set to the matched element

Advantages:
- Handles events from elements added after binding
- Lower overhead when monitoring many elements
- Less code to manage when DOM changes

### Triggering Event Handlers

```javascript
// Trigger a native event
$( "button" ).trigger( "click" );

// Trigger a custom event with data
$( "div" ).trigger( "myCustom", [ "param1", "param2" ] );

// Trigger without bubbling (returns handler's return value)
var result = $( "div" ).triggerHandler( "myCustom" );
```

### Custom Events

```javascript
// Bind a custom event
$( "div" ).on( "myCustom", function( event, param1, param2 ) {
  console.log( "Custom event:", param1, param2 );
});

// Trigger it
$( "div" ).trigger( "myCustom", [ "hello", "world" ] );
```

### Event Namespaces

Namespaces simplify removing or triggering specific handlers:

```javascript
// Bind with namespace
$( "p" ).on( "click.myPlugin", handler1 );
$( "p" ).on( "click.logging", handler2 );

// Remove only myPlugin's handler
$( "p" ).off( "click.myPlugin" );

// Trigger only logging handler
$( "p" ).trigger( "click.logging" );
```

### Event Helpers

```javascript
// .hover() — combines mouseenter and mouseleave
$( "div" ).hover(
  function() { $( this ).addClass( "hover" ); },
  function() { $( this ).removeClass( "hover" ); }
);

// .toggle() — alternate between functions (removed in jQuery 1.9, use .toggle() for visibility)
```

### History of jQuery Events

- **jQuery 1.0-1.6**: `.bind()`, `.live()`, `.delegate()`
- **jQuery 1.7+**: `.on()` and `.off()` replace all previous methods
- **jQuery 1.9**: `.live()` removed; use `.on()` with delegation
- **jQuery 3.0**: `.bind()`, `.delegate()`, `.die()` deprecated

## Effects

### Introduction to Effects

jQuery makes it trivial to add simple effects with built-in settings or customized durations:

```javascript
// Built-in effects with duration
$( "p" ).hide( "slow" );         // "slow" = 600ms
$( "p" ).show( "fast" );         // "fast" = 200ms
$( "p" ).hide( 400 );            // Custom duration in ms

// With callback
$( "p" ).hide( "slow", function() {
  console.log( "Hidden!" );
});
```

Durations: `"slow"` (600ms), `"fast"` (200ms), or a number in milliseconds. Default easing is `"swing"`.

### Custom Effects with .animate()

```javascript
// Animate CSS properties
$( "#box" ).animate({
  width: "500px",
  height: "300px",
  opacity: 0.5,
  marginLeft: "+=50px",    // Relative animation
  fontSize: "1.5em"
}, 1500, "swing", function() {
  console.log( "Animation complete" );
});
```

Animatable properties must be numeric (width, height, opacity, margins, padding, borders, font-size, etc.). Colors are not animatable without a plugin (like jQuery UI).

#### Animation Options Object

```javascript
$( "#box" ).animate({ width: "500px" }, {
  duration: 1000,
  easing: "linear",
  queue: true,              // true = queue in fx, false = run immediately
  step: function( now, fx ) {
    // Called for each property at each step
    console.log( fx.prop + ": " + now );
  },
  progress: function( animation, progress, remainingMs ) {
    // Called after each step
  },
  complete: function() {
    console.log( "Done!" );
  },
  start: function( animation ) {},
  done: function( animation, jumpedToEnd ) {},
  fail: function( animation, jumpedToEnd ) {},
  always: function( animation, jumpedToEnd ) {}
});
```

### Queue & Dequeue Explained

Every jQuery object has one or more queues of functions. The default queue is `"fx"` (animations):

```javascript
// Sequential animations via queue
$( "#box" )
  .animate({ width: "500px" }, 1000 )
  .animate({ height: "300px" }, 1000 )
  .animate({ opacity: 0.5 }, 1000 );

// Custom queue
$( "#box" ).queue( "custom", function( next ) {
  console.log( "Custom queue item" );
  next();  // Must call next() to proceed
}).dequeue( "custom" );

// Inspect the queue
var queue = $( "#box" ).queue( "fx" );
console.log( queue.length );

// Clear the queue
$( "#box" ).clearQueue();

// Delay
$( "#box" ).delay( 500 ).animate({ width: "500px" });

// Stop
$( "#box" ).stop();               // Stop current, continue queue
$( "#box" ).stop( true );         // Stop current, clear queue
$( "#box" ).stop( true, true );   // Stop, clear, jump to end of current
$( "#box" ).finish();             // Stop all, jump to end of all
```

## Ajax

### Key Concepts

Ajax (Asynchronous JavaScript and XML) allows browsers to communicate with servers without reloading pages. jQuery abstracts browser differences:

- `$.ajax()` — full-featured method
- `$.get()`, `$.post()` — convenience methods
- `$.getJSON()` — get JSON data
- `$.getScript()` — load and execute JavaScript
- `.load()` — load HTML into an element

Most jQuery Ajax applications transport data as plain HTML or JSON, not XML.

### Same-Origin Policy and Cross-Domain

Ajax requests are subject to the same-origin policy. Workarounds:
- **JSONP** (JSON with Padding) — uses `<script>` tags for cross-domain
- **CORS** (Cross-Origin Resource Sharing) — modern browser support

### jQuery's Ajax-Related Methods

```javascript
// Full $.ajax
$.ajax({
  url: "/api/data",
  method: "GET",
  dataType: "json"
}).done(function( data ) {
  console.log( data );
}).fail(function( jqXHR, textStatus, error ) {
  console.error( "Error:", textStatus, error );
});

// Shorthand methods
$.get( "/api/data", callback );
$.post( "/api/data", { key: "value" }, callback );
$.getJSON( "/api/data.json", callback );
$.getScript( "/js/script.js", callback );
$( "#result" ).load( "/page.html #content" );
```

### Ajax and Forms

```javascript
// Serialize a form
$( "form" ).on( "submit", function( event ) {
  event.preventDefault();
  var data = $( this ).serialize();  // "name=John&email=john%40example.com"

  $.ajax({
    url: "/submit",
    method: "POST",
    data: data,
    dataType: "json"
  }).done(function( response ) {
    console.log( "Submitted:", response );
  });
});

// Or use serializeArray for structured data
var fields = $( "form" ).serializeArray();
// [{ name: "name", value: "John" }, ...]

// Submit via FormData for file uploads
var formData = new FormData( $( "form" )[0] );
$.ajax({
  url: "/upload",
  method: "POST",
  data: formData,
  processData: false,  // Don't transform FormData
  contentType: false,  // Let browser set multipart boundary
  dataType: "json"
}).done(function( response ) {
  console.log( "Uploaded:", response );
});
```

### Working with JSONP

```javascript
// JSONP request
$.ajax({
  url: "https://api.example.com/data",
  dataType: "jsonp",
  jsonp: "callback",      // Parameter name (default: "callback")
  jsonpCallback: "myCallback"  // Custom callback name
}).done(function( data ) {
  console.log( data );
});

// Or use $.getJSON with callback
$.getJSON( "https://api.example.com/data?callback=?", function( data ) {
  console.log( data );
});
```

### Ajax Events

Global Ajax events fire on `document` and can be used to show/hide loading indicators:

```javascript
$( document )
  .ajaxStart(function() {
    $( "#loading" ).show();
  })
  .ajaxStop(function() {
    $( "#loading" ).hide();
  })
  .ajaxError(function( event, jqXHR, settings, error ) {
    console.error( "Ajax error:", error );
  });

// Per-request events
$( document )
  .ajaxSend(function( event, jqXHR, options ) {
    console.log( "Sending to:", options.url );
  })
  .ajaxComplete(function( event, jqXHR, options ) {
    console.log( "Completed:", options.url );
  })
  .ajaxSuccess(function( event, jqXHR, options, data ) {
    console.log( "Success:", options.url );
  });
```

## Plugins

### Finding & Evaluating Plugins

Thousands of jQuery plugins are available. When evaluating:
- Check maintenance status and jQuery version compatibility
- Review the source code quality
- Check for tests and documentation
- Verify license compatibility

### How to Create a Basic Plugin

A jQuery plugin extends jQuery's prototype (`$.fn`):

```javascript
// Basic plugin
$.fn.greenify = function() {
  this.css( "color", "green" );
  return this;  // Enable chaining
};

// Usage
$( "p" ).greenify().addClass( "green-text" );
```

#### Plugin with Options

```javascript
$.fn.tooltip = function( options ) {
  var settings = $.extend({
    location: "top",
    background: "#eee",
    color: "#333"
  }, options );

  return this.each(function() {
    var $element = $( this );
    // Plugin logic here
    $element.on( "mouseenter", function() {
      // Show tooltip
    });
  });
};

// Usage
$( ".tip" ).tooltip({
  location: "bottom",
  background: "#333",
  color: "#fff"
});
```

### Advanced Plugin Concepts

#### Plugin with Public Methods

```javascript
(function( $ ) {
  var methods = {
    init: function( options ) {
      return this.each(function() {
        var $this = $( this );
        $this.data( "myPlugin", $.extend({}, options ) );
      });
    },
    show: function() {
      return this.each(function() {
        $( this ).show();
      });
    },
    hide: function() {
      return this.each(function() {
        $( this ).hide();
      });
    },
    destroy: function() {
      return this.each(function() {
        $( this ).removeData( "myPlugin" );
      });
    }
  };

  $.fn.myPlugin = function( method ) {
    if ( methods[ method ] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
    } else if ( typeof method === "object" || !method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( "Method " + method + " does not exist on jQuery.myPlugin" );
    }
  };
})( jQuery );

// Usage
$( "div" ).myPlugin({ option: "value" });
$( "div" ).myPlugin( "show" );
$( "div" ).myPlugin( "destroy" );
```

#### Namespacing Events

```javascript
$.fn.myPlugin = function() {
  return this.each(function() {
    $( this ).on( "click.myPlugin", handler );
    // Cleanup
    $( this ).on( "destroy.myPlugin", function() {
      $( this ).off( ".myPlugin" );
    });
  });
};
```

### Publishing jQuery Plugins to npm

```bash
# package.json
{
  "name": "jquery-myplugin",
  "version": "1.0.0",
  "main": "dist/jquery.myplugin.js",
  "dependencies": {
    "jquery": ">=1.7"
  }
}

# Publish
npm publish
```

## Performance

### Append Outside of Loops

DOM manipulation is expensive. Avoid appending inside loops:

```javascript
// Bad: 100 DOM insertions
for ( var i = 0; i < 100; i++ ) {
  $( "ul" ).append( "<li>Item " + i + "</li>" );
}

// Good: 1 DOM insertion
var items = [];
for ( var i = 0; i < 100; i++ ) {
  items.push( "<li>Item " + i + "</li>" );
}
$( "ul" ).append( items.join( "" ) );
```

### Cache Length During Loops

```javascript
// Bad: reads .length every iteration
for ( var i = 0; i < myArray.length; i++ ) { /* ... */ }

// Good: cache length
for ( var i = 0, len = myArray.length; i < len; i++ ) { /* ... */ }
```

### Detach Elements to Work with Them

DOM operations trigger reflow. Detach elements, manipulate, then reattach:

```javascript
var $table = $( "#myTable" );
var $parent = $table.parent();

$table.detach();
// ... heavy DOM manipulation ...
$parent.append( $table );
```

### Don't Act on Absent Elements

```javascript
// Bad: runs even if no elements match
$( ".not-exists" ).on( "click", function() { /* ... */ });

// Good: check first
if ( $( ".my-element" ).length ) {
  $( ".my-element" ).on( "click", function() { /* ... */ });
}
```

### Optimize Selectors

```javascript
// ID selector is fastest
$( "#myId" )

// For class selectors, scope to a parent
$( "#container .myClass" )  // Faster than $( ".myClass" ) on large pages

// Use .find() for better performance
$( "#container" ).find( ".myClass" )  // Faster than $( "#container .myClass" )

// Avoid overly specific selectors
$( ".myClass" )  // Better than $( "body div.wrapper ul li.myClass" )
```

### Use Stylesheets for Changing CSS on Many Elements

```javascript
// Bad: sets inline style on 1,000 elements
$( "li" ).css( "color", "red" );

// Good: add a class, let CSS handle it
$( "li" ).addClass( "red-text" );
```

## Code Organization

### Concepts

- **Encapsulate** functionality into named functions or modules
- **Avoid globals** — use IIFEs (Immediately Invoked Function Expressions)
- **Separate** concerns: DOM, data, events, business logic

### Beware Anonymous Functions

Anonymous functions are hard to debug and reuse:

```javascript
// Hard to debug and reuse
$( "button" ).on( "click", function() {
  // 50 lines of code
});

// Better: named function
$( "button" ).on( "click", handleClickButton );

function handleClickButton( event ) {
  // Clear stack trace, reusable, testable
}
```

### Keep Things DRY

```javascript
// Bad: repeated logic
$( "button" ).on( "click", function() {
  $( this ).addClass( "active" ).siblings().removeClass( "active" );
});
$( "li" ).on( "click", function() {
  $( this ).addClass( "active" ).siblings().removeClass( "active" );
});

// Good: shared function
function activateSibling( $element ) {
  $element.addClass( "active" ).siblings().removeClass( "active" );
}

$( "button" ).on( "click", function() { activateSibling( $( this ) ); });
$( "li" ).on( "click", function() { activateSibling( $( this ) ); });
```

### Feature & Browser Detection

```javascript
// Use feature detection, not browser detection
if ( window.matchMedia ) {
  // Supports matchMedia
}

// jQuery's $.support (deprecated but available)
if ( $.support.opacity ) {
  // Supports CSS opacity
}
```

### Module Pattern with IIFE

```javascript
(function( $ ) {
  // Private variables
  var privateVar = "secret";

  // Private function
  function privateFunction() {
    console.log( privateVar );
  }

  // Public API
  window.MyApp = {
    init: function() {
      $( document ).ready(function() {
        privateFunction();
      });
    },
    doSomething: function() {
      console.log( "Public method" );
    }
  };
})( jQuery );

MyApp.init();
MyApp.doSomething();
```

### jQuery Deferreds for Code Organization

Deferreds help manage asynchronous flows:

```javascript
function loadUserData() {
  return $.ajax( "/api/user" ).then(function( user ) {
    return $.ajax( "/api/permissions/" + user.id ).then(function( perms ) {
      return { user: user, permissions: perms };
    });
  });
}

loadUserData()
  .done(function( data ) {
    console.log( "User:", data.user );
    console.log( "Permissions:", data.permissions );
  })
  .fail(function() {
    console.error( "Failed to load user data" );
  });
```

## Sources

- https://learn.jquery.com/events/
- https://learn.jquery.com/effects/
- https://learn.jquery.com/ajax/
- https://learn.jquery.com/plugins/
- https://learn.jquery.com/performance/
- https://learn.jquery.com/code-organization/
- https://learn.jquery.com/about-jquery/how-jquery-works/
