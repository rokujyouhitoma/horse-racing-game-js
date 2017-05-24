"use strict";

/*
 * Porting from tornado/template.py([Tornado](https://github.com/tornadoweb/tornado)).
 * Copyright 2011-2017 Ike Tohru<ike.tohru@gmail.com>
 *
 * NOTICE:
 *  Original codes(tornado/template.py by Tornado) are using Python and licensed under the Apache License, Version 2.0
 *  Please see below. There are quoted by tornado/template.py file.
#
# Copyright 2009 Facebook
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
 */

/**
 * @interface
 */
var IWithItem = function(){};

/**
 * __enter__
 * @return {IWithItem} .
 */
IWithItem.prototype.__enter__ = function(){};

/**
 * __exit__
 */
IWithItem.prototype.__exit__ = function(){};

var statement = {};

/**
 * @param {IWithItem} item .
 * @param {function(?IWithItem)} func .
 */
statement.with_stmt = function(item, func){
    var with_item = item.__enter__();
    func(with_item);
    item.__exit__();
};

/**
 * @param {Function} childCtor Child class constructor.
 * @param {Function} parentCtor Parent class constructor.
 */
function inherits(childCtor, parentCtor) {
    /** @constructor */
    function tempCtor() {}
    tempCtor.prototype = parentCtor.prototype;
    childCtor.__super__ = parentCtor.prototype;
    childCtor.prototype = new tempCtor();
    childCtor.prototype.constructor = childCtor;
}

/*
 * be based on Python class methods.
 */

var buildin = {};

/**
 * @private
 * @param {Arguments} args .
 * @param {string} implementation_of .
 * @return {number} .
 */
buildin._min_max = function(args, implementation_of) {
    var length = args.length;
    var first = args[0];
    var last = args[length - 1];
    if (implementation_of === "min") {
        if (typeof last === "object" && last.hasOwnProperty('key')) {
            throw new NotImplementedError();
        }
        if (first instanceof  Array) {
            return Math.min.apply(null, first);
        }
        return Math.min.apply(null, args);
    }
    else if (implementation_of === 'max') {
        if (typeof last === "object" && last.hasOwnProperty('key')) {
            throw new NotImplementedError();
        }
        if (first instanceof  Array) {
            return Math.max.apply(null, first);
        }
        return Math.max.apply(null, args);
    }
    else {
        throw new Error();
    }
};

/**
 * @param {...*} args The rest of the arguments.
 * @return {number} .
 * @see Python <a href='http://docs.python.org/library/functions.html#max'>max</a> function.
 * @see PyPy pypy/module/__builtin__/functional#max
 */
buildin.max = function(args) {
    return buildin._min_max(arguments, "max");
};

/**
 * @param {...*} args The rest of the arguments.
 * @return {number} .
 * @see Python <a href='http://docs.python.org/library/functions.html#min'>min</a> function.
 * @see PyPy pypy/module/__builtin__/functional#min
 */
buildin.min = function(args) {
    return buildin._min_max(arguments, "min");
};

var array = {};

/**
 * @param {Array} arr .
 * @param {?string} value .
 * @return {boolean} .
 */
array.contains = function(arr, value) {
    var length = arr.length;
    for (var i = 0; i < length; ++i) {
        if (arr[i] === value) {
            return true;
        }
    }
    return false;
};

var object = {};

/**
 * @param {Object} obj .
 * @param {string} key .
 * @return {*} .
 */
object.get = function(obj, key) {
    if (obj.hasOwnProperty(key)) {
        return obj[key];
    }
    return null;
};

var string = {};

/**
 * @param {string} value .
 * @param {string} fragment .
 * @return {boolean} .
 */
string.contains = function(value, fragment) {
    var result = value.search(fragment);
    return (-1 < result);
};

/**
 * @param {string} str .
 * @param {string} sub .
 * @param {number} start .
 * @param {number} end .
 * @param {?number=} count .
 * @return {number} .
 */
string.count = function(str, sub, start, end, count) {
    start = start ? start : 0;
    end = end ? end : str.length;
    count = count ? count : 0;
    if (end < start) {
        return 0;
    }
    var p = str.indexOf(sub);
    if (p === -1) {
        return count;
    }
    count += 1;
    if (count === str.length) {
        return count;
    }
    return string.count(str.slice(start, end), sub, start, end, count);
};

/**
 * @param {string} str .
 * @param {string} suffix .
 * @return {boolean} .
 */
string.endswith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

/**
 * @param {string} str .
 * @param {string} sub .
 * @param {?number=} start .
 * @param {?number=} end .
 * @return {number} number or -1(not found).
 */
string.find = function(str, sub, start, end) {
    start = start ? start : 0;
    end = end ? end : str.length;
    str = str.slice(start, end);
    var res = str.indexOf(sub);
    if (res > -1) {
        res += start;
    }
    return res;
};

/**
 * Remove head and tail spaces.
 * @param {string} str .
 * @return {string} .
 */
string.strip = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
};

/**
 * @param {string} str .
 * @param {string} substr .
 * @return {boolean} .
 */
string.startwith = function(str, substr) {
    var parttern = new RegExp('^' + substr);
    return (str.search(parttern) === 0);
};

/**
 * @param {string} str .
 * @param {number} count .
 * @return {string} .
 */
string.__mul__ = function(str, count) {
    return str.repeat(count);
};

/*
 * Be based on Python build-in Error class.
 */

/**
 * NotImplementedError.
 * @param {string=} message .
 * @constructor
 * @extends {Error}
 */
var NotImplementedError = function(message) {
    NotImplementedError.__super__.constructor.apply(this, [message]);
    this.name = 'NotImplementedError';
};
inherits(NotImplementedError, Error);

/**
 * AssertionError.
 * @param {string} message .
 * @constructor
 * @extends {Error}
 */
var AssertionError = function(message) {
    AssertionError.__super__.constructor.apply(this, [message]);
    this.name = 'AssertionError';
};
inherits(AssertionError, Error);

/**
 * ValueError.
 * @param {string} message .
 * @constructor
 * @extends {Error}
 */
var ValueError = function(message) {
    ValueError.__super__.constructor.apply(this, [message]);
    this.name = 'ValueError';
};
inherits(ValueError, Error);

/**
 * @param {...*} var_args The rest of the arguments.
 * @constructor
 * @extends {Error}
 */
var IOError = function(var_args) {
    var message = '';
    var fragment = arguments.length > 1 ? arguments[1] : '';
    if (typeof var_args === "number" || var_args instanceof Number) {
        message = '[Errno ' + String(1) + '] ' + fragment;
    }
    else if (typeof var_args === "string" || var_args instanceof String) {
        message = fragment;
    }
    else {
        throw new NotImplementedError();
    }
    IOError.__super__.constructor.apply(this, [message]);
    this.name = 'IOError';
};
inherits(IOError, Error);

/**
 * StopIteration
 * @param {string=} message .
 * @constructor
 * @extends {Error}
 */
var StopIteration = function(message) {
   StopIteration.__super__.constructor.apply(this, [message]);
   this.name = 'StopIteration';
};
inherits(StopIteration, Error);

/*
 * Be based on Python statement.
 */

/**
 * @param {boolean} value .
 * @param {string=} message .
 */
var assert = function(value, message) {
    if (!value) {
        message = message ? message : '';
        throw new AssertionError(message);
    }
};

/**
 * posixpath
 * @see Python posixpath modules.
 */
var posixpath = {};

/**
 * Returns the directory component of a pathname
 * @param {string} p .
 * @return {string} .
 */
posixpath.dirname = function(p) {
    var i = string.find(p, '/');
    return p.substr(0, i);
};

/**
 * StringIO
 * @see Python <a href='http://docs.python.org/library/stringio.html'>StringIO</
a> modules.
 */

/** @const */ var EINVAL = 22;

/**
 * @param {boolean} closed .
 */
function _complain_ifclosed(closed) {
    if (closed) {
        throw new ValueError('I/O operation on closed file');
    }
}
/**
 * StringIO is based on Python StringIO build-in modules.
 * @param {?string=} buf .
 * @constructor
 * @extends {Object}
 */
var StringIO = function(buf) {
    buf = buf ? buf : '';
    this.buf = buf;
    this.len = buf.length;
    this.buflist = [];
    this.pos = 0;
    this.closed = false;
    this.softspace = 0;
};
inherits(StringIO, Object);

/**
 * @return {StringIO} .
 */
StringIO.prototype.__iter__ = function() {
    return this;
};

/**
 * @return {string} read line.
 */
StringIO.prototype.next = function() {
    _complain_ifclosed(this.closed);
    var r = this.readline();
    if(!r) {
        throw new StopIteration();
        //return new StopIteration();
    }
    return r;
};
StringIO.prototype['next'] = StringIO.prototype.next;

/**
 * Free the memory buffer.
 */
StringIO.prototype.close = function() {
    if (!this.closed) {
        this.closed = true;
        delete this.buf;
        delete this.pos;
    }
};
StringIO.prototype['close'] = StringIO.prototype.close;

/**
 * Returns false because StringIO objects are not connected to a tty-like
 * device.
 * @return {boolean} .
 */
StringIO.prototype.isatty = function() {
    _complain_ifclosed(this.closed);
    return false;
};
StringIO.prototype['isatty'] = StringIO.prototype.isatty;

/**
 * Set the file's current position.
 * 
 * The mode argument is optional and defaults to 0 (absolute file
 * positioning); other values are 1 (seek relative to the current
 * position) and 2 (seek relative to the file's end).
 * There is no return value.
 * @param {number} pos .
 * @param {number} mode .
 */
StringIO.prototype.seek = function(pos, mode) {
    mode = mode ? mode : 0;
    _complain_ifclosed(this.closed);
    if (this.buflist) {
        this.buf += this.buflist.join('');
        this.buflist = [];
    }
    if (mode === 1) {
        pos += this.pos;
    }
    else if (mode === 2) {
        pos += this.len;
    }
    this.pos = buildin.max(0, pos);
};
StringIO.prototype['seek'] = StringIO.prototype.seek;

/**
 * Return the file's current position.
 * @param {number} pos .
 * @param {number} mode .
 * @return {number} .
 */
StringIO.prototype.tell = function(pos, mode) {
    mode = mode ? mode : 0;
    _complain_ifclosed(this.closed);
    return this.pos;
};
StringIO.prototype['tell'] = StringIO.prototype.tell;

/**
 * @param {number} n .
 * @return {string} r .
 */
StringIO.prototype.read = function(n) {
    n = n ? n : -1;
    _complain_ifclosed(this.closed);
    if(this.buflist) {
        this.buf += this.buflist.join('');
        this.buflist = [];
    }
    var newpos = null;
    if (n === null || n < 0) {
        newpos = this.len;
    }
    else {
        newpos = buildin.min(this.pos + n, this.len);
    }
    var r = this.buf.slice(this.pos, newpos);
    this.pos = newpos;
    return r;
};
StringIO.prototype['read'] = StringIO.prototype.read;

/**
 * @param {?number=} length .
 * @return {string} .
 */
StringIO.prototype.readline = function(length) {
    length = length ? length : null;
    _complain_ifclosed(this.closed);
    if (this.buflist) {
        this.buf += this.buflist.join('');
        this.buflist = [];
    }
    var i = string.find(this.buf, '\n', this.pos);
    var newpos = null;
    if (i < 0) {
        newpos = this.len;
    } else {
        newpos = i + 1;
    }
    if (!(length === null) && length > 0) {
        if ((this.pos + length) < newpos) {
            newpos = this.pos + length;
        }
    }
    var r = this.buf.slice(this.pos, newpos);
    this.pos = newpos;
    return r;
};
StringIO.prototype['readline'] = StringIO.prototype.readline;

/**
 * @param {number} sizehint .
 * @return {Array<string>} .
 */
StringIO.prototype.readlines = function(sizehint) {
    sizehint = sizehint ? sizehint : 0;
    var total = 0;
    var lines = [];
    var line = this.readline();
    while (line) {
        lines.push(line);
        total += line.length;
        if (0 < sizehint && sizehint <= total) {
            break;
        }
        line = this.readline();
    }
    return lines;
};
StringIO.prototype['readlines'] = StringIO.prototype.readlines;

/**
 * @param {?number=} size .
 */
StringIO.prototype.truncate = function(size) {
    size = size ? size : null;
    _complain_ifclosed(this.closed);
    if (size === null) {
        size = this.pos;
    }
    else if (size < 0) {
        throw new IOError(EINVAL, 'Negative size not allowed');
    }
    else if (size < this.pos) {
        this.pos = size;
    }
    this.buf = this.getvalue().slice(0, size);
    this.len = size;
};
StringIO.prototype['truncate'] = StringIO.prototype.truncate;

/**
 * @param {string} s .
 */
StringIO.prototype.write = function(s) {
    //Write a string to the file.
    //There is no return value.
    _complain_ifclosed(this.closed);
    if (s === '') {
        return;
    }
    var spos = this.pos;
    var slen = this.len;
    if (spos === slen) {
        this.buflist.push(s);
        this.len = this.pos = spos + s.length;
        return;
    }
    if (spos > slen) {
        var str;
        var len = spos - slen;
        for (var i = 0; i < len; ++i) {
            str += "\0";
        }
        this.buflist.push(str);
        slen = spos;
    }
    var newpos = spos + s.length;
    if (spos < slen) {
        if (this.buflist) {
            this.buf += this.buflist.join('');
        }
        this.buflist = [this.buf.substring(0, spos), s,
                        this.buf.substring(newpos, s.length)];
        this.buf = '';
        if (newpos > slen) {
            slen = newpos;
        }
    } else {
        this.buflist.push(s);
        slen = newpos;
    }
    this.len = slen;
    this.pos = newpos;
};
StringIO.prototype['write'] = StringIO.prototype.write;

/**
 * @param {Array|Object} iterable .
 */
StringIO.prototype.writelines = function(iterable) {
    for (var key in iterable) {
        var line = iterable[key];
        this.write(line);
    }
};
StringIO.prototype['writelines'] = StringIO.prototype.writelines;

/**
 * flush
 */
StringIO.prototype.flush = function() {
    _complain_ifclosed(this.closed);
};
StringIO.prototype['flush'] = StringIO.prototype.flush;

/**
 * @return {string} .
 */
StringIO.prototype.getvalue = function() {
    if (this.buflist) {
        this.buf += this.buflist.join('');
        this.buflist = [];
    }
    return this.buf;
};
StringIO.prototype['getvalue'] = StringIO.prototype.getvalue;

/**
 * Be based on Tornado template engine.
 * @see <a href='https://github.com/facebook/tornado/blob/master/tornado/template.py'>template.py</a>
 */

/*
A simple template system that compiles templates to JavaScript code.

Basic usage looks like::

    var t = new Template("<html>{{ myvalue }}</html>");
    console.log(t.generate({myvalue:"XXX"}));

We compile all templates to raw JavaScript. Error-reporting is currently... uh,
interesting. Syntax for the templates::

    ### base.html
    <html>
      <head>
        <title>{% block title %}Default title{% end %}</title>
      </head>
      <body>
        <ul>
          {% for (key in students) %}
            {% block student %}
              <li>{{ students[key].name }}</li>
            {% end %}
          {% end %}
        </ul>
      </body>
    </html>

    ### bold.html
    {% extends "base.html" %}

    {% block title %}A bolder title{% end %}

    {% block student %}
      <li><span style="bold">{{ students[key].name }}</span></li>
    {% end %}

Translating directly to JavaScript means you can apply functions to expressions
easily, like the escape() function in the examples above. You can pass
functions in to your template just like any other variable::

   ### JavaScript code
   function add(x, y) {
      return x + y;
   }
   template.generate({add:add});

   ### The template
   {{ add(1, 2) }}

We provide the functions escape() to all templates by default.
//NO SUPPORTED.
//url_escape(), json_encode(), and squeeze()

Syntax Reference
----------------

Template expressions are surrounded by double curly braces: ``{{ ... }}``.
The contents may be any python expression, which will be escaped according
to the current autoescape setting and inserted into the output.  Other
template directives use ``{% %}``.  These tags may be escaped as ``{{!``
and ``{%!`` if you need to include a literal ``{{`` or ``{%`` in the output.

``{% apply *function* %}...{% end %}``
    Applies a function to the output of all template code between ``apply``
    and ``end``::

        {% apply linkify %}{{name}} said: {{message}}{% end %}

//NO SUPPORTED.
``{% autoescape *function* %}``
    Sets the autoescape mode for the current file.  This does not affect
    other files, even those referenced by ``{% include %}``.  Note that
    autoescaping can also be configured globally, at the `Application`
    or `Loader`.::

        {% autoescape xhtml_escape %}
        {% autoescape None %}

``{% block *name* %}...{% end %}``
    Indicates a named, replaceable block for use with ``{% extends %}``.
    Blocks in the parent template will be replaced with the contents of
    the same-named block in a child template.::

        <!-- base.html -->
        <title>{% block title %}Default title{% end %}</title>

        <!-- mypage.html -->
        {% extends "base.html" %}
        {% block title %}My page title{% end %}

``{% comment ... %}``
    A comment which will be removed from the template output.  Note that
    there is no ``{% end %}`` tag; the comment goes from the word ``comment``
    to the closing ``%}`` tag.

``{% extends *filename* %}``
    Inherit from another template.  Templates that use ``extends`` should
    contain one or more ``block`` tags to replace content from the parent
    template.  Anything in the child template not contained in a ``block``
    tag will be ignored.  For an example, see the ``{% block %}`` tag.

``{% for (*var* in *expr*) %}...{% end %}``
    Same as the javascript ``for`` statement.  ``{% break %}`` and
    ``{% continue %}`` may be used inside the loop.

``{% if (*condition*) %}...{% else if (*condition*) %}...{% else %}...{% end %}``
    Conditional statement - outputs the first section whose condition is
    true.  (The ``else if`` and ``else`` sections are optional)

``{% include *filename* %}``
    Includes another template file.  The included file can see all the local
    variables as if it were copied directly to the point of the ``include``
    directive (the ``{% autoescape %}`` directive is an exception).
    Alternately, ``{% module Template(filename, **kwargs) %}`` may be used
    to include another template with an isolated namespace.

``{% raw *expr* %}``
    Outputs the result of the given expression without autoescaping.

``{% set var *x* = *y* %}``
    Sets a local variable.

``{% try %}...{% catch(e) %}...{% end %}``
    Same as the javascript ``try`` statement.

``{% while (*condition*) %}... {% end %}``
    Same as the javascript ``while`` statement. ``{% break %}`` and
    ``{% continue %}`` may be used inside the loop.

``{% whitespace *mode* %}``
    Sets the whitespace mode for the remainder of the current file
    (or until the next ``{% whitespace %}`` directive). See
    `filter_whitespace` for available options.
*/

/**
 * @type {*} .
 */
var escape_ = {};

/**
 * @type {Array.<string>}
 */
escape_['_XHTML_ESCAPE'] = ['&', '<', '>', '"'];

/**
 * @enum {string}
 */
escape_['_XHTML_ESCAPEDICT'] = {'&': '&amp;',
                                '<': '&lt;',
                                '>': '&gt;',
                                '"': '&quot;'};

/**
 * @param {string} value Target escape value.
 * @return {string} escaped value.
 */
escape_.xhtml_escape = function(value) {
    var match;
    var chr;
    var length = escape_['_XHTML_ESCAPE'].length;
    for (var i = 0; i < length; ++i) {
        chr = escape_['_XHTML_ESCAPE'][i];
        match = new RegExp(chr, 'g');
        value = value.replace(match, escape_['_XHTML_ESCAPEDICT'][chr]);
    }
    return value;
};

/**
 * @param {string} value Target escape value.
 * @return {string} escaped value.
 */
escape_.native_str = function(value) {
    //xxx
    return value;
};

/** @const */ var _DEFAULT_AUTOESCAPE = 'xhtml_escape';
var _UNSET = {};

/**
 * Transform whitespace in ``text`` according to ``mode``.
 *  Available modes are:
 *  * ``all``: Return all whitespace unmodified.
 *  * ``single``: Collapse consecutive whitespace with a single whitespace
 *    character, preserving newlines.
 *  * ``oneline``: Collapse all runs of whitespace into a single space
 *    character, removing all newlines in the process.
 * @param {string} mode .
 * @param {string} text .
 * @return {string} .
 */
var filter_whitespace = function(mode, text) {
    if (mode === 'all') {
        return text;
    } else if (mode === 'single') {
        text = text.replace(/([\t ]+)/g, ' ', text);
        text = text.replace(/(\s*\n\s*)/g, '\n', text);
        return text;
    } else if (mode === 'oneline') {
        text = text.replace(/(\s+)/g, ' ', text);
        return text;
    } else {
        throw new Error("invalid whitespace mode " + mode);
    }
};

/**
 * A compiled template.
 * We compile into Python from the given template_string. You can generate
 * the template from variables with generate().
 * @param {string} template_string .
 * @param {string=} name .
 * @param {BaseLoader=} loader .
 * @param {Object=} autoescape .
 * @param {?string=} whitespace .
 * @constructor
 * @extends {Object}
 */
var Template = function(template_string, name, loader, autoescape, whitespace) {
    name = name ? name : '<string>';
    loader = loader ? loader : null;
    autoescape = autoescape ? autoescape : _UNSET;
    whitespace = whitespace ? whitespace : null;
    this.name = name;
    if (!whitespace) {
        if(loader && loader.whitespace){
            whitespace = loader.whitespace;
        } else {
            // Whitespace defaults by filename.
            if (string.endswith(name, '.html') || string.endswith(name, '.js')) {
                whitespace = 'single';
            } else {
                whitespace = 'all';
            }
        }
    }
    // Validate the whitespace setting.
    filter_whitespace(whitespace, '');
    if (autoescape !== _UNSET) {
        this.autoescape = autoescape;
    } else if (loader) {
        this.autoescape = loader.autoescape;
    } else {
        this.autoescape = _DEFAULT_AUTOESCAPE;
    }
    this.namespace = loader ? loader.namespace : {};
    var reader = new _TemplateReader(name, escape_.native_str(template_string), whitespace);
    var parsed = _parse(reader, this);
    this.file = new _File(parsed);
    /** @type {string} */
    this.code = this._generate_js(loader);
    try {
        this.compiled = new Function(this.code);
    } catch (e) {
        console.error('code: ' + this.code);
        throw e;
    }
};
inherits(Template, Object);

/**
 * Generate this template with the given arguments.
 * @param {Object} kwargs .
 * @return {string} .
 */
Template.prototype.generate = function(kwargs) {
    kwargs = kwargs ? kwargs : {};
    var namespace = {
        'escape': escape_.xhtml_escape,
        'xhtml_escape': escape_.xhtml_escape,
        'macro_variables': function(obj){
            var buf = [];
            for(var key in obj){
                buf.push('var ' + key + ' = ' + 'namespace["' + key + '"];');
            }
            return buf.join("");
        },
    };
    for (var key in this.namespace) {
        namespace[key] = this.namespace[key];
    }
    for (var key in kwargs) {
        namespace[key] = kwargs[key];
    }
    namespace._execute = this.compiled();
    var execute = namespace._execute;
    try {
        return execute(namespace);
    } catch (x) {
        console.error(x);
        throw new Error(x);
    }
};
Template.prototype['generate'] = Template.prototype.generate;

/**
 * @param {BaseLoader} loader .
 * @return {string} .
 * @protected
 */
Template.prototype._generate_js = function(loader) {
    /** @type {StringIO} } */
    var buffer = new StringIO();
    // named_blocks maps from names to _NamedBlock objects
    var named_blocks = {};
    var ancestors = this._get_ancestors(loader);
    ancestors.reverse();
    for(var i = 0; i < ancestors.length; ++i){
        var ancestor = ancestors[i];
        ancestor.find_named_blocks(loader, named_blocks);
    }
    this.file.find_named_blocks(loader, named_blocks);
    var writer = new _CodeWriter(buffer, named_blocks, loader, this);
    ancestors[0].generate(writer);
    return buffer.getvalue();
};

/**
 * @param {BaseLoader} loader .
 * @return {Array} .
 * @protected
 */
Template.prototype._get_ancestors = function(loader) {
    var ancestors = [this.file];
    for (var key in this.file.body.chunks) {
        var chunk = this.file.body.chunks[key];
        if (chunk instanceof _ExtendsBlock) {
            if (!loader) {
                throw new ParseError('{% extends %} block found, but no' +
                                     ' template loader');
            }
            var template = loader.load(chunk.name, this.name);
            ancestors = ancestors.concat(template._get_ancestors(loader));
        }
    }
    return ancestors;
};

/**
 * Base class for template loaders.
 *
 * Creates a template loader.
 *
 * root_directory may be the empty string if this loader does not
 * use the filesystem.
 *
 * autoescape must be either None or a string naming a function
 * in the template namespace, such as "xhtml_escape".
 * @param {string} autoescape .
 * @param {Object} namespace .
 * @param {?string} whitespace .
 * @constructor
 * @extends {Object}
 */
var BaseLoader = function(autoescape, namespace, whitespace) {
    autoescape = autoescape ? autoescape : _DEFAULT_AUTOESCAPE;
    namespace = namespace ? namespace : null;
    whitespace = whitespace ? whitespace : null;
    this.autoescape = autoescape;
    this.namespace = namespace;
    this.whitespace = whitespace;
    this.templates = {};
};
inherits(BaseLoader, Object);

/**
 * Resets the cache of compiled templates.
 */
BaseLoader.prototype.rest = function() {
    this.templates = {};
};

/**
 * Converts a possibly-relative path to absolute (used internally).
 * @param {string} name .
 * @param {?string} parent_path .
 * @return {string} .
 */
BaseLoader.prototype.resolve_path = function(name, parent_path) {
    parent_path = parent_path ? parent_path : null;
    throw new NotImplementedError();
};

/**
 * Loads a template.
 * @param {string} name .
 * @param {?string=} parent_path .
 * @return {Template} .
 */
BaseLoader.prototype.load = function(name, parent_path) {
    parent_path = parent_path ? parent_path : null;
    name = this.resolve_path(name, parent_path);
    if (!object.get(this.templates, name)) {
        this.templates[name] = this._create_template(name);
    }
    return this.templates[name];
};

/**
 * @return {Template} .
 * @param {string} name .
 */
BaseLoader.prototype._create_template = function(name) {
    throw new NotImplementedError();
};

/**
 * A template loader that loads from a single root directory.
 *
 * You must use a template loader to use template constructs like
 * {% extends %} and {% include %}. Loader caches all templates after
 * they are loaded the first time.
 * @constructor
 * @extends {BaseLoader}
 */
var Loader = function() {
    throw new NotImplementedError();
};
inherits(Loader, BaseLoader);

/**
 * resolve path
 */
Loader.prototype.resolve_path = function() {
    throw new NotImplementedError();
};

/**
 * create template
 */
Loader.prototype._create_template = function() {
    throw new NotImplementedError();
};

/**
 * A template loader that loads from a dictionary.
 * @param {Object} dict .
 * @constructor
 * @extends {BaseLoader}
 */
var DictLoader = function(dict) {
    DictLoader.__super__.constructor.apply(this, Array.prototype.slice.call(arguments, 1));
    this.dict = dict;
};
inherits(DictLoader, BaseLoader);

/**
 * @param {string} name .
 * @param {?string} parent_path .
 * @return {string} name.
 */
DictLoader.prototype.resolve_path = function(name, parent_path) {
    parent_path = parent_path ? parent_path : null;
    if (parent_path &&
        !string.startwith(parent_path, '<') &&
        !string.startwith(parent_path, '/') &&
        !string.startwith(name, '/')) {
        //TODO: xxx
        //var file_dir = posixpath.dirname(parent_path);
        //name = posixpath.normpath(posixpath.join(file_dir, name));
    }
    return name;
};

/**
 * @param {string} name .
 * @return {Template} .
 * @override
 */
DictLoader.prototype._create_template = function(name) {
    return new Template(this.dict[name], name, this);
};

/**
 * @constructor
 */
var _Node = function() {};
inherits(_Node, Object);

/**
 * @return {Array} .
 */
_Node.prototype.each_child = function() {
    return [];
};

/**
 * @param {_CodeWriter} writer .
 */
_Node.prototype.generate = function(writer) {
    throw new NotImplementedError();
};

/**
 * @param {BaseLoader} loader .
 * @param {Object} named_blocks .
 */
_Node.prototype.find_named_blocks = function(loader, named_blocks) {
    var children = this.each_child();
    for(var i = 0; i < children.length; ++i){
        var child = children[i];
        child.find_named_blocks(loader, named_blocks);
    }
};
_Node.prototype['find_named_blocks'] = _Node.prototype.find_named_blocks;

/**
 * @param {_ChunkList} body .
 * @constructor
 * @extends {_Node}
 */
var _File = function(body) {
    this.body = body;
    this.line = 0;
};
inherits(_File, _Node);

/**
 * @param {_CodeWriter} writer .
 * @override
 */
_File.prototype.generate = function(writer) {
    writer.write_line('return function(namespace){', this.line);
    statement.with_stmt(writer.indent(), function(){
        writer.write_line('eval(namespace.macro_variables(namespace));', this.line); //TODO: suggest that not use eval.
        writer.write_line('return function(){', this.line);
        statement.with_stmt(writer.indent(), function(){
            writer.write_line('var _buffer = [];', this.line);
            this.body.generate(writer);
            writer.write_line('return _buffer.join("");', this.line);
        }.bind(this));
        writer.write_line('}();', this.line);
    }.bind(this));
    writer.write_line('};', this.line);
};

/**
 * @return {Array.<_ChunkList>} .
 * @override
 */
_File.prototype.each_child = function() {
    return [this.body];
};

/**
 * @param {Array} chunks .
 * @constructor
 * @extends {_Node}
 */
var _ChunkList = function(chunks) {
    this.chunks = chunks;
};
inherits(_ChunkList, _Node);

/**
 * @param {_CodeWriter} writer .
 * @override
 */
_ChunkList.prototype.generate = function(writer) {
    var chunks = this.chunks;
    var len = chunks.length;
    for (var i = 0; i < len; ++i) {
        chunks[i].generate(writer);
    }
};

/**
 * @return {Array} .
 * @override
 */
_ChunkList.prototype.each_child = function() {
    return this.chunks;
};

/**
 * @param {string} name .
 * @param {_ChunkList} body .
 * @param {Template} template .
 * @param {number} line .
 * @constructor
 * @extends {_Node}
 */
var _NamedBlock = function(name, body, template, line) {
    this.name = name;
    this.body = body;
    this.template = template;
    this.line = line;
};
inherits(_NamedBlock, _Node);

/**
 * @return {Array.<string>} .
 * @override
 */
_NamedBlock.prototype.each_child = function() {
    return [this.body];
};

/**
 * @param {_CodeWriter} writer .
 * @override
 */
_NamedBlock.prototype.generate = function(writer) {
    var block = writer.named_blocks[this.name];
    var old = writer.current_template;
    writer.current_template = block.template;
    block.body.generate(writer);
    writer.current_template = old;
};

/**
 * @param {BaseLoader} loader .
 * @param {Object} named_blocks .
 */
_NamedBlock.prototype.find_named_blocks = function(loader, named_blocks) {
    named_blocks[this.name] = this;
    _NamedBlock.__super__['find_named_blocks'].apply(this, [loader, named_blocks]);
};
_NamedBlock.prototype['find_named_blocks'] = _NamedBlock.prototype.find_named_blocks;

/**
 * @param {string} name .
 * @constructor
 * @extends {_Node}
 */
var _ExtendsBlock = function(name) {
    this.name = name;
};
inherits(_ExtendsBlock, _Node);

/**
 * @param {string} name .
 * @param {_TemplateReader} reader .
 * @param {number} line .
 * @constructor
 * @extends {_Node}
 */
var _IncludeBlock = function(name, reader, line) {
    this.name = name;
    this.template_name = reader.name;
    this.line = line;
};
inherits(_IncludeBlock, _Node);

/**
 * @param {BaseLoader} loader .
 * @param {Object} named_blocks .
 */
_IncludeBlock.prototype.find_named_blocks = function(loader, named_blocks) {
    var included = loader.load(this.name, this.template_name);
    included.file.find_named_blocks(loader, named_blocks);
};

/**
 * @param {_CodeWriter} writer .
 */
_IncludeBlock.prototype.generate = function(writer) {
    var included = writer.loader.load(this.name, this.template_name);
    var old = writer.current_template;
    writer.current_template = included;
    included.file.body.generate(writer);
    writer.current_template = old;
};

/**
 * @param {string} method .
 * @param {number} line .
 * @param {_ChunkList} body .
 * @constructor
 * @extends {_Node}
 */
var _ApplyBlock = function(method, line, body) {
    body = body ? body : null;
    this.method = method;
    this.line = line;
    this.body = body;
};
inherits(_ApplyBlock, _Node);

/**
 * @param {_CodeWriter} writer .
 * @override
 */
_ApplyBlock.prototype.generate = function(writer) {
    var method_name = '_apply' + writer.apply_counter;
    writer.apply_counter += 1;
    writer.write_line('function ' + method_name + '(){', this.line);
    statement.with_stmt(writer.indent(), function(){
        writer.write_line('var _buffer = [];', this.line);
        this.body.generate(writer);
        writer.write_line('return _buffer.join("");', this.line);
    }.bind(this));
    writer.write_line('}', this.line);
    writer.write_line('_buffer.push(' + this.method + '(' + method_name + '()));' , this.line);
};

/**
 * @return {Array.<_ChunkList>} .
 * @override
 */
_ApplyBlock.prototype.each_child = function() {
    return [this.body];
};

/**
 * @param {string} statement .
 * @param {number} line .
 * @param {_ChunkList} body .
 * @constructor
 * @extends {_Node}
 */
var _ControlBlock = function(statement, line, body) {
    this.statement = statement;
    this.line = line;
    this.body = body;
};
inherits(_ControlBlock, _Node);

/**
 * @return {Array.<_ChunkList>} .
 * @override
 */
_ControlBlock.prototype.each_child = function() {
    return [this.body];
};

/**
 * @param {_CodeWriter} writer .
 * @override
 */
_ControlBlock.prototype.generate = function(writer) {
    writer.write_line(this.statement, this.line);
    writer.write_line('{', this.line);
    statement.with_stmt(writer.indent(), function(){
        this.body.generate(writer);
    }.bind(this));
    writer.write_line('}', this.line);
};

/**
 * @param {string} statement .
 * @param {number} line .
 * @constructor
 * @extends {_Node}
 */
var _IntermediateControlBlock = function(statement, line) {
    this.statement = statement;
    this.line = line;
};
inherits(_IntermediateControlBlock, _Node);

/**
 * @param {_CodeWriter} writer .
 * @override
 */
_IntermediateControlBlock.prototype.generate = function(writer) {
    writer.write_line('}' + this.statement + '{', this.line);
};

/**
 * @param {string} statement .
 * @param {number} line .
 * @constructor
 * @extends {_Node}
 */
var _Statement = function(statement, line) {
    this.statement = statement;
    this.line = line;
};
inherits(_Statement, _Node);

/**
 * @param {_CodeWriter} writer .
 * @override
 */
_Statement.prototype.generate = function(writer) {
    writer.write_line(this.statement, this.line);
};

/**
 * @param {string} expression .
 * @param {number} line .
 * @param {?boolean=} raw .
 * @constructor
 * @extends {_Node}
 */
var _Expression = function(expression, line, raw) {
    raw = raw ? raw : false;
    this.expression = expression;
    this.line = line;
    this.raw = raw;
};
inherits(_Expression, _Node);

/**
 * @param {_CodeWriter} writer .
 * @override
 */
_Expression.prototype.generate = function(writer) {
    writer.write_line('var _tmp = ' + this.expression + ';', this.line);
    if(!this.raw && (writer.current_template.autoescape != null)) {
        writer.write_line('_tmp = ' + writer.current_template.autoescape + '(String(_tmp));', this.line);
    }
    writer.write_line('_buffer.push(_tmp);', this.line);
};

/**
 * @param {string} value .
 * @param {number} line .
 * @param {string} whitespace .
 * @constructor
 * @extends {_Node}
 */
var _Text = function(value, line, whitespace) {
    this.value = value;
    this.line = line;
    this.whitespace = whitespace;
};
inherits(_Text, _Node);

/**
 * @param {_CodeWriter} writer .
 * @override
 */
_Text.prototype.generate = function(writer) {
    var value = this.value;
    // Compress lots of white space to a single character. If the whitespace
    // breaks a line, have it continue to break a line, but just with a
    // single \n character
    if (!(string.contains(value, '<pre>'))) {
        value = filter_whitespace(this.whitespace, value);
    }
    //JavaScript specific implements.
    if (string.contains(value, '\n')) {
        value = value.replace(/(\n)/g, '\\n', value);
    }
    if (string.contains(value, '"')) {
        value = value.replace(/(")/g, '\\"', value);
    }
    if (value) {
        writer.write_line('_buffer.push("' + value + '");', this.line);
    }
};

/**
 * Raised for template syntax errors.
 * @param {string} message .
 * @param {?string=} filename .
 * @param {?number=} lineno .
 * @constructor
 * @extends {Error}
 */
var ParseError = function(message, filename, lineno) {
    filename = filename ? filename : null;
    lineno = lineno ? lineno : null;
    ParseError.__super__.constructor.apply(this, [message]);
    this.name = 'ParseError';
    this.message = message || '';
    this.filename = filename;
    this.lineno = lineno;
};
inherits(ParseError, Error);

/**
 * @return {string} .
 */
ParseError.prototype.toString = function(){
    return this.message + " at " + this.filename + ":" + this.lineno;
};

/**
 * @param {StringIO} file .
 * @param {Object} named_blocks .
 * @param {BaseLoader} loader .
 * @param {Template} current_template .
 * @constructor
 * @extends {Object}
 */
var _CodeWriter = function(file, named_blocks, loader, current_template) {
    this.file = file;
    this.named_blocks = named_blocks;
    this.loader = loader;
    this.current_template = current_template;
    this.apply_counter = 0;
    this._indent = 0;
};
inherits(_CodeWriter, Object);

/**
 * @return {number} indent .
 */
_CodeWriter.prototype.indent_size = function(){
    return this._indent;
};

/**
 * @return {IWithItem} .
 */
_CodeWriter.prototype.indent = function(){
    /**
     * @constructor
     * @implements {IWithItem}
     */
    var Indenter = function(){};
    Indenter.prototype.__enter__ = function(){
        this._indent += 1;
        return this;
    }.bind(this);
    Indenter.prototype.__exit__ = function(){
        assert(this._indent > 0);
        this._indent -= 1;
    }.bind(this);
    return new Indenter();
};

/**
 * @param {string} line .
 * @param {number} line_number .
 * @param {?number=} indent .
 */
_CodeWriter.prototype.write_line = function(line, line_number, indent) {
    indent = indent ? indent : null;
    if(indent == null){
        indent = this._indent;
    }
    var line_comment = ' // ' + this.current_template.name + ':' + line_number;
    this.file.write(string.__mul__('\t', indent) + line + line_comment + '\n');
};

/**
 * @param {string} name Name.
 * @param {string} text Text.
 * @param {string} whitespace .
 * @constructor
 * @extends {Object}
 */
var _TemplateReader = function(name, text, whitespace) {
    this.name = name;
    this.text = text;
    this.whitespace = whitespace;
    this.line = 1;
    this.pos = 0;
};
inherits(_TemplateReader, Object);

/**
 * @param {string} needle .
 * @param {?number=} start .
 * @param {?number=} end .
 * @return {number} index.
 */
_TemplateReader.prototype.find = function(needle, start, end) {
    start = start ? start : 0;
    end = end ? end : null;
    assert(start >= 0);
    var pos = this.pos;
    start += pos;
    var index;
    if (end === null) {
        index = string.find(this.text, needle, start, end);
    } else {
        end += pos;
        assert(end >= start);
        index = string.find(this.text, needle, start, end);
    }
    if (index !== -1) {
        index -= pos;
    }
    return index;
};

/**
 * @param {?number=} count .
 * @return {string} .
 */
_TemplateReader.prototype.consume = function(count) {
    count = count ? count : null;
    if (count === null) {
        count = this.text.length - this.pos;
    }
    var newpos = this.pos + count;
    this.line += string.count(this.text, '\n', this.pos, newpos);
    var s = this.text.substring(this.pos, newpos);
    this.pos = newpos;
    return s;
};

/**
 * @return {number} .
 */
_TemplateReader.prototype.remaining = function() {
    return this.text.length - this.pos;
};

/**
 * @return {number} .
 */
_TemplateReader.prototype.__len__ = function() {
    return this.remaining();
};

/**
 * @param {number} key .
 * @return {string} char.
 */
_TemplateReader.prototype.__getitem__ = function(key) {
    var chr = null;
    if (key < 0) {
        chr = this.text.charAt(key);
    }
    else {
        chr = this.text.charAt(this.pos + key);
    }
    return chr;
};

/**
 * __str__
 */
_TemplateReader.prototype.__str__ = function() {
    throw new NotImplementedError('xxx: __str__');
};

/**
 * @param {string} msg .
 */
_TemplateReader.prototype.raise_parse_error = function(msg) {
    throw new ParseError(msg, this.name, this.line);
};

/**
 * @param {_TemplateReader} reader .
 * @param {Template} template .
 * @param {?string=} in_block .
 * @param {?string=} in_loop .
 * @return {_ChunkList} body.
 */
var _parse = function(reader, template, in_block, in_loop) {
    in_block = in_block ? in_block : null;
    in_loop = in_loop ? in_loop : null;
    var body = new _ChunkList([]);
    while (true) {
        // Find next template directive
        var curly = 0;
        var contents;
        var end;
        var block;
        while (true) {
            curly = reader.find('{', curly);
            if (curly === -1 || curly + 1 === reader.remaining()) {
                // EOF
                if (in_block) {
                    reader.raise_parse_error('Missing {%% end %%} block for ' + in_block);
                }
                body.chunks.push(new _Text(reader.consume(), reader.line, reader.whitespace));
                return body;
            }
            // If the first curly brace is not the start of a special token,
            // start searching from the character after it
            if (!array.contains(['{', '%', '#'], reader.__getitem__(curly + 1))) {
                curly += 1;
                continue;
            }
            // When there are more than 2 curlies in a row, use the
            // innermost ones.  This is useful when generating languages
            // like latex where curlies are also meaningful
            if (curly + 2 < reader.remaining() &&
                reader.__getitem__(curly + 1) === '{' &&
                reader.__getitem__(curly + 2) === '{') {
                curly += 1;
                continue;
            }
            break;
        }
        // Append any text before the special token
        if (curly > 0) {
            body.chunks.push(new _Text(reader.consume(curly), reader.line, reader.whitespace));
        }
        var start_brace = reader.consume(2);
        var line = reader.line;
        // Template directives may be escaped as "{{!" or "{%!".
        // In this case output the braces and consume the "!".
        // This is especially useful in conjunction with jquery templates,
        // which also use double braces.
        if (reader.remaining() && reader.__getitem__(0) === '!') {
            reader.consume(1);
            body.chunks.push(new _Text(start_brace, line, reader.whitespace));
            continue;
        }
        // Comment
        if (start_brace === '{#') {
            end = reader.find('#}');
            if (end === -1) {
                reader.raise_parse_error('Missing end comment on line ' + String(line));
            }
            contents = string.strip(reader.consume(end));
            reader.consume(2);
            continue;
        }
        // Expression
        if (start_brace === '{{') {
            end = reader.find('}}');
            if (end === -1 || reader.find('\n', 0, end) !== -1) {
                reader.raise_parse_error('Missing end expression }} on line ' + String(line));
            }
            contents = string.strip(reader.consume(end));
            reader.consume(2);
            if (!contents) {
                reader.raise_parse_error('Empty expression on line ' + String(line));
            }
            body.chunks.push(new _Expression(contents, line));
            continue;
        }
        // Block
        assert(start_brace == '{%', start_brace);
        end = reader.find('%}');
        if (end === -1 || reader.find('\n', 0, end) !== -1) {
            reader.raise_parse_error('Missing end block %%} on line ' + line);
        }
        contents = string.strip(reader.consume(end));
        reader.consume(2);
        if (contents === '') {
            reader.raise_parse_error('Empty block tag ({%% %%}) on line ' + line);
        }
        var partition = contents.split(' ');
        var operator = partition.shift();
        var suffix = partition.join(' ');
        // Intermediate ('else', 'elif', etc) blocks
        var intermediate_blocks = {
            'else': ['if'],
            'catch(e)': ['try'],
        };
        var allowed_parents = object.get(intermediate_blocks, operator);
        if (allowed_parents !== null) {
            if (!in_block) {
                reader.raise_parse_error(operator + ' outside ' + allowed_parents + ' block');
            }
            if (allowed_parents instanceof Array && !array.contains(allowed_parents, in_block)) {
                reader.raise_parse_error(operator +' block cannot be attached to ' + in_block + 'block');
            }
            body.chunks.push(new _IntermediateControlBlock(contents, line));
            continue;
        // End tag
        } else if (operator === 'end') {
            if (!in_block) {
                reader.raise_parse_error('Extra {%% end %%} block on line ' + line);
            }
            return body;
        } else if (array.contains([
            'extends',
            'include',
            'set',
            'comment',
            'autoescape',
            'whitespace',
            'raw',
        ], operator)) {
            if (operator === 'comment') {
                continue;
            }
            if (operator === 'extends') {
                suffix = suffix.replace(/[\"\']/g, ''); //TODO: xxx
                if (!suffix) {
                    reader.raise_parse_error('extends missing file path on line ' +line);
                }
                block = new _ExtendsBlock(suffix);
            }
            else if (operator === 'include') {
                suffix = suffix.replace(/[\"\']/g, ''); //TODO: xxx
                if (!suffix) {
                    reader.raise_parse_error('include missing file path on line ' + line);
                }
                block = new _IncludeBlock(suffix, reader, line);
            }
            else if (operator === 'set') {
                if (!suffix) {
                    reader.raise_parse_error('set missing statement on line ' + line);
                }
                block = new _Statement(suffix, line);
            }
            else if (operator === 'autoescape') {
                var fn = string.strip(suffix);
                if (fn === 'null') {
                    fn = null;
                }
                template.autoescape = fn;
                continue;
            }
            else if (operator === 'whitespace') {
                var mode = string.strip(suffix);
                // Validate the selected mode
                filter_whitespace(mode, '');
                reader.whitespace = mode;
                continue;
            }
            else if (operator === 'raw') {
                block = new _Expression(suffix, line, true);
            }
            body.chunks.push(block);
            continue;
        } else if (array.contains(['apply', 'block', 'try', 'if', 'for', 'while'], operator)) {
            // parse inner body recursively
            var block_body;
            if (array.contains(['for', 'while'], operator)) {
                block_body = _parse(reader, template, operator, operator);
            } else if (operator === 'apply') {
                // apply creates a nested function so syntactically it's not
                // in the loop.
                block_body = _parse(reader, template, operator, null);
            } else {
                block_body = _parse(reader, template, operator, in_loop);
            }
            if (operator === 'apply') {
                if (!suffix) {
                    reader.raise_parse_error('apply missing method name on line ' + line);
                }
                block = new _ApplyBlock(suffix, line, block_body);
            } else if (operator === 'block') {
                if (!suffix) {
                    reader.raise_parse_error('block missing name on line ' + line);
                }
                block = new _NamedBlock(suffix, block_body, template, line);
            } else {
                block = new _ControlBlock(contents, line, block_body);
            }
            body.chunks.push(block);
            continue;
        } else if (array.contains(['break', 'continue'], operator)) {
            if (!in_loop) {
                reader.raise_parse_error(operator + ' outside ["for", "while"] block');
            }
            body.chunks.push(new _Statement(contents, line));
            continue;
        } else {
            reader.raise_parse_error('unknown operator: ' + operator);
        }
    }
};
