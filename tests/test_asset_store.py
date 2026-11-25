"""Unit tests for content-addressed floorplan image storage."""

from __future__ import annotations

import asyncio
import base64
import importlib
import json
import struct
import sys
import tempfile
import threading
import time
import types
import unittest
from io import BytesIO
from pathlib import Path
from unittest.mock import patch

from PIL import Image


def _load_asset_module():
    root = Path(__file__).resolve().parents[1]
    integration_path = root / "custom_components" / "floorplan_ui"
    sys.modules.setdefault(
        "homeassistant",
        types.ModuleType("homeassistant"),
    )
    core = sys.modules.setdefault(
        "homeassistant.core",
        types.ModuleType("homeassistant.core"),
    )
    core.HomeAssistant = object
    package_name = "floorplan_ui_asset_test"
    package = types.ModuleType(package_name)
    package.__path__ = [str(integration_path)]
    sys.modules[package_name] = package
    return importlib.import_module(f"{package_name}.asset_store")


ASSET_MODULE = _load_asset_module()
AssetValidationError = ASSET_MODULE.AssetValidationError
FloorplanAssetStore = ASSET_MODULE.FloorplanAssetStore
collect_referenced_asset_ids = ASSET_MODULE.collect_referenced_asset_ids
decode_image_data_url = ASSET_MODULE.decode_image_data_url
validate_image_bytes = ASSET_MODULE.validate_image_bytes
validate_glb_bytes = ASSET_MODULE.validate_glb_bytes


def image_bytes(image_format: str, size: tuple[int, int] = (4, 3)) -> bytes:
    """Create a small, fully decodable image fixture."""
    output = BytesIO()
    mode = "RGB" if image_format == "JPEG" else "RGBA"
    Image.new(mode, size, "white").save(output, format=image_format)
    return output.getvalue()


def animated_image_bytes(image_format: str) -> bytes:
    """Create a raster fixture with two distinct frames."""
    output = BytesIO()
    Image.new("RGBA", (4, 3), "white").save(
        output,
        format=image_format,
        save_all=True,
        append_images=[Image.new("RGBA", (4, 3), "black")],
        duration=100,
    )
    return output.getvalue()


PNG = image_bytes("PNG")
JPEG = image_bytes("JPEG")
SVG = b'<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="8"/></svg>'


def make_glb(document: dict | bytes, binary: bytes = b"", *, trailing: bytes = b"") -> bytes:
    """Build a GLB with aligned JSON and optional BIN chunks."""
    raw_json = json.dumps(document).encode() if isinstance(document, dict) else document
    raw_json += b" " * (-len(raw_json) % 4)
    chunks = struct.pack("<I4s", len(raw_json), b"JSON") + raw_json
    if binary:
        binary = binary.ljust(len(binary) + (-len(binary) % 4), b"\0")
        chunks += struct.pack("<I4s", len(binary), b"BIN\0") + binary
    chunks += trailing
    return struct.pack("<4sII", b"glTF", 2, 12 + len(chunks)) + chunks


GLB = make_glb({"asset": {"version": "2.0"}})


class AssetValidationTests(unittest.TestCase):
    def test_png_and_jpeg_are_fully_decoded(self) -> None:
        validate_image_bytes(PNG, "image/png")
        validate_image_bytes(JPEG, "image/jpeg")

    def test_rejects_animated_png_uploads_and_svg_embedded_apng(self) -> None:
        apng = animated_image_bytes("PNG")
        encoded = base64.b64encode(apng).decode()
        svg = f'<svg><image href="data:image/png;base64,{encoded}"/></svg>'.encode()
        for data, content_type in ((apng, "image/png"), (svg, "image/svg+xml")):
            with (
                self.subTest(content_type=content_type),
                self.assertRaisesRegex(
                    AssetValidationError, "Animated PNG images are not supported"
                ),
            ):
                validate_image_bytes(data, content_type)

    def test_signature_only_payload_is_rejected(self) -> None:
        with self.assertRaisesRegex(AssetValidationError, "decoded"):
            validate_image_bytes(b"\x89PNG\r\n\x1a\nnot-an-image", "image/png")

    def test_declared_type_must_match_decoded_format(self) -> None:
        with self.assertRaisesRegex(AssetValidationError, "does not match"):
            validate_image_bytes(JPEG, "image/png")

    def test_excessive_dimensions_are_rejected(self) -> None:
        too_wide = image_bytes("PNG", (16_385, 1))

        with self.assertRaisesRegex(AssetValidationError, "dimensions"):
            validate_image_bytes(too_wide, "image/png")

    def test_excessive_pixel_count_is_rejected(self) -> None:
        output = BytesIO()
        Image.new("1", (8_000, 8_001)).save(output, format="PNG")

        with self.assertRaisesRegex(AssetValidationError, "pixel"):
            validate_image_bytes(output.getvalue(), "image/png")

    def test_embedded_data_url_is_strictly_validated(self) -> None:
        data, content_type = decode_image_data_url(
            f"data:image/png;base64,{base64.b64encode(PNG).decode('ascii')}"
        )
        self.assertEqual(PNG, data)
        self.assertEqual("image/png", content_type)

    def test_svg_supports_local_styles_and_portable_data_urls(self) -> None:
        encoded_png = base64.b64encode(PNG).decode()
        svg = f"""<?xml version="1.0" encoding="UTF-8"?>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <style>rect {{ fill: url("#gradient"); }}</style>
          <defs><linearGradient id="gradient"/><rect id="room"/></defs>
          <use xlink:href="#room"/>
          <image href="data:image/png;base64,{encoded_png}"/>
        </svg>""".encode()
        url = "data:image/svg+xml;base64," + base64.b64encode(svg).decode()
        self.assertEqual((svg, "image/svg+xml"), decode_image_data_url(url))

    def test_svg_fully_validates_embedded_rasters(self) -> None:
        for raster, error in (
            (image_bytes("PNG", (ASSET_MODULE.MAX_IMAGE_WIDTH + 1, 1)), "dimensions"),
            (PNG[:32], "fully decoded"),
            (JPEG, "does not match"),
        ):
            with self.subTest(error=error), self.assertRaisesRegex(AssetValidationError, error):
                uri = "data:image/png;base64," + base64.b64encode(raster).decode()
                validate_image_bytes(f'<svg><image href="{uri}"/></svg>'.encode(), "image/svg+xml")

    def test_svg_counts_embedded_pixels_across_href_and_css(self) -> None:
        uri = "data:image/png;base64," + base64.b64encode(PNG).decode()
        svg = f'<svg><image href="{uri}"/><style>image {{ fill: url({uri}); }}</style></svg>'
        with patch.object(ASSET_MODULE, "_MAX_SVG_EMBEDDED_PIXELS", 24):
            validate_image_bytes(svg.encode(), "image/svg+xml")
        with (
            patch.object(ASSET_MODULE, "_MAX_SVG_EMBEDDED_PIXELS", 23),
            self.assertRaisesRegex(AssetValidationError, "total pixel limit"),
        ):
            validate_image_bytes(svg.encode(), "image/svg+xml")

    def test_svg_rejects_unsafe_xml_and_external_references(self) -> None:
        for svg in (
            b"<svg><script/></svg>",
            b'<svg onload=""/>',
            b"<svg><foreignObject/></svg>",
            b"<!DOCTYPE svg><svg/>",
            b'<!DOCTYPE svg [<!ENTITY forbidden "value">]><svg/>',
            b'<?xml-stylesheet href="style.css"?><svg/>',
            b'<svg><use href="javascript:"/></svg>',
            b'<svg><image href="//example.com/image.png"/></svg>',
            b'<svg><image href="image.png"/></svg>',
            b'<svg><image href="data:image/svg+xml;base64,PHN2Zy8+"/></svg>',
            b'<svg><image href="data:image/png;base64,invalid!"/></svg>',
            b"<svg><style>@import 'style.css';</style></svg>",
            b'<svg><style>rect {fill: url("https://example.com/image.svg");}</style></svg>',
            b'<svg><rect style="fill: url(//example.com/image.svg)"/></svg>',
            b'<svg><rect fill="url(file:///image.svg)"/></svg>',
            b"<svg>\xff</svg>",
            "<svg/>".encode("utf-16-le"),
            b"<html/>",
        ):
            with self.subTest(svg=svg), self.assertRaises(AssetValidationError):
                validate_image_bytes(svg, "image/svg+xml")

    def test_glb_supports_bin_chunk_and_embedded_images(self) -> None:
        validate_glb_bytes(GLB)
        validate_glb_bytes(
            make_glb(
                {
                    "asset": {"version": "2.0"},
                    "buffers": [{"byteLength": len(PNG)}],
                    "bufferViews": [{"buffer": 0, "byteLength": len(PNG)}],
                    "images": [
                        {"bufferView": 0, "mimeType": "image/png"},
                        {"uri": f"data:image/png;base64,{base64.b64encode(PNG).decode()}"},
                    ],
                    "extensionsUsed": ["KHR_lights_punctual"],
                },
                PNG,
            )
        )

    def test_glb_rejects_bad_headers_and_chunks(self) -> None:
        cases = {
            "magic": b"glTz" + GLB[4:],
            "version": GLB[:4] + struct.pack("<I", 1) + GLB[8:],
            "truncated header": GLB[:15],
            "truncated body": GLB[:-1],
            "unaligned chunk": GLB[:12] + struct.pack("<I", 25) + GLB[16:],
            "missing JSON type": GLB[:16] + b"BIN\0" + GLB[20:],
            "malformed JSON": make_glb(b'{"asset":'),
            "invalid UTF-8": make_glb(b'{"asset":"\xff"}'),
            "non-finite JSON": make_glb(b'{"asset":{"version":"2.0"},"extra":NaN}'),
            "duplicate key": make_glb(b'{"asset":{"version":"2.0","version":"2.0"}}'),
            "unknown second chunk": make_glb(
                {"asset": {"version": "2.0"}}, trailing=struct.pack("<I4s", 0, b"JUNK")
            ),
            "extra chunk": make_glb({"asset": {"version": "2.0"}}, b"abcd", trailing=b"garbage!"),
            "oversized JSON": make_glb(b" " * (ASSET_MODULE.MAX_GLB_JSON_CHUNK_BYTES + 1)),
            "oversized model": GLB.ljust(ASSET_MODULE.MAX_MODEL_FILE_BYTES + 1, b" "),
        }
        for name, sample in cases.items():
            with self.subTest(name=name), self.assertRaises(AssetValidationError):
                validate_glb_bytes(sample)

    def test_glb_rejects_invalid_buffers_and_images(self) -> None:
        cases = (
            {"asset": {"version": "1.0"}},
            {"buffers": {}},
            {"buffers": [{"uri": "external.bin"}]},
            {"buffers": [{"uri": "data:application/octet-stream;base64,YQ=="}]},
            {"buffers": [{"byteLength": 5}]},
            {"buffers": [{"byteLength": True}]},
            {"buffers": [{"byteLength": -1}]},
            {"images": {}},
            {"images": [{"uri": "https://example.com/texture.png"}]},
            {"images": [{"uri": "texture.png", "bufferView": 0}]},
            {"images": [{"uri": "data:image/svg+xml;base64,PHN2Zy8+"}]},
            {"images": [{"uri": "data:image/webp;base64,invalid!"}]},
            {"images": [{"bufferView": False}]},
            {"images": [{}]},
            {"accessors": [{"count": 2_000_001}]},
            {"bufferViews": [{"byteOffset": 0, "byteLength": 8}]},
            {"images": [{"bufferView": 0}], "bufferViews": [{"byteOffset": 0, "byteLength": 4}]},
        )
        for fields in cases:
            with self.subTest(fields=fields), self.assertRaises(AssetValidationError):
                validate_glb_bytes(make_glb({"asset": {"version": "2.0"}, **fields}, b"abcd"))

    def test_glb_allowlists_required_extensions(self) -> None:
        document = {"asset": {"version": "2.0"}}
        supported = [
            "EXT_materials_bump",
            "EXT_mesh_gpu_instancing",
            "EXT_texture_webp",
            "KHR_materials_diffuse_roughness",
            "KHR_materials_unlit",
        ]
        validate_glb_bytes(make_glb({**document, "extensionsRequired": supported}))
        for extension in (
            "KHR_draco_mesh_compression",
            "EXT_meshopt_compression",
            "KHR_meshopt_compression",
            "KHR_materials_pbrSpecularGlossiness",
            "KHR_texture_basisu",
            "EXT_unknown",
        ):
            with (
                self.subTest(extension=extension),
                self.assertRaisesRegex(AssetValidationError, f"unsupported extension.*{extension}"),
            ):
                validate_glb_bytes(make_glb({**document, "extensionsRequired": [extension]}))
        validate_glb_bytes(make_glb({**document, "extensionsUsed": ["EXT_unknown"]}))

    def test_glb_rejects_two_uri_less_buffers(self) -> None:
        document = {
            "asset": {"version": "2.0"},
            "buffers": [{"byteLength": 4}, {"byteLength": 4}],
        }
        with self.assertRaisesRegex(AssetValidationError, "at most one BIN buffer"):
            validate_glb_bytes(make_glb(document, bytes(8)))

    def test_glb_validates_buffer_view_indices_declared_lengths_and_strides(self) -> None:
        for fields, error in (
            ({"buffer": 1}, "buffer index"),
            ({"buffer": False}, "buffer index"),
            ({"byteOffset": 4}, "declared buffer"),
            ({"byteStride": 6}, "byteStride"),
            ({"byteStride": 256}, "byteStride"),
        ):
            with self.subTest(fields=fields), self.assertRaisesRegex(AssetValidationError, error):
                validate_glb_bytes(
                    make_glb(
                        {
                            "asset": {"version": "2.0"},
                            "buffers": [{"byteLength": 5}],
                            "bufferViews": [{"buffer": 0, "byteLength": 4, **fields}],
                        },
                        bytes(8),
                    )
                )

    def test_glb_validates_interleaved_accessor_spans(self) -> None:
        view = {"buffer": 0, "byteLength": 28, "byteStride": 16}
        accessor = {"bufferView": 0, "componentType": 5126, "count": 2, "type": "VEC3"}
        document = {
            "asset": {"version": "2.0"},
            "buffers": [{"byteLength": 28}],
            "bufferViews": [view],
            "accessors": [accessor],
        }
        validate_glb_bytes(make_glb(document, bytes(28)))
        for fields, error in (
            ({"bufferView": 1}, "bufferView index"),
            ({"byteOffset": 2}, "byteOffset"),
            ({"count": 3}, "byte span"),
            ({"componentType": 5124}, "componentType"),
            ({"type": "VEC5"}, "accessor type"),
        ):
            with self.subTest(fields=fields), self.assertRaisesRegex(AssetValidationError, error):
                validate_glb_bytes(
                    make_glb({**document, "accessors": [{**accessor, **fields}]}, bytes(28))
                )
        for fields in ({"byteLength": 27}, {"byteStride": 8}):
            with (
                self.subTest(fields=fields),
                self.assertRaisesRegex(AssetValidationError, "byte span"),
            ):
                validate_glb_bytes(
                    make_glb({**document, "bufferViews": [{**view, **fields}]}, bytes(28))
                )

    def test_glb_accessor_spans_include_matrix_column_padding(self) -> None:
        for shape, component, count, length in (
            ("MAT2", 5121, 1, 6),
            ("MAT3", 5121, 1, 11),
            ("MAT3", 5121, 2, 23),
            ("MAT3", 5123, 1, 22),
        ):
            with self.subTest(shape=shape, component=component, count=count):
                view = {"buffer": 0, "byteLength": length}
                accessor = {
                    "bufferView": 0,
                    "componentType": component,
                    "count": count,
                    "type": shape,
                }
                document = {
                    "asset": {"version": "2.0"},
                    "buffers": [{"byteLength": length + 4}],
                    "bufferViews": [view],
                    "accessors": [accessor],
                }
                binary = bytes(length + 4)
                validate_glb_bytes(make_glb(document, binary))
                view["byteLength"] = length - 1
                with self.assertRaisesRegex(AssetValidationError, "byte span"):
                    validate_glb_bytes(make_glb(document, binary))
                view["byteLength"] = length + 1
                accessor["byteOffset"] = 1
                with self.assertRaisesRegex(AssetValidationError, "misaligned"):
                    validate_glb_bytes(make_glb(document, binary))
                accessor["byteOffset"] = 0
                view["byteOffset"] = 1
                with self.assertRaisesRegex(AssetValidationError, "misaligned"):
                    validate_glb_bytes(make_glb(document, binary))

    def test_glb_validates_sparse_matrix_value_span_and_alignment(self) -> None:
        values = {"bufferView": 1}
        view = {"buffer": 0, "byteOffset": 4, "byteLength": 23}
        document = {
            "asset": {"version": "2.0"},
            "buffers": [{"byteLength": 28}],
            "bufferViews": [{"buffer": 0, "byteLength": 2}, view],
            "accessors": [
                {
                    "componentType": 5121,
                    "count": 3,
                    "type": "MAT3",
                    "sparse": {
                        "count": 2,
                        "indices": {"bufferView": 0, "componentType": 5121},
                        "values": values,
                    },
                }
            ],
        }
        binary = bytes([0, 2]) + bytes(26)
        validate_glb_bytes(make_glb(document, binary))
        view["byteLength"] = 22
        with self.assertRaisesRegex(AssetValidationError, "byte span"):
            validate_glb_bytes(make_glb(document, binary))
        view["byteLength"] = 24
        values["byteOffset"] = 1
        with self.assertRaisesRegex(AssetValidationError, "misaligned"):
            validate_glb_bytes(make_glb(document, binary))

    def test_glb_validates_sparse_index_and_value_spans(self) -> None:
        indices = {"bufferView": 0, "componentType": 5121}
        values = {"bufferView": 1}
        sparse = {"count": 2, "indices": indices, "values": values}
        accessor = {"componentType": 5126, "count": 4, "type": "VEC3", "sparse": sparse}
        document = {
            "asset": {"version": "2.0"},
            "buffers": [{"byteLength": 28}],
            "bufferViews": [
                {"buffer": 0, "byteLength": 2},
                {"buffer": 0, "byteOffset": 4, "byteLength": 24},
            ],
            "accessors": [accessor],
        }
        binary = bytes([0, 1]) + bytes(26)
        validate_glb_bytes(make_glb(document, binary))
        for pair, error in (
            ([0, 0], "strictly increasing"),
            ([1, 0], "strictly increasing"),
            ([0, 4], "out of range"),
        ):
            with self.subTest(pair=pair), self.assertRaisesRegex(AssetValidationError, error):
                validate_glb_bytes(make_glb(document, bytes(pair) + binary[2:]))
        for fields, error in (
            ({"count": 5}, "sparse accessor count"),
            ({"indices": {**indices, "componentType": 5122}}, "index componentType"),
            ({"indices": {**indices, "byteOffset": 1}}, "byte span"),
            ({"values": {"bufferView": 2}}, "bufferView index"),
            ({"values": {**values, "byteOffset": 4}}, "byte span"),
        ):
            with self.subTest(fields=fields), self.assertRaisesRegex(AssetValidationError, error):
                accessor["sparse"] = {**sparse, **fields}
                validate_glb_bytes(make_glb(document, binary))

    def test_glb_rejects_stride_and_target_on_sparse_buffer_views(self) -> None:
        views = [
            {"buffer": 0, "byteLength": 2},
            {"buffer": 0, "byteOffset": 4, "byteLength": 8},
        ]
        document = {
            "asset": {"version": "2.0"},
            "buffers": [{"byteLength": 12}],
            "bufferViews": views,
            "accessors": [
                {
                    "componentType": 5126,
                    "count": 2,
                    "type": "SCALAR",
                    "sparse": {
                        "count": 2,
                        "indices": {"bufferView": 0, "componentType": 5121},
                        "values": {"bufferView": 1},
                    },
                }
            ],
        }
        binary = bytes([0, 1]) + bytes(10)
        validate_glb_bytes(make_glb(document, binary))
        for view_index, field, value in (
            (0, "byteStride", 4),
            (0, "target", 34963),
            (1, "byteStride", 4),
            (1, "target", 34962),
        ):
            buffer_views = views.copy()
            buffer_views[view_index] = {**views[view_index], field: value}
            with (
                self.subTest(view_index=view_index, field=field),
                self.assertRaisesRegex(AssetValidationError, "sparse accessor bufferView"),
            ):
                validate_glb_bytes(make_glb({**document, "bufferViews": buffer_views}, binary))

    def test_glb_rejects_animated_png_and_webp_textures(self) -> None:
        for image_format in ("PNG", "WEBP"):
            texture = animated_image_bytes(image_format)
            document = {
                "asset": {"version": "2.0"},
                "buffers": [{"byteLength": len(texture)}],
                "bufferViews": [{"buffer": 0, "byteLength": len(texture)}],
                "images": [{"bufferView": 0, "mimeType": f"image/{image_format.lower()}"}],
            }
            with (
                self.subTest(image_format=image_format),
                self.assertRaisesRegex(AssetValidationError, "animated textures"),
            ):
                validate_glb_bytes(make_glb(document, texture))

    def test_glb_accepts_valid_embedded_bufferview_png_and_rejects_oversized_texture(self) -> None:
        padded_png = PNG + b"\x00" * ((4 - len(PNG) % 4) % 4)
        valid_doc = {
            "asset": {"version": "2.0"},
            "buffers": [{"byteLength": len(padded_png)}],
            "bufferViews": [{"buffer": 0, "byteOffset": 0, "byteLength": len(PNG)}],
            "images": [{"bufferView": 0, "mimeType": "image/png"}],
        }
        validate_glb_bytes(make_glb(valid_doc, padded_png))

        bomb_png = BytesIO()
        Image.new("RGB", (ASSET_MODULE.MAX_IMAGE_WIDTH + 1, 1), color=(0, 0, 0)).save(
            bomb_png, format="PNG"
        )
        bomb_bytes = bomb_png.getvalue()
        padded_bomb = bomb_bytes + b"\x00" * ((4 - len(bomb_bytes) % 4) % 4)
        bomb_doc = {
            "asset": {"version": "2.0"},
            "buffers": [{"byteLength": len(padded_bomb)}],
            "bufferViews": [{"buffer": 0, "byteOffset": 0, "byteLength": len(bomb_bytes)}],
            "images": [{"bufferView": 0, "mimeType": "image/png"}],
        }
        with self.assertRaises(AssetValidationError):
            validate_glb_bytes(make_glb(bomb_doc, padded_bomb))

    def test_model_data_url_is_unavailable(self) -> None:
        with self.assertRaises(AssetValidationError):
            decode_image_data_url("data:model/gltf-binary;base64," + base64.b64encode(GLB).decode())


class AssetReferenceTests(unittest.TestCase):
    def test_collects_unique_references_from_multiple_plans(self) -> None:
        config = {
            "plans": [
                {"background": {"asset_id": "a" * 64}},
                {"background": {"asset_id": "a" * 64}},
                {"background": {"type": "model", "asset_id": "b" * 64}},
                {"background": {"asset_id": "unsafe"}},
            ]
        }

        self.assertEqual(
            {"a" * 64, "b" * 64},
            collect_referenced_asset_ids(config),
        )


class AssetPersistenceTests(unittest.IsolatedAsyncioTestCase):
    @staticmethod
    def _store(directory: str) -> FloorplanAssetStore:
        class Config:
            @staticmethod
            def path(_relative: str) -> str:
                return directory

        class Hass:
            config = Config()

            @staticmethod
            async def async_add_executor_job(function, *args):
                return await asyncio.to_thread(function, *args)

        return FloorplanAssetStore(Hass())

    async def test_assets_are_content_addressed_and_deduplicated(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            store = self._store(directory)
            first = await store.async_store(PNG, "image/png")
            second = await store.async_store(PNG, "image/png")

            self.assertEqual(first, second)
            self.assertTrue(store.path_for(first.asset_id, first.content_type).is_file())

    async def test_raw_image_validation_runs_once_outside_the_event_loop(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            store = self._store(directory)
            event_loop_thread = threading.get_ident()
            validation_threads: list[int] = []
            original_validate = ASSET_MODULE.validate_image_bytes

            def track_validation(data: bytes, content_type: str) -> None:
                validation_threads.append(threading.get_ident())
                original_validate(data, content_type)

            with patch.object(ASSET_MODULE, "validate_image_bytes", side_effect=track_validation):
                await store.async_store(PNG, "image/png")

            self.assertEqual(1, len(validation_threads))
            self.assertNotEqual(event_loop_thread, validation_threads[0])

    async def test_legacy_data_url_is_decoded_once_outside_the_event_loop(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            store = self._store(directory)
            event_loop_thread = threading.get_ident()
            validation_threads: list[int] = []
            original_validate = ASSET_MODULE.validate_image_bytes
            data_url = f"data:image/png;base64,{base64.b64encode(PNG).decode('ascii')}"

            def track_validation(data: bytes, content_type: str) -> None:
                validation_threads.append(threading.get_ident())
                original_validate(data, content_type)

            with patch.object(ASSET_MODULE, "validate_image_bytes", side_effect=track_validation):
                await store.async_store_data_url(data_url)

            self.assertEqual(1, len(validation_threads))
            self.assertNotEqual(event_loop_thread, validation_threads[0])


class AssetGarbageCollectionTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self._temporary = tempfile.TemporaryDirectory()
        directory = self._temporary.name

        class Config:
            @staticmethod
            def path(_relative: str) -> str:
                return directory

        class Hass:
            config = Config()

            @staticmethod
            async def async_add_executor_job(function, *args):
                return await asyncio.to_thread(function, *args)

        self.store = FloorplanAssetStore(Hass())

    def tearDown(self) -> None:
        self._temporary.cleanup()

    def _asset_file(self, asset_id: str, *, age_seconds: int) -> Path:
        path = self.store.directory / f"{asset_id}.png"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(PNG)
        timestamp = time.time() - age_seconds
        path.touch()
        path.chmod(0o600)
        import os

        os.utime(path, (timestamp, timestamp))
        return path

    async def test_retains_newly_unreferenced_old_images_until_grace_expires(self) -> None:
        referenced = "a" * 64
        orphan = "b" * 64
        fresh = "c" * 64
        referenced_path = self._asset_file(referenced, age_seconds=10_000)
        orphan_path = self._asset_file(orphan, age_seconds=10_000)
        fresh_path = self._asset_file(fresh, age_seconds=10)
        invalid_path = self.store.directory / "not-an-asset.png"
        invalid_path.write_bytes(PNG)

        started = time.time()
        self.assertEqual(
            [], await self.store.async_collect_garbage({referenced}, grace_seconds=300)
        )
        self.assertTrue(orphan_path.exists())
        # Referencing the fresh asset clears its orphan timestamp.
        await self.store.async_collect_garbage({referenced, fresh}, grace_seconds=300)
        with patch.object(ASSET_MODULE.time, "time", return_value=started + 301):
            deleted = await self.store.async_collect_garbage({referenced, fresh}, grace_seconds=300)

        self.assertEqual([orphan], deleted)
        self.assertTrue(referenced_path.exists())
        self.assertFalse(orphan_path.exists())
        self.assertTrue(fresh_path.exists())
        self.assertTrue(invalid_path.exists())

    async def test_glb_and_svg_use_the_same_garbage_collection_grace_period(self) -> None:
        svg = await self.store.async_store(SVG, "image/svg+xml")
        glb = await self.store.async_store(GLB, "model/gltf-binary")
        svg_path = self.store.path_for(svg.asset_id, svg.content_type)
        glb_path = self.store.path_for(glb.asset_id, glb.content_type)
        self.assertEqual(".svg", svg_path.suffix)
        self.assertEqual(".glb", glb_path.suffix)
        self.assertEqual(SVG, svg_path.read_bytes())
        self.assertEqual(GLB, glb_path.read_bytes())

        self.assertEqual([], await self.store.async_collect_garbage({glb.asset_id}))
        self.assertEqual([], await self.store.async_collect_garbage(set()))
        with patch.object(
            ASSET_MODULE.time,
            "time",
            return_value=time.time() + ASSET_MODULE.ASSET_GC_GRACE_SECONDS + 1,
        ):
            removed = await self.store.async_collect_garbage(set())

        self.assertCountEqual([svg.asset_id, glb.asset_id], removed)
        self.assertFalse(svg_path.exists())
        self.assertFalse(glb_path.exists())

    async def test_dry_run_reports_without_deleting_and_is_idempotent(self) -> None:
        orphan = "d" * 64
        orphan_path = self._asset_file(orphan, age_seconds=10_000)

        candidates = await self.store.async_collect_garbage(set(), grace_seconds=0, dry_run=True)
        self.assertFalse(orphan_path.with_name(f".{orphan_path.name}.unreferenced").exists())
        deleted = await self.store.async_collect_garbage(set(), grace_seconds=0)
        repeated = await self.store.async_collect_garbage(set(), grace_seconds=300)

        self.assertEqual([orphan], candidates)
        self.assertEqual([orphan], deleted)
        self.assertEqual([], repeated)
        self.assertFalse(orphan_path.exists())

    async def test_undo_and_reupload_reset_retention_across_restarts(self) -> None:
        reference = await self.store.async_store(PNG, "image/png")
        path = self.store.path_for(reference.asset_id, reference.content_type)
        await self.store.async_collect_garbage(set(), grace_seconds=300)
        marker = path.with_name(f".{path.name}.unreferenced")
        self.assertTrue(marker.exists())
        # A restored plan removes the orphan timestamp.
        await self.store.async_collect_garbage({reference.asset_id}, grace_seconds=300)
        self.assertFalse(marker.exists())
        await self.store.async_collect_garbage(set(), grace_seconds=300)
        # Retention survives an integration restart.
        restarted = FloorplanAssetStore(self.store._hass)
        with patch.object(ASSET_MODULE.time, "time", return_value=time.time() + 301):
            self.assertEqual(
                [reference.asset_id],
                await restarted.async_collect_garbage(set(), grace_seconds=300, dry_run=True),
            )
            await restarted.async_store(PNG, "image/png")
            self.assertEqual([], await restarted.async_collect_garbage(set(), grace_seconds=300))
        self.assertTrue(path.exists())

    async def test_gc_skips_symlinked_asset_directory(self) -> None:
        with tempfile.TemporaryDirectory() as external_dir:
            target = Path(external_dir)
            victim = target / f"{'e' * 64}.png"
            victim.write_bytes(PNG)
            symlink_dir = Path(self._temporary.name) / "symlinked-assets"
            symlink_dir.symlink_to(target)
            self.store._directory = symlink_dir

            removed = await self.store.async_collect_garbage(set(), grace_seconds=0)

            self.assertEqual([], removed)
            self.assertTrue(victim.exists())
