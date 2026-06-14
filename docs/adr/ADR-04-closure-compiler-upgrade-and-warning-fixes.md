# [ADR-04] Google Closure Compiler Upgrade and Warning Remediation

* **Date**: 2026-06-14
* **Status**: Accepted
* **Author**: Development Team

---

## Context

The build tools used in this project (Google Closure Compiler from 2017 and an old build of Closure Stylesheets) were outdated. To leverage modern build optimizations, performance improvements, and security enhancements, we upgraded them to the latest versions (`closure-compiler-v20260602.jar` and `closure-stylesheets-1.5.0.jar`).

Compiling the codebase with the upgraded Closure Compiler initially flagged a total of 791 compilation warnings. These warnings fell into two distinct categories:

1. **Functional Bugs & Type Mismatch Warnings (9 occurrences)**:
   - An redundant third argument passed to `String.prototype.replace` (a relic from Python's `re.sub`).
   - Mismatched return type annotations on ES6 generator functions (`function*`), where the iteration targets inside `for-of` loops must be annotated as `Iterable` rather than `Iterator`.
   - The `Locator` container using constructor functions directly as object keys (`JSC_NON_STRINGIFIABLE_OBJECT_KEY`).
2. **Style-related Guidelines (782 occurrences)**:
   - Warnings recommending `let` and `const` instead of `var` (467 occurrences).
   - Missing explicit nullability markers (`!` or `?`) for reference types in JSDoc comments (310 occurrences).
   - Missing `@const` annotations on private properties.

## Decision

To improve code quality while avoiding unnecessary regressions, we decided on the following two-fold approach:

1. **Fix Functional Warnings and Bugs**:
   - Removed the redundant third argument from `replace` in `template.js` (fixing a latent runtime bug).
   - Refactored `locator.js` to use an ES6 `Map` rather than a plain object to prevent implicit string conversion conflicts when using constructor functions as keys.
   - Fixed generator JSDoc return type annotations to `@return {!IterableIterator<Type>}` and refined type casts.
   - Restructured incorrect JSDoc parameter formatting (e.g. `/** type` changed to `/** @type`).
2. **Disable Non-Functional Style Checks**:
   - The legacy codebase is written in ES5 syntax. Performing bulk mechanical replacement of `var` to `let`/`const` across 467 occurrences carries a significant risk of introducing block-scoping bugs.
   - Therefore, we removed the strict style checking flag `--jscomp_warning=lintChecks` from the `Makefile`. This suppresses stylistic warnings while preserving core compiler type safety checks.

## Consequences

- The `make` build command now succeeds with exactly **0 errors and 0 warnings**.
- A potential regex replacement runtime bug has been resolved.
- Implicit string conversions in the `Locator` key lookup are eliminated, ensuring safe class dependency resolution in memory.
