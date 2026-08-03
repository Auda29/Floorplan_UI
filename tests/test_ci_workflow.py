"""Contracts for the repository's GitHub Actions workflow."""

from __future__ import annotations

import re
import unittest
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / ".github" / "workflows" / "ci.yml"
PINNED_ACTION = re.compile(r"^[^@\s]+@[0-9a-f]{40}$")


class CiWorkflowContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.workflow: dict[str, Any] = yaml.safe_load(WORKFLOW.read_text(encoding="utf-8"))
        self.jobs: dict[str, Any] = self.workflow["jobs"]

    def test_expected_quality_jobs_and_gates_are_present(self) -> None:
        self.assertGreaterEqual(
            self.jobs.keys(),
            {"frontend", "backend", "home-assistant", "validate-hacs", "hassfest"},
        )
        frontend = "\n".join(str(step.get("run", "")) for step in self.jobs["frontend"]["steps"])
        backend = "\n".join(str(step.get("run", "")) for step in self.jobs["backend"]["steps"])
        self.assertIn("pnpm run test:e2e", frontend)
        self.assertIn("git diff --exit-code -- src/types/floorplan-config.generated.ts", frontend)
        self.assertIn("ruff check", backend)
        self.assertIn("mypy custom_components/floorplan_ui", backend)
        self.assertIn("coverage report", backend)

        home_assistant = "\n".join(
            str(step.get("run", "")) for step in self.jobs["home-assistant"]["steps"]
        )
        self.assertIn("--cov=custom_components/floorplan_ui", home_assistant)
        self.assertIn("--cov-fail-under=40", home_assistant)
        self.assertNotIn("coverage run", home_assistant)

    def test_current_home_assistant_matrix_tracks_current_packages(self) -> None:
        matrix = self.jobs["home-assistant"]["strategy"]["matrix"]["include"]
        current = next(entry for entry in matrix if entry["name"] == "current")
        packages = current["packages"].split()

        self.assertEqual("3.14", current["python-version"])
        self.assertIn("homeassistant", packages)
        self.assertIn("home-assistant-frontend", packages)
        self.assertFalse(
            any(
                package.startswith(("homeassistant==", "home-assistant-frontend=="))
                for package in packages
            )
        )

    def test_all_external_actions_are_pinned_to_full_commits(self) -> None:
        action_refs = [
            step["uses"]
            for job in self.jobs.values()
            for step in job.get("steps", [])
            if "uses" in step
        ]
        self.assertTrue(action_refs)
        self.assertEqual(
            [ref for ref in action_refs if not PINNED_ACTION.fullmatch(ref)],
            [],
            "Every external action must use a full 40-character commit SHA",
        )


if __name__ == "__main__":
    unittest.main()
