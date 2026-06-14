# [ADR-03] Tornado Template Engine JS Port

* **Date**: 2017-05-21 (Initial architecture), documented 2026-06-13
* **Status**: Accepted
* **Author**: Development Team

---

## Context

To display dynamic data (such as racing leaderboards, odds tables, and cards) in HTML without using bulky frameworks, we need a way to render templates containing logical loops and variables.

Writing manual DOM-generation code (e.g., `document.createElement`) or simple string concatenation (e.g., `str += '<div>' + val + '</div>'`) leads to hard-to-read, error-prone code. However, existing template engines (such as Mustache, Handlebars, or EJS) either add external bundle size or lack support for strict compile-time optimization.

We need a lightweight, fast, and dependency-free template parser that can run completely client-side in vanilla JS.

## Decision

We decided to port the Python template engine syntax from the **Tornado Web Server** into a small client-side JavaScript module (`template.js` / `templates.js`).

Key details:
- **Syntax Support**: Supports `&#123;&#123; variable &#125;&#125;`, `&#123;% if condition %&#125;`, `&#123;% for item in collection %&#125;`, and `&#123;% while condition %&#125;` syntax blocks.
- **Dynamic Compilation**: The parser uses regular expressions to scan the HTML template string and generate a JavaScript function string at runtime. This generated code is compiled using `new Function(...)`.
- **Fast Execution**: Once compiled, rendering the template is as fast as executing native JS string operations, since it directly runs the compiled function with variables passed as an argument scope.
- **Exclusion of server-side constructs**: Code references to server-only constructs like `import`, `from`, or `module` were purposefully stripped as they do not apply to client-side JS.

## Consequences

### Benefits (Pros):
- **High performance**: Re-rendering uses compiled JS functions, reducing templates to native string operations.
- **Clean separation**: HTML templates can be defined separately from JavaScript logic, keeping code readable.
- **No dependencies**: Zero added bytes in third-party library downloads.

### Trade-offs (Cons):
- **`new Function` Security Risk**: Standard templates compiled this way must not process unverified user inputs, as arbitrary JS expressions inside `&#123;&#123; ... &#125;&#125;` or `&#123;% ... %&#125;` are executed directly. (See [REQ-03-system_requirements.md](../REQ-03-system_requirements.md) for mitigation details).
- **Hard Debugging**: Syntax errors in templates compile to dynamic functions, making it difficult to trace syntax errors back to specific lines in the raw HTML template.

---

### 2026-06-14 Security & Performance Refactoring
- **`eval` Statement Elimination**: Previously, `eval(namespace.js_variables(...))` was called at runtime inside dynamic functions to bind variables. This has been replaced by wrapping the generated template logic in a `with(namespace) { ... }` block inside the dynamic function. This eliminates runtime `eval` calls, improving security, compatibility with strict environments, and optimization potential.
- **Robust Suffix/Quote Parsing**: Fixed parser logic for `extends` and `include` directives. Raw regular expressions previously left trailing quotes or crashed on inconsistent quoting. The regex now extracts template paths cleanly, handling both single and double quotes properly.

---

### 2026-06-14 Template Syntax Alignment (Tornado v6.6.dev1)
- **`try/except/else/finally` Support**: Added full support for compiling `try ... except ... else ... finally ... end` block structures in templates into valid nested JS statements. Exception tracking is emulated using an internal `_tt_no_exc` flag.
- **`elif` Directive**: Mapped `elif <condition>` directly to JS `else if (<condition>)`.
- **Traceback Line Mapping**: Implemented V8 stack trace parsing inside `Template.prototype.generate` to translate compiled JS runtime error locations back to original template filenames and line numbers using appended comments (`// <name>:<line> (via ...)`).
- **`posixpath` Path Resolution**: Fully implemented `posixpath.dirname`, `posixpath.join`, and `posixpath.normpath` to handle relative path inclusions (`..`) in `DictLoader` templates.
- **Compiler warning resolution**: Resolved all Closure Compiler annotations and warnings, including fixing a loop index count bug in `string.count`.



