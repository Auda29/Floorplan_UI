"""Repository-level release contract tests."""

from __future__ import annotations

import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ReleaseContractTests(unittest.TestCase):
    """Keep release metadata and bundled artifacts synchronized."""

    def test_versions_match(self) -> None:
        manifest = json.loads(
            (ROOT / "custom_components/floorplan_ui/manifest.json").read_text(
                encoding="utf-8"
            )
        )
        package = json.loads(
            (ROOT / "frontend/package.json").read_text(encoding="utf-8")
        )
        constants = (ROOT / "custom_components/floorplan_ui/const.py").read_text(
            encoding="utf-8"
        )
        match = re.search(r'^INTEGRATION_VERSION = "([^"]+)"$', constants, re.MULTILINE)

        self.assertIsNotNone(match)
        self.assertEqual(manifest["version"], package["version"])
        self.assertEqual(manifest["version"], match.group(1))

    def test_frontend_bundle_and_hacs_brand_are_committed(self) -> None:
        bundle = ROOT / "custom_components/floorplan_ui/frontend/floorplan-ui.js"
        icon = ROOT / "brand/icon.png"

        self.assertGreater(bundle.stat().st_size, 100_000)
        self.assertGreater(icon.stat().st_size, 1_000)


if __name__ == "__main__":
    unittest.main()
