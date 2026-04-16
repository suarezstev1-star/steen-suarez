# CLAUDE.md

## Repository Overview

**steen-suarez** — A new project repository. This file provides guidance for AI assistants working in this codebase.

## Repository Structure

```
steen-suarez/
├── README.md        # Project readme
└── CLAUDE.md        # AI assistant guidance (this file)
```

This repository is in its early stages. Update this section as the project structure evolves.

## Development Workflow

### Branch Strategy

- **main** — Production branch. Do not push directly.
- Feature branches should follow the pattern: `<author>/<description>`

### Commits

- Write clear, concise commit messages describing *why* the change was made.
- Keep commits focused on a single logical change.

### Pull Requests

- PRs should target `main` unless otherwise specified.
- Include a summary and test plan in PR descriptions.

## Conventions

### Code Style

- Follow the conventions established by any linters or formatters configured in the project.
- When no tooling is configured, follow standard community conventions for the language in use.

### Testing

- Add tests for new functionality.
- Run the full test suite before pushing changes.

## Key Commands

<!-- Update this section as build/test/lint commands are established -->

_No build system configured yet. Update this section when one is added._

## Notes for AI Assistants

- Always read relevant files before proposing changes.
- Do not add unnecessary features, abstractions, or refactors beyond what is requested.
- Prefer editing existing files over creating new ones.
- Do not introduce security vulnerabilities (XSS, injection, etc.).
- Keep changes minimal and focused on the task at hand.
