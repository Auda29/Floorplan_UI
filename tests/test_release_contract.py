"""Repository-level release contract tests."""

from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class ReleaseContractTests(unittest.TestCase):
    """Keep release metadata and bundled artifacts synchronized."""

    RELEASE_VERSION = "0.2.0-beta.3"

    def test_release_version_is_expected_beta(self) -> None:
        manifest = json.loads(
            (ROOT / "custom_components/floorplan_ui/manifest.json").read_text(encoding="utf-8")
        )

        self.assertEqual(self.RELEASE_VERSION, manifest["version"])

    def test_versions_match(self) -> None:
        manifest = json.loads(
            (ROOT / "custom_components/floorplan_ui/manifest.json").read_text(encoding="utf-8")
        )
        package = json.loads((ROOT / "frontend/package.json").read_text(encoding="utf-8"))
        constants = (ROOT / "custom_components/floorplan_ui/const.py").read_text(encoding="utf-8")
        match = re.search(r'^INTEGRATION_VERSION = "([^"]+)"$', constants, re.MULTILINE)

        self.assertIsNotNone(match)
        self.assertEqual(manifest["version"], package["version"])
        self.assertEqual(manifest["version"], match.group(1))

    def test_frontend_bundle_and_hacs_brand_are_committed(self) -> None:
        bundle = ROOT / "custom_components/floorplan_ui/frontend/floorplan-ui.js"
        icon = ROOT / "custom_components/floorplan_ui/brand/icon.png"

        self.assertGreater(bundle.stat().st_size, 100_000)
        self.assertGreater(icon.stat().st_size, 1_000)

    def test_yaml_setup_declares_an_empty_config_schema(self) -> None:
        integration = (ROOT / "custom_components/floorplan_ui/__init__.py").read_text(
            encoding="utf-8"
        )

        self.assertIn("CONFIG_SCHEMA = cv.empty_config_schema(DOMAIN)", integration)


if __name__ == "__main__":
    unittest.main()
