# Google Closure Compiler

This directory contains the executable JAR of Google Closure Compiler.

## Download Information
- **Source**: Maven Central Repository
- **Download URL**: [closure-compiler-v20260602.jar](https://repo1.maven.org/maven2/com/google/javascript/closure-compiler/v20260602/closure-compiler-v20260602.jar)
- **Version**: `v20260602` (Released: June 4, 2026)

## Tool Information
Google Closure Compiler is a tool for making JavaScript download and run faster. It is a parser and optimizer that compiles JavaScript into compact, high-performance JavaScript. In this project, it is used to bundle, optimize, and minify all JavaScript source code.

## Configuration & Usage
The compiler is configured in the root [Makefile](file:///workspace/horse-racing-game-js/Makefile) and run using the command `make`.

```bash
java -jar tools/closure-compiler/closure-compiler-v20260602.jar --help
```

## Note / Warnings
- **Java Dependency**: Requires Java 8 or higher to execute the compiled JAR.
