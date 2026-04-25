# CLAUDE.md

## Repository Overview

**steen-suarez** — A new project repository. This file provides guidance for AI assistants working in this codebase.

## Repository Structure

```
steen-suarez/
├── README.md             # Project readme
├── CLAUDE.md             # AI assistant guidance (this file)
├── .mcp.json.example     # Template for local MCP server config (real .mcp.json is gitignored)
├── .agents/skills/       # Marketing skills installed via skills CLI
├── .claude/skills/       # Symlinks consumed by Claude Code
├── ai-video-studio/      # Remotion compositions and helper scripts
├── skills-lock.json      # Lockfile for installed skills
└── .github/              # Issue/PR templates, Dependabot, CI workflows
```

## Development Workflow

### Branch Strategy

- **main** — Production branch. Do not push directly.
- Feature branches should follow the pattern: `<author>/<description>`

### Commits

- Write clear, concise commit messages describing *why* the change was made.
- Keep commits focused on a single logical change.

### Pull Requests

- PRs should target `main` unless otherwise specified.
- The PR template under `.github/PULL_REQUEST_TEMPLATE.md` is required: fill the summary, test plan, security checklist and (when applicable) compliance checklist.
- The `Secret scan` workflow (`.github/workflows/secret-scan.yml`) runs on every PR. A failing scan blocks merge — fix the leak instead of bypassing.

### Issues

- Use the templates under `.github/ISSUE_TEMPLATE/` (bug or feature). Blank issues are disabled.
- Security findings: do **not** open a public issue. Use GitHub Security Advisories (link is in the issue chooser).

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

## Secrets and credentials

- `.mcp.json` is gitignored. Use `.mcp.json.example` as the template and reference real keys via `${ENV_VAR}` expansion.
- `.env`, `*.pem`, `*.key`, `*.p12`, `secrets.json` and `credentials.json` are also gitignored — do not work around it.
- **Historical risk**: commit `eb650af7` introduced `.mcp.json` with a placeholder `FIRECRAWL_API_KEY` value. Before the next release, audit the git history with `gitleaks detect --log-opts="--all"` and rotate any key that ever existed in real form. The `Secret scan` workflow only catches new leaks; old commits stay in history until rewritten.

## Compliance for ad creative

- Insurance / IUL Meta Ads must be cross-checked against the `meta-compliance` skill (banned phrases, safe alternatives) before merge.
- Avoid promises of guaranteed returns or terms vetoed by Meta. Document the legal review date in the PR description.

## Notes for AI Assistants

- Always read relevant files before proposing changes.
- Do not add unnecessary features, abstractions, or refactors beyond what is requested.
- Prefer editing existing files over creating new ones.
- Do not introduce security vulnerabilities (XSS, injection, etc.).
- Keep changes minimal and focused on the task at hand.
- When adding new MCP servers, only ship the example config; never commit a populated `.mcp.json`.
