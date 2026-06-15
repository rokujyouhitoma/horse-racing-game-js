# Closure Stylesheets

This directory contains the executable JAR of Closure Stylesheets.

## Download Information
- **Source**: GitHub Releases (Official distribution for executable shaded JAR)
- **Download URL**: [closure-stylesheets-1.5.0.jar](https://github.com/google/closure-stylesheets/releases/download/v1.5.0/closure-stylesheets.jar)
- **Version**: `v1.5.0` (Released: July 2017)

## Tool Information
Closure Stylesheets is a CSS preprocessor and optimizer. It adds variables, functions, conditionals, mixins, minification, and linting support to standard CSS. In this project, it is used to parse and minify CSS files.

## Configuration & Usage
The preprocessor is configured in the root [Makefile](../../Makefile) and run using the command `make`.

```bash
java -jar tools/closure-stylesheets/closure-stylesheets-1.5.0.jar --help
```

## Note / Warnings
- **Java Dependency**: Requires Java to run.
- **End-of-Life (EOL) Warning**: **This project is officially EOL.** There will be no further Google-authored changes published. It is recommended to use modern alternatives (e.g., Sass, PostCSS, cssnano) if migrating or doing significant changes in the future.
