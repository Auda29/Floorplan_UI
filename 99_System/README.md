# Agent Workflow Skeleton

This repository provides a minimal, language-agnostic skeleton for implementing the agentic workflow defined in `99_System/docs/agent-workflow-v5.1.md`. It includes the necessary folder structure, configuration files, and templates to get started.

## Quickstart (Golden Path)

1.  **Clone the repository:**
    ```sh
    git clone <this-repo-url>
    cd <repo-name>
    ```
2.  **Review the workflow:**
    - Read `99_System/docs/workflow/dev-workflow.md` for an overview.
    - Read `99_System/CLAUDE.md` for project-specific rules.
3.  **Start working on a feature:**
    ```sh
    git checkout -b feature/my-new-feature
    ```
4.  Use your preferred agentic tool (Cursor, Zed, etc.) to develop. Follow the guidelines in `99_System/CLAUDE.md`.

## Verify on Your Machine

### Cursor
1. Open this folder in Cursor.
2. Configure your `settings.json` to point to the local skills:
   ```json
   // EXAMPLE / PSEUDO-CONFIG
   "cursor.agent.skillsPath": "99_System/.cursor/skills/SKILL.md"
   ```
3. Try invoking a skill with `@agent /use-skill intake-to-plan`.

### Zed + Claude Code
1. Open this folder in Zed.
2. Ensure your ACP endpoint is configured correctly.
3. Use Claude Code to review a file and check if it follows the rules in `99_System/CLAUDE.md`.

### Docker MCP Toolkit
1. Follow the setup guide in `99_System/docs/agent-workflow-v5.1.md` (Section 9.2).
2. Start the MCP gateway.
3. Ensure your agent can connect to the gateway and use tools like `filesystem`.

## Editing Guidelines

- **Skills:** Edit `99_System/.cursor/skills/SKILL.md` to define new skills. If you vendor skills in the `99_System/skills/` directory, update `99_System/skills.allowlist` and `99_System/skills.versions`.
- **Docs:** Update the markdown files in `99_System/docs/`. For new architectural decisions, use the template in `99_System/docs/decisions/`.
- **Templates:** Modify the GitHub templates in `99_System/.github/`.

## Assumptions & Pseudo-Config

- **Node.js/npm:** Some example commands in `99_System/CLAUDE.md` and the CI template use `npm`. These are **placeholders** and should be replaced with your project's actual commands (e.g., `pip`, `cargo`, `mvn`).
- **Branch Protections:** The rules in `99_System/docs/workflow/git-github-workflow.md` are examples. You must configure them in your repository settings.
- **`skills.lock.example`:** This file is purely illustrative and not used by the skeleton.
- **CI Configuration:** The workflow file at `99_System/.github/workflows/ci.yml` is an example template and will likely require significant changes to work for a real project.
