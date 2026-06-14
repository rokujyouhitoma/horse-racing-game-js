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
