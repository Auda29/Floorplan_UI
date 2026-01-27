# SKILL.md — Cursor Agent Skills Library

This file contains the canonical skill definitions for this project's workflow. Agents should use these skills to perform complex, multi-step tasks.

## Skill Name Registry

This registry provides a canonical name for each skill and a list of allowed aliases. Agents should prefer the canonical name.

| Canonical Name      | Aliases                | Description                          |
| ------------------- | ---------------------- | ------------------------------------ |
| `intake-to-plan`    | `plan`, `create-plan`  | Decompose a request into a task plan.|
| `review-pr`         | `review`, `pr-review`  | Review a Pull Request for quality.   |

---

## Intake & Planning Skills

### skill: intake-to-plan

**Goal:** Decompose a user request (feature, bug fix) into a structured plan that an agent can execute.

**When to Use:** At the beginning of any new task.

**Steps:**

1.  **Clarify Goal:** If the request is ambiguous, ask clarifying questions.
2.  **Identify Constraints:** Note any technical, business, or security constraints.
3.  **Break Down Tasks:** Decompose the goal into small, verifiable tasks.
4.  **Estimate Complexity:** Assign a t-shirt size (S/M/L/XL) to each task.
5.  **Define Test Strategy:** Outline how the final work will be verified (unit, integration, e2e).
6.  **Identify Risks:** List potential blockers or risks.
7.  **Determine Rollback:** Specify how to undo the changes if they cause issues.
8.  **Output Plan:** Format the output as a markdown plan.

**Outputs:** A markdown document containing the plan.

**Example Usage:**

```
@agent /use-skill intake-to-plan

**Request:** Add a dark mode toggle to the web app.
```
