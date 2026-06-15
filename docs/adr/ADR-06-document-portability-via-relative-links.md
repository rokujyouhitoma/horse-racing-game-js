# [ADR-06] Document Portability via Relative Links

* **Date**: 2026-06-15
* **Status**: Accepted
* **Author**: Development Team

---

## Context

Inside the markdown documentation files (such as issues, design documents, and READMEs), absolute file links prefixed with `file:///workspace/` were used to point to source code and configuration files.

Using absolute file links tied the documentation to a specific local file system hierarchy. When the repository is cloned by different developers, moved, or built inside different environments (such as CI/CD runners), these links break.

To ensure the documents remain useful, portable, and cross-platform compatible, we need to enforce a link management strategy that functions independently of the developer's absolute system path.

## Decision

We decided to ban absolute `file:///workspace/` path formats inside all repository-managed markdown files and replace them with relative links (`../` or `../../`).

Key details:
- Relative links will resolve correctly across any local checkout, web-based repository viewer (e.g. GitHub/GitLab), or standard markdown renderer.
- Future issue templates and documents must follow relative referencing to maintain compatibility.
- Direct absolute references are only allowed in local execution environments, runtime logs, or agent system prompts, but never in files tracked by version control.

## Consequences

### Benefits (Pros):
- **High Portability**: The documentation can be cloned anywhere without breaking links.
- **Git Compatibility**: The links work directly on web repository platforms like GitHub.
- **Environment Agnostic**: Documentation remains valid in containerized development or cloud environments.

### Trade-offs (Cons):
- **Path Calculation Overhead**: Developers and AI agents must manually calculate relative directories (`../`, `../../`) based on the file depth, which can be prone to manual syntax errors if directory structure changes.
