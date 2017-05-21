/**
 * Original code is here.
 * https://raw.githubusercontent.com/rokujyouhitoma/js-templateengine/develop/src/template/template.js
 */

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

/**
 * @param {!Object} self Should always be "this".
 * @param {*=} opt_methodName The method name if calling a super method.
 * @param {...*} var_args The rest of the arguments.
 * @return {*} The return value of the superclass method.
 */
function base(self, opt_methodName, var_args) {
    var caller = arguments.callee.caller;
    if (caller.__super__) {
        return caller.__super__.constructor.apply(
            self, Array.prototype.slice.call(arguments, 1));
    }
    var args = Array.prototype.slice.call(arguments, 2);
    var foundCaller = false;
    for (var ctor = self.constructor; ctor; ctor = ctor.__super__ &&
         ctor.__super__.constructor) {
        if (ctor.prototype[opt_methodName] === caller) {
            foundCaller = true;
        } else if (foundCaller) {
            return ctor.prototype[opt_methodName].apply(self, args);
        }
    }
    if (self[opt_methodName] === caller) {
        return self.constructor.prototype[opt_methodName].apply(self, args);
    } else {
        throw new Error('base called from a method of one name to a method of' +
                        ' a different name');
    }
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
 * @param {string} value .
 * @return {boolean} .
 */
array.contains = function(arr, value) {
    var i = 0;
    var length = arr.length;
    for (; i < length; ++i) {
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
    if (result === -1) {
        return false;
    }
    else if (result > -1) {
        return true;
    }
    else {
        throw new Error('string.contains: ' + result);
    }
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
    if (str.search(parttern) === 0) {
        return true;
    }
    else {
        return false;
    }
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
        var i;
        var len = spos - slen;
        for (i = 0; i < len; i++) {
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
    var key;
    var line;
    for (key in iterable) {
        line = iterable[key];
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

//NOTICE: NO SUPPORTED.
//Loader is a class that loads templates from a root directory and caches
//the compiled templates::
//
//    var loader = template.Loader("/home/btaylor")
//    console.log(loader.load("test.html").generate({myvalue:"XXX"}));

We compile all templates to raw JavaScript. Error-reporting is currently... uh,
interesting. Syntax for the templates::

    ### base.html
    <html>
      <head>
        <title>{% block title %}Default title{% end %}</title>
      </head>
      <body>
        <ul>
          {% for key in students %}
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
      <li><span style="bold">{{ student.name }}</span></li>
    {% end %}

Unlike most other template systems, we do not put any restrictions on the
expressions you can include in your statements. if and for blocks get
translated exactly into Python, you can do complex expressions like::

   {% for student in [p for p in people if p.student and p.age > 23] %}
     <li>{{ escape(student.name) }}</li>
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

//NO SUPPORTED.
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

//SUPPORTED.
``{% block *name* %}...{% end %}``
    Indicates a named, replaceable block for use with ``{% extends %}``.
    Blocks in the parent template will be replaced with the contents of
    the same-named block in a child template.::

        <!-- base.html -->
        <title>{% block title %}Default title{% end %}</title>

        <!-- mypage.html -->
        {% extends "base.html" %}
        {% block title %}My page title{% end %}

//NO SUPPORTED.
``{% comment ... %}``
    A comment which will be removed from the template output.  Note that
    there is no ``{% end %}`` tag; the comment goes from the word ``comment``
    to the closing ``%}`` tag.

//SUPPORTED.
``{% extends *filename* %}``
    Inherit from another template.  Templates that use ``extends`` should
    contain one or more ``block`` tags to replace content from the parent
    template.  Anything in the child template not contained in a ``block``
    tag will be ignored.  For an example, see the ``{% block %}`` tag.

//NO SUPPORTED.
``{% for *var* in *expr* %}...{% end %}``
    Same as the python ``for`` statement.

//DEPRECATED
``{% from *x* import *y* %}``
    Same as the python ``import`` statement.

//SUPPORTED.
``{% if *condition* %}...{% elif *condition* %}...{% else %}...{% end %}``
    Conditional statement - outputs the first section whose condition is
    true.  (The ``elif`` and ``else`` sections are optional)

//DEPRECATED
``{% import *module* %}``
    Same as the python ``import`` statement.

//SUPPORTED.
``{% include *filename* %}``
    Includes another template file.  The included file can see all the local
    variables as if it were copied directly to the point of the ``include``
    directive (the ``{% autoescape %}`` directive is an exception).
    Alternately, ``{% module Template(filename, **kwargs) %}`` may be used
    to include another template with an isolated namespace.

//DEPRECATED
``{% module *expr* %}``
    Renders a `~tornado.web.UIModule`.  The output of the ``UIModule`` is
    not escaped::

        {% module Template("foo.html", arg=42) %}

//NO SUPPORTED
``{% raw *expr* %}``
    Outputs the result of the given expression without autoescaping.

//NO SUPPORTED
``{% set *x* = *y* %}``
    Sets a local variable.

//NO SUPPORTED
``{% try %}...{% except %}...{% finally %}...{% end %}``
    Same as the python ``try`` statement.

//NO SUPPORTED
``{% while *condition* %}... {% end %}``
    Same as the python ``while`` statement.
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
    var i = 0;
    var length = escape_['_XHTML_ESCAPE'].length;
    for (;i < length; ++i) {
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
//var _UNSET = new Object();
var _UNSET = {};

/**
 * A compiled template.
 * We compile into Python from the given template_string. You can generate
 * the template from variables with generate().
 * @param {string} template_string .
 * @param {string} name .
 * @param {?BaseLoader=} loader .
 * @param {?boolean=} compress_whitespace .
 * @param {?Object=} autoescape .
 * @constructor
 * @extends {Object}
 */
var Template = function(template_string, name, loader, compress_whitespace,
                        autoescape) {
    name = name ? name : '<string>';
    loader = loader ? loader : null;
    compress_whitespace = compress_whitespace ? compress_whitespace : null;
    autoescape = autoescape ? autoescape : _UNSET;

    this.name = name;
    if (compress_whitespace === null) {
        compress_whitespace = string.endswith(name, '.html') ||
            string.endswith(name, '.js');
    }
    if (autoescape !== _UNSET) {
        this.autoescape = autoescape;
    } else if (loader) {
        this.autoescape = loader.autoescape;
    } else {
        this.autoescape = _DEFAULT_AUTOESCAPE;
    }
    this.namespace = loader ? loader.namespace : {};
    var reader = new _TemplateReader(name, escape_.native_str(template_string));
    this.file = new _File(_parse(reader, this));

    /**
     * @type {string}
     */
    this.code = this._generate_js(loader, compress_whitespace);

    /**
     * @type {string}
     */
    var startFragment = 'return function(namespace) {for(var key in namespace) {this[key] = namespace[key];}';

    /**
     * @type {string}
     */
    var endFragment = '};';
    this.code = startFragment + this.code + endFragment;

    try {
        this.compiled = new Function(this.code);
    } catch (e) {
        console.log('code: ' + this.code);
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
        'xhtml_escape': escape_.xhtml_escape
    };

    var key;
    for (key in this.namespace) {
        namespace[key] = this.namespace[key];
    }

    for (key in kwargs) {
        namespace[key] = kwargs[key];
    }

    //namespace['_execute'] = this.compiled();
    //var execute = namespace['_execute'];
    namespace._execute = this.compiled();
    var execute = namespace._execute;
    try {
        return execute(namespace);
    } catch (x) {
        console.log(x);
        throw new Error(x);
    }
};
Template.prototype['generate'] = Template.prototype.generate;

/**
 * @param {BaseLoader} loader .
 * @param {boolean} compress_whitespace .
 * @return {string} .
 * @protected
 */
Template.prototype._generate_js = function(loader, compress_whitespace) {
    /** @type {StringIO} } */
    var buffer = new StringIO();
    // named_blocks maps from names to _NamedBlock objects
    var named_blocks = {};
    var ancestors = this._get_ancestors(loader);
    ancestors.reverse();
    var key;
    var ancestor;
    for(var i = 0; i < ancestors.length; i++){
        ancestor = ancestors[i];
        ancestor.find_named_blocks(loader, named_blocks);
    }
    this.file.find_named_blocks(loader, named_blocks);
    var writer = new _CodeWriter(buffer, named_blocks, loader, this, compress_whitespace);
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
    var key;
    var chunk;
    for (key in this.file.body.chunks) {
        chunk = this.file.body.chunks[key];
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
 * @param {string} autoescape .
 * @param {Object} namespace .
 * @constructor
 * @extends {Object}
 */
var BaseLoader = function(autoescape, namespace) {
    //Creates a template loader.
    //
    //root_directory may be the empty string if this loader does not
    //use the filesystem.
    //
    //autoescape must be either None or a string naming a function
    //in the template namespace, such as "xhtml_escape".
    autoescape = autoescape ? autoescape : _DEFAULT_AUTOESCAPE;
    namespace = namespace ? namespace : null;

    this.autoescape = autoescape;
    this.namespace = namespace;
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
 * @param {?string} parent_path .
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
    //TODO: xxx
    throw new NotImplementedError();
};
inherits(Loader, BaseLoader);

/**
 * resolve path
 */
Loader.prototype.resolve_path = function() {
    //TODO: xxx
    throw new NotImplementedError();
};

/**
 * create template
 */
Loader.prototype._create_template = function() {
    //TODO: xxx
    throw new NotImplementedError();
};

/**
 * A template loader that loads from a dictionary.
 * @param {Object} dict .
 * @constructor
 * @extends {BaseLoader}
 */
var DictLoader = function(dict) {
    DictLoader.__super__.constructor.apply(this);
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
    var key;
    var children = this.each_child();
    for(var i = 0; i < children.length; i++){
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
};
inherits(_File, _Node);

/**
 * @param {_CodeWriter} writer .
 * @override
 */
_File.prototype.generate = function(writer) {
    writer.write_line('_buffer = [];');
    this.body.generate(writer);
    writer.write_line('return _buffer.join("");');
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
    var i = 0;
    var chunks = this.chunks;
    var len = chunks.length;
    for (; i < len; ++i) {
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
 * @constructor
 * @extends {_Node}
 */
var _NamedBlock = function(name, body, template) {
    this.name = name;
    this.body = body;
    this.template = template;
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
//    base(this, 'find_named_blocks', loader, named_blocks);
    _NamedBlock.__super__['find_named_blocks'].apply(this, [loader, named_blocks])
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
 * @constructor
 * @extends {_Node}
 */
var _IncludeBlock = function(name, reader) {
    this.name = name;
    this.template_name = reader.name;
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
 * @param {_ChunkList} body .
 * @constructor
 * @extends {_Node}
 */
var _ApplyBlock = function(method, body) {
    body = body ? body : null;

    this.method = method;
    this.body = body;

    throw new NotImplementedError();
};
inherits(_ApplyBlock, _Node);

/**
 * @param {string} statement .
 * @param {_ChunkList} body .
 * @constructor
 * @extends {_Node}
 */
var _ControlBlock = function(statement, body) {
    this.statement = statement;
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
    writer.write_line(this.statement);
    writer.write_line('{');
    this.body.generate(writer);
    writer.write_line('}');
};

/**
 * @param {string} statement .
 * @constructor
 * @extends {_Node}
 */
var _IntermediateControlBlock = function(statement) {
    this.statement = statement;
};
inherits(_IntermediateControlBlock, _Node);

/**
 * @param {_CodeWriter} writer .
 * @override
 */
_IntermediateControlBlock.prototype.generate = function(writer) {
    writer.write_line('}' + this.statement + '{');
};

/**
 * @param {string} statement .
 * @constructor
 * @extends {_Node}
 */
var _Statement = function(statement) {
    this.statement = statement;

    throw new NotImplementedError();
};
inherits(_Statement, _Node);

/**
 * @param {string} expression .
 * @param {?boolean=} row .
 * @constructor
 * @extends {_Node}
 */
var _Expression = function(expression, row) {
    row = row ? row : false;

    this.expression = expression;
    this.row = row;
};
inherits(_Expression, _Node);

/**
 * @param {_CodeWriter} writer .
 * @override
 */
_Expression.prototype.generate = function(writer) {
    writer.write_line('var _tmp = ' + this.expression + ';');
    writer.write_line('_buffer.push(_tmp);');
};

/**
 * @param {string} expression .
 * @constructor
 * @extends {_Expression}
 */
var _Module = function(expression) {
    throw new NotImplementedError();
};
inherits(_Module, _Expression);

/**
 * @param {string} value .
 * @constructor
 * @extends {_Node}
 */
var _Text = function(value) {
    this.value = value;
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
    if (writer.compress_whitespace && !(string.contains(value, '<pre>'))) {
        value = value.replace(/([\t ]+)/g, ' ', value);
        value = value.replace(/(\s*\n\s*)/g, '\n', value);
    }

    //JavaScript specific implements.
    if (string.contains(value, '\n')) {
        value = value.replace(/(\n)/g, '\\n', value);
    }
    if (string.contains(value, '"')) {
        value = value.replace(/(")/g, '\\"', value);
    }

    if (value) {
        writer.write_line('_buffer.push("' + value + '");');
    }
};

/**
 * @param {string} message .
 * @constructor
 * @extends {Error}
 */
var ParseError = function(message) {
    // Raised for template syntax errors.
    this.name = 'ParseError';
    this.message = message || '';
};
inherits(ParseError, Error);

/**
 * @param {StringIO} file .
 * @param {Object} named_blocks .
 * @param {BaseLoader} loader .
 * @param {Template} current_template .
 * @param {boolean} compress_whitespace .
 * @constructor
 * @extends {Object}
 */
var _CodeWriter = function(file, named_blocks, loader, current_template,
                           compress_whitespace) {
    this.file = file;
    this.named_blocks = named_blocks;
    this.loader = loader;
    this.current_template = current_template;
    this.compress_whitespace = compress_whitespace;
    this.apply_counter = 0;
};
inherits(_CodeWriter, Object);

/**
 * @param {string} line .
 */
_CodeWriter.prototype.write_line = function(line) {
    this.file.write(line + '\n');
};

/**
 * @param {string} name Name.
 * @param {string} text Text.
 * @constructor
 * @extends {Object}
 */
var _TemplateReader = function(name, text) {
    this.name = name;
    this.text = text;
    this.line = 0;
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
 * @param {string} code .
 */
function _format_code(code) {
    throw new NotImplementedError('xxx: _format_code');
}

/**
 * @param {_TemplateReader} reader .
 * @param {Template} template .
 * @param {?string=} in_block .
 * @return {_ChunkList} body.
 */
var _parse = function(reader, template, in_block) {
    in_block = in_block ? in_block : null;

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
                    throw new ParseError('Missing {%% end %%} block for ' +
                                         in_block);
                }
                body.chunks.push(new _Text(reader.consume()));
                return body;
            }

            // If the first curly brace is not the start of a special token,
            // start searching from the character after it
            if (!array.contains(['{', '%'], reader.__getitem__(curly + 1))) {
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
            body.chunks.push(new _Text(reader.consume(curly)));
        }

        var start_brace = reader.consume(2);
        var line = reader.line;

        // Template directives may be escaped as "{{!" or "{%!".
        // In this case output the braces and consume the "!".
        // This is especially useful in conjunction with jquery templates,
        // which also use double braces.
        if (reader.remaining() && reader.__getitem__(0) === '!') {
            reader.consume(1);
            body.chunks.push(new _Text(start_brace));
            continue;
        }

        // Expression
        if (start_brace === '{{') {
            end = reader.find('}}');
            if (end === -1 || reader.find('\n', 0, end) !== -1) {
                throw new ParseError('Missing end expression }} on line ' +
                                     String(line));
            }
            contents = string.strip(reader.consume(end));
            reader.consume(2);
            if (!contents) {
                throw new ParseError('Empty expression on line ' +
                                     String(line));
            }
            body.chunks.push(new _Expression(contents));
            continue;
        }

        // Block
        assert(start_brace == '{%', start_brace);
        end = reader.find('%}');
        if (end === -1 || reader.find('\n', 0, end) !== -1) {
            throw new ParseError('Missing end block %%} on line ' + line);
        }
        contents = string.strip(reader.consume(end));
        reader.consume(2);
        if (contents === '') {
            throw new ParseError('Empty block tag ({%% %%}) on line ' + line);
        }

        var partition = contents.split(' ');
        var operator = partition.shift();
        var suffix = partition.join('');
        //console.log('operator, suffix: ' + operator + ', ' + suffix);

        // Intermediate ('else', 'elif', etc) blocks
        var intermediate_blocks = {
            'else': ['if', 'for', 'while'],
            'elif': ['if'],
            'except': ['try'],
            'finally': ['try']
        };

        var allowed_parents = object.get(intermediate_blocks, operator);
        if (allowed_parents !== null) {
            if (!in_block) {
                throw new ParseError(operator + ' outside ' + allowed_parents +
                                     ' block');
            }
            if (allowed_parents instanceof Array && !array.contains(allowed_parents, in_block)) {
                throw new ParseError(operator +
                                     ' block cannot be attached to ' +
                                     in_block + 'block');
            }
            body.chunks.push(new _IntermediateControlBlock(contents));
            continue;

        // End tag
        } else if (operator === 'end') {
            if (!in_block) {
                throw new ParseError('Extra {%% end %%} block on line ' + line);
            }
            return body;

        } else if (array.contains(['extends', 'include', 'set', 'import', 'from',
                                 'comment', 'autoescape', 'raw', 'module'],
                                operator)) {
            if (operator === 'end') {
                continue;
            }
            if (operator === 'extends') {
                suffix = suffix.replace(/[\"\']/g, ''); //TODO: xxx
                if (!suffix) {
                    throw new ParseError('extends missing file path on line ' +line);
                }
                block = new _ExtendsBlock(suffix);
            }
            else if (array.contains(['import', 'from'], operator)) {
                throw new NotImplementedError('xxx: import or from');
            }
            else if (operator === 'include') {
                suffix = suffix.replace(/[\"\']/g, ''); //TODO: xxx
                if (!suffix) {
                    throw new ParseError('include missing file path on line ' +
                                         line);
                }
                block = new _IncludeBlock(suffix, reader);
            }
            else if (operator === 'set') {
                if (!suffix) {
                    throw new ParseError('set missing statement on line ' + line);
                }
                block = new _Statement(suffix);
            }
            else if (operator === 'autoescape') {
                throw new NotImplementedError('xxx: autoescape');
            }
            else if (operator === 'raw') {
                block = new _Expression(suffix, true);
            }
            else if (operator === 'module') {
                block = new _Module(suffix);
            }
            body.chunks.push(block);
            continue;
        } else if (array.contains(['apply', 'block', 'try', 'if', 'for', 'while'],
                                  operator)) {
            // parse inner body recursively
            var block_body = _parse(reader, template, operator);
            if (operator === 'apply') {
                if (!suffix) {
                    throw new ParseError('apply missing method name on line ' +
                                         line);
                }
                block = new _ApplyBlock(suffix, block_body);
            } else if (operator === 'block') {
                if (!suffix) {
                    throw new ParseError('block missing name on line ' + line);
                }
                block = new _NamedBlock(suffix, block_body, template);
            } else {
                block = new _ControlBlock(contents, block_body);
            }
            body.chunks.push(block);
            continue;
        } else {
            throw new ParseError('unknown operator: ' + operator);
        }
    }
};
