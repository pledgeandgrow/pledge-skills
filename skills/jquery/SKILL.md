---
name: jquery-docs
version: "3.7.x"
tags:
  - jquery
  - javascript library
  - dom manipulation
  - dom traversal
  - event handling
  - animation
  - ajax
  - selectors
  - css selectors
  - chaining
  - document ready
  - noconflict
  - jquery object
  - effects
  - fading
  - sliding
  - animate
  - queue
  - dequeue
  - deferred
  - promise
  - jqxhr
  - serialize
  - jsonp
  - cors
  - plugins
  - jquery ui
  - jquery mobile
  - qunit
  - sizzle
  - jquery migrate
  - cross-browser
  - javascript
  - frontend
  - web development
  - cdn
  - npm
  - class selector
  - id selector
  - attribute selector
  - form selector
  - pseudo selector
  - child filter
  - addClass
  - removeClass
  - toggleClass
  - hasClass
  - attr
  - prop
  - val
  - html
  - text
  - append
  - prepend
  - after
  - before
  - wrap
  - clone
  - remove
  - detach
  - empty
  - replaceWith
  - find
  - children
  - parent
  - parents
  - siblings
  - next
  - prev
  - closest
  - filter
  - not
  - eq
  - first
  - last
  - slice
  - css
  - height
  - width
  - offset
  - position
  - scrollTop
  - scrollLeft
  - on
  - off
  - one
  - trigger
  - click
  - hover
  - ready
  - event object
  - preventDefault
  - stopPropagation
  - fadeIn
  - fadeOut
  - slideDown
  - slideUp
  - toggle
  - stop
  - delay
  - finish
  - $.ajax
  - $.get
  - $.post
  - $.getJSON
  - $.getScript
  - load
  - ajaxSetup
  - ajaxPrefilter
  - param
  - each
  - extend
  - grep
  - map
  - merge
  - inArray
  - type
  - parseJSON
  - parseHTML
  - parseXML
  - proxy
  - noop
  - trim
  - Deferred
  - promise
  - done
  - fail
  - always
  - then
  - resolve
  - reject
  - when
  - pushStack
  - Callbacks
  - callbacks.add
  - callbacks.remove
  - callbacks.fire
  - callbacks.fireWith
  - callbacks.disable
  - callbacks.disabled
  - callbacks.empty
  - callbacks.has
  - callbacks.fired
  - callbacks.lock
  - callbacks.locked
  - $.Callbacks
  - once
  - memory
  - unique
  - stopOnFalse
  - $ vs $()
  - $.fn
  - document ready
  - window load
  - noConflict
  - IIFE
  - selecting elements
  - pseudo-selectors
  - :visible
  - :hidden
  - saving selections
  - refining selections
  - getters
  - setters
  - chaining
  - .end()
  - manipulating elements
  - creating elements
  - cloning
  - detach
  - jQuery object
  - not live
  - .get()
  - .eq()
  - traversing
  - parents
  - children
  - siblings
  - closest
  - parentsUntil
  - nextUntil
  - prevUntil
  - data methods
  - .data()
  - utility methods
  - $.trim
  - $.inArray
  - $.extend
  - $.proxy
  - iterating
  - .each()
  - $.each()
  - .map()
  - .index()
  - implicit iteration
  - deprecated
  - deprecated methods
  - live
  - die
  - bind
  - unbind
  - delegate
  - undelegate
  - size
  - andSelf
  - jQuery.browser
  - jQuery.boxModel
  - jQuery.support
  - jQuery.parseJSON
  - jQuery.unique
  - jQuery.isArray
  - jQuery.isFunction
  - jQuery.isNumeric
  - jQuery.isWindow
  - jQuery.now
  - jQuery.proxy
  - jQuery.type
  - jQuery.trim
  - jQuery.holdReady
  - jQuery.fx.interval
  - deferred.pipe
  - deferred.isRejected
  - deferred.isResolved
  - hover
  - toggle event
  - error shorthand
  - load event
  - unload
  - ajaxComplete
  - ajaxError
  - ajaxSend
  - ajaxStart
  - ajaxStop
  - ajaxSuccess
  - jQuery Migrate
description: |
  jQuery 3.7.x — selectors, DOM manipulation, traversal, events, effects, AJAX, Deferred, utilities, plugins.
---

# jQuery Skill

> **jQuery** — A fast, small, and feature-rich JavaScript library for DOM traversal, manipulation, event handling, animation, and Ajax.
> **Version**: jQuery 3.7.x | **Docs**: [api.jquery.com](https://api.jquery.com/) | [learn.jquery.com](https://learn.jquery.com/)

## Quick Reference

| File | Topics |
|------|--------|
| [getting-started.md](getting-started.md) | Installation (npm, Yarn, CDN, downloading), including jQuery in pages, document ready, `$` vs `jQuery`, basic selectors, chaining, noConflict, jQuery vs vanilla JS, browser support, jQuery Migrate plugin |
| [api.md](api.md) | Core (`jQuery()`, `$.extend()`, `$.each()`, `$.when()`, `noConflict()`), selectors (CSS, attribute, form, pseudo, hierarchy), attributes (attr, prop, val, html, text, addClass, removeClass, toggleClass, hasClass), manipulation (append, prepend, after, before, clone, remove, empty, replaceWith, wrap), traversing (find, children, parent, parents, siblings, next, prev, closest, filter, not, eq, first, last, slice, add, end), CSS (css, height, width, offset, position, scrollLeft, scrollTop), events (on, off, one, trigger, click, hover, ready, event object properties and methods), effects (show, hide, toggle, fadeIn, fadeOut, fadeTo, fadeToggle, slideDown, slideUp, slideToggle, animate, stop, delay, queue, dequeue, finish), Ajax ($.ajax, $.get, $.post, $.getJSON, $.getScript, .load, $.ajaxSetup, $.ajaxPrefilter, $.param, .serialize, .serializeArray, jqXHR object), utilities ($.each, $.extend, $.grep, $.map, $.merge, $.inArray, $.isArray, $.isFunction, $.isPlainObject, $.trim, $.type, $.parseJSON, $.parseHTML, $.parseXML, $.proxy, $.noop, $.now, $.uniqueSort), deferreds (Deferred, promise, done, fail, always, then, pipe, resolve, reject, notify, state, when), internals (context, jquery, selector, pushStack) |
| [guides.md](guides.md) | Events (event basics, event delegation, custom events, event helpers, triggering, event handling function), effects (intro, custom animations with .animate(), queue & dequeue explained), Ajax (key concepts, jQuery Ajax methods, Ajax and forms, JSONP, Ajax events), plugins (finding & evaluating, basic plugin creation, advanced plugin concepts, publishing to npm), performance (append outside loops, cache length, detach elements, optimize selectors, use stylesheets, don't act on absent elements), code organization (concepts, beware anonymous functions, DRY, feature & browser detection, deferreds) |

## Core Concepts

- **jQuery Object**: A wrapper around DOM elements returned by `$()` or `jQuery()`, providing cross-browser methods
- **Chaining**: Most jQuery methods return the jQuery object, allowing method chaining: `$( "p" ).addClass( "intro" ).show()`
- **Document Ready**: `$( document ).ready(fn)` or `$(fn)` — executes code after DOM is fully parsed
- **Selectors**: CSS-style selectors for finding elements: `$( "#id" )`, `$( ".class" )`, `$( "element" )`, `$( "parent > child" )`
- **Event Handling**: `.on()` for attaching handlers; supports direct and delegated event binding
- **Effects**: Built-in animations (show/hide, fade, slide) and custom `.animate()` for arbitrary CSS properties
- **Ajax**: `$.ajax()` with convenience methods `$.get()`, `$.post()`, `$.getJSON()`, `.load()` for server communication
- **Deferreds**: Promise-like objects for managing asynchronous callbacks: `$.Deferred()`, `.done()`, `.fail()`, `.then()`
- **Utilities**: Helper functions on the `$` namespace: `$.each()`, `$.extend()`, `$.map()`, `$.grep()`, `$.type()`
- **Plugins**: Extend jQuery's prototype (`$.fn`) to add custom methods
- **noConflict**: `$.noConflict()` releases `$` to avoid conflicts with other libraries

## jQuery Ecosystem

| Library | Description |
|---------|-------------|
| [jQuery UI](https://jqueryui.com/) | Official UI widgets (datepicker, dialog, draggable, droppable, sortable, autocomplete, tabs, accordion) |
| [jQuery Mobile](https://jquerymobile.com/) | Touch-optimized web framework for smartphones and tablets |
| [QUnit](https://qunitjs.com/) | JavaScript unit testing framework (jQuery project) |
| [jQuery Migrate](https://github.com/jquery/jquery-migrate/) | Plugin to restore deprecated features for easy upgrades |
| [Sizzle](https://sizzlejs.com/) | CSS selector engine (jQuery's selector engine) |
| [jQuery Validation](https://jqueryvalidation.org/) | Form validation plugin |

## Common Patterns

```javascript
// Document ready
$( document ).ready(function() {
  // Code runs after DOM is parsed
});

// Click handler with event delegation
$( "#container" ).on( "click", "button", function( event ) {
  $( this ).toggleClass( "active" );
});

// Chaining
$( ".box" )
  .css( "background", "#f00" )
  .slideUp( 300 )
  .delay( 800 )
  .fadeIn( 400 );

// Ajax with $.ajax
$.ajax({
  url: "/api/users",
  method: "GET",
  dataType: "json"
})
  .done(function( data ) {
    console.log( data );
  })
  .fail(function( jqXHR, textStatus, error ) {
    console.error( "Error:", error );
  });

// Deferred / Promise
var deferred = $.Deferred();
deferred.done(function( value ) {
  console.log( "Resolved with:", value );
});
deferred.resolve( "success" );

// Plugin definition
$.fn.greenify = function() {
  this.css( "color", "green" );
  return this;
};
$( "p" ).greenify();
```

## Sources

- jQuery API documentation: https://api.jquery.com/
- jQuery Learning Center: https://learn.jquery.com/
- jQuery download: https://jquery.com/download/
- jQuery GitHub: https://github.com/jquery/jquery
- jQuery UI API: https://api.jqueryui.com/
- jQuery Mobile API: https://api.jquerymobile.com/
- QUnit API: https://api.qunitjs.com/
- jQuery.Callbacks(): https://api.jquery.com/jQuery.Callbacks/
- Callbacks Object category: https://api.jquery.com/category/callbacks-object/
- Using jQuery Core: https://learn.jquery.com/using-jquery-core/
- $ vs $(): https://learn.jquery.com/using-jquery-core/dollar-object-vs-function/
- $( document ).ready(): https://learn.jquery.com/using-jquery-core/document-ready/
- Avoiding Conflicts: https://learn.jquery.com/using-jquery-core/avoid-conflicts-other-libraries/
- Selecting Elements: https://learn.jquery.com/using-jquery-core/selecting-elements/
- Working with Selections: https://learn.jquery.com/using-jquery-core/working-with-selections/
- Manipulating Elements: https://learn.jquery.com/using-jquery-core/manipulating-elements/
- The jQuery Object: https://learn.jquery.com/using-jquery-core/jquery-object/
- Traversing: https://learn.jquery.com/using-jquery-core/traversing/
- CSS, Styling, & Dimensions: https://learn.jquery.com/using-jquery-core/css-styling-dimensions/
- Data Methods: https://learn.jquery.com/using-jquery-core/data-methods/
- Utility Methods: https://learn.jquery.com/using-jquery-core/utility-methods/
- Iterating: https://learn.jquery.com/using-jquery-core/iterating/
- Understanding .index(): https://learn.jquery.com/using-jquery-core/understanding-index/
