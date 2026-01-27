# Git & GitHub Workflow

This document outlines the branching model, commit conventions, and Pull Request process.

## 7.1 Branching Model

- `main`: The default branch. It must always be in a deployable state. Direct pushes are forbidden.
- `feature/<name>`: For new features. Branched from `main`.
- `bugfix/<name>`: For bug fixes. Branched from `main`.
- `chore/<name>`: For maintenance tasks. Branched from `main`.

## 7.2 Commit Message Convention

This project uses the [Conventional Commits](https://www.conventionalcommits.org/) specification. Each commit message should be in the format:

`<type>[optional scope]: <description>`

- **Types:** `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`.

## 7.3 Pull Request Flow

1.  Create a feature or bugfix branch from `main`.
2.  Implement changes and commit your work.
3.  Push your branch to the remote repository.
4.  Open a Pull Request (PR) against the `main` branch.
5.  The PR title must follow the Conventional Commits format.
6.  The PR body must be filled out according to the template.
7.  At least one review is required for approval.
8.  All status checks must pass.
9.  Once approved and checks pass, the PR can be squashed and merged.

## 7.4 Branch Protection Rules (EXAMPLE)

The `main` branch should be protected with the following rules:

- **Require a pull request before merging**
  - Require at least 1 approving review.
  - Dismiss stale pull request approvals when new commits are pushed.
  - Require review from Code Owners.
- **Require status checks to pass before merging**
  - Require branches to be up to date before merging.
  - (EXAMPLE) `lint`, `typecheck`, `test`, `build`.
- **Require linear history**
- **Enforce for administrators**
- **Do not allow force pushes**
