"""Contract tests for the shared Floorplan UI JSON Schema."""

from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

from jsonschema import Draft202012Validator

from tests.test_store import FloorplanStore, valid_config

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = ROOT / "schema" / "floorplan-config.schema.json"


class ConfigSchemaContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
        Draft202012Validator.check_schema(cls.schema)
        cls.validator = Draft202012Validator(cls.schema)

    def test_backend_normalized_config_matches_shared_schema(self) -> None:
        normalized = FloorplanStore.validate_and_normalize(valid_config())

        self.validator.validate(normalized)

    def test_schema_version_matches_python_and_typescript_constants(self) -> None:
        python_constants = (ROOT / "custom_components" / "floorplan_ui" / "const.py").read_text(
            encoding="utf-8"
        )
        typescript_api = (ROOT / "frontend" / "src" / "lib" / "config-api.ts").read_text(
            encoding="utf-8"
        )
        schema_version = self.schema["properties"]["version"]["maximum"]

        self.assertIsNotNone(
            re.search(rf"^CONFIG_VERSION = {schema_version}$", python_constants, re.MULTILINE)
        )
        self.assertIsNotNone(
            re.search(
                rf"^export const CURRENT_CONFIG_VERSION = {schema_version};$",
                typescript_api,
                re.MULTILINE,
            )
        )

    def test_generated_types_are_committed_and_identify_the_schema_source(self) -> None:
        generated = (
            ROOT / "frontend" / "src" / "types" / "floorplan-config.generated.ts"
        ).read_text(encoding="utf-8")

        self.assertIn("AUTO-GENERATED from schema/floorplan-config.schema.json", generated)
        self.assertIn("export interface FloorplanUIConfiguration", generated)


if __name__ == "__main__":
    unittest.main()
