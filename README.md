# misc-js

Client-side javascript libraries.



---
## cookies.js (no dependencies)

Cookie manipulation (get/set/del/all) helper.

Loading this script exposes two global variables: `Cookies` (the class), and `cookies` (a singleton instance).

All calls take an optional list of parameters after positional arguments.

* `expires`: Date
* `path`: String
* `domain`: String
* `secure`: Boolean
* `raw`: Boolean
    - Not part of the cookie data, but controls how the cookie is stringified.
    - Prevents `encodeURIComponent` being called on the given name and value.

There are no defaults for these fields, but you can set site-wide defaults (well, whenever you use the `cookies` instance) like so:

    cookies.defaults = function() {
      var now = new Date();
      var one_month_from_now = new Date(now.getTime() + 31*24*60*60*1000);
      return {
        path: '/',
        expires: one_month_from_now
      };
    };

Or if you want to just set the default `path`, for example, you can simply say:

    cookies.defaults = {path: '/'};

**API**

| method | return type | description |
|:-------|:------------|:------------|
| `cookies.get(name [, options])` | String | get the value of a cookie by name (defers to all() if `name` is null or undefined |
| `cookies.set(name, value [, options])` | null | set the string value of a cookie by name |
| `cookies.del(name [, options])` | null | expire the cookie  by name and set its value to the empty string |
| `cookies.all([options])` | Object | get all cookies as an object mapping names to values |
| `cookies.defaults` | Object or Function | directly settable; if a function is used, will execute it every time defaults are needed |

**Examples**

See [doc/cookies.html](doc/cookies.html) for an example that uses all of these methods.

Set a simple site-wide cookie:

    cookies.set('user_id', '10089', {path: '/'});

This has the same effect as the following:

    cookies.defaults = {path: '/'};
    cookies.set('user_id', '10089');

Get it back:

    var user_id = cookies.get('user_id');
    // user_id will be a string or undefined (if you or the user deleted it since you set it)
    console.log('user_id:', user_id);

Get rid of it:

    cookie.del('user_id');



---
## forms.js (no dependencies)

Protocols:

* `select` will produce a single string / null (unless there is another input with same name)
* `select[multiple]` will always produce an array of strings
* Two or more inputs with the same `[name]` attribute produce an array (of strings)
* `input[type=hidden]` + `input[type=checkbox]` with same name uses the hidden input's value if the checkbox is unchecked (and it gets a little messy if the checkbox's value is unspecified (which defies the html5 spec, by the way).
* Etc. (TODO: add more and document here)

**Usage:** first, set up a form:

    <div id="ownership">
      <label>Pet Names</label>
      <input name="petnames" />
      <input name="petnames" />
      <input name="petnames" />
      <input name="petnames" />

      <select name="breeds" multiple />
        <option>Reptile</option>
        <option>Labrador</option>
        <option>Collie</option>
        <option>Aquatic</option>
      </script>

      <label>Sole-proprietor</label>
      <input name="sole" type="hidden" value="not_sole_prop" />
      <input name="sole" type="checkbox" value="is_sole_prop" />

      <button>Submit</button>
    </div>

Now, hook it up:

    <script>
    var container = document.getElementById('#ownership');

    var form = new Form(container);

    form.set({
      petnames: ['Lester', 'Crevice'],
      breeds: ['Aquatic'], // can also be set as just a naked string, 'Aquatic'
    });

    document.querySelector('button').addEventListener('click', function() {
      var result_object = form.get();
      console.log(result_object.petnames);
      // ['Lester', 'Crevice']
      console.log(result_object.breeds, result_object.sole);
    });
    </script>

The general idea is that inputs inside the same container with the same name are related, and by pairing different kinds of native inputs with the same name, we can create more complex data structures declaratively.
Following the simple protocols, the data assignment / collection can be more generic.
The intent is that more complex form needs can be handled pretty simply with this `Form` interface, which merely takes an element to initialize, and then returns an object when `get`ting data from the form, and receives an object when `set`ting the form.



---
## jquery-autocomplete.js (jQuery)

jQuery UI's autocomplete is too bulky and hard to configure. The hoops you have to jump through, just to use use a little `<b>` markup in your results, it's crazy.

But this plugin, I want you to copy & paste into your own project, and to tear apart, and build out of. Because autocomplete has to be blazing fast, and that means it has to be bloody simple. This is just a little starting block for an autocomplete. Your mileage *will* vary.

In your html:

    <input type="text" data-autocomplete="/users.json" />

Where /users.json?q=jo will respond in json like the following:

    [
      {"label": "Professor", "value": "prof"},
      {"label": "Student", "value": "student"}
    ]

Either `label` or `value` must be present, and if both are, `label` is used.

Then call:

    $('input[data-autocomplete]').ac();
    // the actual Autocomplete object will be available at each element's .data('autocomplete') key



---
## jquery-flags.js (jQuery)

Like those "Sign here" post-its, this plugin is intended to provide element level flash messages/feedback.
It's absolutely positioned, so you needn't put dummy "submit-debug" spans in your html just to provide a little feedback.

    $('#submit').flag({
      anchor: 'r', // put on the right side of the #submit element
      html: 'This element needs <em>attention</em>', // uses html()
      // text: 'So does this one.', // for text(), if you play safe like that
      fade: 5000 // hide after five seconds.
    });

The `anchor` parameter defaults to 'r', and must be one of 't|r|b|l'. If `fade` is not specified, the flag will remain visible until clicked.

If you use only a string, it's like calling it with `{text: "that-string"}`.

    $('#submit').flag('Failed');

If you want to hide or update the flag programmatically, use `$.flag` instead, which returns a Flag object.

    var flag = $.flag(('#submit'), {text: 'Failed'});
    flag.$el.fadeOut(10000);

Use something like this in your CSS:

    .flag {
      position: absolute;
      background-color: black;
      border-radius: 3px;
      padding: 2px 6px;
      color: white;
    }
    .flag .triangle {
      position: absolute;
      border: 6px solid transparent;
    }



---
## templating.js (Underscore, jQuery, Backbone, Handlebars)

Templating helper for Backbone joined with Handlebars.

### Creates a class, `TemplateManager`.

* TemplateManager.cache = the dictionary to look up and store templates by name
* TemplateManager.url = where to request templates if they're not in the cache
* TemplateManager.extension = the dictionary to look up and store templates by name.
* TemplateManager.querystring = set to '?t=123' to keep from pulling static templates from cache.
* TemplateManager.compile = function(template_string) -> function(context) -> html

### Creates a global variable, `HandlebarsTemplates`:

For convenience, `Templates` is set to the same reference.

Unless you have set `window.DEBUG = true` somewhere, `HandlebarsTemplates` will load `Handlebars.templates` as its cache.

### Creates helper classes for Backbone:

* TemplatedView (extends Backbone.View)
* TemplatedCollection (extends Backbone.Collection)



---
## textarea.js (no dependencies)

When all you want is a little textarea that expands vertically to hold its contents, and handles tab keypresses like a code editor.

    <script src="/static/lib/textarea.js"></script>
    <script>
    Textarea.enhance(document.querySelector('textarea'));
    </script>

Off-the-cuff comparison:

|  | [`textarea.js`](textarea.js) | [CodeMirror](http://codemirror.net/) | [Ace](http://ace.c9.io/) |
|:-----------------------------|:------|:-------|:-------|
| Size                         | 11 KB | 228 KB | 546 KB |
| Minified                     | 5 KB  | 108 KB | 303 KB |
| Auto expand                  | yes   | yes    | no     |
| Tab support                  | yes   | yes    | yes    |
| Restyles text                | no    | yes    | yes    |
| Code highlighter             | no    | yes    | yes    |
| Requires spans to be inline  | no    | yes    | yes    |
| Handles necessary CSS resets | yes   | no     | no     |
| Homepage is animated         | no    | no     | yes    |



---
## License

Copyright (c) 2011-2013 Christopher Brown. MIT Licensed.
