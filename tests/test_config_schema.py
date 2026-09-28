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

    def test_schema_rejects_inputs_rejected_by_backend(self) -> None:
        cases: list[tuple[str, dict]] = []

        missing_content_type = valid_config()
        del missing_content_type["plans"][0]["background"]["content_type"]
        cases.append(("asset without content type", missing_content_type))

        odd_polygon = valid_config()
        odd_polygon["plans"][0]["areas"] = [
            {
                "id": "odd-polygon",
                "area_id": "",
                "shape": {"type": "polygon", "points": [0, 0, 10, 0, 10, 10, 0]},
                "tags": [],
                "style": {"fillOpacity": 0.4, "strokeWidth": 2},
            }
        ]
        cases.append(("odd polygon coordinate count", odd_polygon))

        excessive_polygon = valid_config()
        excessive_polygon["plans"][0]["areas"] = [
            {
                "id": "excessive-polygon",
                "area_id": "",
                "shape": {"type": "polygon", "points": [0, 0] * 1_001},
                "tags": [],
                "style": {"fillOpacity": 0.4, "strokeWidth": 2},
            }
        ]
        cases.append(("excessive polygon coordinate count", excessive_polygon))

        empty_attribute = valid_config()
        empty_attribute["plans"][0]["markers"][0]["bind"]["primary"] = {
            "source": "attr",
            "attr": "",
        }
        cases.append(("empty attribute binding", empty_attribute))

        for name, config in cases:
            with self.subTest(name=name):
                with self.assertRaises(ValueError):
                    FloorplanStore.validate_and_normalize(config)
                self.assertFalse(self.validator.is_valid(config))

    def test_backend_accepted_marker_extensions_match_schema(self) -> None:
        config = valid_config()
        marker = config["plans"][0]["markers"][0]
        marker.pop("icon")
        marker["future_extension"] = {"enabled": True}

        normalized = FloorplanStore.validate_and_normalize(config)

        self.validator.validate(normalized)

    def test_malformed_marker_fields_are_rejected_by_backend_and_schema(self) -> None:
        for field, value in (
            ("icon", []),
            ("icon", None),
            ("area_id", []),
            ("area_id", 123),
            ("action", None),
            ("action", []),
            ("action", {"tap": "unsupported"}),
            ("action", {"tap": []}),
            ("label_mode", []),
            ("bind", {"primary": {"source": []}}),
        ):
            with self.subTest(field=field, value=value):
                config = valid_config()
                config["plans"][0]["markers"][0][field] = value
                self.assertFalse(self.validator.is_valid(config))
                with self.assertRaises(ValueError):
                    FloorplanStore.validate_and_normalize(config)

    def test_supported_marker_actions_and_optional_fields_match_schema(self) -> None:
        for action in (
            {},
            {"tap": "none"},
            {"tap": "toggle"},
            {"tap": "more-info", "extension": True},
        ):
            config = valid_config()
            marker = config["plans"][0]["markers"][0]
            marker["action"] = action
            marker["area_id"] = None
            marker.pop("icon")
            self.validator.validate(FloorplanStore.validate_and_normalize(config))

    def test_unknown_nested_fields_and_null_collections_are_rejected(self) -> None:
        paths = [
            ("plans", 0, "markers", 0, "pos"),
            ("plans", 0, "markers", 0, "bind"),
            ("plans", 0, "markers", 0, "bind", "primary"),
            ("views", 0, "filters"),
            ("views", 0, "marker_overlay"),
            ("views", 0, "marker_overlay", "primary"),
            ("views", 0, "marker_overlay", "badges", 0),
            ("views", 0, "marker_overlay", "badges", 0, "when"),
        ]
        for path in paths:
            with self.subTest(path=path):
                config = valid_config()
                config["views"][0]["marker_overlay"] = {
                    "primary": {"mode": "entity", "entity_id": "sensor.temp", "source": "state"},
                    "badges": [{"entity_id": "light.a", "when": {"state_is": "on"}}],
                }
                node = config
                for key in path:
                    node = node[key]
                node["unexpected"] = True
                self.assertFalse(self.validator.is_valid(config))
                with self.assertRaises(ValueError):
                    FloorplanStore.validate_and_normalize(config)
        for values in (
            {"filters": {"tags": None}},
            {"marker_overlay": None},
            {"marker_overlay": {"badges": None}},
        ):
            config = valid_config()
            config["views"][0].update(values)
            with self.assertRaises(ValueError):
                FloorplanStore.validate_and_normalize(config)

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
