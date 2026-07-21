# jQuery — API Reference

## Core

### jQuery() / $()

The main entry point. Accepts a CSS selector, HTML string, DOM element, or callback.

```javascript
// Selector with optional context
$( "div.foo" )
$( "span", this )  // equivalent to $( this ).find( "span" )

// HTML string — creates new elements
$( "<div class='new'>Hello</div>" )

// DOM element
$( this )
$( document.getElementById( "myId" ) )

// Callback — runs on document ready
$( function() { /* DOM ready */ } )

// Empty set
$()  // returns empty jQuery object (length 0)
```

### jQuery.noConflict()

Releases jQuery's control of the `$` variable:

```javascript
$.noConflict();
jQuery( "p" ).text( "Hello" );

// Custom alias
var jq = $.noConflict();
jq( "p" ).text( "Hello" );
```

### jQuery.holdReady()

Hold or release jQuery's ready event:

```javascript
$.holdReady( true );  // Hold ready event
$.holdReady( false ); // Release ready event
```

### jQuery.readyException()

Set a function to handle errors thrown synchronously in functions passed to `$()`:

```javascript
jQuery.readyException = function( error ) {
  console.error( "Ready error:", error );
};
```

### jQuery.sub()

Create a copy of jQuery with its own properties and methods (deprecated).

### jQuery.when()

Provides a way to execute callback functions based on zero or more Thenable objects:

```javascript
$.when( $.ajax( "/page1.php" ), $.ajax( "/page2.php" ) )
  .done(function( a1, a2 ) {
    // a1 and a2 are arrays [ data, textStatus, jqXHR ]
    console.log( "Both requests complete" );
  })
  .fail(function() {
    console.log( "At least one failed" );
  });
```

## Selectors

### Basic CSS Selectors

| Selector | Description | Example |
|----------|-------------|---------|
| `*` | All elements | `$( "*" )` |
| `#id` | Element with ID | `$( "#myId" )` |
| `.class` | Elements with class | `$( ".myClass" )` |
| `element` | Elements of type | `$( "p" )` |
| `selector1, selector2` | Multiple selectors | `$( "div, p, span" )` |

### Hierarchy Selectors

| Selector | Description | Example |
|----------|-------------|---------|
| `ancestor descendant` | Descendant elements | `$( "div p" )` |
| `parent > child` | Direct children | `$( "ul > li" )` |
| `prev + next` | Next adjacent sibling | `$( "label + input" )` |
| `prev ~ siblings` | All following siblings | `$( "h1 ~ p" )` |

### Attribute Selectors

| Selector | Description |
|----------|-------------|
| `[name]` | Has attribute |
| `[name="value"]` | Attribute equals value |
| `[name!="value"]` | Attribute not equal (deprecated, use `.not()`) |
| `[name^="value"]` | Starts with |
| `[name$="value"]` | Ends with |
| `[name*="value"]` | Contains substring |
| `[name~="value"]` | Contains word |
| `[name|="value"]` | Equals or starts with hyphenated prefix |
| `[name="value"][name2="value2"]` | Multiple attributes |

```javascript
$( "input[name='email']" )
$( "a[href^='https']" )
$( "img[alt$='photo']" )
$( "div[class*='widget']" )
```

### Form Selectors

| Selector | Matches |
|----------|---------|
| `:button` | `<button>` elements and `input[type="button"]` |
| `:checkbox` | Checkboxes |
| `:checked` | Checked elements (checkboxes, radio buttons) |
| `:disabled` | Disabled elements |
| `:enabled` | Enabled elements |
| `:file` | File inputs |
| `:focus` | Currently focused element |
| `:image` | Image inputs |
| `:input` | All input, textarea, select, button |
| `:password` | Password inputs |
| `:radio` | Radio buttons |
| `:reset` | Reset buttons |
| `:selected` | Selected `<option>` elements |
| `:submit` | Submit buttons |
| `:text` | Text inputs |

### Pseudo/Filter Selectors

| Selector | Description |
|----------|-------------|
| `:first` | First matched element |
| `:last` | Last matched element |
| `:even` | Even-indexed elements (0-based) |
| `:odd` | Odd-indexed elements |
| `:eq(n)` | Element at index n |
| `:gt(n)` | Elements at index greater than n |
| `:lt(n)` | Elements at index less than n |
| `:not(selector)` | Elements not matching selector |
| `:contains(text)` | Elements containing text |
| `:empty` | Elements with no children |
| `:has(selector)` | Elements containing matching descendants |
| `:header` | Header elements (h1-h6) |
| `:hidden` | Hidden elements |
| `:visible` | Visible elements |
| `:animated` | Currently animated elements |
| `:parent` | Elements that have children |

### Child Filter Selectors

| Selector | Description |
|----------|-------------|
| `:first-child` | First child of parent |
| `:last-child` | Last child of parent |
| `:only-child` | Only child of parent |
| `:nth-child(n)` | Nth child (1-based) |
| `:nth-last-child(n)` | Nth child from end |
| `:first-of-type` | First child of its type |
| `:last-of-type` | Last child of its type |
| `:only-of-type` | Only child of its type |
| `:nth-of-type(n)` | Nth child of its type |
| `:nth-last-of-type(n)` | Nth child of its type from end |

## Attributes

### .attr()

Get or set HTML attributes:

```javascript
// Get
var href = $( "a" ).attr( "href" );

// Set single
$( "a" ).attr( "href", "https://example.com" );

// Set multiple
$( "img" ).attr({
  src: "/images/photo.jpg",
  alt: "Photo",
  title: "My Photo"
});

// Set with function
$( "a" ).attr( "href", function( i, val ) {
  return val + "?ref=mysite";
});
```

### .prop()

Get or set DOM properties (preferred for `checked`, `disabled`, `selected`):

```javascript
var checked = $( "#checkbox" ).prop( "checked" );
$( "#checkbox" ).prop( "checked", true );
```

### .removeAttr() / .removeProp()

```javascript
$( "input" ).removeAttr( "disabled" );
$( "#checkbox" ).removeProp( "checked" );
```

### .val()

Get or set form values:

```javascript
// Get
var value = $( "input" ).val();

// Set
$( "input" ).val( "new value" );

// For select multiple
$( "select" ).val([ "value1", "value2" ]);
```

### .html()

Get or set inner HTML:

```javascript
var content = $( "div" ).html();
$( "div" ).html( "<p>New content</p>" );
```

### .text()

Get or set text content:

```javascript
var text = $( "p" ).text();
$( "p" ).text( "Plain text" );
```

### .addClass() / .removeClass() / .toggleClass() / .hasClass()

```javascript
$( "p" ).addClass( "highlight important" );
$( "p" ).removeClass( "highlight" );
$( "p" ).toggleClass( "active" );
var has = $( "p" ).hasClass( "highlight" );  // true/false

// With function
$( "li" ).addClass(function( index ) {
  return "item-" + index;
});
```

## Manipulation

### Insertion

```javascript
// Inside (as last child)
$( "ul" ).append( "<li>Item</li>" );
$( "<li>Item</li>" ).appendTo( "ul" );

// Inside (as first child)
$( "ul" ).prepend( "<li>First</li>" );
$( "<li>First</li>" ).prependTo( "ul" );

// Outside (after)
$( "p" ).after( "<div>After</div>" );
$( "<div>After</div>" ).insertAfter( "p" );

// Outside (before)
$( "p" ).before( "<div>Before</div>" );
$( "<div>Before</div>" ).insertBefore( "p" );

// Wrap
$( "p" ).wrap( "<div class='wrapper'></div>" );
$( "p" ).wrapAll( "<div></div>" );     // Wrap all matched as one group
$( "p" ).wrapInner( "<strong></strong>" ); // Wrap contents of each
$( "p" ).unwrap();                     // Remove parent
```

### Replacement and Removal

```javascript
// Replace
$( "p" ).replaceWith( "<div>Replacement</div>" );
$( "<div>New</div>" ).replaceAll( "p" );

// Remove
$( "p" ).remove();                     // Removes elements (and data/events)
$( "p" ).detach();                     // Removes but preserves data/events for re-insertion
$( "div" ).empty();                    // Removes all children
```

### Cloning

```javascript
var $clone = $( "p" ).clone();           // Shallow clone
var $deep = $( "p" ).clone( true );      // Deep clone (with events and data)
var $deep2 = $( "p" ).clone( true, true ); // Deep clone (with events and data for children)
```

## Traversing

### Filtering

```javascript
$( "li" ).first();          // First element
$( "li" ).last();           // Last element
$( "li" ).eq( 2 );          // Element at index 2
$( "li" ).even();           // Even-indexed (jQuery 3.x+)
$( "li" ).odd();            // Odd-indexed (jQuery 3.x+)
$( "li" ).filter( ".active" );    // Filter by selector
$( "li" ).not( ".active" );      // Exclude matching
$( "li" ).has( "ul" );           // Has matching descendant
$( "li" ).is( ".active" );       // Boolean: any match?
$( "li" ).slice( 1, 4 );         // Elements from index 1 to 3
$( "li" ).map(function( index, el ) {
  return el.id;
}).get();                     // Map to array
```

### Tree Traversal

```javascript
// Children
$( "div" ).children();           // All direct children
$( "div" ).children( ".selected" ); // Filtered children
$( "div" ).contents();           // All children including text/comment nodes

// Find descendants
$( "div" ).find( "p" );          // All matching descendants

// Parent
$( "li" ).parent();              // Direct parent
$( "li" ).parent( "ul" );        // Direct parent if matching
$( "li" ).parents();             // All ancestors
$( "li" ).parents( "div" );      // Ancestors matching selector
$( "li" ).parentsUntil( "body" ); // Ancestors until (exclusive)
$( "li" ).closest( "ul" );       // Nearest matching ancestor (including self)

// Siblings
$( "li" ).siblings();            // All siblings
$( "li" ).next();                // Next sibling
$( "li" ).nextAll();             // All following siblings
$( "li" ).nextUntil( ".end" );   // Following siblings until
$( "li" ).prev();                // Previous sibling
$( "li" ).prevAll();             // All preceding siblings
$( "li" ).prevUntil( ".start" ); // Preceding siblings until
```

### Set Manipulation

```javascript
// Add to set
$( "p" ).add( "div" );           // Add matching elements
$( "p" ).addBack();              // Include previous set (formerly andSelf)
$( "p" ).addBack( ".filtered" ); // Add back filtered

// End current traversal
$( "div" ).find( "p" ).addClass( "x" ).end().addClass( "y" );
// .end() reverts to the previous set (div)
```

## CSS

### .css()

```javascript
// Get computed value
var color = $( "p" ).css( "color" );

// Set single property
$( "p" ).css( "color", "red" );

// Set multiple properties
$( "p" ).css({
  color: "red",
  "font-size": "16px",
  "background-color": "#eee"
});

// Set with function
$( "div" ).css( "width", function( index ) {
  return (index + 1) * 50 + "px";
});
```

### Dimensions

```javascript
// Height / Width
$( "div" ).height();           // Content height
$( "div" ).height( 200 );      // Set content height
$( "div" ).width();            // Content width
$( "div" ).width( 300 );       // Set content width

// Inner (content + padding)
$( "div" ).innerHeight();
$( "div" ).innerWidth();

// Outer (content + padding + border, optionally margin)
$( "div" ).outerHeight();           // + border
$( "div" ).outerHeight( true );     // + border + margin
$( "div" ).outerWidth();
$( "div" ).outerWidth( true );
```

### Position

```javascript
// Offset (relative to document)
var offset = $( "p" ).offset();
// offset.top, offset.left
$( "p" ).offset({ top: 100, left: 200 });

// Position (relative to offset parent)
var pos = $( "p" ).position();
// pos.top, pos.left

// Scroll
$( "div" ).scrollLeft();       // Get scroll left
$( "div" ).scrollLeft( 100 );  // Set scroll left
$( "div" ).scrollTop();        // Get scroll top
$( "div" ).scrollTop( 100 );   // Set scroll top

// Offset parent
$( "p" ).offsetParent();
```

### jQuery.cssHooks / jQuery.cssNumber

```javascript
// cssHooks: Custom CSS property handling
$.cssHooks[ "borderRadius" ] = {
  get: function( elem, computed, extra ) { /* ... */ },
  set: function( elem, value ) { /* ... */ }
};

// cssNumber: Properties that don't need "px" unit
$.cssNumber; // Object listing properties like zIndex, fontWeight, etc.
```

### jQuery.escapeSelector()

Escape CSS selector strings for use in jQuery selectors:

```javascript
$.escapeSelector( "foo.bar" );  // "foo\\.bar"
$( "#" + $.escapeSelector( "my.id" ) );
```

## Events

### .on()

The primary method for attaching event handlers (since jQuery 1.7):

```javascript
// Direct binding
$( "p" ).on( "click", function( event ) {
  console.log( "Clicked:", this );
});

// Delegated binding (for current and future descendants)
$( "#container" ).on( "click", "button", function( event ) {
  console.log( "Button clicked:", this );
});

// Multiple events
$( "p" ).on({
  click: function() { /* ... */ },
  mouseenter: function() { /* ... */ },
  mouseleave: function() { /* ... */ }
});

// With data
$( "p" ).on( "click", { foo: "bar" }, function( event ) {
  console.log( event.data.foo );  // "bar"
});

// With namespaces
$( "p" ).on( "click.myPlugin", handler );
$( "p" ).off( "click.myPlugin" );  // Remove only this handler
```

### .off()

Remove event handlers:

```javascript
$( "p" ).off();                          // Remove all
$( "p" ).off( "click" );                 // Remove all click handlers
$( "p" ).off( "click.myPlugin" );        // Remove namespaced
$( "p" ).off( "click", "**" );           // Remove all namespaced click
$( "#container" ).off( "click", "button" ); // Remove delegated
```

### .one()

Attach a handler that runs only once:

```javascript
$( "p" ).one( "click", function() {
  console.log( "This runs only once" });
});
```

### .trigger() / .triggerHandler()

```javascript
$( "p" ).trigger( "click" );             // Trigger event (bubbles)
$( "p" ).triggerHandler( "click" );      // Trigger without bubbling, returns handler result
$( "p" ).trigger( "customEvent", [ arg1, arg2 ] );
```

### Shorthand Event Methods

```javascript
// Mouse
.click( handler )        .dblclick( handler )
.mousedown( handler )    .mouseup( handler )
.mouseenter( handler )   .mouseleave( handler )
.mousemove( handler )    .mouseover( handler )
.mouseout( handler )     .hover( handlerIn, handlerOut )
.contextmenu( handler )

// Keyboard
.keydown( handler )      .keypress( handler )
.keyup( handler )

// Form
.focus( handler )        .blur( handler )
.change( handler )       .select( handler )
.submit( handler )       .focusin( handler )
.focusout( handler )

// Window
.resize( handler )       .scroll( handler )

// Document
.ready( handler )        .load( handler )
.unload( handler )
```

### Event Object

| Property/Method | Description |
|-----------------|-------------|
| `event.currentTarget` | The DOM element within the current bubbling phase |
| `event.target` | The DOM element that originated the event |
| `event.relatedTarget` | Other DOM element (for mouse/keyboard events) |
| `event.data` | Optional data passed via `.on()` |
| `event.delegateTarget` | The element where delegate handler was attached |
| `event.namespace` | Namespace string when event was triggered |
| `event.pageX` | Mouse position relative to left edge of document |
| `event.pageY` | Mouse position relative to top edge of document |
| `event.which` | Normalized key/button code |
| `event.metaKey` | Boolean: meta key pressed |
| `event.timeStamp` | Time when event was created |
| `event.type` | Event type string |
| `event.result` | Last value returned by handler for this event |
| `event.preventDefault()` | Prevent default browser action |
| `event.stopPropagation()` | Stop event bubbling |
| `event.stopImmediatePropagation()` | Stop bubbling and other handlers on same element |
| `event.isDefaultPrevented()` | Boolean: was preventDefault called? |
| `event.isPropagationStopped()` | Boolean: was stopPropagation called? |
| `event.isImmediatePropagationStopped()` | Boolean: was stopImmediatePropagation called? |

### jQuery.proxy()

Create a function with a specific context:

```javascript
var obj = { name: "John" };
var handler = $.proxy(function() {
  console.log( this.name );
}, obj);
$( "button" ).on( "click", handler );
```

## Effects

### Basic Effects

```javascript
$( "p" ).show();                    // Show (instant)
$( "p" ).show( "slow" );            // Show with animation
$( "p" ).show( 400 );               // Show in 400ms
$( "p" ).show( 400, function() { /* callback */ } );

$( "p" ).hide();
$( "p" ).hide( "fast" );

$( "p" ).toggle();                  // Toggle visibility
$( "p" ).toggle( 300 );
$( "p" ).toggle( true );            // Force show
$( "p" ).toggle( false );           // Force hide
$( "p" ).toggle( "swing" );         // With easing
```

### Fading Effects

```javascript
$( "p" ).fadeIn();                  // Fade in
$( "p" ).fadeIn( "slow" );
$( "p" ).fadeOut();                 // Fade out
$( "p" ).fadeOut( 400, callback );
$( "p" ).fadeTo( "slow", 0.5 );     // Fade to opacity 0.5
$( "p" ).fadeToggle();              // Toggle with fade
```

### Sliding Effects

```javascript
$( "p" ).slideDown();               // Slide down (reveal)
$( "p" ).slideUp();                 // Slide up (hide)
$( "p" ).slideToggle();             // Toggle with slide
```

### Custom Animation

```javascript
$( "#box" ).animate({
  width: "500px",
  height: "300px",
  opacity: 0.5,
  marginLeft: "+=50px"
}, 1500, "swing", function() {
  console.log( "Animation complete" );
});

// Step function
$( "#box" ).animate({ width: "500px" }, {
  duration: 1000,
  step: function( now, fx ) {
    console.log( "Current width:", now );
  },
  complete: function() {
    console.log( "Done" );
  }
});

// Queue animations
$( "#box" )
  .animate({ width: "500px" }, 1000 )
  .animate({ height: "300px" }, 1000 )
  .animate({ opacity: 0.5 }, 1000 );
```

### Queue Control

```javascript
// Queue: "fx" (default animation queue)
$( "#box" ).queue(function() {
  // Custom code in the queue
  $( this ).dequeue();  // Continue to next item
});

$( "#box" ).clearQueue();           // Clear all pending animations
$( "#box" ).stop();                 // Stop current animation
$( "#box" ).stop( true );           // Stop and clear queue
$( "#box" ).stop( true, true );     // Stop, clear queue, jump to end
$( "#box" ).finish();               // Stop all, jump to final state
$( "#box" ).delay( 800 );           // Delay next item by 800ms
```

### Easing

Built-in easings: `"swing"` (default), `"linear"`.

Additional easings available via [jQuery UI](https://jqueryui.com/) or [jQuery Easing plugin](https://github.com/gdsmith/jquery.easing).

### jQuery.fx

```javascript
$.fx.off = true;           // Disable all animations globally
$.fx.interval = 60;        // Animation frame interval (default 13ms)
$.speed;                    // Object defining duration, easing, complete
```

## Ajax

### jQuery.ajax()

The full-featured Ajax method. Returns a jqXHR object (Promise-like):

```javascript
$.ajax({
  url: "/api/users",
  method: "POST",
  data: { name: "John", email: "john@example.com" },
  dataType: "json",
  contentType: "application/x-www-form-urlencoded; charset=UTF-8",
  timeout: 5000,
  headers: { "X-Custom-Header": "value" },
  cache: false,
  traditional: false,
  crossDomain: false,
  global: true,
  processData: true,
  ifModified: false
})
  .done(function( data, textStatus, jqXHR ) { /* success */ })
  .fail(function( jqXHR, textStatus, errorThrown ) { /* error */ })
  .always(function() { /* called regardless */ })
  .then(function( data ) { /* Promise-style */ });
```

Key settings:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `url` | String | Current page | Request URL |
| `method` | String | `"GET"` | HTTP method (POST, GET, PUT, DELETE) |
| `data` | Object/String/Array | — | Data sent to server |
| `dataType` | String | Auto-detect | Expected response type: `"json"`, `"html"`, `"xml"`, `"text"`, `"jsonp"`, `"script"` |
| `contentType` | String | `"application/x-www-form-urlencoded; charset=UTF-8"` | Content-Type header |
| `timeout` | Number | 0 | Timeout in ms (0 = no timeout) |
| `cache` | Boolean | `true` for GET | Cache the request |
| `async` | Boolean | `true` | Asynchronous request |
| `headers` | Object | `{}` | Additional headers |
| `context` | Object | Ajax settings | `this` in callbacks |
| `global` | Boolean | `true` | Trigger global Ajax events |
| `processData` | Boolean | `true` | Transform data to query string |
| `traditional` | Boolean | `false` | Traditional param serialization |
| `statusCode` | Object | `{}` | HTTP status code callbacks |
| `jsonp` | String/Boolean | `"callback"` | JSONP callback parameter name |
| `jsonpCallback` | String/Function | Auto | JSONP callback function name |
| `scriptAttrs` | Object | — | Attributes for script/jsonp tags |
| `beforeSend` | Function | — | Pre-request callback (can cancel) |
| `success` | Function | — | Success callback (deprecated, use `.done()`) |
| `error` | Function | — | Error callback (deprecated, use `.fail()`) |
| `complete` | Function | — | Complete callback (deprecated, use `.always()`) |
| `dataFilter` | Function | — | Pre-filter response data |
| `converters` | Object | Default | Data-type converters |
| `username` | String | — | HTTP auth username |
| `password` | String | — | HTTP auth password |
| `mimeType` | String | — | Override XHR mime type |
| `ifModified` | Boolean | `false` | Success only if response changed |
| `isLocal` | Boolean | Auto | Recognize as local environment |

### Convenience Methods

```javascript
// $.get
$.get( "/api/users", function( data ) {
  console.log( data );
}, "json" );

// $.get with jqXHR
$.get( "/api/users" )
  .done(function( data ) { /* ... */ })
  .fail(function() { /* ... */ });

// $.post
$.post( "/api/users", { name: "John" }, function( data ) {
  console.log( data );
}, "json" );

// $.getJSON
$.getJSON( "/api/users.json", function( data ) {
  $.each( data, function( index, user ) {
    console.log( user.name );
  });
});

// $.getScript
$.getScript( "/js/myscript.js", function() {
  console.log( "Script loaded and executed" );
});

// .load — load HTML from server and insert into element
$( "#result" ).load( "/page.html #content" );
$( "#result" ).load( "/page.html", { param: "value" } );
```

### $.ajaxSetup()

Set default Ajax options:

```javascript
$.ajaxSetup({
  url: "/api/",
  method: "POST",
  dataType: "json",
  timeout: 10000,
  headers: { "X-Requested-With": "XMLHttpRequest" }
});
```

### $.ajaxPrefilter()

Pre-filter Ajax requests before they are sent:

```javascript
$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
  options.url = "/api/" + options.url;
});
```

### $.ajaxTransport()

Create custom Ajax transports:

```javascript
$.ajaxTransport( "image", function( options ) {
  // Custom transport for image data type
});
```

### Serialization

```javascript
// .serialize() — encode form as query string
var queryString = $( "form" ).serialize();
// "name=John&email=john%40example.com"

// .serializeArray() — encode as array of objects
var fields = $( "form" ).serializeArray();
// [{ name: "name", value: "John" }, { name: "email", value: "john@example.com" }]

// $.param — serialize object/array
var params = $.param({ name: "John", age: 30 });
// "name=John&age=30"
```

### jqXHR Object

The jqXHR object is a superset of the browser's native XMLHttpRequest, implementing the Promise interface:

```javascript
var jqXHR = $.ajax( "/api/data" );

// Promise methods
jqXHR.done(function( data ) { /* ... */ });
jqXHR.fail(function( jqXHR, textStatus, error ) { /* ... */ });
jqXHR.always(function() { /* ... */ });
jqXHR.then( doneFilter, failFilter );

// Additional methods
jqXHR.abort();                    // Cancel the request
jqXHR.statusCode({ 404: function() { /* ... */ } });

// Properties
jqXHR.readyState;                 // Request state
jqXHR.status;                     // HTTP status code
jqXHR.statusText;                 // HTTP status text
jqXHR.responseText;               // Raw response text
jqXHR.responseJSON;               // Parsed JSON (if applicable)
jqXHR.responseXML;                // XML document (if applicable)
```

### Global Ajax Events

```javascript
$( document )
  .ajaxStart(function() { /* no active requests → request started */ })
  .ajaxSend(function( event, jqXHR, options ) { /* before each request */ })
  .ajaxComplete(function( event, jqXHR, options ) { /* after each request completes */ })
  .ajaxSuccess(function( event, jqXHR, options, data ) { /* on success */ })
  .ajaxError(function( event, jqXHR, settings, error ) { /* on error */ })
  .ajaxStop(function() { /* all requests completed */ });
```

## Utilities

### Iteration

```javascript
// $.each — iterate arrays or objects
$.each([ 1, 2, 3 ], function( index, value ) {
  console.log( index, value );
});
$.each({ name: "John", age: 30 }, function( key, value ) {
  console.log( key, value );
});

// .each — iterate jQuery objects
$( "li" ).each(function( index, element ) {
  console.log( index, element );
});

// $.map — transform array/object
var doubled = $.map([ 1, 2, 3 ], function( value, index ) {
  return value * 2;
});

// $.grep — filter array
var evens = $.grep([ 1, 2, 3, 4, 5 ], function( value ) {
  return value % 2 === 0;
});
```

### Object/Array Operations

```javascript
// $.extend — merge objects
var merged = $.extend({}, defaults, options);
var deep = $.extend( true, {}, obj1, obj2 );  // Deep merge

// $.fn.extend — extend jQuery prototype (for plugins)
$.fn.extend({
  myPlugin: function() { /* ... */ }
});

// $.merge — merge arrays
var combined = $.merge([ 1, 2 ], [ 3, 4 ]);  // [ 1, 2, 3, 4 ]

// $.makeArray — convert array-like to true array
var arr = $.makeArray( document.getElementsByTagName( "div" ) );

// $.inArray — find value in array (returns index or -1)
var idx = $.inArray( 2, [ 1, 2, 3 ] );  // 1

// $.uniqueSort — remove duplicates from DOM element array
var unique = $.uniqueSort( elements );

// $.toArray — convert jQuery object to native array
var arr = $( "p" ).toArray();
```

### Type Checking

```javascript
$.isArray( [] );              // true (deprecated, use Array.isArray)
$.isFunction( fn );           // true (deprecated, use typeof)
$.isPlainObject( {} );        // true
$.isEmptyObject( {} );        // true
$.isNumeric( 42 );            // true
$.isWindow( window );         // true
$.isXMLDoc( xmlDoc );         // true
$.type( [] );                 // "array"
$.type( null );               // "null"
$.type( /regex/ );            // "regexp"
```

### Parsing

```javascript
$.parseJSON( '{"name":"John"}' );   // Parse JSON string (deprecated, use JSON.parse)
$.parseHTML( "<div>Hello</div>" );  // Parse HTML string → DOM nodes
$.parseXML( "<root><item/></root>" ); // Parse XML string → XML document
```

### String/Function Utilities

```javascript
$.trim( "  hello  " );       // "hello" (deprecated, use String.prototype.trim)
$.now();                      // Date.now()
$.noop();                     // Empty function (useful as default callback)
$.proxy( fn, context );       // Bind function to context
$.proxy( obj, "methodName" ); // Bind method by name
$.globalEval( "var x = 1;" ); // Evaluate globally
$.error( "message" );         // Throw error with message
```

### Data

```javascript
// $.data — low-level data storage
$.data( element, "key", "value" );
var val = $.data( element, "key" );
$.removeData( element, "key" );

// .data — instance method
$( "div" ).data( "key", "value" );
var val = $( "div" ).data( "key" );
$( "div" ).removeData( "key" );
```

### Contains

```javascript
$.contains( container, contained );  // Boolean: does container contain contained?
```

## Deferreds

### jQuery.Deferred()

Create a Deferred object for managing asynchronous callbacks:

```javascript
var deferred = $.Deferred();

deferred
  .done(function( value ) { console.log( "Done:", value ); })
  .fail(function() { console.log( "Failed" ); })
  .progress(function( value ) { console.log( "Progress:", value ); })
  .always(function() { console.log( "Always" ); });

// Resolve / reject / notify
deferred.notify( "50%" );     // Triggers progress callbacks
deferred.resolve( "success" ); // Triggers done + always
// or
deferred.reject( "error" );    // Triggers fail + always
```

### deferred.then()

Promise-style chaining:

```javascript
deferred.then(
  function( value ) { /* done filter */ return value; },
  function( error ) { /* fail filter */ },
  function( progress ) { /* progress filter */ }
);
```

### deferred.pipe()

Filter resolved/rejected values (deprecated, use `.then()`):

```javascript
deferred.pipe( doneFilter, failFilter, progressFilter );
```

### deferred.state()

Returns current state: `"pending"`, `"resolved"`, or `"rejected"`.

### deferred.promise()

Returns an immutable Promise object (without resolve/reject methods):

```javascript
function asyncOperation() {
  var deferred = $.Deferred();
  setTimeout(function() {
    deferred.resolve( "done" );
  }, 1000 );
  return deferred.promise();  // Return promise, not the full Deferred
}

asyncOperation().done(function( value ) {
  console.log( value );
});
```

### .promise()

Return a Promise object bound to a collection (resolves when all animations complete):

```javascript
$( "div" ).slideUp( 1000 ).promise().done(function() {
  console.log( "All animations complete" );
});
```

### jQuery.when()

Combine multiple Deferreds:

```javascript
$.when( deferred1, deferred2 )
  .done(function( result1, result2 ) {
    // Both resolved
  })
  .fail(function() {
    // At least one failed
  });
```

### Deferred Methods Summary

| Method | Description |
|--------|-------------|
| `deferred.done( fn )` | Add success callback |
| `deferred.fail( fn )` | Add failure callback |
| `deferred.always( fn )` | Add callback for both |
| `deferred.progress( fn )` | Add progress callback |
| `deferred.then( doneFn, failFn, progressFn )` | Promise-style chaining |
| `deferred.catch( failFn )` | Alias for `.then( null, failFn )` |
| `deferred.pipe( doneFn, failFn, progressFn )` | Filter (deprecated) |
| `deferred.resolve( value )` | Resolve with value |
| `deferred.resolveWith( context, args )` | Resolve with context |
| `deferred.reject( value )` | Reject with value |
| `deferred.rejectWith( context, args )` | Reject with context |
| `deferred.notify( value )` | Notify progress |
| `deferred.notifyWith( context, args )` | Notify with context |
| `deferred.state()` | Get current state |
| `deferred.promise( target )` | Get immutable Promise |
| `deferred.isRejected()` | Boolean (deprecated) |
| `deferred.isResolved()` | Boolean (deprecated) |

## Callbacks Object

jQuery.Callbacks() (deprecated since jQuery 3.0, but still available) provides a multi-purpose callback list management object. It is the underlying implementation for `$.Deferred()`.

### jQuery.Callbacks()

```javascript
var callbacks = $.Callbacks( flags );
```

**Flags** (space-separated string, optional):

| Flag | Description |
|------|-------------|
| `once` | Callback list can only be fired once (like a Deferred) |
| `memory` | Tracks previous values; callbacks added after firing are called immediately with latest memorized values |
| `unique` | A callback can only be added once (no duplicates) |
| `stopOnFalse` | Interrupts calling when a callback returns `false` |

```javascript
function fn1( value ) { console.log( value ); }
function fn2( value ) { console.log( "fn2 says: " + value ); return false; }

// Basic usage
var callbacks = $.Callbacks();
callbacks.add( fn1 );
callbacks.fire( "foo!" );  // Outputs: foo!
callbacks.add( fn2 );
callbacks.fire( "bar!" );  // Outputs: bar!, fn2 says: bar!

// Remove a callback
callbacks.remove( fn2 );
callbacks.fire( "foobar" ); // Only outputs: foobar

// With flags
var once = $.Callbacks( "once" );
once.add( fn1 );
once.fire( "foo" );        // Outputs: foo
once.add( fn2 );
once.fire( "bar" );        // No output — already fired once

var memory = $.Callbacks( "memory" );
memory.add( fn1 );
memory.fire( "foo" );      // Outputs: foo
memory.add( fn2 );         // Outputs: fn2 says: foo (immediately, from memory)

var unique = $.Callbacks( "unique" );
unique.add( fn1 );
unique.add( fn1 );         // Duplicate — ignored
unique.fire( "foo" );      // Outputs: foo (only once)

var stopOnFalse = $.Callbacks( "stopOnFalse" );
stopOnFalse.add( fn1 );
stopOnFalse.add( fn2 );    // fn2 returns false
stopOnFalse.fire( "bar" ); // fn1 runs, fn2 runs and stops further callbacks

// Combined flags
var combined = $.Callbacks( "unique memory" );
```

> Internally, `$.Deferred()` uses `$.Callbacks('memory once')` for `.done()` and `.fail()`.

### Callbacks Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `callbacks.add( fn or [fns] )` | Callbacks | Add a callback or array of callbacks to the list |
| `callbacks.remove( fn or [fns] )` | Callbacks | Remove a callback or array of callbacks from the list |
| `callbacks.fire( args )` | Callbacks | Call all callbacks with the given arguments |
| `callbacks.fireWith( [context][, args] )` | Callbacks | Call all callbacks with given context and arguments |
| `callbacks.disable()` | Callbacks | Disable the callback list from doing anything more |
| `callbacks.disabled()` | Boolean | Determine if the list has been disabled |
| `callbacks.empty()` | Callbacks | Remove all callbacks from the list |
| `callbacks.has( [fn] )` | Boolean | Determine whether the list has any callbacks (or contains a specific callback) |
| `callbacks.fired()` | Boolean | Determine if callbacks have been called at least once |
| `callbacks.lock()` | Callbacks | Lock the callback list in its current state |
| `callbacks.locked()` | Boolean | Determine if the list has been locked |

```javascript
// Detached methods (shorthand references)
var callbacks = $.Callbacks(),
    add = callbacks.add,
    remove = callbacks.remove,
    fire = callbacks.fire;

add( fn1 );
fire( "hello world" );
remove( fn1 );

// Check state
console.log( callbacks.fired() );    // true
console.log( callbacks.disabled() ); // false
console.log( callbacks.locked() );   // false
console.log( callbacks.has( fn1 ) ); // false (was removed)
```

> **Note:** When locked with the `"memory"` flag, additional functions may still be added and fired after the lock.

## Internals

| Property/Method | Description |
|-----------------|-------------|
| `.context` | The DOM node context passed to `$()` (deprecated) |
| `.jquery` | jQuery version number string |
| `.selector` | Selector string used to create collection (deprecated) |
| `.pushStack( elements )` | Push DOM elements onto jQuery stack (for plugin authors) |
| `jQuery.error( message )` | Throw error with message |

## Deprecated

jQuery deprecates methods over multiple versions. Below is a consolidated reference of all deprecated methods/properties, organized by the version they were deprecated in. Use the modern replacement where indicated.

### Deprecated in jQuery 1.3

| Method/Property | Replacement |
|-----------------|-------------|
| `jQuery.boxModel` | No replacement (feature detection instead) |
| `jQuery.browser` | Feature detection (e.g., `$.support`) or Modernizr |

### Deprecated in jQuery 1.7

| Method/Property | Replacement |
|-----------------|-------------|
| `.live()` | `.on()` (delegated) |
| `.die()` | `.off()` |
| `jQuery.sub()` | No direct replacement (use `.extend()` for plugin namespacing) |
| `deferred.isRejected()` | `deferred.state()` (returns `"rejected"`) |
| `deferred.isResolved()` | `deferred.state()` (returns `"resolved"`) |
| `.selector` | No replacement |

### Deprecated in jQuery 1.8

| Method/Property | Replacement |
|-----------------|-------------|
| `.andSelf()` | `.addBack()` |
| `deferred.pipe()` | `deferred.then()` |
| `.error()` | `.on( "error", handler )` |
| `.load()` (event shorthand) | `.on( "load", handler )` |
| `.size()` | `.length` property |
| `.toggle()` (event, click handler toggle) | Use `.on( "click" )` with manual state tracking |
| `.unload()` | `.on( "unload", handler )` |

### Deprecated in jQuery 1.9

| Method/Property | Replacement |
|-----------------|-------------|
| `jQuery.support` | Feature detection libraries (Modernizr) |

### Deprecated in jQuery 3.0

| Method/Property | Replacement |
|-----------------|-------------|
| `.bind()` | `.on()` |
| `.delegate()` | `.on()` (delegated) |
| `.unbind()` | `.off()` |
| `.undelegate()` | `.off()` (delegated) |
| `jQuery.fx.interval` | `requestAnimationFrame` (jQuery uses it internally) |
| `jQuery.parseJSON()` | `JSON.parse()` |
| `jQuery.unique()` | `jQuery.uniqueSort()` |

### Deprecated in jQuery 3.2

| Method/Property | Replacement |
|-----------------|-------------|
| `jQuery.holdReady()` | No replacement (removed in favor of `$.ready` promise) |
| `jQuery.isArray()` | `Array.isArray()` |

### Deprecated in jQuery 3.3

| Method/Property | Replacement |
|-----------------|-------------|
| `.blur()` | `.on( "blur", handler )` / `.trigger( "blur" )` |
| `.change()` | `.on( "change", handler )` / `.trigger( "change" )` |
| `.click()` | `.on( "click", handler )` / `.trigger( "click" )` |
| `.contextmenu()` | `.on( "contextmenu", handler )` / `.trigger( "contextmenu" )` |
| `.dblclick()` | `.on( "dblclick", handler )` / `.trigger( "dblclick" )` |
| `.focus()` | `.on( "focus", handler )` / `.trigger( "focus" )` |
| `.focusin()` | `.on( "focusin", handler )` / `.trigger( "focusin" )` |
| `.focusout()` | `.on( "focusout", handler )` / `.trigger( "focusout" )` |
| `.hover()` | `.on( "mouseenter", fn1 ).on( "mouseleave", fn2 )` |
| `.keydown()` | `.on( "keydown", handler )` / `.trigger( "keydown" )` |
| `.keypress()` | `.on( "keypress", handler )` / `.trigger( "keypress" )` |
| `.keyup()` | `.on( "keyup", handler )` / `.trigger( "keyup" )` |
| `.mousedown()` | `.on( "mousedown", handler )` / `.trigger( "mousedown" )` |
| `.mouseenter()` | `.on( "mouseenter", handler )` / `.trigger( "mouseenter" )` |
| `.mouseleave()` | `.on( "mouseleave", handler )` / `.trigger( "mouseleave" )` |
| `.mousemove()` | `.on( "mousemove", handler )` / `.trigger( "mousemove" )` |
| `.mouseout()` | `.on( "mouseout", handler )` / `.trigger( "mouseout" )` |
| `.mouseover()` | `.on( "mouseover", handler )` / `.trigger( "mouseover" )` |
| `.mouseup()` | `.on( "mouseup", handler )` / `.trigger( "mouseup" )` |
| `.resize()` | `.on( "resize", handler )` / `.trigger( "resize" )` |
| `.scroll()` | `.on( "scroll", handler )` / `.trigger( "scroll" )` |
| `.select()` | `.on( "select", handler )` / `.trigger( "select" )` |
| `.submit()` | `.on( "submit", handler )` / `.trigger( "submit" )` |
| `jQuery.isFunction()` | `typeof x === "function"` |
| `jQuery.isNumeric()` | `typeof x === "number" && !isNaN( x )` |
| `jQuery.isWindow()` | `x != null && x === x.window` |
| `jQuery.now()` | `Date.now()` |
| `jQuery.proxy()` | `Function.prototype.bind()` |
| `jQuery.type()` | `typeof` / `Object.prototype.toString.call()` |

### Deprecated in jQuery 3.4

| Selector | Replacement |
|----------|-------------|
| `:eq()` | `.eq()` method |
| `:even()` | `.even()` method |
| `:first` | `.first()` method |
| `:gt()` | `.slice()` method |
| `:last` | `.last()` method |
| `:lt()` | `.slice()` method |
| `:odd()` | `.odd()` method |

### Deprecated in jQuery 3.5

| Method/Property | Replacement |
|-----------------|-------------|
| `.ajaxComplete()` | `.on( "ajaxComplete", handler )` |
| `.ajaxError()` | `.on( "ajaxError", handler )` |
| `.ajaxSend()` | `.on( "ajaxSend", handler )` |
| `.ajaxStart()` | `.on( "ajaxStart", handler )` |
| `.ajaxStop()` | `.on( "ajaxStop", handler )` |
| `.ajaxSuccess()` | `.on( "ajaxSuccess", handler )` |
| `jQuery.trim()` | `String.prototype.trim()` |

### Other Deprecated Properties

| Property | Deprecated Since | Replacement |
|----------|-----------------|-------------|
| `.context` | 1.10 | No replacement |
| `jQuery.Deferred.getStackHook()` | 1.8 | No replacement |
| `jQuery.Callbacks()` | 3.0 | `$.Deferred()` for promise-based flows |

> **Migration tip:** Use the [jQuery Migrate plugin](https://github.com/jquery/jquery-migrate) to identify deprecated APIs in existing code. It restores deprecated behaviors and logs warnings to the console.

## Sources

- https://api.jquery.com/category/core/
- https://api.jquery.com/category/selectors/
- https://api.jquery.com/category/attributes/
- https://api.jquery.com/category/manipulation/
- https://api.jquery.com/category/traversing/
- https://api.jquery.com/category/css/
- https://api.jquery.com/category/events/
- https://api.jquery.com/category/effects/
- https://api.jquery.com/category/ajax/
- https://api.jquery.com/category/utilities/
- https://api.jquery.com/category/deferred-object/
- https://api.jquery.com/category/internals/
- https://api.jquery.com/category/callbacks-object/
- https://api.jquery.com/category/deprecated/
- https://api.jquery.com/jquery/
- https://api.jquery.com/on/
- https://api.jquery.com/jQuery.ajax/
