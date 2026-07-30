"""Security contract tests for WebSocket handlers."""

from __future__ import annotations

import ast
import unittest
from pathlib import Path


def _decorator_name(node: ast.expr) -> str:
    if isinstance(node, ast.Attribute):
        return f"{_decorator_name(node.value)}.{node.attr}"
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Call):
        return _decorator_name(node.func)
    return ""


class WebSocketSecurityTests(unittest.TestCase):
    """Prevent accidental removal of admin guards from sensitive commands."""

    def test_mutating_and_registry_handlers_require_admin(self) -> None:
        path = (
            Path(__file__).resolve().parents[1]
            / "custom_components"
            / "floorplan_ui"
            / "websocket.py"
        )
        module = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
        handlers = {
            node.name: {_decorator_name(decorator) for decorator in node.decorator_list}
            for node in module.body
            if isinstance(node, (ast.AsyncFunctionDef, ast.FunctionDef))
        }

        for handler in (
            "websocket_save_config",
            "websocket_validate_config",
            "websocket_list_registry",
        ):
            self.assertIn("websocket_api.require_admin", handlers[handler])


if __name__ == "__main__":
    unittest.main()
