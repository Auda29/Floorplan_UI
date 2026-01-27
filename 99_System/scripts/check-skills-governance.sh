#!/bin/bash

# check-skills-governance.sh
#
# This script checks for changes in the skills/ directory and ensures that
# the skills.allowlist and skills.versions files are also updated.
# This is a simple governance check to prevent vendored skills from being
# added or modified without explicit approval in the governance files.
#
# NOTE FOR WINDOWS USERS:
# This script is written in bash and may not run on standard Windows CMD.
# It is recommended to use Git Bash or WSL (Windows Subsystem for Linux)
# to run this script.

# Check if there are any staged changes in the 99_System/skills/ directory.
if git diff --quiet --cached 99_System/skills/; then
  # No staged changes in skills/, so no check is needed.
  exit 0
fi

# If there are changes in skills/, check if skills.allowlist or skills.versions were also changed.
if git diff --quiet --cached 99_System/skills.allowlist && git diff --quiet --cached 99_System/skills.versions; then
  echo "Error: Changes detected in '99_System/skills/' directory, but no corresponding changes were found in '99_System/skills.allowlist' or '99_System/skills.versions'."
  echo "Please update the governance files to reflect the skill changes."
  exit 1
fi

echo "Skills governance check passed."
exit 0
