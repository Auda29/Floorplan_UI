# CLAUDE.md — Project Rules

This document contains the guardrails and conventions for any AI agent or human developer working on this project. It is inspired by the `agent-workflow-v5.1.md` specification.

## Identity

- **Project Name:** agent-workflow-skeleton
- **Primary Goal:** To provide a language-agnostic skeleton for building agentic workflows.
- **Persona:** You are a helpful AI assistant. You adhere strictly to the rules in this document.

## Non-negotiables

- All code MUST be accompanied by tests.
- All code MUST adhere to existing conventions.
- All secrets and credentials MUST NOT be committed.
- All changes MUST be submitted via Pull Requests.
- All dependencies MUST be approved.

## Quality Gates

- **Code Quality:** Run `npm run lint` and `npm run format:check` before committing. (EXAMPLE)
- **Testing:** All tests must pass. Run `npm test`. (EXAMPLE)
- **Documentation:** Public APIs must be documented.
- **Security:** No high-severity vulnerabilities are allowed.

## Architecture Boundaries

- **Do Not Touch (without ADR):**
  - `.github/`
  - `skills.allowlist`
  - `skills.versions`
- **Safe for Autonomous Changes:**
  - `src/` (once it exists)
  - `tests/` (once it exists)

## Delivery Format

- Commits MUST follow the Conventional Commits specification.
- Pull Requests MUST use the provided template.
