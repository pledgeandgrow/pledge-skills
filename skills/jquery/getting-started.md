# jQuery — Getting Started

## What is jQuery?

jQuery is a fast, small, and feature-rich JavaScript library. It makes HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers.

jQuery is just a JavaScript library — all its power is accessed via JavaScript. Having a strong grasp of JavaScript is essential for understanding, structuring, and debugging jQuery code.

## Installation

### npm / Yarn

```bash
npm install jquery
# or
yarn add jquery
```

```javascript
// ES Module import
import $ from "jquery";
// or
import jQuery from "jquery";
```

### CDN

```html
<!-- Production (minified) -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- Development (uncompressed) -->
<script src="https://code.jquery.com/jquery-3.7.1.js"></script>
```

### Download

Download jQuery from [jquery.com/download/](https://jquery.com/download/) and include it:

```html
<script src="jquery-3.7.1.min.js"></script>
```

### Other CDNs

- Google CDN: `https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js`
- Microsoft CDN: `https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.7.1.min.js`
- jsDelivr: `https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js`

## Including jQuery in a Page

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>jQuery Demo</title>
</head>
<body>
  <a href="http://jquery.com/">jQuery</a>
  <script src="jquery-3.7.1.min.js"></script>
  <script>
    // Your code goes here
  </script>
</body>
</html>
```

> **Note:** Always include jQuery before your custom scripts. The `src` attribute must point to a copy of jQuery.

## The `$` and `jQuery` Aliases

The jQuery library exposes its methods via two properties of the `window` object: `jQuery` and `$`. `$` is simply an alias for `jQuery`, used because it's shorter and faster to write.

```javascript
// These are equivalent
jQuery( "p" ).hide();
$( "p" ).hide();
```

## Document Ready

To ensure code runs after the browser finishes loading the document, use the ready event:

```javascript
// Full syntax
$( document ).ready(function() {
  // Your code here
});

// Shorthand
$(function() {
  // Your code here
});
```

The ready event fires as soon as the DOM is fully parsed — it does **not** wait for images to download, unlike `window.onload`.

## Basic Selectors

```javascript
// ID selector
$( "#myId" )

// Class selector
$( ".myClass" )

// Element selector
$( "p" )

// Multiple selector
$( "div, p, span" )

// Descendant selector
$( "div p" )

// Child selector
$( "ul > li" )

// Attribute selector
$( "input[type='text']" )

// Pseudo selectors
$( ":button" )
$( ":checked" )
$( ":first" )
$( ":visible" )
```

## Chaining

Most jQuery methods return the jQuery object, enabling method chaining:

```javascript
$( "#box" )
  .css( "background-color", "#f00" )
  .addClass( "highlight" )
  .fadeIn( 400 )
  .delay( 800 )
  .slideUp( 300 );
```

## noConflict

If another JavaScript framework uses `$`, call `$.noConflict()` to release it:

```javascript
$.noConflict();
jQuery( document ).ready(function() {
  jQuery( "p" ).text( "Hello!" );
});

// Or assign to a custom alias
var jq = $.noConflict();
jq( "p" ).text( "Hello!" );
```

## jQuery vs Vanilla JS

| Feature | jQuery | Vanilla JS |
|---------|--------|------------|
| Select elements | `$( ".cls" )` | `document.querySelectorAll( ".cls" )` |
| Event binding | `$( el ).on( "click", fn )` | `el.addEventListener( "click", fn )` |
| Add class | `$( el ).addClass( "cls" )` | `el.classList.add( "cls" )` |
| Set text | `$( el ).text( "Hello" )` | `el.textContent = "Hello" ` |
| AJAX | `$.ajax({ url })` | `fetch( url )` |
| DOM ready | `$( fn )` | `document.addEventListener( "DOMContentLoaded", fn )` |

jQuery's main historical advantage was cross-browser consistency. Modern browsers have converged, but jQuery still provides concise syntax, powerful chaining, and a rich plugin ecosystem.

## jQuery Migrate Plugin

When upgrading jQuery versions, use the [jQuery Migrate](https://github.com/jquery/jquery-migrate/) plugin to restore deprecated features and identify issues:

```html
<script src="jquery-3.7.1.min.js"></script>
<script src="jquery-migrate-3.4.1.min.js"></script>
```

The Migrate plugin logs warnings to the console for deprecated features in use.

## Browser Support

jQuery 3.x supports:
- Chrome, Edge, Firefox, Safari (current and previous version)
- Internet Explorer 9+ (limited support for IE 9-11)

> jQuery 4.x (in development) will drop IE support entirely.

## The jQuery Object

When you call `$()`, you create a jQuery object — an array-like collection of matched DOM elements:

```javascript
var $links = $( "a" );
console.log( $links.length );  // Number of matched elements

// Access raw DOM elements
$links[0]            // First DOM element
$links.get( 0 )      // Same as above

// Iterate
$links.each(function( index, element ) {
  console.log( index, element );
});
```

## Creating Elements

Pass an HTML string to `$()` to create new DOM elements:

```javascript
var $newDiv = $( "<div class='new'>Hello</div>" );
$newDiv.appendTo( "body" );
```

## Working with `this`

Inside event handlers, `this` refers to the raw DOM element. Wrap it in `$()` to use jQuery methods:

```javascript
$( "button" ).on( "click", function() {
  $( this ).toggleClass( "active" );  // `this` is the raw DOM element
});
```

## Callbacks

jQuery uses callbacks extensively — functions passed as arguments to be executed later:

```javascript
// Callback without arguments
$( "p" ).hide( "slow", function() {
  // Called when animation completes
  console.log( "Hidden!" );
});

// Callback with arguments
$( "p" ).hide( "slow", function() {
  alert( "Hidden: " + $( this ).text() );
});
```

## $ vs $()

There are two distinct namespaces in jQuery:

- **`$.fn` namespace** — Methods called on jQuery selections (object methods). They automatically receive and return the selection as `this`.
- **`$` namespace** — Utility-type methods that do not work with selections.

```javascript
// $.fn method (called on a selection)
$( "h1" ).remove();

// $ utility method (not called on a selection)
$.each([ 1, 2, 3 ], function( index, value ) {
  console.log( index, value );
});
```

> **Caution:** Some methods exist in both namespaces with different behavior, e.g. `$.each()` vs `.each()`. Always check which one you're using.

## $( document ).ready() vs $( window ).on( "load" )

```javascript
// Runs when DOM is fully parsed (doesn't wait for images)
$( document ).ready(function() {
  console.log( "document loaded" );
});

// Shorthand
$(function() {
  console.log( "ready!" );
});

// Runs when entire page (images, iframes) is loaded
$( window ).on( "load", function() {
  console.log( "window loaded" );
});
```

You can also pass a named function:

```javascript
function readyFn( jQuery ) {
  // Code to run when the document is ready
}

$( document ).ready( readyFn );
// or:
$( window ).on( "load", readyFn );
```

## Avoiding Conflicts with Other Libraries

### No-Conflict Mode

```javascript
// Create a new alias
var $j = jQuery.noConflict();
$j( document ).ready(function() {
  $j( "div" ).hide();
});
```

### Include jQuery Before Other Libraries

If jQuery is loaded first, `$` will belong to the other library. Use `jQuery` directly:

```javascript
jQuery( document ).ready(function() {
  jQuery( "div" ).hide();
});
```

### Three Ways to Reference jQuery

1. **Create a new alias:**
```javascript
var $jq = jQuery.noConflict();
```

2. **Use an IIFE (Immediately Invoked Function Expression):**
```javascript
jQuery.noConflict();
(function( $ ) {
  // Your jQuery code here, using the $
})( jQuery );
```

3. **Use the `$` argument passed to `$( document ).ready()`:**
```javascript
jQuery( document ).ready(function( $ ) {
  // $ refers to jQuery inside this function
  $( "div" ).hide();
});

// Or shorthand:
jQuery(function( $ ) {
  $( "div" ).hide();
});
```

## Selecting Elements

### By ID, Class, Attribute, Compound Selector

```javascript
$( "#myId" );                          // By ID (must be unique)
$( ".myClass" );                       // By class
$( "input[name='first_name']" );      // By attribute
$( "#contents ul.people li" );        // Compound CSS selector
$( "div.myClass, ul.people" );        // Comma-separated list
```

### Pseudo-Selectors

```javascript
$( "a.external:first" );
$( "tr:odd" );
$( "#myForm :input" );
$( "div:visible" );
$( "div:gt(2)" );                     // All except first three divs
$( "div:animated" );                  // Currently animated divs
```

> **Note:** `:visible` and `:hidden` test actual physical dimensions (height and width > 0), not just CSS `visibility` or `display`. For `<tr>` elements, jQuery checks the CSS `display` property. Elements not added to the DOM are always considered hidden.

### Choosing Good Selectors

Too much specificity hurts performance. `#myTable th.special` is better than `#myTable thead tr th.special`.

### Does My Selection Contain Any Elements?

```javascript
// WRONG: $() always returns an object (truthy)
if ( $( "div.foo" ) ) { ... }

// CORRECT: check .length
if ( $( "div.foo" ).length ) { ... }
```

### Saving Selections

jQuery doesn't cache elements. Store selections in variables to avoid re-selecting:

```javascript
var divs = $( "div" );
```

> Selections only fetch elements at the time they're made. If the DOM changes, re-run the selector.

### Refining & Filtering Selections

```javascript
$( "div.foo" ).has( "p" );           // div.foo elements containing <p> tags
$( "h1" ).not( ".bar" );             // h1 elements without class "bar"
$( "ul li" ).filter( ".current" );   // li elements with class "current"
$( "ul li" ).first();                // First li
$( "ul li" ).eq( 5 );                // Sixth li (0-based)
```

## Working with Selections

### Getters & Setters

- **Setters** affect all elements in a selection and return the jQuery object (chainable)
- **Getters** return the requested value for the **first element only** (exception: `.text()` returns concatenated text from all elements)

```javascript
// Setter — sets HTML for all h1 elements
$( "h1" ).html( "hello world" );

// Getter — returns HTML of first h1 only
$( "h1" ).html();

// This will NOT work — getter returns a string, not a jQuery object
$( "h1" ).html().addClass( "test" );
```

### Chaining

```javascript
$( "#content" )
  .find( "h3" )
  .eq( 2 )
  .html( "new text for the third h3!" );

// .end() restores the previous selection
$( "#content" )
  .find( "h3" )
  .eq( 2 )
  .html( "new text for the third h3!" )
  .end()  // Back to all h3s in #content
  .eq( 0 )
  .html( "new text for the first h3!" );
```

> Extensive chaining can make code difficult to modify or debug. Use with care.

## Manipulating Elements

### Getting & Setting Information

| Method | Description |
|--------|-------------|
| `.html()` | Get or set HTML contents |
| `.text()` | Get or set text contents (HTML stripped) |
| `.attr()` | Get or set attribute value |
| `.width()` | Get or set width in pixels (integer) |
| `.height()` | Get or set height in pixels (integer) |
| `.position()` | Get position object relative to first positioned ancestor (getter only) |
| `.val()` | Get or set form element values |

### Moving Elements

Two approaches: place selected element relative to another, or place an element relative to the selection:

```javascript
// .appendTo() returns the moved element (stores reference)
var li = $( "#myList li:first" ).appendTo( "#myList" );

// .append() returns the container (no reference to moved element)
$( "#myList" ).append( $( "#myList li:first" ) );
```

Similar pairs: `.insertAfter()` / `.after()`, `.insertBefore()` / `.before()`, `.prependTo()` / `.prepend()`.

### Cloning Elements

```javascript
var $clone = $( "p" ).clone();           // Shallow
var $deep = $( "p" ).clone( true );      // With events and data
```

### Removing Elements

```javascript
$( "p" ).remove();    // Removes elements and their data/events
$( "p" ).detach();    // Removes but preserves data/events for re-insertion
$( "div" ).empty();   // Removes all children
```

### Creating New Elements

```javascript
// From HTML string
$( "<p>This is a new paragraph</p>" );

// With attributes object
$( "<a/>", {
  html: "This is a <strong>new</strong> link",
  "class": "new",
  href: "foo.html"
});

// Add to page
var myNewElement = $( "<p>New element</p>" );
myNewElement.appendTo( "#content" );

// Create and add in one step (no reference to new element)
$( "ul" ).append( "<li>list item</li>" );
```

> **Performance:** When adding many elements, concatenate all HTML into a single string first, then append once:
```javascript
var myItems = [];
var myList = $( "#myList" );
for ( var i = 0; i < 100; i++ ) {
  myItems.push( "<li>item " + i + "</li>" );
}
myList.append( myItems.join( "" ) );
```

### Manipulating Attributes

```javascript
// .attr() as setter
$( "a" ).attr( "href", "allMyHrefsAreTheSameNow.html" );
$( "a" ).attr({
  title: "all titles are the same too!",
  href: "somethingNew.html"
});

// .attr() as getter
$( "a" ).attr( "href" ); // Returns href for first <a>
```

## The jQuery Object

The jQuery object wraps DOM elements to provide cross-browser compatibility and convenience:

```javascript
// Selecting all <h1> tags
var headings = $( "h1" );
console.log( headings.length );  // Number of matched elements

// Get first element as jQuery object
var firstHeading = headings.eq( 0 );

// Get raw DOM element
var firstHeadingElem = $( "h1" ).get( 0 );
// or
var firstHeadingElem = $( "h1" )[ 0 ];
```

### Not All jQuery Objects are Created ===

```javascript
// Two jQuery objects for the same element are NOT equal
alert( $( "#logo" ) === $( "#logo" ) );  // false

// But the underlying DOM elements ARE equal
var logo1 = $( "#logo" ).get( 0 );
var logo2 = $( "#logo" ).get( 0 );
alert( logo1 === logo2 );  // true
```

### jQuery Objects Are Not "Live"

jQuery objects don't automatically update when the DOM changes. Re-run the selector to get fresh results:

```javascript
var allParagraphs = $( "p" );
// ... DOM changes ...
allParagraphs = $( "p" );  // Refresh the selection
```

## Traversing

### Parents

```javascript
$( "span.subchild" ).parent();                      // Direct parent
$( "span.subchild" ).parents( "div.parent" );       // All ancestors matching selector
$( "span.subchild" ).parents();                     // All ancestors
$( "span.subchild" ).parentsUntil( "div.grandparent" ); // Ancestors until (exclusive)
$( "span.subchild" ).closest( "div" );              // Nearest matching ancestor (includes self)
```

### Children

```javascript
$( "div.grandparent" ).children( "div" );   // Direct children only
$( "div.grandparent" ).find( "div" );       // All descendants (recursive)
```

### Siblings

```javascript
$( "div.parent" ).next();                    // Next sibling
$( "div.parent" ).prev();                    // Previous sibling
$( "div.parent" ).nextAll();                 // All following siblings
$( "div.parent" ).prevAll();                 // All preceding siblings
$( "div.parent" ).siblings();                // All siblings (both directions)
$( "div.parent" ).nextUntil( ".end" );       // Following siblings until
$( "div.parent" ).prevUntil( ".start" );     // Preceding siblings until
```

> **Caution:** Avoid traversing long distances in documents. Complex traversals make code fragile if the document structure changes. One- or two-step traversal is fine.

## CSS, Styling, & Dimensions

### Using CSS Classes for Styling

Avoid `.css()` as a setter in production code. Keep presentational information in CSS:

```javascript
var h1 = $( "h1" );
h1.addClass( "big" );
h1.removeClass( "big" );
h1.toggleClass( "big" );
if ( h1.hasClass( "big" ) ) { /* ... */ }
```

### Dimensions

```javascript
$( "h1" ).width( "50px" );    // Set width
$( "h1" ).width();            // Get width (first element)
$( "h1" ).height( "50px" );  // Set height
$( "h1" ).height();           // Get height (first element)
$( "h1" ).position();         // Position relative to offset parent (getter only)
```

## Data Methods

Store data associated with elements without memory leak issues:

```javascript
// Store
$( "#myDiv" ).data( "keyName", { foo: "bar" } );

// Retrieve
$( "#myDiv" ).data( "keyName" );  // Returns { foo: "bar" }

// Store relationships between elements
$( "#myList li" ).each(function() {
  var li = $( this );
  var div = li.find( "div.content" );
  li.data( "contentDiv", div );
});

// Later, retrieve without re-finding
var firstLi = $( "#myList li:first" );
firstLi.data( "contentDiv" ).html( "new content" );
```

## Utility Methods

### $.trim()

```javascript
$.trim( " lots of extra whitespace " );  // "lots of extra whitespace"
```

### $.each()

```javascript
// Iterate arrays
$.each([ "foo", "bar", "baz" ], function( idx, val ) {
  console.log( "element " + idx + " is " + val );
});

// Iterate objects
$.each({ foo: "bar", baz: "bim" }, function( k, v ) {
  console.log( k + " : " + v );
});
```

> Use `.each()` (not `$.each()`) for iterating over jQuery selections.

### $.inArray()

```javascript
var myArray = [ 1, 2, 3, 5 ];
if ( $.inArray( 4, myArray ) !== -1 ) {
  console.log( "found it!" );
}
```

### $.extend()

```javascript
var firstObject = { foo: "bar", a: "b" };
var secondObject = { foo: "baz" };

// Merges into firstObject (mutates it)
var newObject = $.extend( firstObject, secondObject );
console.log( firstObject.foo );  // "baz"

// Safe merge — don't mutate originals
var safe = $.extend( {}, firstObject, secondObject );
```

### $.proxy()

```javascript
var myFunction = function() { console.log( this ); };
var myObject = { foo: "bar" };

myFunction();  // window
var myProxyFunction = $.proxy( myFunction, myObject );
myProxyFunction();  // myObject

// Or with method name
var myObject = {
  myFn: function() { console.log( this ); }
};
$( "#foo" ).click( myObject.myFn );                    // HTMLElement #foo
$( "#foo" ).click( $.proxy( myObject, "myFn" ) );     // myObject
```

## Iterating Over jQuery and Non-jQuery Objects

### $.each() — for plain objects, arrays, array-like objects

```javascript
var sum = 0;
var arr = [ 1, 2, 3, 4, 5 ];

// Traditional for loop
for ( var i = 0, l = arr.length; i < l; i++ ) { sum += arr[ i ]; }

// Same with $.each()
$.each( arr, function( index, value ) { sum += value; } );

// For objects
var obj = { foo: 1, bar: 2 };
$.each( obj, function( key, value ) { sum += value; } );
```

> **Don't** use `$.each()` on jQuery collections — use `.each()` instead.

### .each() — for jQuery collections

```javascript
$( "li" ).each( function( index, element ) {
  console.log( $( this ).text() );
});
// Logs: Link 1, Link 2, Link 3
```

#### The Second Argument

The `element` argument is useful when `this` context may change (e.g., inside nested callbacks):

```javascript
$( "li" ).each( function( index, listItem ) {
  this === listItem;  // true
  $.ajax({
    success: function( data ) {
      this !== listItem;  // true — context changed!
    }
  });
});
```

#### Sometimes .each() Isn't Necessary

Many jQuery methods implicitly iterate:

```javascript
// Unnecessary — .addClass() iterates automatically
$( "li" ).each( function( i, el ) { $( el ).addClass( "newClass" ); });

// Just do this
$( "li" ).addClass( "newClass" );
```

**Methods that require `.each()`** (getter forms that need per-element processing):
`.attr()`, `.css()`, `.data()`, `.height()`, `.html()`, `.innerHeight()`, `.innerWidth()`, `.offset()`, `.outerHeight()`, `.outerWidth()`, `.position()`, `.prop()`, `.scrollLeft()`, `.scrollTop()`, `.val()`, `.width()`

> **Note:** Setter forms of these methods accept callback functions, providing an alternative to `.each()`:
```javascript
// Instead of .each()
$( "input" ).each( function( i, el ) {
  var elem = $( el );
  elem.val( elem.val() + "%" );
});

// Use callback form
$( "input" ).val(function( index, value ) {
  return value + "%";
});
```

### .map() — for creating arrays from collections

```javascript
// Instead of this:
var newArr = [];
$( "li" ).each( function() { newArr.push( this.id ); });

// Use .map():
var arr = $( "li" ).map( function( index, element ) {
  return this.id;
}).get();  // .get() returns a plain JS array

// Chain .join() for a string
var str = $( "li" ).map( function() { return this.id; }).get().join( ", " );
```

## Using jQuery's .index() Function

### .index() with No Arguments

Returns the zero-based index of the first element within its parent:

```javascript
// HTML: <ul><div></div><li id="foo1">foo</li>...</ul>
$( "#foo1" ).index();  // 1 (second child of parent)
$( "li" ).index();     // 1 (first li, implicitly .first())
$( "div" ).index();    // 0 (first div)
```

### .index() with a String Argument

Queries the entire DOM with the selector, then finds the index of the first element in the jQuery object:

```javascript
$( "#baz1" ).index( "li" );      // 2
$( "#bar1" ).index( ".test" );   // 1
$( "#last" ).index( "div" );     // 2
```

### .index() with a jQuery Object Argument

Searches for the first element of the argument within the original jQuery object:

```javascript
var foo = $( "li" );
var baz = $( "#baz1" );
foo.index( baz );  // 2
```

### .index() with a DOM Element Argument

Same as jQuery object argument, but passes a raw DOM element:

```javascript
var bar = $( "#bar1" );
$( ".test" ).index( bar[ 0 ] );  // 1
```

## Sources

- https://learn.jquery.com/about-jquery/
- https://learn.jquery.com/about-jquery/how-jquery-works/
- https://jquery.com/download/
- https://api.jquery.com/jquery/
- https://api.jquery.com/ready/
- https://api.jquery.com/jQuery.noConflict/
- https://learn.jquery.com/using-jquery-core/
- https://learn.jquery.com/using-jquery-core/dollar-object-vs-function/
- https://learn.jquery.com/using-jquery-core/document-ready/
- https://learn.jquery.com/using-jquery-core/avoid-conflicts-other-libraries/
- https://learn.jquery.com/using-jquery-core/attributes/
- https://learn.jquery.com/using-jquery-core/selecting-elements/
- https://learn.jquery.com/using-jquery-core/working-with-selections/
- https://learn.jquery.com/using-jquery-core/manipulating-elements/
- https://learn.jquery.com/using-jquery-core/jquery-object/
- https://learn.jquery.com/using-jquery-core/traversing/
- https://learn.jquery.com/using-jquery-core/css-styling-dimensions/
- https://learn.jquery.com/using-jquery-core/data-methods/
- https://learn.jquery.com/using-jquery-core/utility-methods/
- https://learn.jquery.com/using-jquery-core/iterating/
- https://learn.jquery.com/using-jquery-core/understanding-index/
