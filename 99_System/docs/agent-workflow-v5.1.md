# Language-Agnostic Developer Workflow — Extended Edition
**Cursor Agents + Zed/Claude Code + Docker MCP Toolkit + skills.sh + Ralph**

*Last updated: January 2026*

> Goal: A workflow that is **not** tied to any specific language, yet remains reproducible, reviewable, and tool-supported—without AI becoming a chaos multiplier.

---

## ⚠️ Reality Check — Read First

**This document contains example configurations.** Before copy/pasting:

1. **Verify tool versions** — CLI flags, config keys, and image tags change. Check official docs:
   - Cursor: [cursor.sh/docs](https://cursor.sh/docs)
   - Claude Code: [docs.anthropic.com/claude-code](https://docs.anthropic.com/claude-code)
   - Docker MCP: [docs.docker.com/mcp](https://docs.docker.com) *(verify current URL)*
   - skills.sh: [skills.sh/docs](https://skills.sh) *(verify current URL)*

2. **Config snippets are illustrative** — Keys like `cursor.agent.mcpGateway`, `docker mcp gateway start`, image tags like `docker.io/mcp/github:v1.2.3` are **examples**. Your actual values may differ.

3. **Test in isolated environment first** — Don't run agents with write permissions on production repos until you've verified the workflow.

4. **MCP servers are experimental** — The MCP ecosystem is young. Server availability, APIs, and security posture change frequently.

5. **Ralph is powerful but risky** — Autonomous loops can spam commits, exhaust API budgets, or loop forever on flaky tests. Use guardrails.

---

## Executive Summary (One-Pager)

### Tool Roles at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                     TOOL RESPONSIBILITIES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CURSOR (Builder)          ZED + CLAUDE CODE (Reviewer)         │
│  ─────────────────         ────────────────────────────         │
│  • Plan features           • Review against CLAUDE.md           │
│  • Implement code          • Find bugs before users             │
│  • Run subagents           • Suggest simplifications            │
│  • Execute skills          • Security sanity check              │
│                                                                  │
│  RALPH (Autonomous)        DOCKER MCP (Toolbox)                 │
│  ─────────────────         ────────────────────                 │
│  • Overnight execution     • GitHub integration                 │
│  • PRD → Complete          • Filesystem access                  │
│  • Fresh context each run  • Database queries                   │
│  • Self-documenting        • HTTP requests                      │
│                                                                  │
│  SKILLS.SH (Registry)                                           │
│  ────────────────────                                           │
│  • Skill discovery         • Version management                 │
│  • Cross-client compat     • Supply chain tracking              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow Modes

```mermaid
graph LR
    subgraph Interactive["Interactive Mode (Cursor)"]
        I1[Plan] --> I2[Discover] --> I3[Implement] --> I4[Review] --> I5[Merge]
    end
    
    subgraph Autonomous["Autonomous Mode (Ralph)"]
        A1[Create PRD] --> A2[Run Ralph<br/>overnight] --> A3[Review] --> A4[Merge]
    end
```

### 30-Minute Quickstart Path

```
Step 1: Bootstrap repo        → CLAUDE.md + .cursor/skills/SKILL.md + templates
Step 2: Configure Cursor      → Skills path + model settings
Step 3: (Optional) Setup MCP  → Docker Desktop + GitHub server
Step 4: Hello-Workflow        → Issue → Branch → Implement → Review → PR
Step 5: (Optional) Add Ralph  → For autonomous overnight work
```

**Jump to:** [Section 14: Quickstart](#14-quickstart-30-minutes-to-productive)

### Key Files

| File | Purpose | Required? |
|------|---------|-----------|
| `CLAUDE.md` | Project rules for agents | ✅ Yes |
| `.cursor/skills/SKILL.md` | Reusable workflows | ✅ Yes |
| `prd.json` | Ralph task list | Only for Ralph |
| `progress.txt` | Ralph learnings | Only for Ralph |
| `docs/decisions/*.md` | Architecture decisions | Recommended |

### Security Defaults (Non-Negotiable)

| Rule | Why |
|------|-----|
| **Agents cannot merge to main** | Human approval required |
| **MCP write-actions require review** | Prevent accidental damage |
| **No secrets in agent context** | Use MCP Gateway for credentials |
| **Pin skill versions** | Prevent supply chain attacks |
| **Ralph max iterations = 20** | Prevent infinite loops |

### Project Quality Commands (Language-Agnostic)

Configure these once per project. All examples in this document reference these variables.

```bash
# .env.workflow or in your CI config — SET THESE FOR YOUR STACK
PROJECT_TEST_CMD="npm test"              # Or: pytest, cargo test, go test ./...
PROJECT_LINT_CMD="npm run lint"          # Or: ruff check, cargo clippy, golangci-lint
PROJECT_TYPECHECK_CMD="npm run typecheck" # Or: mypy, cargo check (optional)
PROJECT_BUILD_CMD="npm run build"        # Or: cargo build, go build
PROJECT_FORMAT_CMD="npm run format"      # Or: black, rustfmt, gofmt

# Examples by language:
# Node/TS:  npm test, npm run lint, npm run typecheck
# Python:   pytest, ruff check ., mypy src/
# Rust:     cargo test, cargo clippy, cargo check
# Go:       go test ./..., golangci-lint run, (none)
# Java:     ./gradlew test, ./gradlew check, (built-in)
```

Throughout this document, when you see `$PROJECT_TEST_CMD`, substitute your project's actual command.

---

## Table of Contents

1. [Tool Roles](#1-tool-roles)
2. [Repository Setup](#2-repository-setup)
3. [Configuration Files](#3-configuration-files)
4. [Core Workflow (Phase Model)](#4-core-workflow-phase-model)
5. [Agent Specifications](#5-agent-specifications)
6. [Concrete Prompts & Examples](#6-concrete-prompts--examples)
7. [Git/GitHub Workflow](#7-gitgithub-workflow)
8. [skills.sh Integration](#8-skillssh-integration)
9. [Docker MCP Deep Dive](#9-docker-mcp-deep-dive)
10. [Ralph Integration (Autonomous Agent Loop)](#10-ralph-integration-autonomous-agent-loop)
11. [Templates](#11-templates)
12. [Anti-Patterns & Troubleshooting](#12-anti-patterns--troubleshooting)
13. [Metrics & KPIs](#13-metrics--kpis)
14. [Quickstart (30 Minutes)](#14-quickstart-30-minutes-to-productive)
15. [Daily Driver Checklists](#15-daily-driver-checklists)

---

## 1) Tool Roles

### 1.1 Cursor (Agents / Subagents / Skills)

Cursor is your **Builder IDE** — the workhorse for implementation.

```mermaid
graph TB
    subgraph Cursor["Cursor IDE"]
        PA[Primary Agent<br/>Delivery Lead]
        PA --> Scout[Scout Subagent<br/>Impact Analysis]
        PA --> Impl[Implementer Subagent<br/>Code Changes]
        PA --> Test[Tester Subagent<br/>Test Coverage]
        PA --> Doc[Doc Subagent<br/>Documentation]
    end
    
    Skills[(SKILL.md<br/>Playbooks)] --> PA
    MCP[MCP Tools] --> PA
```

#### Primary Agent Capabilities
| Capability | Description | When to Use |
|------------|-------------|-------------|
| **End-to-End Delivery** | Plans, implements, tests, documents | Feature requests, bug fixes |
| **Subagent Delegation** | Parallel work distribution | Complex changes (>3 files) |
| **Skill Invocation** | Follows structured playbooks | Repeatable workflows |
| **MCP Tool Access** | External integrations | GitHub, DB, HTTP calls |

#### Subagent Roles
| Subagent | Mission | Output |
|----------|---------|--------|
| **Scout** | Understand without rebuilding | Impact map, hotspots, entry points |
| **Implementer** | Concrete code changes | 1 task = 1 diff block |
| **Tester** | Prove changes work | Test cases, coverage report |
| **Doc** | Docs are part of the feature | README, ADRs, workflow docs |

#### Ideal Use Cases
- Feature implementation across multiple files/modules
- Refactors + "move fast but don't break everything"
- Test coverage & repo-wide changes
- Repeatable workflows via Skills (Plan, Review, Release, etc.)
- Complex debugging requiring multi-file analysis

#### Configuration: `.cursor/settings.json`
```json
{
  "cursor.agent.maxParallelSubagents": 4,
  "cursor.agent.skillsPath": ".cursor/skills/SKILL.md",
  "cursor.agent.mcpAutoConnect": true,
  "cursor.agent.defaultModel": "claude-sonnet-4",
  "cursor.agent.reviewBeforeApply": true,
  "cursor.agent.commitOnSuccess": false
}
```

---

### 1.2 Zed + Claude Code (ACP)

Zed is your **Fast Editor + Review Gate** — the quality checkpoint.

```mermaid
graph LR
    subgraph Zed["Zed Editor"]
        CC[Claude Code Agent]
        ACP[ACP Protocol]
        CC <--> ACP
    end
    
    CLAUDE[CLAUDE.md<br/>Project Rules] --> CC
    Code[Code Changes] --> CC
    CC --> Review[Review Output]
    CC --> Fix[Quick Fixes]
```

#### ACP (Agent Client Protocol)
ACP is the protocol that allows Zed to communicate with external agents like Claude Code:

```yaml
# ~/.config/zed/agents.yaml
agents:
  - name: claude-code
    protocol: acp
    endpoint: unix:///tmp/claude-code.sock
    capabilities:
      - code-review
      - design-check
      - quick-fix
      - architecture-analysis
```

#### Ideal Use Cases
| Use Case | Why Zed/Claude Code |
|----------|---------------------|
| PR/Design review | "Is this actually good?" - critical eye |
| Architecture checks | Edge cases, simplification opportunities |
| Fast, precise edits | No IDE overhead, terminal-native |
| Check → Fix → Check loop | Rapid iteration without context switching |

#### Claude Code Configuration: `CLAUDE.md`
Claude Code reads `CLAUDE.md` at project root as guardrails:
```md
# CLAUDE.md
Claude Code orients to this file for project-specific norms.
See Section 3.1 for full configuration.
```

#### Key Differences: Cursor vs Zed/Claude Code
| Aspect | Cursor | Zed + Claude Code |
|--------|--------|-------------------|
| **Strength** | Building, implementing | Reviewing, refining |
| **Speed** | Comprehensive but slower | Fast and focused |
| **Scope** | Multi-file, repo-wide | Single file, precise |
| **Mode** | Proactive creation | Reactive analysis |
| **Best for** | "Build this feature" | "Is this correct?" |

---

### 1.3 Docker Desktop MCP Toolkit (+ MCP Gateway)

Docker provides the **Toolbox for Agents** — controlled access to external systems.

```mermaid
graph TB
    subgraph Docker["Docker Desktop"]
        Toolkit[MCP Toolkit UI]
        Gateway[MCP Gateway<br/>Central Proxy]
        
        subgraph Servers["MCP Servers (Containers)"]
            GH[GitHub MCP]
            FS[Filesystem MCP]
            DB[Database MCP]
            HTTP[HTTP MCP]
        end
        
        Toolkit --> Gateway
        Gateway --> Servers
    end
    
    Cursor[Cursor Agent] --> Gateway
    Zed[Claude Code] --> Gateway
    
    Gateway --> |Credentials| Vault[Secret Store]
```

#### MCP Components
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **MCP Toolkit** | Management UI | Enable/disable servers, monitor usage |
| **MCP Catalog** | Verified servers | Versioned, SBOM, security patches |
| **MCP Gateway** | Central proxy | Auth, rate limiting, audit logs |

#### Available MCP Servers (Example Catalog)

> ⚠️ **Note:** This catalog is illustrative. MCP ecosystem is evolving rapidly.
> Verify current availability at Docker MCP documentation.

| Server | Capabilities | Use Case |
|--------|--------------|----------|
| `mcp/github` | repos, issues, PRs, actions | Git operations |
| `mcp/gitlab` | repos, issues, MRs, CI | GitLab integration |
| `mcp/filesystem` | read, write, list, watch | Local file access |
| `mcp/postgres` | query, schema, migrate | PostgreSQL access |
| `mcp/mysql` | query, schema | MySQL access |
| `mcp/redis` | get, set, del, keys | Redis access |
| `mcp/http` | get, post, put, delete | HTTP requests |
| `mcp/docker` | containers, images, compose | Docker management |
| `mcp/kubernetes` | pods, deployments, services | K8s management |
| `mcp/slack` | messages, channels | Slack integration |
| `mcp/jira` | issues, projects | Jira integration |

#### Security Model
```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│  1. Container Isolation    │ Each MCP server in own     │
│                            │ container with minimal     │
│                            │ filesystem access          │
├─────────────────────────────────────────────────────────┤
│  2. Gateway Auth           │ Central credential store,  │
│                            │ no secrets in agent context│
├─────────────────────────────────────────────────────────┤
│  3. Capability Scoping     │ Grant only needed perms    │
│                            │ per server (read vs write) │
├─────────────────────────────────────────────────────────┤
│  4. Audit Logging          │ All tool calls logged with │
│                            │ timestamp, agent, params   │
└─────────────────────────────────────────────────────────┘
```

> **Security Reality:** MCP servers are powerful—and therefore attack targets.
> **Rule:** Version pin, grant minimal access, apply updates promptly.

---

### 1.4 skills.sh (Open Agent Skills Ecosystem)

skills.sh is the **Directory + Registry** for Agent Skills — the supply chain.

```mermaid
graph LR
    subgraph Registry["skills.sh"]
        Catalog[Skill Catalog]
        Search[Search/Browse]
        Stats[Usage Stats]
    end
    
    subgraph Local["Local Machine"]
        CLI[skills CLI]
        Skills[Installed Skills]
    end
    
    CLI --> |npx skills add| Catalog
    Skills --> Cursor[Cursor]
    Skills --> CC[Claude Code]
    Skills --> Codex[Codex]
```

#### CLI Commands
```bash
# Search for skills
npx skills search "code review"

# Install a skill
npx skills add anthropic/review-pr

# List installed skills
npx skills list

# Update all skills
npx skills update

# Remove a skill
npx skills remove anthropic/review-pr

# Show skill details
npx skills info anthropic/review-pr
```

#### Skill Anatomy
```
skills/
  <vendor>/
    <skill-name>/
      SKILL.md           # Required: Instructions + metadata
      scripts/           # Optional: Automation scripts
        pre-run.sh
        post-run.sh
        validate.py
      templates/         # Optional: File templates
        pr-template.md
        adr-template.md
      tests/             # Optional: Skill tests
        test-cases.yaml
```

#### SKILL.md Frontmatter
```yaml
---
name: review-pr
version: 1.2.0
description: Review PRs like a strict teammate
author: anthropic
license: MIT
compatibility:
  - cursor >= 0.40
  - claude-code >= 1.0
allowed-tools:
  - github.pr.read
  - github.pr.comment
  - filesystem.read
tags: [review, quality, pr]
---

# skill: review-pr
...
```

**Important:** skills.sh is not "yet another IDE" — it's the **supply chain** for procedural knowledge.

---

## 2) Repository Setup

### 2.1 Complete Structure

```
repo/
├── README.md                          # Project overview
├── CLAUDE.md                          # Project rules for Claude Code
├── CONTRIBUTING.md                    # Contribution guidelines
├── CHANGELOG.md                       # Version history
│
├── docs/
│   ├── workflow/
│   │   ├── dev-workflow.md            # This document
│   │   ├── git-github-workflow.md     # Git conventions
│   │   └── onboarding.md              # New developer guide
│   ├── architecture/
│   │   ├── overview.md                # System architecture
│   │   └── diagrams/                  # Architecture diagrams
│   ├── decisions/
│   │   ├── adr-0000-template.md       # ADR template
│   │   ├── adr-0001-framework.md      # Example: Framework choice
│   │   └── README.md                  # ADR index
│   └── api/
│       └── README.md                  # API documentation
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                     # CI pipeline
│   │   ├── release.yml                # Release automation
│   │   └── codeql.yml                 # Security scanning
│   ├── pull_request_template.md       # PR template
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── config.yml
│   ├── CODEOWNERS                     # Code ownership
│   └── dependabot.yml                 # Dependency updates
│
├── .cursor/
│   ├── settings.json                  # Cursor configuration
│   └── skills/
│       └── SKILL.md                   # Project-specific skills
│
├── skills/                            # External/custom skills
│   └── <vendor-or-org>/
│       └── <skill-name>/
│           ├── SKILL.md
│           ├── scripts/
│           └── templates/
│
├── .vscode/                           # VS Code settings (optional)
│   └── settings.json
│
└── <language-specific>/               # Source code
    ├── src/
    ├── tests/
    └── ...
```

### 2.2 File Purposes

| File/Directory | Purpose | Agent Usage |
|----------------|---------|-------------|
| `CLAUDE.md` | Stability brake, project rules | Claude Code reads as guardrails |
| `.cursor/skills/SKILL.md` | Repeatable workflows | Cursor agents follow playbooks |
| `docs/decisions/` | Architecture Decision Records | Prevents refactor loops |
| `.github/workflows/` | CI/CD automation | Agents trigger, read results |
| `CODEOWNERS` | Review responsibility | Agents know who to notify |
| `CONTRIBUTING.md` | Contribution rules | Agents follow conventions |

### 2.3 Initialization Script

```bash
#!/bin/bash
# init-agent-workflow.sh - Initialize repo for agent workflow

set -e

echo "🚀 Initializing Agent Workflow Structure..."

# Create directories
mkdir -p docs/{workflow,architecture,decisions,api}
mkdir -p .github/{workflows,ISSUE_TEMPLATE}
mkdir -p .cursor/skills
mkdir -p skills

# Create CLAUDE.md
cat > CLAUDE.md << 'EOF'
# CLAUDE.md — Project Rules

## Non-negotiables
- Keep changes minimal and reviewable
- Prefer small commits (1 topic per commit)
- Never change public behavior without docs/tests
- If uncertain: propose 2 options with tradeoffs

## Quality gates
- Add/Update tests for any behavior change
- No silent API changes
- Maintain backward compatibility unless ADR exists

## Delivery format
- Summarize what changed
- List risks
- Provide rollback notes
EOF

# Create basic SKILL.md
cat > .cursor/skills/SKILL.md << 'EOF'
# SKILL.md — Cursor Agent Skills

## skill: plan-change
Goal: Create a safe implementation plan.
Steps:
1) Summarize goal + constraints
2) Identify impacted modules
3) Provide task list (small + verifiable)
4) Define test strategy
5) Provide rollback plan

## skill: implement-safely
Goal: Implement with minimal risk.
Steps:
1) Create smallest viable change
2) Run checks/tests
3) Fix errors
4) Cleanup (naming, comments)
5) Update docs
EOF

# Create ADR template
cat > docs/decisions/adr-0000-template.md << 'EOF'
# ADR-0000: <Decision Title>

Date: YYYY-MM-DD
Status: Proposed | Accepted | Rejected | Superseded

## Context

## Decision

## Options considered

## Consequences
EOF

echo "✅ Agent Workflow Structure initialized!"
echo ""
echo "Next steps:"
echo "  1. Customize CLAUDE.md for your project"
echo "  2. Add project-specific skills to .cursor/skills/SKILL.md"
echo "  3. Set up MCP tools in Docker Desktop"
```

---

## 3) Configuration Files

### 3.1 `CLAUDE.md` (Project Rules) — Extended

```md
# CLAUDE.md — Project Rules

> This file defines guardrails for Claude Code and other AI agents.
> Last updated: 2026-01-XX

## Identity

- **Project:** <Project Name>
- **Language:** <Primary Language>
- **Framework:** <Framework if applicable>
- **Team Size:** <Small/Medium/Large>

---

## Non-negotiables

These rules are absolute. No exceptions without explicit human approval.

1. **Keep changes minimal and reviewable**
   - Maximum 400 LOC per PR (excluding generated files)
   - One logical change per commit
   - No "while I'm here" drive-by fixes

2. **Prefer small commits (1 topic per commit)**
   - Commit message format: `<type>: <description>`
   - Types: feat, fix, test, docs, refactor, chore

3. **Never change public behavior without docs/tests**
   - Public = exported functions, APIs, CLI flags
   - Tests must cover happy path + at least 1 edge case
   - Update docs in same PR (not "later")

4. **If uncertain: propose 2 options with tradeoffs**
   - Don't guess at requirements
   - Present options with pros/cons
   - Let human decide on ambiguous cases

---

## Quality Gates

Before marking work as complete:

### Code Quality
- [ ] Linter passes (`npm run lint` / `cargo clippy` / etc.)
- [ ] Formatter applied (`npm run format` / `cargo fmt` / etc.)
- [ ] No new warnings introduced
- [ ] Type checking passes (if applicable)

### Testing
- [ ] All existing tests pass
- [ ] New tests added for new behavior
- [ ] Edge cases covered (null, empty, boundary)
- [ ] No flaky tests introduced

### Documentation
- [ ] Public API documented
- [ ] README updated if user-facing change
- [ ] CHANGELOG entry added
- [ ] ADR created for architectural decisions

### Security
- [ ] No secrets in code
- [ ] Input validation for external data
- [ ] Dependencies from trusted sources
- [ ] No unsafe operations without justification

---

## Language-Specific Rules

### TypeScript/JavaScript
- Strict mode enabled
- No `any` without comment explaining why
- Prefer `const` over `let`
- Use async/await over raw promises

### Rust
- No `unwrap()` in production code
- Use `thiserror` for error types
- Document panics in function docs
- Run `cargo clippy -- -D warnings`

### Python
- Type hints for public functions
- Docstrings for public API
- Use `pathlib` over `os.path`
- Format with `black`

---

## Architecture Boundaries

### Do Not Touch (without ADR)
- `src/core/` — Core domain logic
- `src/auth/` — Authentication system
- Database schema — Requires migration plan
- Public API contracts — Breaking change process

### High-Risk Areas
- `src/billing/` — Financial implications
- `src/integrations/` — Third-party dependencies
- `config/production.yaml` — Production settings

### Safe for Autonomous Changes
- `tests/` — Test improvements welcome
- `docs/` — Documentation updates
- `src/utils/` — Utility functions (with tests)
- `.github/workflows/` — CI improvements

---

## Delivery Format

When completing a task, always provide:

### Summary
```
## What changed
- Brief description of the change

## Why
- Motivation / issue reference

## How to verify
- Steps to test the change
```

### Risks
```
## Risks
- [ ] Risk 1: Description + mitigation
- [ ] Risk 2: Description + mitigation
```

### Rollback
```
## Rollback plan
- Revert commit: `git revert <sha>`
- Feature flag: Set `FEATURE_X=false`
- Config change: Restore `config.yaml` from backup
```

---

## Communication Style

- Be direct and concise
- Use code blocks for any code
- Link to relevant files with line numbers
- Acknowledge uncertainty explicitly
- Don't apologize for limitations — explain alternatives

---

## Escalation

Escalate to human when:
- Unsure about security implications
- Change affects billing/payments
- Breaking change to public API
- Performance impact unclear
- Conflicting requirements detected
```

---

### 3.2 Cursor Skills: `.cursor/skills/SKILL.md` — Full Library

```md
# SKILL.md — Cursor Agent Skills Library

> Skills are procedural knowledge: repeatable workflows that produce consistent results.
> Invoke with: "Use skill: <skill-name>"

---

## Intake & Planning Skills

### skill: intake-to-plan
Goal: Turn issue/request into execution plan.

**Inputs:**
- Issue description or user request
- Context about current system state

**Outputs:**
- Scope summary (1-2 paragraphs)
- Task list (small, verifiable steps)
- Risk list with mitigations
- Test strategy
- Rollback plan

**Steps:**
1) Restate goal in your own words + identify constraints
2) Use Scout to identify impacted areas
3) Break down into tasks (max 4 hours each)
4) For each task, define "done" criteria
5) Identify risks and propose mitigations
6) Define test approach (unit, integration, manual)
7) Document rollback procedure

**Template:**
```
## Plan: <Feature/Fix Name>

### Goal
<1-2 sentence summary>

### Constraints
- <Constraint 1>
- <Constraint 2>

### Tasks
- [ ] Task 1: <Description> (~Xh)
- [ ] Task 2: <Description> (~Xh)
- [ ] Task 3: <Description> (~Xh)

### Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| ... | Low/Med/High | Low/Med/High | ... |

### Test Strategy
- Unit: <What to test>
- Integration: <What to test>
- Manual: <Steps to verify>

### Rollback
- <How to undo if things go wrong>

### Definition of Done
- [ ] All tasks complete
- [ ] Tests passing
- [ ] Docs updated
- [ ] PR approved
```

---

### skill: impact-scan
Goal: Identify minimal change surface without rebuilding.

**Outputs:**
- List of impacted files/modules
- Dependency graph (relevant portion)
- "Do-not-touch" zones
- Suggested entry point
- Estimated complexity (S/M/L/XL)

**Steps:**
1) Search for symbols mentioned in the request
2) Trace call sites and dependencies
3) Identify shared state and side effects
4) Map control flow through the change
5) Flag tightly coupled areas
6) Recommend minimal entry point
7) Estimate change size

**Report Template:**
```
## Impact Scan: <Change Description>

### Directly Impacted
| File | What Changes | Risk |
|------|--------------|------|
| ... | ... | Low/Med/High |

### Indirectly Impacted (Dependencies)
| File | Why | Action |
|------|-----|--------|
| ... | Calls changed function | Verify behavior |

### Do Not Touch
- <File/Module>: <Reason>

### Entry Point
Start with: `<file>:<function>` because <reason>

### Complexity: <S/M/L/XL>
Reasoning: <Why this estimate>
```

---

## Implementation Skills

### skill: implement-minimal
Goal: Implement smallest safe change.

**Rules:**
- No refactor unless explicitly required
- Prefer local changes over abstractions
- Keep diffs small and focused
- Match existing code style

**Steps:**
1) Read entry point and immediate context
2) Write minimal implementation
3) Add inline comments only where non-obvious
4) Run type checker / linter
5) Keep naming consistent with surroundings
6) Update interfaces only if absolutely needed

**Checklist before marking done:**
- [ ] Change does one thing only
- [ ] No unrelated modifications
- [ ] Follows existing patterns
- [ ] Linter passes

---

### skill: implement-safely
Goal: Implement with minimal risk.

**Steps:**
1) Create smallest viable change (use implement-minimal)
2) Run checks/tests immediately
3) Fix any errors before continuing
4) Clean up (naming, dead code)
5) Add/update documentation
6) Self-review diff before committing

**Error Handling:**
- If tests fail: Fix before adding more code
- If lint fails: Fix before continuing
- If type error: Resolve before proceeding
- If uncertain: Stop and ask

---

### skill: refactor-safe
Goal: Refactor without changing behavior.

**Rules:**
- Behavior must remain identical
- Tests must cover before/after
- No combined feature changes
- Small steps, verify each

**Steps:**
1) Ensure tests exist for current behavior
2) Add more tests if coverage insufficient
3) Apply one small refactor step
4) Run tests — must still pass
5) Repeat steps 3-4
6) Remove dead code only when proven safe
7) Update any affected docs

**Common Refactors:**
- Extract function/method
- Rename for clarity
- Move to better location
- Remove duplication
- Simplify conditionals

---

## Testing Skills

### skill: tests-first-add
Goal: Add tests for new behavior (TDD-style).

**Outputs:**
- List of test cases needed
- New test files/functions
- Edge cases covered

**Steps:**
1) Identify the behavior change
2) Write test cases that fail (red)
3) Implement minimal code to pass (green)
4) Refactor if needed (refactor)
5) Add boundary/edge case tests
6) Ensure deterministic outcomes

**Test Case Categories:**
- Happy path (normal operation)
- Empty/null/undefined inputs
- Boundary values
- Error conditions
- Concurrency (if applicable)

---

### skill: regression-hunt
Goal: Find likely regressions before CI does.

**Outputs:**
- Risk hotspots identified
- Suggested additional tests
- Rollback notes

**Steps:**
1) Identify assumptions in changed code
2) Find code that depends on those assumptions
3) Compare new flow vs old flow
4) Check error handling paths
5) Look for implicit contracts
6) Add targeted tests for risks
7) Document rollback procedure

**Hotspot Indicators:**
- Shared state
- Global variables
- Implicit type conversions
- Time-dependent logic
- External service calls

---

### skill: performance-smoke
Goal: Lightweight performance sanity check.

**Outputs:**
- Suspected hotspots
- Cheap optimizations
- Measurement plan (if deeper analysis needed)

**Steps:**
1) Identify loops and I/O paths in changed code
2) Check for N+1 queries or redundant calls
3) Look for memory allocation in hot paths
4) Add simple timing if allowed
5) Suggest low-risk optimizations
6) Avoid premature optimization

**Red Flags:**
- Loop inside loop with external calls
- String concatenation in loops
- Unbounded list growth
- Missing pagination
- No caching for repeated lookups

---

## Review Skills

### skill: review-pr
Goal: Review like a strict teammate.

**Checklist:**
- [ ] Correctness: Does it do what it claims?
- [ ] Edge cases: Handled nulls, empties, boundaries?
- [ ] Performance: Any obvious N² or memory issues?
- [ ] Security: Input validation, no secrets exposed?
- [ ] Maintainability: Clear names, appropriate comments?
- [ ] Tests: Coverage for new behavior?
- [ ] Docs: Updated if user-facing?

**Output Format:**
```
## Review: <PR Title>

### Summary
<1-2 sentences on overall impression>

### Top Issues (must fix)
1. <File:Line> — <Issue description>
2. <File:Line> — <Issue description>

### Improvements (should fix)
1. <File:Line> — <Suggestion>
2. <File:Line> — <Suggestion>

### Nitpicks (optional)
- <Minor observation>

### Simplification Opportunity
<One way to make this simpler>

### Verdict
- [ ] Approve
- [ ] Request changes
- [ ] Needs discussion
```

---

### skill: review-like-senior
Goal: Deep review focusing on architecture and long-term impact.

**Focus Areas:**
- Does this fit the existing architecture?
- Will this scale?
- Is this the right abstraction level?
- Are there hidden maintenance costs?
- What will this look like in 6 months?

**Output:**
- Top 5 issues (blocking or significant)
- Top 3 improvements (non-blocking suggestions)
- One simplification suggestion
- Long-term concerns (if any)

---

### skill: security-sanity
Goal: Spot obvious security footguns.

**Checklist:**
- [ ] Secrets: No hardcoded credentials, tokens, keys?
- [ ] Injection: SQL, command, template injection vectors?
- [ ] AuthZ: Proper authorization checks on all paths?
- [ ] Logging: No sensitive data in logs?
- [ ] Dependencies: Known vulnerabilities in new deps?
- [ ] Input: All external input validated?

**Output:**
```
## Security Review: <Component>

### Findings
| Severity | Location | Issue | Mitigation |
|----------|----------|-------|------------|
| High/Med/Low | File:Line | Description | Fix |

### Recommendations
- <Security improvement suggestion>
```

---

## Documentation Skills

### skill: doc-sync
Goal: Ensure documentation matches code behavior.

**Outputs:**
- README updates (if needed)
- `docs/` updates (if needed)
- ADR suggestion (if architecture changed)
- CHANGELOG entry

**Steps:**
1) Identify user-visible changes
2) Find corresponding documentation
3) Update docs to match new behavior
4) Add examples if helpful
5) Write migration notes if breaking
6) Create ADR for significant decisions

---

### skill: release-notes
Goal: Write release notes users actually understand.

**Output Format:**
```
# Release vX.Y.Z

## Highlights
<1-2 sentence summary of this release>

## ✨ New Features
- **Feature name:** Brief description (#PR)

## 🐛 Bug Fixes
- Fixed <issue description> (#PR)

## 💥 Breaking Changes
- **What changed:** <Description>
- **Migration:** <What users need to do>

## ⚠️ Deprecations
- `oldFunction()` deprecated, use `newFunction()` instead

## 🔧 Under the Hood
- <Internal improvements users might care about>

## Known Issues
- <Issue description> — workaround: <workaround>
```

---

### skill: pr-ready
Goal: Produce a PR-ready change set.

**Outputs:**
- Clean commit list
- PR description
- Verification checklist
- Risk summary

**Steps:**
1) Review all diffs for noise/debugging code
2) Ensure all tests pass locally
3) Verify docs are updated
4) Write clear commit messages
5) Produce PR summary
6) List verification steps
7) Note any risks

**PR Template Fill:**
```
## Summary
<What this PR does>

## Motivation
<Why this change is needed>

## Changes
- <Change 1>
- <Change 2>

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing: <steps>

## Risks
- <Risk and mitigation>

## Checklist
- [ ] Linter passes
- [ ] Tests pass
- [ ] Docs updated
- [ ] CHANGELOG updated
```
```

---

## 4) Core Workflow (Phase Model)

### Visual Overview

```mermaid
graph TB
    subgraph Phase_A["Phase A: Intake → Plan"]
        Issue[Issue/Bug/Feature] --> Plan[Primary Agent<br/>Creates Plan]
        Plan --> Tasks[Task List + Risks]
    end
    
    subgraph Phase_B["Phase B: Parallel Discovery"]
        Tasks --> Scout[Scout:<br/>Impact Map]
        Tasks --> Tester[Tester:<br/>Test Gaps]
        Tasks --> Doc[Doc:<br/>Doc Needs]
        Tasks --> Impl[Implementer:<br/>Code Blocks]
    end
    
    subgraph Phase_C["Phase C: Implement → Verify"]
        Scout --> Code[Write Code]
        Tester --> Code
        Doc --> Code
        Impl --> Code
        Code --> Test[Run Tests]
        Test --> Fix{Pass?}
        Fix -->|No| Code
        Fix -->|Yes| Clean[Cleanup]
    end
    
    subgraph Phase_D["Phase D: Review Gate"]
        Clean --> Review[Claude Code<br/>Reviews vs CLAUDE.md]
        Review --> Feedback{Approved?}
        Feedback -->|No| Code
        Feedback -->|Yes| PR[Create PR]
    end
    
    subgraph Phase_E["Phase E: Tooling"]
        PR --> MCP[MCP Tools:<br/>GitHub, DB, etc.]
        MCP --> Merge[Merge to Main]
    end
```

### Phase A — Intake → Plan (Cursor Primary Agent)

**Trigger:** New issue, bug report, feature request, or tech debt ticket

**Prompt to Primary Agent:**
```
New task: <paste issue/request>

Use skill: intake-to-plan

Consider:
- Current system state
- Recent related changes
- Team capacity
```

**Primary Agent Delivers:**
| Output | Description |
|--------|-------------|
| Scope summary | What we're doing and why |
| Task list | Numbered, small, verifiable steps |
| Risk assessment | What could go wrong + mitigations |
| Test strategy | What tests are needed |
| Definition of Done | Clear completion criteria |

**Example Output:**
```
## Plan: Add rate limiting to API endpoints

### Goal
Prevent abuse by limiting requests per IP to 100/minute.

### Constraints
- Must not affect existing authenticated users
- Must return proper 429 status codes
- Must be configurable per endpoint

### Tasks
1. [ ] Add rate limiting middleware (~2h)
2. [ ] Configure default limits (~1h)
3. [ ] Add per-endpoint override capability (~2h)
4. [ ] Add monitoring/alerting (~1h)
5. [ ] Update API documentation (~1h)
6. [ ] Add integration tests (~2h)

### Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Block legitimate users | Medium | High | Start with generous limits, monitor |
| Redis dependency failure | Low | High | Fallback to in-memory with warning |

### Test Strategy
- Unit: Test rate limit calculation logic
- Integration: Test actual request blocking
- Load: Verify limits work under load

### Rollback
- Disable via config: RATE_LIMIT_ENABLED=false
- Or revert commit

### Definition of Done
- [ ] Rate limiting active on all public endpoints
- [ ] 429 responses include Retry-After header
- [ ] Monitoring dashboard shows rate limit hits
- [ ] Documentation updated
```

---

### Phase B — Parallel Discovery (Cursor Subagents)

Primary Agent delegates to subagents simultaneously:

```
┌──────────────────────────────────────────────────────────────┐
│                    Primary Agent                              │
│                  (Orchestrates)                               │
└─────────────┬────────────┬────────────┬───────────┬──────────┘
              │            │            │           │
              ▼            ▼            ▼           ▼
        ┌─────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐
        │  Scout  │  │ Tester   │  │  Doc   │  │Implementer│
        └────┬────┘  └────┬─────┘  └───┬────┘  └─────┬─────┘
             │            │            │             │
             ▼            ▼            ▼             ▼
        Impact Map   Test Gaps    Doc Needs    Code Blocks
```

**Scout Prompt:**
```
Use skill: impact-scan

Task context: <task description>

Identify:
- Which files need changes
- What depends on those files
- Any "do-not-touch" areas
- Recommended starting point
```

**Tester Prompt:**
```
For this change: <task description>

Identify:
- Existing test coverage gaps
- New tests needed
- Edge cases to cover
- Risk of regression
```

**Doc Prompt:**
```
For this change: <task description>

Identify:
- Documentation that needs updates
- New documentation needed
- Whether an ADR is required
- User-facing impacts to document
```

**Implementer Prompt:**
```
For task: <specific task from plan>

Provide:
- Concrete code changes as diff blocks
- One task = one diff
- Follow existing patterns
- No drive-by refactors
```

---

### Phase C — Implement → Verify (Cursor)

**Strict Order (no creativity here):**

1. **Smallest patch first**
   - One file, one function if possible
   - Get something working before expanding

2. **Run checks/tests immediately**
   ```bash
   # Run after every significant change (use YOUR project's commands)
   $PROJECT_TEST_CMD
   $PROJECT_LINT_CMD
   $PROJECT_TYPECHECK_CMD  # if applicable
   ```

3. **Fix errors before continuing**
   - Don't accumulate technical debt
   - Address each failure as it occurs

4. **Cleanup (naming, comments, dead code)**
   - Remove debug statements
   - Rename unclear variables
   - Delete commented-out code

5. **Update documentation**
   - Inline comments for complex logic
   - README if user-facing
   - API docs if interface changed

**Prompt:**
```
Use skill: implement-safely

Task: <specific task>

Rules:
- Smallest viable change first
- Run tests after each change
- Fix before moving on
- Match existing style
```

---

### Phase D — Review Gate (Zed + Claude Code)

Zed becomes the quality checkpoint before PR creation.

**Review Prompt:**
```
Review this change against CLAUDE.md rules.

Changed files:
<paste diff or file list>

Provide:
1. Concrete risks (with file:line references)
2. Two simplification suggestions
3. Missing test cases
4. Documentation gaps
5. Overall verdict: Approve / Request Changes / Discuss
```

**Review Checklist (Claude Code applies):**
- [ ] Changes match stated goal
- [ ] No drive-by refactors
- [ ] Tests cover new behavior
- [ ] Docs updated
- [ ] No obvious security issues
- [ ] Rollback possible

**If Issues Found:**
```
Issues identified. Fix before proceeding:

1. [HIGH] src/api.ts:45 — Missing input validation
2. [MED] src/utils.ts:12 — Consider extracting to function
3. [LOW] README.md — Version number outdated

Use skill: implement-safely to address issues.
```

---

### Phase E — Tooling via MCP (Docker)

When the agent needs to interact with external systems:

**Available MCP Actions:**

| Tool | Action | Example Use |
|------|--------|-------------|
| **GitHub** | Create PR | `github.pr.create({base: "main", head: "feat/rate-limit"})` |
| **GitHub** | Add reviewer | `github.pr.requestReview({reviewer: "teammate"})` |
| **Filesystem** | Read config | `fs.read("/config/production.yaml")` |
| **Database** | Check schema | `db.query("DESCRIBE users")` |
| **HTTP** | Test endpoint | `http.get("https://api.example.com/health")` |

**MCP Security Rules:**
1. **Least privilege:** Only request needed permissions
2. **Version pinning:** Use specific MCP server versions
3. **Audit logging:** All actions logged
4. **Credential isolation:** Secrets never in agent context

---

## 5) Agent Specifications

### Primary Agent (Cursor) — Delivery Lead

```yaml
agent: primary
role: Delivery Lead
model: claude-sonnet-4 (or opus for complex tasks)

mission: |
  Deliver PR-ready changes: code + tests + docs.
  Orchestrate subagents for parallel work.
  Ensure quality gates are met.

definition_of_done:
  - All checks/tests green
  - Review passed
  - PR template complete
  - Rollback documented

responsibilities:
  - Create execution plan
  - Delegate to subagents
  - Integrate work products
  - Ensure test coverage
  - Handle review feedback
  - Prepare merge

default_skills:
  - intake-to-plan
  - implement-safely
  - review-pr
  - release-notes
  - pr-ready

escalation_triggers:
  - Security implications unclear
  - Breaking change to public API
  - Performance impact unknown
  - Conflicting requirements
```

### Subagent: Scout

```yaml
agent: scout
role: Impact Analyst
model: claude-sonnet-4

mission: |
  Understand codebase without rebuilding everything.
  Map the minimal change surface.

outputs:
  - Impacted files list
  - Dependency graph (relevant portion)
  - Hotspots (high-risk areas)
  - Minimal entry point recommendation
  - "Do-not-touch" zones

behaviors:
  - Search before assuming
  - Trace call sites
  - Identify shared state
  - Flag tight coupling
  - Estimate complexity

forbidden:
  - Making code changes
  - Running tests
  - Modifying files
```

### Subagent: Implementer

```yaml
agent: implementer
role: Code Writer
model: claude-sonnet-4

mission: |
  Write concrete code changes at task level.
  One task = one diff block.

rules:
  - Match existing code style
  - No refactor without explicit request
  - Keep diffs minimal
  - Include only necessary changes

output_format: |
  ```diff
  --- a/src/file.ts
  +++ b/src/file.ts
  @@ -10,5 +10,7 @@
   existing code
  +new code
   more existing
  ```

forbidden:
  - Drive-by refactors
  - Unrelated changes
  - "While I'm here" fixes
  - Premature optimization
```

### Subagent: Tester

```yaml
agent: tester
role: Quality Assurance
model: claude-sonnet-4

mission: |
  Prove changes work. Don't hope — verify.

test_checklist:
  - Happy path (normal operation)
  - null / empty / undefined
  - Boundary values
  - Error conditions
  - API compatibility (if affected)
  - Performance baseline (if relevant)

outputs:
  - Test cases list
  - New test code
  - Coverage report
  - Regression risks

behaviors:
  - Identify untested paths
  - Write deterministic tests
  - Avoid flaky tests
  - Test behavior, not implementation
```

### Subagent: Doc

```yaml
agent: doc
role: Documentation Writer
model: claude-sonnet-4

mission: |
  Documentation is part of the feature, not an afterthought.

outputs:
  - README updates
  - docs/workflow/ updates
  - docs/api/ updates (if API changed)
  - ADR for architectural decisions
  - CHANGELOG entry
  - Migration guide (if breaking)

quality_bar:
  - Accurate (matches code)
  - Complete (covers what changed)
  - Clear (a new developer understands)
  - Findable (in the right place)
```

### Review Gate: Claude Code (Zed)

```yaml
agent: claude-code
role: Quality Gate
model: claude-sonnet-4

mission: |
  Find errors before users do.
  Be the strict teammate everyone needs.

guardrails: CLAUDE.md

review_dimensions:
  - correctness: Does it work?
  - completeness: Is anything missing?
  - simplicity: Can this be simpler?
  - security: Any obvious risks?
  - maintainability: Will this age well?

outputs:
  - Top issues (must fix)
  - Improvements (should fix)
  - Simplification suggestions
  - Regression risks
  - Verdict: Approve / Request Changes / Discuss

tone: |
  Direct but constructive.
  Explain why, not just what.
  Suggest alternatives, not just problems.
```

---

## 6) Concrete Prompts & Examples

### 6.1 Starting a New Feature

**User → Cursor Primary Agent:**
```
New feature request:

Add a dark mode toggle to the settings page. Should:
- Persist user preference in localStorage
- Apply immediately without page reload
- Include system preference detection
- Work on all pages

Use skill: intake-to-plan
Then delegate to subagents for discovery.
```

**Expected Agent Response:**
```
## Plan: Dark Mode Toggle

### Goal
Add user-controlled dark mode with persistence and system preference detection.

### Tasks
1. [ ] Create theme context/provider (~2h)
2. [ ] Add toggle component to settings (~1h)
3. [ ] Implement CSS variables for theming (~2h)
4. [ ] Add localStorage persistence (~30min)
5. [ ] Add system preference detection (~30min)
6. [ ] Update all pages to use theme context (~2h)
7. [ ] Add tests (~2h)
8. [ ] Update documentation (~1h)

### Delegating to subagents...

**Scout:** Analyzing impact on existing components...
**Tester:** Identifying test requirements...
**Doc:** Checking documentation needs...
```

---

### 6.2 Debugging a Bug

**User → Cursor Primary Agent:**
```
Bug report: Users report 500 errors when uploading files > 5MB.

Investigate and fix. Start with impact scan.
```

**Expected Investigation Flow:**
```
## Investigation: File Upload 500 Errors

**Scout Report:**
- Upload endpoint: src/api/upload.ts
- Size validation: src/middleware/validate.ts
- Storage handler: src/services/storage.ts
- Dependencies: multer, aws-sdk

**Hypothesis:**
Checking multer configuration...
Found: fileSize limit set to 5MB but error handling missing.

**Root Cause:**
Line 45 in src/middleware/validate.ts:
multer throws when limit exceeded, but error isn't caught.

**Fix Plan:**
1. Add error handler for LIMIT_FILE_SIZE error
2. Return proper 413 status code
3. Add user-friendly error message
4. Add test for large file rejection

Proceeding with implementation...
```

---

### 6.3 Code Review Session

**User → Zed/Claude Code:**
```
Review this PR against CLAUDE.md:

PR: Add user authentication
Files changed: 12
Lines added: 450

Focus on security and completeness.
```

**Expected Review:**
```
## Review: Add User Authentication

### Summary
Adds JWT-based authentication with login/logout endpoints.
Overall solid implementation but several security concerns.

### Top Issues (Must Fix)

1. **[CRITICAL] src/auth/jwt.ts:23**
   Secret key is hardcoded. Must use environment variable.
   ```typescript
   // BAD
   const SECRET = "mysecret123";
   // GOOD
   const SECRET = process.env.JWT_SECRET;
   ```

2. **[HIGH] src/auth/login.ts:45**
   Password comparison uses `===` instead of timing-safe compare.
   Risk: Timing attack vulnerability.

3. **[HIGH] src/routes/auth.ts:12**
   No rate limiting on login endpoint.
   Risk: Brute force attacks.

### Improvements (Should Fix)

1. **src/auth/jwt.ts:30**
   Token expiry of 7 days is long. Consider 1h with refresh tokens.

2. **src/middleware/auth.ts:15**
   Missing test for expired token handling.

### Simplification

Consider using a proven auth library (passport.js, next-auth)
instead of custom implementation. Reduces maintenance burden
and security risk.

### Verdict
❌ Request Changes — Security issues must be addressed before merge.
```

---

### 6.4 Refactoring Request

**User → Cursor:**
```
The UserService class is 800 lines and does too much.
Refactor into smaller, focused modules.

Use skill: refactor-safe

Requirements:
- No behavior changes
- Tests must pass throughout
- Keep backward compatibility
```

**Expected Approach:**
```
## Refactor Plan: UserService

### Current State
UserService handles:
- User CRUD (create, read, update, delete)
- Authentication (login, logout, password reset)
- Profile management (avatar, settings)
- Notification preferences

### Target State
Split into focused services:
- UserRepository (data access)
- AuthService (authentication)
- ProfileService (profile management)
- NotificationPrefsService (notifications)

### Safety Approach
1. Add integration tests for current behavior
2. Extract UserRepository (data layer)
3. Verify tests pass
4. Extract AuthService
5. Verify tests pass
6. Extract ProfileService
7. Verify tests pass
8. Create facade for backward compatibility
9. Final test run

### Backward Compatibility
Existing UserService will become a facade:
```typescript
class UserService {
  constructor(
    private repo: UserRepository,
    private auth: AuthService,
    private profile: ProfileService
  ) {}
  
  // Delegate to new services
  createUser(data) { return this.repo.create(data); }
  login(creds) { return this.auth.login(creds); }
  // ...
}
```

Proceeding with step 1: Adding integration tests...
```

---

### 6.5 Emergency Hotfix

**User → Cursor:**
```
URGENT: Production is down. Error: "Connection pool exhausted"

Diagnose and propose immediate fix.
No long-term refactor — just stop the bleeding.
```

**Expected Response:**
```
## Emergency Analysis: Connection Pool Exhausted

### Quick Diagnosis
Checking connection handling...

**Found:** src/db/pool.ts
- Pool max: 10 connections
- Leak: Connections not released in error path (line 78)

### Immediate Fix
```diff
--- a/src/db/pool.ts
+++ b/src/db/pool.ts
@@ -75,8 +75,12 @@ async function query(sql) {
   const conn = await pool.getConnection();
   try {
     return await conn.query(sql);
-  } catch (e) {
-    throw e;
+  } finally {
+    conn.release();  // Always release, even on error
   }
 }
```

### Verification
- Run: `npm test -- --grep "database"`
- Check pool stats: `curl localhost:3000/health/db`

### Rollback
If issues persist:
```bash
kubectl rollout undo deployment/api
```

### Follow-up (after incident)
- Add connection leak detection
- Increase pool size with alerting
- Add integration test for error path

Deploy this fix immediately?
```

---

### 6.6 CLI Tool Feature (Language-Agnostic)

**User → Cursor Primary Agent:**
```
Add a new --dry-run flag to our CLI tool that shows what would happen 
without making actual changes.

The CLI is written in Go. Use skill: plan-change.
```

**Expected Plan:**
```
## Plan: Add --dry-run Flag

### Goal
Add --dry-run flag that simulates operations without side effects.

### Constraints
- Must work with all existing commands
- Must show clear "DRY RUN" indicators in output
- Must not affect existing behavior when flag is absent

### Tasks
1. [ ] Add flag definition to root command (~30min)
2. [ ] Create DryRun context/config propagation (~1h)
3. [ ] Update create/delete operations to check flag (~2h)
4. [ ] Add colored "[DRY RUN]" prefix to affected output (~30min)
5. [ ] Write unit tests for flag parsing (~1h)
6. [ ] Write integration tests for dry-run behavior (~2h)
7. [ ] Update CLI documentation and --help text (~30min)
8. [ ] Update README with examples (~30min)

### Test Strategy
- Unit: Flag parsing, config propagation
- Integration: Run commands with --dry-run, verify no side effects
- Manual: Test with real resources in staging

### Rollback
- Revert commits (flag is additive, no breaking changes)
```

**Implementation Approach:**
```go
// cmd/root.go - EXAMPLE (Go/Cobra)
var dryRun bool

func init() {
    rootCmd.PersistentFlags().BoolVar(&dryRun, "dry-run", false, 
        "Show what would happen without making changes")
}

// In operation functions:
func createResource(name string) error {
    if config.DryRun {
        fmt.Printf("[DRY RUN] Would create resource: %s\n", name)
        return nil
    }
    // Actual creation logic
}
```

---

### 6.7 Infrastructure Change (CI/Docker)

**User → Cursor Primary Agent:**
```
Add caching to our CI pipeline to speed up builds.
Currently builds take 8 minutes, target is under 3 minutes.

Use skill: plan-change
```

**Expected Plan:**
```
## Plan: CI Build Caching

### Goal
Reduce CI build time from ~8min to <3min via caching.

### Tasks
1. [ ] Audit current build steps for cache candidates (~30min)
2. [ ] Add dependency caching (node_modules/pip/cargo) (~1h)
3. [ ] Add build artifact caching (~1h)
4. [ ] Add Docker layer caching (~1h)
5. [ ] Measure before/after times (~30min)
6. [ ] Update CI documentation (~30min)

### Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cache invalidation bugs | Medium | Medium | Use content-based hashes |
| Stale cache causing test failures | Low | High | Add cache-bust option |
| Cache storage costs | Low | Low | Set TTL, monitor usage |

### Rollback
- Remove caching steps from workflow
- Or: Set `DISABLE_CACHE=true` env var
```

**Implementation:**
```yaml
# .github/workflows/ci.yml - EXAMPLE
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Dependency caching
      - name: Cache node_modules
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
      
      # Build caching
      - name: Cache build output
        uses: actions/cache@v4
        with:
          path: .next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/*.ts', '**/*.tsx') }}
          
      - run: npm ci --prefer-offline
      - run: npm run build
      - run: npm test
```

---

### 6.8 Database Migration

**User → Cursor Primary Agent:**
```
Add a "last_login_at" timestamp column to the users table.
We use PostgreSQL and Prisma. Use skill: plan-change.
```

**Expected Plan:**
```
## Plan: Add last_login_at Column

### Goal
Track user login timestamps for analytics and security.

### Tasks
1. [ ] Add field to Prisma schema (~10min)
2. [ ] Generate migration (~5min)
3. [ ] Review migration SQL (~10min)
4. [ ] Update login handler to set timestamp (~30min)
5. [ ] Add index for query performance (~10min)
6. [ ] Write migration tests (~30min)
7. [ ] Update API types if exposed (~20min)
8. [ ] Document in schema comments (~10min)

### Constraints
- Column must be nullable (existing users don't have login history)
- Migration must be reversible
- No downtime allowed (online migration)

### Rollback
1. Revert application code (stop writing to column)
2. Run down migration: `prisma migrate revert`
3. Or leave column (no harm if unused)
```

**Implementation:**
```prisma
// prisma/schema.prisma - EXAMPLE
model User {
  id          Int       @id @default(autoincrement())
  email       String    @unique
  lastLoginAt DateTime? @map("last_login_at")
  // ...
  
  @@index([lastLoginAt])  // For "inactive users" queries
}
```

```typescript
// src/auth/login.ts - EXAMPLE
async function recordLogin(userId: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() }
  });
}
```

---

## 7) Git/GitHub Workflow

### 7.1 Branching Model

```mermaid
gitGraph
    commit id: "initial"
    branch develop
    checkout develop
    commit id: "dev work"
    branch feat/user-auth
    checkout feat/user-auth
    commit id: "add login"
    commit id: "add tests"
    checkout develop
    merge feat/user-auth
    branch fix/login-bug
    checkout fix/login-bug
    commit id: "fix validation"
    checkout develop
    merge fix/login-bug
    checkout main
    merge develop tag: "v1.2.0"
```

**Branch Types:**
| Branch | Pattern | Purpose | Lifetime |
|--------|---------|---------|----------|
| `main` | `main` | Production-ready code | Permanent |
| `develop` | `develop` | Integration branch (optional) | Permanent |
| `feat/*` | `feat/user-auth` | New features | Until merged |
| `fix/*` | `fix/login-bug` | Bug fixes | Until merged |
| `chore/*` | `chore/update-deps` | Maintenance | Until merged |
| `release/*` | `release/v1.2.0` | Release preparation | Short-lived |

---

### 7.2 Commit Message Convention

**Format:**
```
<type>(<scope>): <short description>

<body - optional>

<footer - optional>
```

**Types:**
| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add OAuth2 login` |
| `fix` | Bug fix | `fix(upload): handle large files` |
| `docs` | Documentation | `docs: update API reference` |
| `test` | Test changes | `test(auth): add login edge cases` |
| `refactor` | Code restructure | `refactor(db): extract repository` |
| `perf` | Performance | `perf(query): add index lookup` |
| `chore` | Maintenance | `chore: update dependencies` |
| `ci` | CI/CD changes | `ci: add caching to workflow` |

**Examples:**
```bash
# Good commits
feat(api): add rate limiting middleware
fix(auth): prevent timing attack on password compare
docs(readme): add setup instructions for Docker
test(upload): add test for oversized file rejection
refactor(user): extract validation logic
chore(deps): update lodash to 4.17.21

# Bad commits
fixed stuff                    # No type, vague
WIP                            # Not a complete change
feat: add login and also fix bug and update docs  # Multiple changes
```

---

### 7.3 Pull Request Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Cursor as Cursor Agent
    participant Review as Claude Code Review
    participant CI as CI Pipeline
    participant Main as Main Branch
    
    Dev->>Cursor: Create feature request
    Cursor->>Cursor: Plan + Implement
    Cursor->>Review: Request review
    Review->>Cursor: Feedback (if issues)
    Cursor->>Cursor: Address feedback
    Review->>Dev: Approve
    Dev->>CI: Open PR
    CI->>CI: Run tests
    CI->>Dev: Results
    Dev->>Main: Merge
```

**PR Size Guidelines:**
| Size | LOC Changed | Review Time | Risk |
|------|-------------|-------------|------|
| XS | < 50 | 5 min | Low |
| S | 50-150 | 15 min | Low |
| M | 150-400 | 30 min | Medium |
| L | 400-800 | 1 hour | High |
| XL | > 800 | Split it | Very High |

**PR Rules (Non-negotiables):**
1. Feature PRs do NOT contain drive-by refactors
2. Behavior changes require tests OR docs + ADR rationale
3. Keep PRs reviewable (< 400 LOC preferred)
4. One logical change per PR
5. CI must pass before review

---

### 7.4 Branch Protection Rules

```yaml
# Recommended GitHub branch protection for main

branch: main

required_status_checks:
  strict: true  # Branch must be up to date
  contexts:
    - "ci/test"
    - "ci/lint"
    - "ci/typecheck"
    - "security/codeql"

required_pull_request_reviews:
  required_approving_review_count: 1
  dismiss_stale_reviews: true
  require_code_owner_reviews: true

restrictions:
  enforce_admins: true

allow_force_pushes: false
allow_deletions: false
require_linear_history: true  # No merge commits
```

---

### 7.5 CODEOWNERS Setup

```
# .github/CODEOWNERS

# Default owners for everything
* @team-lead

# Core modules need senior review
/src/core/ @senior-dev @tech-lead
/src/auth/ @security-team
/src/billing/ @billing-team @finance

# Infrastructure
/.github/ @devops
/terraform/ @devops
/docker/ @devops

# Documentation
/docs/ @tech-writer @team-lead
README.md @team-lead
```

---

## 8) skills.sh Integration

### 8.1 Complete CLI Reference

```bash
# ===== Discovery =====
# Search the skill catalog
npx skills search "code review"
npx skills search --tag security
npx skills search --author anthropic

# Browse categories
npx skills browse
npx skills browse --category testing

# Get skill details
npx skills info anthropic/review-pr
npx skills info anthropic/review-pr --versions

# ===== Installation =====
# Install a skill
npx skills add anthropic/review-pr

# Install specific version
npx skills add anthropic/review-pr@1.2.0

# Install from local path
npx skills add ./my-custom-skill

# Install for specific client only
npx skills add anthropic/review-pr --client cursor

# ===== Management =====
# List installed skills
npx skills list
npx skills list --verbose

# Update skills
npx skills update                    # Update all
npx skills update anthropic/review-pr  # Update specific

# Remove skill
npx skills remove anthropic/review-pr

# ===== Development =====
# Create new skill
npx skills create my-skill

# Validate skill
npx skills lint ./my-skill

# Test skill
npx skills test ./my-skill

# Publish (if you have registry access)
npx skills publish ./my-skill
```

---

### 8.2 Creating a Custom Skill

**Step 1: Initialize**
```bash
npx skills create company/my-custom-skill
cd my-custom-skill
```

**Step 2: Edit SKILL.md**
```md
---
name: my-custom-skill
version: 1.0.0
description: Custom skill for our specific workflow
author: company
license: MIT
compatibility:
  - cursor >= 0.40
  - claude-code >= 1.0
allowed-tools:
  - filesystem.read
  - filesystem.write
tags: [custom, internal]
---

# skill: my-custom-skill

## Goal
<What this skill accomplishes>

## When to Use
<Trigger conditions>

## Steps
1) Step one
2) Step two
3) Step three

## Outputs
- Output 1
- Output 2

## Examples
<Usage examples>
```

**Step 3: Add Scripts (Optional)**
```bash
# scripts/pre-run.sh
#!/bin/bash
echo "Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "Node required"; exit 1; }
```

**Step 4: Add Templates (Optional)**
```md
# templates/output-template.md
## {{title}}

### Summary
{{summary}}

### Details
{{details}}
```

**Step 5: Validate**
```bash
npx skills lint .
```

**Step 6: Test Locally**
```bash
npx skills add ./
# Then use in Cursor: "Use skill: my-custom-skill"
```

---

### 8.3 Recommended Skill Stack (Templates)

> ⚠️ **These are TEMPLATE skill names** — they represent the *type* of skills you should have,
> not necessarily skills that exist today. The skills.sh ecosystem is evolving.
>
> **Start with local skills** in `.cursor/skills/SKILL.md` — they work immediately without
> external dependencies.

#### Finding Real Skills

```bash
# Step 1: Check what's actually available
npx skills search "review"
npx skills search "test"
npx skills browse --category development

# Step 2: If a skill exists, inspect it
npx skills info <org>/<skill>

# Step 3: If no external skill exists, create a local one
# Add to: .cursor/skills/SKILL.md
```

#### Template: Essential Skills
| Category | Purpose | Example Name | Fallback |
|----------|---------|--------------|----------|
| Skill management | Create new skills | `skill-creator` | Manual SKILL.md |
| Validation | Validate skill format | `skill-linter` | Manual review |
| Code review | PR review | `review-pr` | Local `## skill: review-pr` |
| Security | Security review | `security-check` | Local `## skill: security-sanity` |

#### Template: Development Skills
| Category | Purpose | Example Name | Fallback |
|----------|---------|--------------|----------|
| Testing | Generate tests | `test-generator` | Local `## skill: tests-first-add` |
| Refactoring | Safe refactoring | `refactor-safe` | Local `## skill: refactor-safe` |
| Documentation | Doc updates | `doc-sync` | Local `## skill: doc-sync` |
| API design | API review | `api-design` | Local custom skill |

#### Template: Operations Skills
| Category | Purpose | Example Name | Fallback |
|----------|---------|--------------|----------|
| Releases | Release docs | `release-notes` | Local `## skill: release-notes` |
| Incidents | Incident handling | `incident-response` | Local custom skill |
| Performance | Perf analysis | `perf-analysis` | Local `## skill: performance-smoke` |

**Recommendation:**
1. Start with the playbooks already in `.cursor/skills/SKILL.md` (Section 3.2)
2. Search skills.sh for enhanced versions when available
3. Create custom skills for your specific workflows
4. Share useful skills back to the community

---

### 8.4 Supply Chain Security

**Risk Model:**
```
┌─────────────────────────────────────────────────────────┐
│                  Skill Supply Chain Risks               │
├───────────────────┬─────────────────────────────────────┤
│ Risk              │ Mitigation                          │
├───────────────────┼─────────────────────────────────────┤
│ Malicious skill   │ Only use trusted sources            │
│                   │ Review SKILL.md before install      │
├───────────────────┼─────────────────────────────────────┤
│ Script execution  │ Review scripts/ directory           │
│                   │ Sandbox if possible                 │
├───────────────────┼─────────────────────────────────────┤
│ Data exfiltration │ Check allowed-tools in frontmatter  │
│                   │ Limit MCP permissions               │
├───────────────────┼─────────────────────────────────────┤
│ Upstream changes  │ Pin versions                        │
│                   │ Fork and maintain locally           │
└───────────────────┴─────────────────────────────────────┘
```

**Best Practices:**
1. **Version pin** all skills in production
2. **Review** SKILL.md and scripts before installing
3. **Fork** critical skills to your own repo
4. **Audit** allowed-tools declarations
5. **Update** regularly but test first

### 8.5 Skill Governance (Operationalized)

Abstract "pin versions" into concrete practice:

#### Skill Discovery Flow (How to Find Real Skills)

Before pinning skills, you need to find them:

```bash
# Step 1: Search for skills (when skills.sh is available)
npx skills search "code review"
npx skills search "testing"
npx skills search --tag security

# Step 2: Inspect before installing
npx skills info <org>/<skill-name>
npx skills info <org>/<skill-name> --show-scripts  # Review scripts/

# Step 3: Install with version pin
npx skills add <org>/<skill-name>@1.2.3

# Step 4: Add to your lockfile (see below)
```

> **Note:** If skills.sh isn't available or doesn't have the skill you need,
> create local skills in `.cursor/skills/SKILL.md` — they work just as well.

#### skills.lock File

> ⚠️ **ILLUSTRATIVE FORMAT ONLY** — There is no standardized lockfile format yet.
> This shows the *concept* of version pinning. Implement based on your tooling:
> - Use `npx skills list --json` output if available
> - Or track versions in a simple text file
> - Or use git submodules for forked skills

```yaml
# skills.lock — ILLUSTRATIVE FORMAT (not a real standard)
# 
# PURPOSE: Track which skill versions are approved for this repo
# IMPLEMENTATION: Adapt to your actual tooling
#
# Do NOT assume this format works with skills.sh — verify with docs

skills:
  # Format: <org>/<name>: "<version>@<integrity-hash>"
  anthropic/review-pr: "1.2.0@sha256:abc123..."      # EXAMPLE
  anthropic/test-generator: "1.0.3@sha256:def456..." # EXAMPLE
  company/internal-skill: "local@./skills/company/internal-skill"
  
# Metadata
last_updated: "2026-01-15"
updated_by: "@username"
```

**Alternative: Simple version tracking**
```bash
# skills-versions.txt (simpler, always works)
anthropic/review-pr@1.2.0
anthropic/test-generator@1.0.3
# Local skills don't need versioning — they're in your repo
```

#### Skill Allowlist

Restrict which skills can be installed:

```yaml
# skills.allowlist.yaml — ILLUSTRATIVE FORMAT
# Implement enforcement in CI or pre-commit hooks
allowed_sources:
  - anthropic/*           # Trust Anthropic skills
  - company/*             # Trust internal skills
  - skills-sh/skill-*     # Trust core skills.sh tools
  
blocked_sources:
  - "*"                   # Block everything else by default
  
# To add new sources:
# 1. Review the skill repository
# 2. Check scripts/ for dangerous code
# 3. Verify allowed-tools in SKILL.md
# 4. Get approval from security/tech lead
# 5. Add to allowed_sources
```

#### Fork Critical Skills

For skills in production workflows:

```bash
# 1. Fork to your org
gh repo fork anthropic/review-pr --org=your-company --clone

# 2. Pin to your fork in skills.lock
# company/review-pr: "1.2.0@sha256:..."

# 3. Set up upstream tracking
cd review-pr
git remote add upstream https://github.com/anthropic/review-pr

# 4. Periodic sync (manual review)
git fetch upstream
git diff main upstream/main  # Review changes before merging
git merge upstream/main
```

#### Skill Update Process

```
┌─────────────────────────────────────────────────────────────────┐
│                    SKILL UPDATE PROCESS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Check for updates                                           │
│     npx skills outdated                                         │
│                                                                  │
│  2. Review changelog                                            │
│     npx skills info <skill> --changelog                         │
│                                                                  │
│  3. Test in isolated branch                                     │
│     git checkout -b chore/skill-update                          │
│     npx skills update <skill>                                   │
│     # Run tests                                                 │
│                                                                  │
│  4. Update skills.lock                                          │
│     # Update hash after verification                            │
│                                                                  │
│  5. PR with skill update                                        │
│     # Include changelog summary                                 │
│                                                                  │
│  6. Merge after review                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Terminology: Skill vs Playbook vs Template

To avoid confusion throughout this document:

| Term | Definition | Example |
|------|------------|---------|
| **Skill** | A complete package with SKILL.md + optional scripts/templates | `anthropic/review-pr` |
| **Playbook** | The procedural instructions within a SKILL.md | "## skill: review-pr" section |
| **Template** | Boilerplate files in templates/ directory | `pr-template.md`, `adr-template.md` |
| **Script** | Automation code in scripts/ directory | `validate.py`, `pre-run.sh` |

**Consistent Usage:**
- "Install the `review-pr` **skill**"
- "Follow the `plan-change` **playbook**"
- "Use the ADR **template**"
- "The skill includes a validation **script**"

---

## 9) Docker MCP Deep Dive

### 9.1 Architecture

```mermaid
graph TB
    subgraph Client["Agent Clients"]
        Cursor[Cursor]
        CC[Claude Code]
        Other[Other Agents]
    end
    
    subgraph Gateway["MCP Gateway (Docker)"]
        Proxy[Gateway Proxy<br/>Port 8080]
        Auth[Auth Module]
        Audit[Audit Logger]
        Rate[Rate Limiter]
    end
    
    subgraph Servers["MCP Servers"]
        GH[GitHub MCP<br/>Container]
        FS[Filesystem MCP<br/>Container]
        DB[Database MCP<br/>Container]
        Custom[Custom MCP<br/>Container]
    end
    
    subgraph Secrets["Secret Management"]
        Vault[Docker Secrets /<br/>Vault / 1Password]
    end
    
    Client --> Proxy
    Proxy --> Auth
    Auth --> Rate
    Rate --> Audit
    Audit --> Servers
    Secrets --> Auth
```

### 9.2 Setup Guide

**Step 1: Enable MCP Toolkit in Docker Desktop**
```
Docker Desktop → Settings → Features → MCP Toolkit → Enable
```

**Step 2: Configure Gateway**

> ⚠️ **PSEUDO-CONFIG** — Schema and paths are illustrative. Verify with Docker MCP documentation.

**Config file locations (verify for your OS/version):**
| OS | Typical Path | Notes |
|----|--------------|-------|
| macOS | `~/.docker/mcp/gateway.yaml` | May differ by Docker Desktop version |
| Linux | `~/.docker/mcp/gateway.yaml` | Or `/etc/docker/mcp/` for system-wide |
| Windows | `%USERPROFILE%\.docker\mcp\gateway.yaml` | Use forward slashes in YAML |

**Always validate your config:**
```bash
docker mcp --help             # Check available commands
docker mcp config validate    # Validate config (if available)
cat ~/.docker/mcp/gateway.yaml  # Verify file exists
```

```yaml
# PSEUDO-CONFIG — structure is illustrative only
# Actual schema may differ. Verify with: docker mcp config --help
# File: ~/.docker/mcp/gateway.yaml
gateway:
  listen: "127.0.0.1:8080"
  
  auth:
    type: "token"
    token_file: "/run/secrets/mcp_token"
    
  rate_limit:
    requests_per_minute: 100
    burst: 20
    
  audit:
    enabled: true
    log_file: "/var/log/mcp/audit.log"
    
  servers:
    - name: github
      image: docker.io/mcp/github:v1.2.3
      secrets:
        - GITHUB_TOKEN
      capabilities:
        - repos.read
        - repos.write
        - issues.read
        - issues.write
        - prs.read
        - prs.write
        
    - name: filesystem
      image: docker.io/mcp/filesystem:v1.0.0
      mounts:
        - "/workspace:/workspace:rw"
        - "/home/user/projects:/projects:ro"
      capabilities:
        - read
        - write
        - list
```

**Step 3: Add Secrets**
```bash
# Using Docker secrets
echo "ghp_xxxxxxxxxxxx" | docker secret create github_token -

# Or environment file (less secure)
echo "GITHUB_TOKEN=ghp_xxxxxxxxxxxx" > ~/.docker/mcp/.env
```

**Step 4: Start Gateway**
```bash
docker mcp gateway start
```

**Step 5: Configure Agent Client**
```json
// Cursor: .cursor/settings.json
{
  "cursor.agent.mcpGateway": "http://127.0.0.1:8080",
  "cursor.agent.mcpToken": "${env:MCP_TOKEN}"
}
```

---

### 9.3 Available MCP Servers

**Example MCP Servers:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  ILLUSTRATIVE EXAMPLES ONLY                                 │
│                                                                  │
│  These server names and capabilities are EXAMPLES to show       │
│  the concept. Actual servers may:                               │
│  • Not exist yet                                                │
│  • Have different names/images                                  │
│  • Have different capability names                              │
│                                                                  │
│  ALWAYS verify with: docker mcp catalog (or equivalent)         │
└─────────────────────────────────────────────────────────────────┘
```

| Server | Capabilities | Use Case |
|--------|--------------|----------|
| `mcp/github` | repos, issues, PRs, actions | Git operations |
| `mcp/gitlab` | repos, issues, MRs, CI | GitLab integration |
| `mcp/filesystem` | read, write, list, watch | Local file access |
| `mcp/postgres` | query, schema, migrate | PostgreSQL access |
| `mcp/mysql` | query, schema | MySQL access |
| `mcp/redis` | get, set, del, keys | Redis access |
| `mcp/http` | get, post, put, delete | HTTP requests |
| `mcp/docker` | containers, images, compose | Docker management |
| `mcp/kubernetes` | pods, deployments, services | K8s management |
| `mcp/slack` | messages, channels | Slack integration |
| `mcp/jira` | issues, projects | Jira integration |

*Table shows conceptual server types. Check Docker MCP documentation for actual available servers.*

---

### 9.4 Security Configuration

**Principle of Least Privilege:**
```yaml
# ❌ BAD: Too permissive
servers:
  - name: github
    capabilities: ["*"]  # Everything allowed
    
# ✅ GOOD: Minimal permissions
servers:
  - name: github
    capabilities:
      - repos.read    # Can read repos
      - prs.read      # Can read PRs
      - prs.comment   # Can comment on PRs
      # Cannot: create repos, merge PRs, delete anything
```

**Network Isolation:**
```yaml
servers:
  - name: database
    network: "mcp-internal"  # Isolated network
    allowed_hosts:
      - "db.internal.local"  # Only internal DB
    blocked_hosts:
      - "*"  # Block everything else
```

**Audit Configuration:**
```yaml
# EXAMPLE - verify actual schema with Docker MCP docs
audit:
  enabled: true
  log_file: "/var/log/mcp/audit.log"
  log_level: "info"
  include:
    - timestamp
    - agent_id
    - server
    - action
    - parameters
    - result
    - duration
  sensitive_fields:
    - password
    - token
    - secret
  rotate:
    max_size: "100MB"
    max_age: "30d"
```

### 9.5 Security Policy Matrix (Operationalized)

This section turns "least privilege" from principle into practice.

#### Permission Matrix by Agent Role

| Agent | GitHub | Filesystem | Database | HTTP |
|-------|--------|------------|----------|------|
| **Primary (Cursor)** | repos.read, prs.read, prs.create, issues.read | read, write (workspace only) | query (read-only) | get, post |
| **Review Gate (Claude Code)** | prs.read, prs.comment | read only | query (read-only) | get |
| **Ralph (Autonomous)** | repos.read, prs.create | read, write (workspace only) | query (read-only) | get, post |
| **Human Only** | prs.merge, repos.delete, branch.protect | write (outside workspace) | migrate, drop | — |

#### Hard Rules (Non-Negotiable)

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY HARD RULES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. AGENTS CANNOT MERGE                                         │
│     PRs require human approval. Always.                         │
│     Enforcement: Branch protection + CODEOWNERS                 │
│                                                                  │
│  2. SECRETS NEVER IN CONTEXT                                    │
│     Use MCP Gateway for credentials.                            │
│     Enforcement: Gateway handles auth, agents see responses     │
│                                                                  │
│  3. WRITE ACTIONS REQUIRE JUSTIFICATION                         │
│     Agents must explain why they need write access.             │
│     Enforcement: Audit logs + human review of MCP calls         │
│                                                                  │
│  4. TOKEN ROTATION EVERY 90 DAYS                                │
│     MCP tokens expire. Calendar reminder required.              │
│     Enforcement: Token expiry in Gateway config                 │
│                                                                  │
│  5. SKILL VERSIONS PINNED                                       │
│     No `latest` tags. Use explicit versions.                    │
│     Enforcement: skills.lock file (see Skill Governance)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Token Lifecycle

```yaml
# EXAMPLE - implement based on your secret management
tokens:
  github:
    scope: "repo, read:org"           # Minimal scope
    expiry: "90d"                     # Force rotation
    rotation_reminder: "80d"          # Alert before expiry
    
  mcp_gateway:
    scope: "agent"                    # Not admin
    expiry: "30d"                     # Shorter for higher risk
    
  # NEVER grant these to agents:
  forbidden_scopes:
    - "delete_repo"
    - "admin:org"
    - "write:packages"
```

#### MCP Server Capability Tiers

```yaml
# EXAMPLE configuration - verify with actual MCP docs
tiers:
  read_only:
    description: "Safe for any agent"
    capabilities:
      - repos.read
      - prs.read
      - issues.read
      - files.read
      - db.query
      
  write_limited:
    description: "Requires audit log review"
    capabilities:
      - prs.create
      - prs.comment
      - issues.create
      - files.write  # workspace only
      
  dangerous:
    description: "Human only - never grant to agents"
    capabilities:
      - prs.merge
      - branch.delete
      - repos.delete
      - db.migrate
      - db.drop
```

#### Enforcement Hooks (Practical Implementation)

The rules above are only effective with enforcement. Here's how to implement:

**1. Branch Protection (GitHub)**
```yaml
# Settings → Branches → Branch protection rules → main
required_status_checks:
  strict: true
  contexts:
    - "ci/test"
    - "ci/lint"
    - "security/codeql"           # ← Add security scanning
    
required_reviews:
  count: 1
  dismiss_stale: true
  require_code_owner: true        # ← CODEOWNERS must approve

restrictions:
  enforce_admins: true            # ← Even admins can't bypass

additional:
  allow_force_push: false
  allow_deletions: false
  require_linear_history: true    # ← Clean git history
  require_signed_commits: false   # ← Optional: enable for releases
```

**2. Secret Scanning (Enable in GitHub)**
```
Settings → Security → Code security and analysis
  ✓ Dependency graph
  ✓ Dependabot alerts
  ✓ Dependabot security updates
  ✓ Secret scanning              # ← Catches leaked tokens
  ✓ Secret scanning push protection  # ← Blocks commits with secrets
```

**3. Required Status Checks CI**
```yaml
# .github/workflows/security.yml
name: Security Checks
on: [pull_request]

jobs:
  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Scan for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: high
```

**4. CODEOWNERS for Sensitive Paths**
```
# .github/CODEOWNERS
# Security-sensitive paths require security team review

/src/auth/          @security-team
/src/billing/       @security-team @billing-team
/.github/workflows/ @devops-team
/terraform/         @devops-team
*.env*              @security-team
*secret*            @security-team
```

**5. Signed Commits (Optional, for Releases)**
```bash
# Set up GPG signing
git config --global commit.gpgsign true
git config --global user.signingkey <YOUR-GPG-KEY>

# Verify signatures
git log --show-signature

# Branch protection: require signed commits for release branches
# Settings → Branches → release/* → Require signed commits
```

**Enforcement Checklist:**
```
□ Branch protection enabled on main
□ Required status checks configured
□ CODEOWNERS file in place
□ Secret scanning enabled
□ Dependabot alerts enabled
□ Security workflow in CI
□ (Optional) Signed commits for releases
```

---

### 9.6 Troubleshooting MCP

**Common Issues:**

| Problem | Cause | Solution |
|---------|-------|----------|
| "Connection refused" | Gateway not running | `docker mcp gateway start` |
| "Unauthorized" | Token mismatch | Check token in secrets |
| "Capability denied" | Missing permission | Add to capabilities list |
| "Timeout" | Server slow/crashed | Check container logs |
| "Rate limited" | Too many requests | Increase limit or wait |

**Debug Commands:**
```bash
# Check gateway status
docker mcp gateway status

# View server logs
docker mcp logs github

# Test connectivity
docker mcp ping github

# List active servers
docker mcp servers list

# Restart a server
docker mcp restart filesystem

# View audit logs
docker mcp audit tail -f
```

---

## 10) Ralph Integration (Autonomous Agent Loop)

> **TL;DR — Ralph in 60 seconds:**
> 1. Create `prd.json` with small, verifiable user stories
> 2. Run `./ralph-safe.sh` (or `./scripts/ralph/ralph.sh --tool claude 20`)
> 3. Go to sleep / do other work
> 4. When COMPLETE, review in Zed, then create PR
> 
> **Skip to:** [10.4 Setup](#104-setup-ralph) | [10.5 Workflow](#105-ralph-workflow) | [10.10 Safety](#1010-ralph-safety-defaults-critical)

### 10.1 What is Ralph?

Ralph is an **autonomous AI agent loop** that runs AI coding tools (Claude Code or Amp) repeatedly until all PRD items are complete. Each iteration is a fresh instance with clean context — memory persists only via git history, `progress.txt`, and `prd.json`.

Based on [Geoffrey Huntley's Ralph pattern](https://ghuntley.com/ralph/) and implemented by [snarktank/ralph](https://github.com/snarktank/ralph).

```mermaid
graph TB
    subgraph Ralph["Ralph Loop (ralph.sh)"]
        Start[Start Loop] --> Check{All Stories<br/>Complete?}
        Check -->|No| Pick[Pick Highest Priority<br/>Story where passes=false]
        Pick --> Spawn[Spawn Fresh<br/>Claude Code Instance]
        Spawn --> Implement[Implement Story]
        Implement --> Test[Run Quality Checks<br/>typecheck, lint, test]
        Test --> Pass{Checks<br/>Pass?}
        Pass -->|No| Fix[Fix Issues]
        Fix --> Test
        Pass -->|Yes| Commit[Commit Changes]
        Commit --> Update[Update prd.json<br/>passes: true]
        Update --> Learn[Append to progress.txt]
        Learn --> CLAUDE[Update CLAUDE.md<br/>with learnings]
        CLAUDE --> Check
        Check -->|Yes| Complete[Output: COMPLETE]
    end
    
    PRD[prd.json] --> Ralph
    Progress[progress.txt] --> Ralph
    Git[Git History] --> Ralph
```

### 10.2 When to Use Ralph vs Cursor

| Scenario | Use Ralph | Use Cursor |
|----------|-----------|------------|
| **Overnight autonomous work** | ✅ Set it and forget it | ❌ Needs interaction |
| **Well-defined PRD** | ✅ Perfect match | ✅ Also works |
| **Exploratory work** | ❌ Needs clear specs | ✅ Interactive discovery |
| **Complex multi-file features** | ✅ Iterates until done | ✅ Subagents help |
| **Quick fixes** | ❌ Overkill | ✅ Faster |
| **Learning/understanding code** | ❌ Just executes | ✅ Can explain |

**Recommendation:** Use Ralph for features with clear PRDs that can run overnight. Use Cursor for interactive work, exploration, and quick iterations.

### 10.3 Ralph + Workflow Integration

Ralph integrates into the workflow as an **alternative to Phases A-C** for autonomous execution:

```mermaid
graph TB
    subgraph Traditional["Traditional Workflow"]
        A[Phase A: Plan] --> B[Phase B: Discovery]
        B --> C[Phase C: Implement]
        C --> D[Phase D: Review Gate]
    end
    
    subgraph WithRalph["With Ralph"]
        PRD[Create PRD] --> Ralph[Ralph Loop<br/>Autonomous Implementation]
        Ralph --> D2[Phase D: Review Gate<br/>Claude Code in Zed]
    end
    
    D --> E[Phase E: Merge]
    D2 --> E
```

**Hybrid Approach:**
1. **Phase A:** Create PRD using `prd` skill (human-assisted planning)
2. **Ralph:** Autonomous implementation until all stories pass
3. **Phase D:** Claude Code review gate (quality checkpoint)
4. **Phase E:** Merge via MCP

### 10.4 Setup Ralph

#### Prerequisites
```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Verify jq is installed
brew install jq  # macOS
# or: apt install jq  # Linux
```

#### Installation
```bash
# Option 1: Copy to your project
mkdir -p scripts/ralph
curl -o scripts/ralph/ralph.sh https://raw.githubusercontent.com/snarktank/ralph/main/ralph.sh
curl -o scripts/ralph/CLAUDE.md https://raw.githubusercontent.com/snarktank/ralph/main/CLAUDE.md
chmod +x scripts/ralph/ralph.sh

# Option 2: Install skills globally for Claude Code
mkdir -p ~/.claude/skills
git clone https://github.com/snarktank/ralph.git /tmp/ralph
cp -r /tmp/ralph/skills/prd ~/.claude/skills/
cp -r /tmp/ralph/skills/ralph ~/.claude/skills/
```

#### Project Structure with Ralph
```
repo/
├── CLAUDE.md                  # Project rules (existing)
├── scripts/
│   └── ralph/
│       ├── ralph.sh           # The loop script
│       └── CLAUDE.md          # Ralph-specific instructions
├── tasks/
│   └── prd-feature-name.md    # PRD in markdown
├── prd.json                   # PRD in JSON (Ralph format)
├── progress.txt               # Learnings across iterations
└── ...
```

### 10.5 Ralph Workflow

#### Step 1: Create PRD with Skill

```
Load the prd skill and create a PRD for: 
Add rate limiting to all public API endpoints with:
- 100 requests per minute per IP
- Proper 429 responses with Retry-After
- Redis-backed for distributed deployments
- Per-endpoint override capability
```

The skill asks clarifying questions, then saves to `tasks/prd-rate-limiting.md`.

#### Step 2: Convert PRD to JSON

```
Load the ralph skill and convert tasks/prd-rate-limiting.md to prd.json
```

**Example prd.json:**
```json
{
  "featureName": "API Rate Limiting",
  "branchName": "feat/rate-limiting",
  "description": "Add rate limiting to public API endpoints",
  "userStories": [
    {
      "id": "RL-001",
      "title": "Add rate limiting middleware",
      "priority": 1,
      "acceptanceCriteria": [
        "Middleware intercepts all requests to /api/*",
        "Tracks request count per IP",
        "Returns 429 when limit exceeded",
        "Includes Retry-After header"
      ],
      "passes": false
    },
    {
      "id": "RL-002",
      "title": "Add Redis backend for distributed rate limiting",
      "priority": 2,
      "acceptanceCriteria": [
        "Rate limit state stored in Redis",
        "Works across multiple server instances",
        "Graceful fallback if Redis unavailable"
      ],
      "passes": false
    },
    {
      "id": "RL-003",
      "title": "Add per-endpoint configuration",
      "priority": 3,
      "acceptanceCriteria": [
        "Config file for endpoint-specific limits",
        "Override default 100/min for specific routes",
        "Documentation updated"
      ],
      "passes": false
    }
  ]
}
```

#### Step 3: Run Ralph

```bash
# Run with Claude Code (up to 10 iterations)
./scripts/ralph/ralph.sh --tool claude 10

# Or run overnight with more iterations
./scripts/ralph/ralph.sh --tool claude 50
```

**What Ralph Does:**
1. Creates branch `feat/rate-limiting`
2. Picks story RL-001 (highest priority, `passes: false`)
3. Spawns fresh Claude Code instance
4. Claude implements the story
5. Runs quality checks (typecheck, lint, test)
6. If pass: commits, marks `passes: true`, appends learnings
7. If fail: fixes and retries
8. Picks next story (RL-002)
9. Repeats until all stories pass
10. Outputs `<promise>COMPLETE</promise>`

#### Step 4: Review with Claude Code (Phase D)

After Ralph completes, review in Zed:

```
Review the changes on branch feat/rate-limiting against CLAUDE.md.

Focus on:
1. Security of rate limiting implementation
2. Redis connection handling and fallbacks
3. Test coverage for edge cases
4. Documentation completeness

Provide: Top issues, improvements, and verdict.
```

#### Step 5: Create PR and Merge

```bash
# Ralph already committed, just push
git push origin feat/rate-limiting

# Create PR via MCP or manually
```

### 10.6 Key Ralph Files

| File | Purpose | Persistence |
|------|---------|-------------|
| `prd.json` | User stories with `passes` status | ✅ Git committed |
| `progress.txt` | Append-only learnings | ✅ Git committed |
| `CLAUDE.md` | Updated with learnings per directory | ✅ Git committed |
| Context | Fresh each iteration | ❌ Resets |

### 10.7 Writing Good PRD Stories

**Right-sized stories (fit in one context window):**
- ✅ Add a database column and migration
- ✅ Add a UI component to an existing page
- ✅ Update a server action with new logic
- ✅ Add a filter dropdown to a list
- ✅ Write tests for existing function

**Too big (split these):**
- ❌ "Build the entire dashboard"
- ❌ "Add authentication"
- ❌ "Refactor the API"
- ❌ "Migrate to new framework"

**Story Template:**
```json
{
  "id": "FEAT-001",
  "title": "Clear, specific action",
  "priority": 1,
  "acceptanceCriteria": [
    "Specific, verifiable criterion 1",
    "Specific, verifiable criterion 2",
    "Tests added for new behavior",
    "Documentation updated"
  ],
  "passes": false
}
```

### 10.8 Ralph + CLAUDE.md Synergy

Ralph automatically updates `CLAUDE.md` files with learnings after each iteration. This creates a **feedback loop** where:

1. Ralph discovers patterns/gotchas while implementing
2. Ralph adds them to relevant `CLAUDE.md` files
3. Future iterations (and human developers) benefit
4. Code quality improves over time

**Example CLAUDE.md Update by Ralph:**
```md
## Learnings (added by Ralph)

### Rate Limiting Module
- Use `ioredis` for Redis connection, not `redis` package
- Always set `enableOfflineQueue: false` to fail fast
- The `express-rate-limit` middleware expects `windowMs` in milliseconds
- Test rate limiting with `jest.useFakeTimers()` for deterministic tests
```

### 10.9 Debugging Ralph

**Check Progress:**
```bash
# See which stories are done
cat prd.json | jq '.userStories[] | {id, title, passes}'

# See learnings from previous iterations
cat progress.txt

# Check git history
git log --oneline -10

# See current branch
git branch --show-current
```

**Common Issues:**

| Problem | Cause | Solution |
|---------|-------|----------|
| Story never completes | Too big | Split into smaller stories |
| Same error repeating | Missing context | Add to CLAUDE.md in project |
| Tests keep failing | Flaky tests | Fix tests before running Ralph |
| Stuck in loop | Quality checks misconfigured | Verify lint/test commands |
| Context exhausted | Story too complex | Make acceptance criteria more specific |

**Ralph Logs:**
```bash
# Ralph outputs to stderr, capture it
./scripts/ralph/ralph.sh --tool claude 10 2>&1 | tee ralph-run.log
```

### 10.10 Ralph Safety Defaults (Critical)

Ralph is powerful but dangerous without guardrails. These defaults prevent runaway loops and commit spam.

#### Mandatory Limits

```bash
#!/bin/bash
# ralph-safe.sh - Wrapper with safety limits (HEADLESS-FRIENDLY, CROSS-PLATFORM)
#
# Usage: ./ralph-safe.sh
# Override via env: RALPH_MAX_ITERATIONS=50 RALPH_MAX_HOURS=12 ./ralph-safe.sh

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# === CONFIGURATION (override via env vars) ===
MAX_ITERATIONS="${RALPH_MAX_ITERATIONS:-20}"
MAX_CONSECUTIVE_FAILS="${RALPH_MAX_FAILS:-3}"
MAX_RUNTIME_HOURS="${RALPH_MAX_HOURS:-8}"
ALLOW_SKIPPED_TESTS="${RALPH_ALLOW_SKIPS:-false}"

# === PROJECT COMMANDS (set these for your stack) ===
TEST_CMD="${PROJECT_TEST_CMD:-npm test}"
LINT_CMD="${PROJECT_LINT_CMD:-npm run lint}"
TYPECHECK_CMD="${PROJECT_TYPECHECK_CMD:-}"  # Optional, leave empty to skip

# === TEST DIRECTORIES (customize for your repo) ===
# Space-separated list of directories to scan for skipped tests
TEST_DIRS="${PROJECT_TEST_DIRS:-tests test src}"

# === CROSS-PLATFORM TIMEOUT ===
# macOS doesn't have `timeout` by default, needs `gtimeout` from coreutils
get_timeout_cmd() {
    if command -v timeout &> /dev/null; then
        echo "timeout"
    elif command -v gtimeout &> /dev/null; then
        echo "gtimeout"
    else
        echo ""
    fi
}
TIMEOUT_CMD=$(get_timeout_cmd)

# === PRE-FLIGHT CHECKS (deterministic, no prompts) ===
echo "🔍 Running pre-flight checks..."

# Check 1: Tests must pass
echo "  → Running tests..."
if ! $TEST_CMD > /dev/null 2>&1; then
    echo "❌ ABORT: Tests failing. Fix before running Ralph."
    exit 1
fi
echo "  ✓ Tests passing"

# Check 2: Typecheck (if configured)
if [ -n "$TYPECHECK_CMD" ]; then
    echo "  → Running typecheck..."
    if ! $TYPECHECK_CMD > /dev/null 2>&1; then
        echo "❌ ABORT: Typecheck failing. Fix before running Ralph."
        exit 1
    fi
    echo "  ✓ Typecheck passing"
fi

# Check 3: No skipped/focused tests (unless explicitly allowed)
# NOTE: Patterns are examples - extend for your language/framework
if [ "$ALLOW_SKIPPED_TESTS" != "true" ]; then
    echo "  → Checking for skipped tests..."
    
    # Build list of existing directories to scan
    SCAN_DIRS=""
    for dir in $TEST_DIRS; do
        [ -d "$dir" ] && SCAN_DIRS="$SCAN_DIRS $dir"
    done
    
    if [ -n "$SCAN_DIRS" ]; then
        # Language patterns (extend as needed for your stack):
        # - JS/TS: .skip(, .only(, xit(, xdescribe(
        # - Python: @pytest.mark.skip, @skip
        # - Rust: #[ignore]
        # - Go: t.Skip(
        # - Add more patterns for your languages
        SKIP_PATTERNS='\.skip\(|\.only\(|xit\(|xdescribe\(|@pytest\.mark\.skip|@skip|#\[ignore\]|t\.Skip\('
        
        if grep -rE "$SKIP_PATTERNS" \
           --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" \
           --include="*.py" --include="*.rs" --include="*.go" \
           $SCAN_DIRS 2>/dev/null; then
            echo "❌ ABORT: Found skipped/focused tests."
            echo "   Fix these or run with RALPH_ALLOW_SKIPS=true"
            exit 1
        fi
    fi
    echo "  ✓ No skipped tests"
fi

# Check 4: Lint must pass
echo "  → Running linter..."
if ! $LINT_CMD > /dev/null 2>&1; then
    echo "❌ ABORT: Linter failing. Fix before running Ralph."
    exit 1
fi
echo "  ✓ Linter passing"

# === RUN WITH TIMEOUT ===
echo ""
echo "🚀 Starting Ralph with limits:"
echo "   Max iterations: $MAX_ITERATIONS"
echo "   Max consecutive fails: $MAX_CONSECUTIVE_FAILS"
echo "   Max runtime: ${MAX_RUNTIME_HOURS}h"
echo "   Allow skipped tests: $ALLOW_SKIPPED_TESTS"
echo "   Timeout command: ${TIMEOUT_CMD:-'(none - no time limit)'}"
echo ""

LOG_FILE="ralph-$(date +%Y%m%d-%H%M).log"

# Run with or without timeout depending on availability
if [ -n "$TIMEOUT_CMD" ]; then
    $TIMEOUT_CMD ${MAX_RUNTIME_HOURS}h ./scripts/ralph/ralph.sh --tool claude $MAX_ITERATIONS 2>&1 | tee "$LOG_FILE"
    exit_code=${PIPESTATUS[0]}
    
    if [ $exit_code -eq 124 ]; then
        echo "⏰ Ralph killed: exceeded ${MAX_RUNTIME_HOURS}h runtime limit"
        exit 1
    fi
else
    echo "⚠️  Warning: 'timeout' command not found. Running without time limit."
    echo "   Install coreutils for timeout support: brew install coreutils (macOS)"
    ./scripts/ralph/ralph.sh --tool claude $MAX_ITERATIONS 2>&1 | tee "$LOG_FILE"
fi

echo "✅ Ralph completed. Log: $LOG_FILE"
```

**Usage:**
```bash
# Default settings
./ralph-safe.sh

# Override limits via environment
RALPH_MAX_ITERATIONS=50 RALPH_MAX_HOURS=12 ./ralph-safe.sh

# Allow skipped tests (use with caution)
RALPH_ALLOW_SKIPS=true ./ralph-safe.sh

# Custom commands and directories
PROJECT_TEST_CMD="pytest" \
PROJECT_LINT_CMD="ruff check ." \
PROJECT_TYPECHECK_CMD="mypy src/" \
PROJECT_TEST_DIRS="tests integration_tests" \
./ralph-safe.sh

# macOS: Install timeout if missing
brew install coreutils  # Provides gtimeout
```

#### Stop Conditions

| Condition | Action | Rationale |
|-----------|--------|-----------|
| All stories pass | Exit with COMPLETE | Success! |
| Max iterations reached | Exit with warning | Prevent infinite loops |
| 3 consecutive failures | Exit with error | Something is fundamentally broken |
| Same error 3x | Exit with error | Avoid loop on unfixable issue |
| Runtime > 8 hours | Kill process | Budget/resource protection |
| Disk space < 1GB | Exit with error | Prevent system issues |

#### Branch Hygiene

```bash
# After Ralph completes, before PR:

# 1. Squash commits if too many (optional)
git rebase -i main  # Squash related commits

# 2. Or keep granular history but clean messages
git log --oneline main..HEAD  # Review commit messages

# 3. Ensure branch is up to date
git fetch origin main
git rebase origin/main

# 4. Verify final state
npm test
npm run lint
npm run typecheck
```

#### Pre-Requisites Before Running Ralph

```
┌─────────────────────────────────────────────────────────────────┐
│              RALPH PRE-FLIGHT CHECKLIST                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  □ All tests passing (no skipped/flaky tests)                   │
│  □ Linter passing                                                │
│  □ Type checking passing                                         │
│  □ PRD stories are small enough (< 4h each)                     │
│  □ Acceptance criteria are specific and verifiable              │
│  □ CLAUDE.md has project-specific context                       │
│  □ Feature flags in place (if touching production paths)        │
│  □ Budget/iteration limits set                                   │
│  □ Notification set up (to know when Ralph finishes)            │
│                                                                  │
│  If ANY of these fail → Fix first, then run Ralph               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Handling Flaky Tests

If Ralph loops on flaky tests:

```bash
# 1. Identify flaky tests (use your project's test command)
$PROJECT_TEST_CMD --detectOpenHandles --forceExit  # Node/Jest
# Or: pytest --tb=short -x  # Python
# Or: cargo test -- --test-threads=1  # Rust (isolate)

# 2. Mark known flaky tests (temporarily)
# In test file:
describe.skip('Flaky test suite', () => { ... })

# 3. Or fix the flakiness (preferred)
# Common causes:
# - Shared state between tests
# - Race conditions in async code
# - Time-dependent logic
# - External service dependencies

# 4. Add to CLAUDE.md
echo "## Known Issues
- Test X is flaky due to Y, run with --retry 2" >> CLAUDE.md
```

### 10.11 Ralph Configuration

**Customize `scripts/ralph/CLAUDE.md`:**
```md
# Ralph Instructions (CUSTOMIZE FOR YOUR PROJECT)

## Project Context
- Language: <e.g., TypeScript, Python, Rust, Go>
- Package manager: <e.g., npm, pnpm, pip, cargo>
- Test framework: <e.g., Jest, Vitest, pytest, cargo test>

## Quality Checks (USE YOUR PROJECT'S COMMANDS)
Before committing, run:
- `$PROJECT_TYPECHECK_CMD`  # e.g., tsc, mypy, cargo check
- `$PROJECT_LINT_CMD`       # e.g., eslint, ruff, clippy
- `$PROJECT_TEST_CMD`       # e.g., jest, pytest, cargo test

## Important Patterns
- <Describe your project's conventions>
- <Where are API routes?>
- <How to access database?>
- <Error handling patterns>

## Do Not Touch (without ADR)
- `<auth-path>/` - Authentication system
- `<schema-path>` - Database schema
- `<config-path>` - Production configuration
```

### 10.12 Ralph vs Traditional Workflow Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKFLOW COMPARISON                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TRADITIONAL (Interactive)          RALPH (Autonomous)         │
│  ─────────────────────────          ────────────────────        │
│                                                                 │
│  Human: "Add rate limiting"         Human: Create PRD           │
│       ↓                                  ↓                      │
│  Cursor: Plans                      Human: Convert to JSON      │
│       ↓                                  ↓                      │
│  Human: Reviews plan                Ralph: ./ralph.sh           │
│       ↓                                  ↓                      │
│  Cursor: Implements                 [Go to sleep]               │
│       ↓                                  ↓                      │
│  Human: Reviews code                [Wake up]                   │
│       ↓                                  ↓                      │
│  Cursor: Fixes issues               Ralph: COMPLETE             │
│       ↓                                  ↓                      │
│  Human: More review                 Human: Review in Zed        │
│       ↓                                  ↓                      │
│  PR + Merge                         PR + Merge                  │
│                                                                 │
│  TIME: 2-4 hours interactive        TIME: 30min + overnight     │
│  BEST FOR: Exploration, learning    BEST FOR: Clear specs       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 10.13 Ralph Skills Integration

Ralph works with `skills.sh` skills:

```bash
# Install Ralph skills globally
npx skills add snarktank/prd
npx skills add snarktank/ralph

# Use in Claude Code
# "Load the prd skill and create a PRD for..."
# "Load the ralph skill and convert tasks/prd-*.md to prd.json"
```

**Custom Skill for Your Project:**
```md
# .cursor/skills/SKILL.md (add to existing)

## skill: ralph-prd
Goal: Create a PRD in Ralph-compatible format.

Steps:
1) Clarify requirements with user
2) Break into small, verifiable stories
3) Each story fits in one context window
4) Write acceptance criteria as checklist
5) Output as both markdown and prd.json

Rules:
- Max 5-7 stories per PRD
- Each story < 4 hours of work
- Include test requirements in acceptance criteria
- Include "Documentation updated" criterion
```

### 10.14 Overnight Ralph Recipe

**For maximum productivity:**

```bash
#!/bin/bash
# overnight-ralph.sh

set -e

echo "🌙 Starting overnight Ralph run..."
echo "Time: $(date)"

# Ensure clean state
git checkout main
git pull origin main

# Check PRD exists
if [ ! -f "prd.json" ]; then
    echo "❌ No prd.json found. Create PRD first."
    exit 1
fi

# Show what we're building
echo "📋 PRD Summary:"
cat prd.json | jq '.featureName, .description'
echo ""
echo "📝 Stories:"
cat prd.json | jq '.userStories[] | "\(.id): \(.title) [passes: \(.passes)]"'

# Run Ralph with generous iterations
echo ""
echo "🚀 Starting Ralph loop..."
./scripts/ralph/ralph.sh --tool claude 50 2>&1 | tee "ralph-$(date +%Y%m%d-%H%M).log"

echo ""
echo "✅ Ralph complete at $(date)"
echo ""
echo "📊 Final status:"
cat prd.json | jq '.userStories[] | {id, passes}'
```

**Run before bed:**
```bash
chmod +x overnight-ralph.sh
./overnight-ralph.sh
```

**Check in the morning:**
```bash
# See what happened
cat ralph-*.log | tail -100

# Check story status
cat prd.json | jq '.userStories[] | {id, title, passes}'

# Review changes
git log --oneline -20
git diff main...HEAD --stat

# If complete, review in Zed
# Then create PR
```

---

## 11) Templates

### 11.1 PR Template

**Path:** `.github/pull_request_template.md`

```md
## Summary
<!-- What does this PR do? Keep it brief. -->


## Motivation
<!-- Why is this change needed? Link to issue if applicable. -->

Closes #

## Type of Change
<!-- Check all that apply -->
- [ ] ✨ Feature (new functionality)
- [ ] 🐛 Bug fix (fixes an issue)
- [ ] ♻️ Refactor (no behavior change)
- [ ] 📝 Documentation
- [ ] 🔧 Chore (dependencies, configs)
- [ ] ⚡ Performance improvement
- [ ] 🔒 Security fix

## Changes Made
<!-- List the specific changes -->
-
-
-

## How to Test
### Automated Tests
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests passing

### Manual Verification
<!-- Steps for manual testing -->
1.
2.
3.

## Screenshots/Recordings
<!-- If UI changes, add before/after screenshots -->

## Risks & Mitigations
<!-- What could go wrong? How did you address it? -->
| Risk | Likelihood | Mitigation |
|------|------------|------------|
|      |            |            |

## Rollback Plan
<!-- How to undo this change if needed -->
- [ ] Revert commit(s): `git revert <sha>`
- [ ] Feature flag: Set `FEATURE_X=false`
- [ ] Other: 

## Checklist
<!-- Ensure all items are checked before requesting review -->
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added for new functionality
- [ ] Documentation updated
- [ ] CHANGELOG entry added (if user-facing)
- [ ] No secrets or sensitive data committed
- [ ] PR title follows commit convention

## Notes for Reviewers
<!-- Anything reviewers should focus on or know about -->
```

---

### 11.2 Issue Templates

**Bug Report:** `.github/ISSUE_TEMPLATE/bug_report.md`

```md
---
name: 🐛 Bug Report
about: Report a bug to help us improve
title: "bug: "
labels: ["bug", "needs-triage"]
assignees: ""
---

## Description
<!-- Clear description of the bug -->


## Expected Behavior
<!-- What should happen -->


## Actual Behavior
<!-- What actually happens -->


## Steps to Reproduce
1.
2.
3.

## Environment
- **OS:** 
- **Version/Commit:** 
- **Browser (if applicable):** 
- **Node/Python/etc version:** 

## Logs / Error Messages
<!-- Paste relevant logs in code blocks -->
```

```

## Screenshots
<!-- If applicable -->

## Impact
<!-- How severe is this bug? -->
- [ ] 🔴 Blocks release / Critical
- [ ] 🟠 Breaks core functionality
- [ ] 🟡 Degraded experience
- [ ] 🟢 Minor annoyance

## Possible Solution
<!-- If you have ideas on how to fix -->

```

---

**Feature Request:** `.github/ISSUE_TEMPLATE/feature_request.md`

```md
---
name: ✨ Feature Request
about: Suggest a new feature or improvement
title: "feat: "
labels: ["enhancement", "needs-triage"]
assignees: ""
---

## Problem Statement
<!-- What problem does this solve? -->


## Proposed Solution
<!-- How should it work? -->


## Alternatives Considered
<!-- What other approaches did you consider? -->


## User Stories
<!-- Who benefits and how? -->
As a <role>, I want <feature> so that <benefit>.

## Acceptance Criteria
<!-- How do we know when this is done? -->
- [ ]
- [ ]
- [ ]

## Constraints
- **Compatibility:** 
- **Performance:** 
- **Security:** 
- **UX requirements:** 

## Mockups / Examples
<!-- Visual aids if helpful -->

## Priority
<!-- How important is this? -->
- [ ] 🔴 Critical - Blocking other work
- [ ] 🟠 High - Needed soon
- [ ] 🟡 Medium - Nice to have
- [ ] 🟢 Low - Future consideration
```

---

### 11.3 ADR Template

**Path:** `docs/decisions/adr-0000-template.md`

```md
# ADR-0000: <Decision Title>

| Metadata | Value |
|----------|-------|
| Date | YYYY-MM-DD |
| Status | Proposed / Accepted / Rejected / Superseded / Deprecated |
| Deciders | @person1, @person2 |
| Supersedes | ADR-XXXX (if applicable) |
| Superseded by | ADR-XXXX (if applicable) |

## Context

<!-- What is the issue that we're seeing that is motivating this decision or change? -->


## Decision Drivers

<!-- What factors influenced this decision? -->
- Driver 1
- Driver 2
- Driver 3

## Considered Options

### Option 1: <Name>

**Description:**


**Pros:**
-

**Cons:**
-

**Estimated Effort:** S / M / L / XL

### Option 2: <Name>

**Description:**


**Pros:**
-

**Cons:**
-

**Estimated Effort:** S / M / L / XL

### Option 3: <Name>

**Description:**


**Pros:**
-

**Cons:**
-

**Estimated Effort:** S / M / L / XL

## Decision

<!-- Which option was chosen and why? -->

We will implement **Option X** because...

## Consequences

### Positive
-

### Negative
-

### Neutral
-

## Implementation Notes

<!-- Any technical details for implementation -->


## Follow-up Actions

- [ ] Action 1
- [ ] Action 2

## References

- [Link to relevant discussion]
- [Link to related ADR]
```

---

### 11.4 CHANGELOG Template

**Path:** `CHANGELOG.md`

```md
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features that have been added

### Changed
- Changes in existing functionality

### Deprecated
- Features that will be removed in future versions

### Removed
- Features that have been removed

### Fixed
- Bug fixes

### Security
- Security-related changes

---

## [1.2.0] - 2026-01-15

### Added
- Rate limiting middleware for API endpoints (#123)
- Dark mode support in settings (#124)

### Changed
- Improved error messages for validation failures (#125)

### Fixed
- Connection pool exhaustion under high load (#126)

### Security
- Updated lodash to patch CVE-2024-XXXXX (#127)

---

## [1.1.0] - 2026-01-01

### Added
- Initial release

[Unreleased]: https://github.com/org/repo/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/org/repo/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/org/repo/releases/tag/v1.1.0
```

---

### 11.5 CI Workflow Template

**Path:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Check formatting
        run: npm run format:check

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run type check
        run: npm run typecheck

  test:
    name: Test
    runs-on: ubuntu-latest
    needs: [lint, typecheck]
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
          
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [test]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
```

---

## 12) Anti-Patterns & Troubleshooting

### 12.1 Common Anti-Patterns

#### ❌ The "While I'm Here" Trap

**Problem:** Agent makes unrelated changes alongside the requested work.

```
User: "Fix the login validation bug"

Agent: "Fixed the bug. Also noticed some code style issues
       and refactored the user service while I was there."

Result: 500 lines changed instead of 20. Review nightmare.
```

**Solution:** Strict scope enforcement in CLAUDE.md
```md
## Non-negotiables
- One logical change per PR
- No drive-by refactors
- If you see something, file an issue — don't fix it now
```

---

#### ❌ The Refactor Loop

**Problem:** Continuous refactoring without ADR or clear goal.

```
Week 1: "Let's extract this into a service"
Week 2: "Actually, let's merge those services"
Week 3: "We should split this differently"
Week 4: "Back to the original structure?"
```

**Solution:** Require ADRs for structural changes
```md
## Architecture Boundaries
Any change to /src/core/ or service structure requires:
- ADR with options considered
- Team approval
- Clear "done" criteria
```

---

#### ❌ The Test Afterthought

**Problem:** Tests added after implementation, often superficial.

```
Agent: "Feature implemented! Adding tests now..."
       *writes tests that pass by construction*
       *misses edge cases that cause production bugs*
```

**Solution:** TDD-style skill
```md
## skill: tests-first-add
1) Write failing test first
2) Implement minimal code to pass
3) Refactor
4) Add edge case tests
```

---

#### ❌ The Documentation Debt

**Problem:** "I'll document it later" becomes "never."

```
PR merged without docs → New developer confused
→ Slack questions → Time wasted explaining
→ Still no docs written
```

**Solution:** Docs are part of DoD
```md
## Definition of Done
- [ ] Tests passing
- [ ] Docs updated ← Cannot merge without this
- [ ] CHANGELOG entry
```

---

#### ❌ The Scope Creep

**Problem:** Simple task grows into multi-week project.

```
Original: "Add a loading spinner"
Evolved: "Actually, let's redesign the whole UX"
         "And add animations"
         "And implement a design system"
```

**Solution:** Plan skill with explicit scope
```md
## skill: intake-to-plan
- Define scope upfront
- List what's OUT of scope
- Time-box tasks (max 4 hours each)
- Flag scope creep immediately
```

---

#### ❌ The Config Drift

**Problem:** Production config diverges from documented config.

```
Docs say: "Set TIMEOUT=30"
Prod has: TIMEOUT=300 (someone changed it during incident)
Nobody knows why.
```

**Solution:** Config as code + ADRs
```md
## Config Changes
- All config changes via PR
- Document reason in commit message
- If emergency change: Create ADR within 24h
```

---

### 12.2 Troubleshooting Guide

#### Agent Won't Follow Instructions

**Symptoms:**
- Ignores CLAUDE.md rules
- Makes changes you didn't ask for
- Doesn't use skills when told to

**Solutions:**
1. Check CLAUDE.md is in repo root
2. Make rules explicit and unambiguous
3. Use skills directly: "Use skill: implement-safely"
4. Reduce ambiguity in requests
5. Break complex requests into steps

---

#### Tests Keep Failing

**Symptoms:**
- Agent writes code that breaks existing tests
- New tests are flaky
- Test coverage decreasing

**Solutions:**
1. Run tests after each change (implement-safely skill)
2. Use regression-hunt skill before PR
3. Add test requirements to Definition of Done
4. Fix failing tests before adding new code

---

#### PRs Too Large

**Symptoms:**
- Reviews take forever
- Many comments per PR
- Bugs slip through

**Solutions:**
1. Set hard limit in CLAUDE.md: "Max 400 LOC"
2. Use impact-scan skill to scope changes
3. Break features into multiple PRs
4. Refactors and features in separate PRs

---

#### MCP Connection Issues

**Symptoms:**
- "Connection refused" errors
- Tools timeout
- Intermittent failures

**Solutions:**
```bash
# Check gateway status
docker mcp gateway status

# Restart gateway
docker mcp gateway restart

# Check server health
docker mcp ping github

# View logs
docker mcp logs --tail 100

# Verify credentials
docker secret ls
```

---

#### Skills Not Working

**Symptoms:**
- Agent doesn't recognize skill
- Skill behavior inconsistent
- Errors when invoking skill

**Solutions:**
1. Verify skill is installed: `npx skills list`
2. Check skill syntax: `npx skills lint ./skill`
3. Ensure skill path is correct in config
4. Try explicit invocation: "Use skill: exact-name"
5. Check skill compatibility with agent version

---

### 12.3 Emergency Procedures

#### Production Incident

```
1. STOP all agent-initiated changes
2. Assess impact
3. Rollback if needed:
   - git revert <commit>
   - or feature flag disable
   - or config rollback
4. Investigate with agent assistance
5. Create postmortem ADR
```

#### Agent Producing Bad Code

```
1. Stop current task
2. Review CLAUDE.md rules - are they clear?
3. Add explicit constraints:
   "Do NOT modify files in /src/core/"
   "ONLY change the file I specify"
4. Use more specific skills
5. Break task into smaller steps
```

#### Security Incident

```
1. Revoke compromised credentials immediately
2. Review MCP audit logs
3. Check what agent accessed
4. Rotate all related secrets
5. Review and tighten MCP permissions
6. Create incident ADR
```

---

## 13) Metrics & KPIs

### 13.1 Productivity Metrics

| Metric | Description | Target | How to Measure |
|--------|-------------|--------|----------------|
| **PR Cycle Time** | Time from first commit to merge | < 24h | GitHub API |
| **PR Size** | Lines changed per PR | < 400 LOC | GitHub API |
| **Review Iterations** | Back-and-forth cycles | < 2 | PR comments count |
| **First-Time Approval** | PRs approved without changes | > 70% | GitHub API |
| **Time to First Review** | Time until first review comment | < 4h | GitHub API |

### 13.2 Quality Metrics

| Metric | Description | Target | How to Measure |
|--------|-------------|--------|----------------|
| **Test Coverage** | % of code covered by tests | > 80% | Coverage tool |
| **Bugs per Release** | Bugs found post-release | < 2 | Issue tracker |
| **Regression Rate** | Old bugs reintroduced | < 5% | Issue tracker |
| **CI Pass Rate** | % of CI runs that pass | > 95% | CI dashboard |
| **Incident Frequency** | Production incidents/month | < 1 | Incident tracker |

### 13.3 Agent Effectiveness Metrics

| Metric | Description | Target | How to Measure |
|--------|-------------|--------|----------------|
| **Agent Task Completion** | Tasks completed without human intervention | > 80% | Manual tracking |
| **Review Override Rate** | Claude Code findings ignored by humans | < 20% | PR analysis |
| **Skill Usage** | % of tasks using skills | > 90% | Agent logs |
| **Escalation Rate** | Tasks requiring human decision | < 10% | Manual tracking |
| **Rework Rate** | Agent changes reverted/redone | < 5% | Git history |

### 13.4 Tracking Dashboard

```md
# Weekly Metrics Report

## Week of YYYY-MM-DD

### Summary
| Category | Status | Trend |
|----------|--------|-------|
| Productivity | 🟢 Good | ↑ |
| Quality | 🟡 Okay | → |
| Agent | 🟢 Good | ↑ |

### Productivity
- PR Cycle Time: 18h (target: <24h) ✅
- Average PR Size: 320 LOC (target: <400) ✅
- First-Time Approval: 75% (target: >70%) ✅

### Quality
- Test Coverage: 82% (target: >80%) ✅
- Bugs This Week: 1 (target: <2) ✅
- CI Pass Rate: 93% (target: >95%) ⚠️

### Agent Performance
- Task Completion: 85% ✅
- Skill Usage: 92% ✅
- Escalations: 8% ✅

### Action Items
- [ ] Investigate CI flakiness (3 failures this week)
- [ ] Add more tests for auth module (coverage gap)
```

---

## 14) Quickstart (30 Minutes to Productive)

> **Choose your path:**
> - **Minimal (15 min):** Steps 1-2 + Hello-Workflow → Basic agent workflow
> - **Standard (30 min):** Steps 1-5 + Hello-Workflow → Full workflow with MCP
> - **With Ralph (45 min):** All steps → Autonomous overnight capability

### Prerequisites

| Tool | Required? | Install |
|------|-----------|---------|
| Cursor IDE | ✅ Yes | [cursor.sh](https://cursor.sh) |
| Node.js 18+ | ✅ Yes | [nodejs.org](https://nodejs.org) |
| Git | ✅ Yes | System package manager |
| Docker Desktop | Optional | [docker.com](https://docker.com) (for MCP) |
| Zed Editor | Optional | [zed.dev](https://zed.dev) (for review) |

### Route: Minimal Setup (15 min)

#### Step 1: Bootstrap Repository (5 min)

```bash
#!/bin/bash
# bootstrap-agent-workflow.sh
# Run this in your project root

set -e

echo "🚀 Bootstrapping Agent Workflow..."

# Create directory structure
mkdir -p docs/{workflow,decisions}
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p .cursor/skills

# Create CLAUDE.md (project rules)
cat > CLAUDE.md << 'EOF'
# CLAUDE.md — Project Rules

## Non-negotiables
- Keep changes minimal and reviewable
- Prefer small commits (1 topic per commit)
- Never change public behavior without docs/tests
- If uncertain: propose 2 options with tradeoffs

## Quality gates
- Add/Update tests for any behavior change
- No silent API changes
- Maintain backward compatibility unless ADR exists

## Delivery format
- Summarize what changed
- List risks
- Provide rollback notes
EOF

# Create basic skills
cat > .cursor/skills/SKILL.md << 'EOF'
# SKILL.md — Agent Playbooks

## skill: plan-change
Goal: Create a safe implementation plan.
Steps:
1) Summarize goal + constraints
2) Identify impacted modules
3) Provide task list (small + verifiable)
4) Define test strategy
5) Provide rollback plan

## skill: implement-safely
Goal: Implement with minimal risk.
Steps:
1) Create smallest viable change
2) Run checks/tests
3) Fix errors
4) Cleanup (naming, comments)
5) Update docs

## skill: review-pr
Goal: Review like a strict teammate.
Checklist:
- correctness
- edgecases
- performance
- security basics
- docs/tests updated
EOF

# Create PR template
cat > .github/pull_request_template.md << 'EOF'
## Summary
<!-- What changed? -->

## Motivation
<!-- Why? -->
Closes #

## How to verify
- [ ] Tests added/updated
- [ ] CI green

## Risks
<!-- What could go wrong? -->
EOF

echo "✅ Step 1 complete!"
echo "   Created: CLAUDE.md, .cursor/skills/SKILL.md, PR template"
```

Save as `bootstrap-agent-workflow.sh` and run:
```bash
chmod +x bootstrap-agent-workflow.sh
./bootstrap-agent-workflow.sh
```

#### Step 2: Configure Cursor (2 min)

Create `.cursor/settings.json`:
```json
{
  "cursor.agent.skillsPath": ".cursor/skills/SKILL.md"
}
```

> ⚠️ **Note:** Config keys are examples. Verify against current Cursor docs.

**Now skip to: [Hello-Workflow](#hello-workflow-end-to-end-test)**

---

### Route: Standard Setup (+ MCP, 30 min total)

Complete Steps 1-2 above, then continue:

#### Step 3: Install External Skills (3 min)

**First, check if skills.sh is available:**
```bash
# Reality check: Is skills.sh available?
if npx skills --help > /dev/null 2>&1; then
    echo "✅ skills.sh available"
    
    # Search for available skills
    npx skills search "review"
    npx skills search "test"
    
    # Install if found (EXAMPLE names - actual may differ)
    npx skills add <org>/<skill-name>@<version>
    
    # Verify
    npx skills list
else
    echo "⚠️  skills.sh not available - using local skills only"
    echo "   This is fine! Local .cursor/skills/SKILL.md works great."
    echo "   Skip to Step 4."
fi
```

**Decision tree:**
```
npx skills --help works?
  │
  ├─ YES → Search and install external skills
  │        Then continue to Step 4
  │
  └─ NO  → Skip this step entirely
           Local skills in .cursor/skills/SKILL.md are sufficient
           Continue directly to Step 4
```

> **Bottom line:** If `npx skills` doesn't work, don't waste time debugging.
> Local skills work just as well. Move on.

#### Step 4: Configure Docker MCP (10 min)

> ⚠️ **Prerequisite:** Docker Desktop must be installed and running.

```bash
# Step 4a: Enable MCP Toolkit in Docker Desktop
# Navigate to: Settings → Features → MCP Toolkit → Enable
# (UI location may vary by version)

# Step 4b: Create gateway config (EXAMPLE - verify actual schema)
mkdir -p ~/.docker/mcp
cat > ~/.docker/mcp/gateway.yaml << 'EOF'
# EXAMPLE CONFIGURATION - verify with Docker MCP docs
gateway:
  listen: "127.0.0.1:8080"
  servers:
    - name: github
      image: docker.io/mcp/github:latest  # Verify current image
      capabilities:
        - repos.read
        - prs.read
        - prs.create
    - name: filesystem
      image: docker.io/mcp/filesystem:latest
      mounts:
        - "${PWD}:/workspace:rw"
EOF

# Step 4c: Add GitHub token
# Create token at: https://github.com/settings/tokens
# Scope: repo (read/write)
read -p "Enter GitHub token: " gh_token
echo "$gh_token" | docker secret create github_token -

# Step 4d: Start gateway (EXAMPLE command)
docker mcp gateway start

echo "✅ Step 4 complete!"
```

> ⚠️ **Note:** MCP commands and config format are examples. Check Docker MCP documentation for current syntax.

#### Step 5: Update Cursor Config for MCP (2 min)

```json
{
  "cursor.agent.skillsPath": ".cursor/skills/SKILL.md",
  "cursor.agent.mcpGateway": "http://127.0.0.1:8080"
}
```

**Now continue to: [Hello-Workflow](#hello-workflow-end-to-end-test)**

---

### Route: Add Ralph (+ 15 min)

Complete Steps 1-5 above, then:

#### Step 6: Install Ralph (5 min)

```bash
# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Verify
claude --version

# Install jq (for JSON parsing)
brew install jq  # macOS
# or: apt install jq  # Linux

# Download Ralph scripts
mkdir -p scripts/ralph
curl -o scripts/ralph/ralph.sh \
  https://raw.githubusercontent.com/snarktank/ralph/main/ralph.sh
curl -o scripts/ralph/CLAUDE.md \
  https://raw.githubusercontent.com/snarktank/ralph/main/CLAUDE.md
chmod +x scripts/ralph/ralph.sh

echo "✅ Step 6 complete: Ralph installed"
```

#### Step 7: Test Ralph (10 min)

```bash
# Create a minimal PRD
cat > prd.json << 'EOF'
{
  "featureName": "Hello Ralph",
  "branchName": "feat/hello-ralph",
  "description": "Test Ralph with a simple task",
  "userStories": [
    {
      "id": "HR-001",
      "title": "Add greeting function",
      "priority": 1,
      "acceptanceCriteria": [
        "Function greet(name) returns 'Hello, {name}!'",
        "Unit test exists and passes"
      ],
      "passes": false
    }
  ]
}
EOF

# Run Ralph (1 iteration for test)
./scripts/ralph/ralph.sh --tool claude 1

# Check result
cat prd.json | jq '.userStories[0].passes'
# Should be: true

echo "✅ Step 7 complete: Ralph working"
```

---

### Hello-Workflow: End-to-End Test

This tests the complete workflow. Do this after setup.

#### 1. Create a Feature Branch

```bash
git checkout -b feat/test-workflow
```

#### 2. Open Cursor and Request a Feature

**Prompt to Cursor Agent:**
```
Add a utility function that formats phone numbers.
Input: "1234567890" → Output: "(123) 456-7890"

Use skill: plan-change first.
```

**Expected Response (verify agent follows skill):**
```
## Plan: Phone Number Formatter

### Goal
Create a reusable phone number formatting function.

### Tasks
1. [ ] Create formatPhoneNumber function
2. [ ] Handle edge cases (invalid length, non-digits)
3. [ ] Write unit tests
4. [ ] Add documentation

### Test Strategy
- Unit: Valid input, invalid input, edge cases

### Rollback
- Revert commit (no dependencies)

Proceeding with implementation...
```

#### 3. Implement with Agent

**Follow-up Prompt:**
```
Use skill: implement-safely to implement task 1.
```

#### 4. Review in Zed (or Cursor)

**Review Prompt:**
```
Review this phone formatter against CLAUDE.md.
Check for edge cases and suggest improvements.
```

**Expected Review Output:**
```
## Review: Phone Number Formatter

### Issues
- Missing handling for international numbers
- No input validation for null/undefined

### Suggestions
1. Add input type checking
2. Consider supporting +1 prefix

### Verdict: Approve with minor fixes
```

#### 5. Commit and Create PR

```bash
git add .
git commit -m "feat: add phone number formatter"
git push origin feat/test-workflow

# Create PR via GitHub UI or CLI
gh pr create --title "feat: add phone number formatter" --body "Test workflow PR"
```

#### 6. Verify Complete

```
✅ Workflow Test Complete if:
   - [ ] Agent followed plan-change skill
   - [ ] Agent followed implement-safely skill
   - [ ] Review provided actionable feedback
   - [ ] Code was committed
   - [ ] PR was created

🎉 You're ready to use the agent workflow!
```

---

### Verification Checklist

```
Repository Structure
├── [ ] CLAUDE.md exists at root
├── [ ] .cursor/skills/SKILL.md exists
├── [ ] .cursor/settings.json configured
└── [ ] .github/pull_request_template.md exists

Skills
├── [ ] Local skills work in Cursor
└── [ ] (Optional) npx skills list shows installed

MCP (if configured)
├── [ ] docker mcp gateway status → running
└── [ ] docker mcp ping github → success

Ralph (if configured)
├── [ ] claude --version → shows version
└── [ ] jq --version → shows version
```

### Troubleshooting First Run

| Problem | Solution |
|---------|----------|
| Cursor doesn't see skills | Check `skillsPath` in settings.json |
| MCP connection refused | Verify gateway is running, check port |
| Skills command not found | Install Node.js 18+, try `npx skills` |
| Ralph hangs | Check Claude Code auth: `claude --help` |
| Agent ignores CLAUDE.md | Ensure file is at repo root, not nested |
   - [ ] Review provides actionable feedback
```

---

## 15) Daily Driver Checklists

### Morning Standup

```md
## Daily Workflow Checklist

### Before Starting Work
- [ ] Pull latest from main
- [ ] Check CI status (any failures?)
- [ ] Review assigned issues/PRs
- [ ] Check MCP gateway is running

### Starting a Task
- [ ] Create feature branch
- [ ] Ask Cursor: "Use skill: plan-change for: <task>"
- [ ] Review and adjust plan
- [ ] Proceed with implementation

### During Implementation
- [ ] After each change: Run tests
- [ ] After each file: Commit with good message
- [ ] Stuck > 30 min? Ask for help

### Before PR
- [ ] Run full test suite
- [ ] Run linter
- [ ] Self-review diff
- [ ] Ask Claude Code: "Review against CLAUDE.md"
- [ ] Address all feedback
- [ ] Update docs if needed
- [ ] Update CHANGELOG if user-facing

### PR Submission
- [ ] Fill out PR template completely
- [ ] Link to related issues
- [ ] Request appropriate reviewers
- [ ] Verify CI passes
```

### Weekly Review

```md
## Weekly Review Checklist

### Code Health
- [ ] Review test coverage report
- [ ] Check for new tech debt
- [ ] Review open security advisories
- [ ] Update dependencies if needed

### Documentation
- [ ] Docs still accurate?
- [ ] Any missing ADRs?
- [ ] README up to date?

### Workflow
- [ ] Skills working effectively?
- [ ] Any workflow friction points?
- [ ] MCP tools functioning?

### Metrics Review
- [ ] PR cycle time acceptable?
- [ ] Bug rate trending down?
- [ ] Agent completion rate good?
```

### Release Checklist

```md
## Release Checklist

### Pre-Release
- [ ] All PRs merged
- [ ] CI green on main
- [ ] CHANGELOG updated
- [ ] Version bumped
- [ ] Release notes drafted (use skill: release-notes)

### Release
- [ ] Create release branch (if using)
- [ ] Tag release: `git tag v1.2.3`
- [ ] Push tag: `git push origin v1.2.3`
- [ ] Verify release workflow runs

### Post-Release
- [ ] Verify deployment successful
- [ ] Smoke test production
- [ ] Announce release (Slack/email)
- [ ] Monitor for issues (30 min)
- [ ] Close milestone
```

---

## Appendix A: Quick Reference Card

```
╔══════════════════════════════════════════════════════════════╗
║              AGENT WORKFLOW QUICK REFERENCE                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  TOOLS                                                       ║
║  ─────                                                       ║
║  Cursor     → Build & Implement (Primary Agent + Subagents)  ║
║  Zed/Claude → Review & Refine (Quality Gate)                 ║
║  Ralph      → Autonomous Loop (PRD → Complete overnight)     ║
║  Docker MCP → External Tools (GitHub, DB, HTTP)              ║
║  skills.sh  → Skill Registry (npx skills add/list/update)    ║
║                                                              ║
║  KEY FILES                                                   ║
║  ─────────                                                   ║
║  CLAUDE.md              → Project rules (root)               ║
║  .cursor/skills/SKILL.md → Agent playbooks                   ║
║  prd.json               → Ralph task list                    ║
║  progress.txt           → Ralph learnings                    ║
║  docs/decisions/        → Architecture Decision Records      ║
║                                                              ║
║  CORE SKILLS                                                 ║
║  ───────────                                                 ║
║  plan-change      → Turn request into execution plan         ║
║  implement-safely → Build with minimal risk                  ║
║  review-pr        → Review like strict teammate              ║
║  impact-scan      → Identify change surface                  ║
║  release-notes    → Generate release documentation           ║
║  prd (Ralph)      → Create PRD for autonomous work           ║
║  ralph (Ralph)    → Convert PRD to JSON format               ║
║                                                              ║
║  WORKFLOW MODES                                              ║
║  ──────────────                                              ║
║  Interactive (Cursor):                                       ║
║    A. Intake → Plan                                          ║
║    B. Parallel Discovery (Subagents)                         ║
║    C. Implement → Verify                                     ║
║    D. Review Gate (Claude Code)                              ║
║    E. Tooling via MCP                                        ║
║                                                              ║
║  Autonomous (Ralph):                                         ║
║    1. Create PRD (prd skill)                                 ║
║    2. Convert to JSON (ralph skill)                          ║
║    3. Run: ./ralph.sh --tool claude 50                       ║
║    4. Review in Zed when COMPLETE                            ║
║    5. Create PR and Merge                                    ║
║                                                              ║
║  COMMIT TYPES                                                ║
║  ────────────                                                ║
║  feat:     New feature                                       ║
║  fix:      Bug fix                                           ║
║  docs:     Documentation                                     ║
║  test:     Tests                                             ║
║  refactor: Code restructure                                  ║
║  chore:    Maintenance                                       ║
║                                                              ║
║  EMERGENCY                                                   ║
║  ─────────                                                   ║
║  Rollback: git revert <sha>                                  ║
║  Flag off: FEATURE_X=false                                   ║
║  MCP stop: docker mcp gateway stop                           ║
║  Ralph stop: Ctrl+C or kill the process                      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **ADR** | Architecture Decision Record — documented architectural choice |
| **ACP** | Agent Client Protocol — Zed's protocol for external agents |
| **DoD** | Definition of Done — criteria for task completion |
| **MCP** | Model Context Protocol — standard for agent tool access |
| **PRD** | Product Requirements Document — feature specification for Ralph |
| **Primary Agent** | Main Cursor agent that orchestrates work |
| **Ralph** | Autonomous agent loop that iterates until PRD complete |
| **Ralph Loop** | The bash script that spawns fresh AI instances repeatedly |
| **Skill** | Reusable agent playbook (SKILL.md format) |
| **Subagent** | Specialized agent for specific tasks (Scout, Tester, etc.) |
| **progress.txt** | Append-only file for learnings across Ralph iterations |
| **prd.json** | JSON file with user stories and pass/fail status for Ralph |

---

*Document version: 2.0.0 | Last updated: January 2026*

---

## Addendum: Minimal-Patches (v5.1)

Diese Ergänzungen binden die wichtigsten Review-Punkte ein, **ohne** den bestehenden Dokumentaufbau umzuschmeißen.

### A) Golden Path (1 Seite, zero Diskussion)
1) **Issue → Intake**
   - Primary Agent: `intake-to-plan` (oder dein Standard-Plan-Skill)
2) **Plan → Delegation**
   - Subagents: Scout (Impact), Tester (Plan), Doc (Doku/ADR)
3) **Branch → Implement**
   - `feat/<topic>` oder `fix/<topic>`
4) **Preflight**
   - `ralph-safe.sh` (oder äquivalent): tests + (optional) lint/typecheck
5) **Review Gate**
   - Zed/Claude Code: Review gegen `CLAUDE.md` (konkret, risk-basiert)
6) **PR**
   - PR-Template ausfüllen, CI grün, 1 Review, Squash Merge

### B) Skill Name Registry (Canon + Aliases)
> Ziel: Kein “plan-change vs intake-to-plan”-Chaos mehr.

| Canon Skill | Zweck | Aliases (erlaubt) |
|---|---|---|
| `intake-to-plan` | Issue → Plan + Tasks + Risks | `plan-change` |
| `impact-scan` | minimal change surface | `impact-scan`, `scout-impact` |
| `implement-minimal` | kleinster Patch | `implement-safely` |
| `tests-first-add` | Tests/Regression | `add-tests` |
| `review-like-senior` | Review-Checkliste | `review-pr` |
| `doc-sync` | Doku/ADR Sync | `docs-update` |
| `pr-ready` | PR Summary/Checklist | `prep-pr` |
| `release-notes` | Notes/Migrations | `notes` |

**Regel:** In Text/Prompts immer den **Canon Skill** nennen; Aliases sind nur Kompatibilität.

### C) “Verify on your machine” (pro Tool, 60 Sekunden)
> Copy/Paste ist nett, aber die Realität hat Versionen.

**Cursor**
- Prüfe, dass du Agents/Subagents/Skills in deiner UI siehst.
- Öffne die Skill-Datei (`.cursor/skills/SKILL.md`) und verifiziere, dass Skills erkannt werden (UI/Command Palette).

**Zed + Claude Code**
- Prüfe, dass ein ACP/Agent Provider aktiv ist (Agent Panel sichtbar).
- Öffne `CLAUDE.md` und teste eine Review-Anfrage (kleines Diff).

**Docker MCP Toolkit / Gateway**
- Prüfe, dass MCP Toolkit im Docker Desktop sichtbar/aktiv ist.
- Starte 1 MCP Server (read-only) und teste eine minimale Aktion (z.B. repo metadata lesen).

**skills.sh / skills CLI**
- `npx skills --help` (oder äquivalent) muss funktionieren.
- Wenn nicht: Skills lokal im Repo halten (vendoring-only), bis CLI sauber läuft.

### D) Enforcement (minimal, aber wirksam)
**Policy:** “Neue Skills/MCP-Konfigs brauchen Review”.

Minimaler Ansatz (ohne Tool-Abhängigkeit):
- `skills.allowlist` im Repo
- `skills.lock` (illustrativ) oder `skills.versions` (Commit/Tag festpinnen)
- CI/Pre-commit: fail, wenn ein Skill hinzugefügt/geändert wurde, ohne Allowlist/Pin-Update.

Pseudo-Check (Konzept):
- Wenn `skills/**` diff → require:
  - Update `skills.allowlist`
  - Update `skills.versions`
  - PR label `skills-change`

### E) MCP Default Profiles (damit “gib alles frei” nicht gewinnt)
- **Baseline:** read-only für alle MCP Server
- **Write-enable:** nur per expliziter Freigabe (Ticket/PR Label) und zeitlich begrenzt
- **No-merge-from-agent:** Agent darf PR erstellen/aktualisieren, aber **nicht** mergen (Default)


