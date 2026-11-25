// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Box3,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  PointLight,
  Vector3,
} from "three";
import type { Scene } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { HassEntity } from "../types/home-assistant";
import {
  computeCameraPreset,
  createThreeViewport,
  getLightSettings,
  kelvinToRgb,
  projectPointToScreen,
} from "./three-viewport";
import type {
  ThreeViewportController,
  ThreeViewportMarker,
  ThreeViewportOptions,
} from "./three-viewport";

const webgl = vi.hoisted(() => ({
  mockRenderer: true,
  render: vi.fn(),
  dispose: vi.fn(),
  forceContextLoss: vi.fn(),
  shadowMap: { enabled: false },
}));

vi.mock("three", async (importOriginal) => {
  const three = await importOriginal<typeof import("three")>();
  function TestRenderer(options: { canvas: HTMLCanvasElement }) {
    if (!webgl.mockRenderer) return new three.WebGLRenderer(options);
    return {
      domElement: options.canvas,
      shadowMap: webgl.shadowMap,
      render: webgl.render,
      dispose: webgl.dispose,
      forceContextLoss: webgl.forceContextLoss,
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
    };
  }
  return { ...three, WebGLRenderer: TestRenderer };
});

const bounds = new Box3(new Vector3(-3, -1, -2), new Vector3(7, 3, 4));

describe("camera and light calculations", () => {
  it("fits model bounds for each built-in angle in both camera modes", () => {
    for (const preset of ["isometric", "top", "front"] as const) {
      const plan = computeCameraPreset(bounds, preset, 0.5);
      expect(plan.target.toArray()).toEqual([2, 1, 1]);
      if (preset === "top") expect(plan.position.y).toBeGreaterThan(plan.position.z);
      if (preset === "front") expect(plan.position.y).toBe(plan.target.y);
      const camera = new PerspectiveCamera(45, 0.5, 0.01, 1_000);
      const width = plan.viewHeight * 0.5;
      const ortho = new OrthographicCamera(
        -width / 2,
        width / 2,
        plan.viewHeight / 2,
        -plan.viewHeight / 2,
        0.01,
        1_000
      );
      for (const view of [camera, ortho]) {
        view.position.copy(plan.position);
        view.lookAt(plan.target);
        view.updateMatrixWorld();
        for (const x of [bounds.min.x, bounds.max.x]) {
          for (const y of [bounds.min.y, bounds.max.y]) {
            for (const z of [bounds.min.z, bounds.max.z]) {
              expect(projectPointToScreen({ x, y, z }, view, 400, 800)).not.toBeNull();
            }
          }
        }
      }
    }
  });

  it("projects to CSS pixels and hides points behind or outside the camera", () => {
    const camera = new OrthographicCamera(-2, 2, 1, -1, 0.1, 50);
    camera.position.set(0, 0, 10);
    camera.updateMatrixWorld();
    expect(projectPointToScreen({ x: 0, y: 0, z: 0 }, camera, 200, 100)).toEqual({ x: 100, y: 50 });
    expect(projectPointToScreen({ x: 1, y: 0.5, z: 0 }, camera, 200, 100)).toEqual({
      x: 150,
      y: 25,
    });
    expect(projectPointToScreen({ x: 0, y: 0, z: 20 }, camera, 200, 100)).toBeNull();
    expect(projectPointToScreen({ x: 3, y: 0, z: 0 }, camera, 200, 100)).toBeNull();
    expect(projectPointToScreen({ x: 0, y: 0, z: -50 }, camera, 200, 100)).toBeNull();
  });

  it("uses RGB, warm white, or color temperature and clamps brightness", () => {
    const warm = kelvinToRgb(2700);
    const cool = kelvinToRgb(9000);
    expect(warm[0]).toBeGreaterThan(warm[2]);
    expect(cool[2]).toBeGreaterThan(cool[0]);
    expect(getLightSettings({ state: "off", attributes: { brightness: 255 } })).toBeNull();
    expect(getLightSettings({ state: "unavailable", attributes: {} })).toBeNull();
    expect(getLightSettings({ state: "on", attributes: {} })?.color.getHexString()).toBe("ffd9a0");
    const rgb = getLightSettings({
      state: "on",
      attributes: { brightness: 128, rgb_color: [0, 128, 255], color_temp_kelvin: 2700 },
    });
    expect(rgb?.brightness).toBeCloseTo(128 / 255);
    expect(rgb?.color.getHexString()).toBe("0080ff");
    const kelvin = getLightSettings({
      state: "on",
      attributes: { brightness: 500, color_temp_kelvin: 2700 },
    });
    expect(kelvin?.brightness).toBe(1);
    expect(kelvin?.color.b).toBeLessThan(kelvin?.color.r ?? 0);
    expect(getLightSettings({ state: "on", attributes: { brightness: -1 } })?.brightness).toBe(0);
  });
});

function minimalGlb(): ArrayBuffer {
  const json = '{"asset":{"version":"2.0"},"scene":0,"scenes":[{"nodes":[]}]}';
  const padded = json.padEnd(Math.ceil(json.length / 4) * 4);
  const data = new ArrayBuffer(20 + padded.length);
  const view = new DataView(data);
  view.setUint32(0, 0x46546c67, true);
  view.setUint32(4, 2, true);
  view.setUint32(8, data.byteLength, true);
  view.setUint32(12, padded.length, true);
  view.setUint32(16, 0x4e4f534a, true);
  new Uint8Array(data, 20).set(new TextEncoder().encode(padded));
  return data;
}

function entity(
  entity_id: string,
  state: string,
  attributes: Record<string, unknown> = {}
): HassEntity {
  return {
    entity_id,
    state,
    attributes,
    last_changed: "",
    last_updated: "",
    context: { id: "", parent_id: null, user_id: null },
  };
}

function lamp(id: string): ThreeViewportMarker {
  return {
    id,
    entity_id: `light.${id}`,
    area_id: "room",
    pos: { x: 0, y: 1, z: 0 },
    tags: [],
    label_mode: "auto",
    bind: { primary: { source: "state" }, secondary: { source: "attr", attr: "brightness" } },
    action: { tap: "toggle" },
  };
}

function pointer(target: Element, type: string, x: number, y: number, buttons = 0): void {
  const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0, buttons });
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    pointerType: { value: "mouse" },
    isPrimary: { value: true },
  });
  target.dispatchEvent(event);
}

describe("Three.js viewport lifecycle", () => {
  let pendingFrames: Map<number, (timestamp: number) => void>;
  let container: HTMLDivElement;
  let controller: ThreeViewportController | undefined;

  function drawFrame(time = performance.now()): void {
    const frames = [...pendingFrames.values()];
    pendingFrames.clear();
    for (const callback of frames) callback(time);
  }

  function mount(options: Partial<ThreeViewportOptions> = {}): ThreeViewportController {
    controller = createThreeViewport(container, {
      loadModelBuffer: async () => minimalGlb(),
      ...options,
    });
    const canvas = container.querySelector("canvas");
    if (canvas) {
      vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 400, 300));
      canvas.setPointerCapture = vi.fn();
      canvas.releasePointerCapture = vi.fn();
      Object.defineProperty(canvas, "clientHeight", { value: 300 });
    }
    return controller;
  }

  function addRoomToLoadedScene(defer?: (finish: () => void) => void) {
    const mesh = new Mesh(new BoxGeometry(4, 1, 4), new MeshStandardMaterial());
    mesh.name = "room-mesh";
    const parse = GLTFLoader.prototype.parse;
    vi.spyOn(GLTFLoader.prototype, "parse").mockImplementation(function (
      this: GLTFLoader,
      data,
      path,
      onLoad,
      onError
    ) {
      parse.call(
        this,
        data,
        path,
        (gltf) => {
          gltf.scene.add(mesh);
          if (defer) defer(() => onLoad(gltf));
          else onLoad(gltf);
        },
        onError
      );
    });
    return mesh;
  }

  beforeEach(() => {
    webgl.mockRenderer = true;
    webgl.shadowMap.enabled = false;
    pendingFrames = new Map();
    let id = 0;
    vi.stubGlobal("requestAnimationFrame", (callback: (timestamp: number) => void) => {
      pendingFrames.set(++id, callback);
      return id;
    });
    vi.stubGlobal("cancelAnimationFrame", (frame: number) => pendingFrames.delete(frame));
    container = document.createElement("div");
    document.body.append(container);
    Object.defineProperties(container, {
      clientWidth: { value: 400 },
      clientHeight: { value: 300 },
    });
  });

  afterEach(() => {
    controller?.destroy();
    controller = undefined;
    container.remove();
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("surfaces the real renderer's WebGL error and tears down the fallback", async () => {
    webgl.mockRenderer = false;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const loadModelBuffer = vi.fn();
    const onError = vi.fn();
    const viewport = mount({ loadModelBuffer, onError });

    expect(await viewport.ready).toBe(false);
    expect(container.querySelector("[role=alert]")?.textContent).toContain("WebGL");
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(loadModelBuffer).not.toHaveBeenCalled();
    expect(viewport.raycastClientPoint(0, 0)).toBeNull();
    expect(pendingFrames.size).toBe(0);
    viewport.destroy();
    expect(container.childElementCount).toBe(0);
    expect(container.style.position).toBe("");
  });

  it("reports a model load or validation error", async () => {
    const onError = vi.fn();
    const viewport = mount({ loadModelBuffer: async () => new ArrayBuffer(0), onError });
    expect(await viewport.ready).toBe(false);
    expect(container.querySelector("[role=alert]")?.textContent).toContain("could not be loaded");
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("too short") })
    );
  });

  it("coalesces idle frames, switches cameras, and stops after an animated area focus", async () => {
    const viewport = mount({
      areas: [
        { id: "area", area_id: "room", tags: [], shape: { type: "anchor3d", x: 2, y: 0, z: 1 } },
      ],
      camera_presets: [
        {
          id: "custom",
          mode: "perspective",
          position: { x: 8, y: 6, z: 7 },
          target: { x: 0, y: 0, z: 0 },
        },
      ],
    });
    expect(await viewport.ready).toBe(true);
    viewport.requestRender();
    viewport.requestRender();
    expect(pendingFrames.size).toBe(1);
    drawFrame();
    expect(webgl.render).toHaveBeenCalledTimes(1);
    expect(webgl.render.mock.lastCall?.[1]).toBeInstanceOf(OrthographicCamera);
    expect(pendingFrames.size).toBe(0);

    expect(viewport.applyCameraPreset("custom")).toBe(true);
    expect(viewport.getCameraPreset()?.position).toMatchObject({
      x: expect.closeTo(8),
      y: expect.closeTo(6),
      z: expect.closeTo(7),
    });
    drawFrame();
    expect(webgl.render.mock.lastCall?.[1]).toBeInstanceOf(PerspectiveCamera);
    viewport.setCameraMode("ortho");
    expect(viewport.focusArea("area")).toBe(true);
    const time = performance.now();
    drawFrame(time + 100);
    expect(pendingFrames.size).toBe(1);
    drawFrame(time + 400);
    drawFrame(time + 420);
    expect(pendingFrames.size).toBe(0);
    expect(viewport.getCameraPreset()?.target).toEqual({ x: 2, y: 0, z: 1 });

    viewport.requestRender();
    viewport.destroy();
    expect(pendingFrames.size).toBe(0);
    expect(webgl.dispose).toHaveBeenCalledOnce();
    expect(webgl.forceContextLoss).toHaveBeenCalledOnce();
  });

  it("continues drawing during OrbitControls damping and settles back to idle", async () => {
    const viewport = mount();
    expect(await viewport.ready).toBe(true);
    drawFrame();
    const before = viewport.getCameraPreset()?.position;
    const canvas = container.querySelector("canvas")!;
    pointer(canvas, "pointerdown", 200, 150, 1);
    pointer(canvas, "pointermove", 245, 165, 1);
    pointer(canvas, "pointerup", 245, 165);
    expect(pendingFrames.size).toBe(1);
    drawFrame();
    expect(pendingFrames.size).toBe(1);
    for (let i = 0; pendingFrames.size && i < 150; i++) drawFrame();
    expect(pendingFrames.size).toBe(0);
    expect(viewport.getCameraPreset()?.position).not.toEqual(before);
  });

  it("raycasts bound meshes, falls back to the floor, and accepts pointer placements", async () => {
    const mesh = addRoomToLoadedScene();
    const dispose = vi.spyOn(mesh.geometry, "dispose");
    const onPlaceMarker = vi.fn();
    const onPickMesh = vi.fn();
    const onSelectArea = vi.fn();
    const onDrop = vi.fn();
    const viewport = mount({
      editMode: true,
      meshPickMode: true,
      areas: [
        { id: "area", area_id: "room", tags: [], shape: { type: "mesh", mesh_name: mesh.name } },
      ],
      onPickMesh,
      onPlaceMarker,
      onSelectArea,
      onDrop,
    });
    expect(await viewport.ready).toBe(true);
    viewport.applyCameraPreset("top");
    expect(viewport.getAvailableMeshes()).toEqual(["room-mesh"]);
    expect(viewport.raycastClientPoint(200, 150)).toMatchObject({
      y: expect.closeTo(0.5),
      meshName: mesh.name,
    });
    expect(viewport.raycastClientPoint(0, 0)).toMatchObject({ y: expect.closeTo(-0.5) });
    expect(viewport.raycastClientPoint(-1, 10)).toBeNull();

    const canvas = container.querySelector("canvas")!;
    const tap = () => {
      pointer(canvas, "pointerdown", 200, 150, 1);
      pointer(canvas, "pointerup", 200, 150);
    };
    const material = mesh.material;
    pointer(canvas, "pointermove", 200, 150);
    expect(mesh.material).not.toBe(material);
    tap();
    expect(onPickMesh).toHaveBeenCalledWith(
      mesh.name,
      expect.objectContaining({ y: expect.closeTo(0.5) })
    );

    viewport.update({ meshPickMode: false });
    tap();
    expect(onSelectArea).toHaveBeenCalledWith("area");
    viewport.update({ armedEntityId: "light.test" });
    tap();
    expect(onPlaceMarker).toHaveBeenLastCalledWith(
      "light.test",
      expect.objectContaining({ meshName: mesh.name })
    );
    expect(viewport.dropAt(0, 0, "sensor.test")).toBe(true);
    expect(onPlaceMarker).toHaveBeenLastCalledWith(
      "sensor.test",
      expect.objectContaining({ y: expect.closeTo(-0.5) })
    );
    canvas.dispatchEvent(new MouseEvent("drop", { bubbles: true, clientX: 200, clientY: 150 }));
    expect(onDrop).toHaveBeenCalledWith(
      expect.any(Event),
      expect.objectContaining({ meshName: mesh.name })
    );

    viewport.update({ editMode: false });
    expect(mesh.material).toBe(material);
    viewport.destroy();
    expect(dispose).toHaveBeenCalledOnce();
  });

  it("updates projected chips, aggregate values, mesh styles, and marker interactions", async () => {
    const mesh = addRoomToLoadedScene();
    const original = mesh.material;
    const marker = lamp("test");
    const onActivateMarker = vi.fn();
    const onSelectMarker = vi.fn();
    const onMoveMarker = vi.fn();
    const states = {
      [marker.entity_id]: entity(marker.entity_id, "on", {
        brightness: 128,
        friendly_name: "Desk lamp",
      }),
    };
    const viewport = mount({
      markers: [marker],
      areas: [
        { id: "area", area_id: "room", tags: [], shape: { type: "mesh", mesh_name: mesh.name } },
      ],
      hassAreas: [{ id: "room", name: "Room" }],
      states,
      shadows: true,
      lighting: false,
      view: {
        id: "all",
        name: "All",
        filters: {},
        area_overlay: {
          primary: {
            mode: "aggregate",
            aggregation: "count_on",
            domain: "light",
            format: "{value} on",
          },
        },
        marker_overlay: {
          badges: [{ entity_id: marker.entity_id, when: { state_is: "on" }, label: "Active" }],
        },
        style: {
          highlight_active_areas: true,
          dim_inactive_areas: true,
          active_area_fill: "#aa0000",
          inactive_area_opacity: 0.2,
        },
      },
      resolveIconPath: () => "M0 0h24v24H0z",
      onActivateMarker,
      onSelectMarker,
      onMoveMarker,
    });
    expect(await viewport.ready).toBe(true);
    drawFrame();
    expect(mesh.castShadow).toBe(true);
    expect(mesh.receiveShadow).toBe(true);
    expect(mesh.material.color.getHexString()).toBe("aa0000");
    expect(original.color.getHexString()).toBe("ffffff");
    const markerChip = container.querySelector<HTMLButtonElement>("[data-marker-id=test]")!;
    const areaChip = container.querySelector<HTMLButtonElement>("[data-area-id=area]")!;
    expect(markerChip.hidden).toBe(false);
    expect(markerChip.style.transform).toContain("translate3d(");
    expect(markerChip.innerHTML).toContain("<svg");
    expect(markerChip.textContent).toContain("Desk lamp");
    expect(markerChip.textContent).toContain("128");
    expect(markerChip.textContent).toContain("Active");
    expect(areaChip.textContent).toBe("Room1 on");
    markerChip.click();
    expect(onActivateMarker).toHaveBeenCalledWith(marker, "toggle");

    viewport.update({
      editMode: true,
      selectedMarkerId: marker.id,
      states: { [marker.entity_id]: entity(marker.entity_id, "off") },
    });
    expect(mesh.material.opacity).toBe(0.2);
    expect(markerChip.textContent).not.toContain("Active");
    expect(areaChip.textContent).toBe("Room0 on");
    expect(markerChip.hasAttribute("data-selected")).toBe(true);
    markerChip.click();
    expect(onSelectMarker).toHaveBeenCalledWith(marker.id);
    pointer(markerChip, "pointerdown", 200, 150, 1);
    pointer(markerChip, "pointermove", 220, 150, 1);
    pointer(markerChip, "pointerup", 220, 150);
    expect(onMoveMarker).toHaveBeenCalledWith(
      marker.id,
      expect.objectContaining({ x: expect.any(Number) })
    );

    viewport.update({ view: undefined, shadows: false });
    expect(mesh.material).toBe(original);
    expect(mesh.castShadow).toBe(false);
  });

  it("pools up to twelve active point lights while retaining extra floor glows", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      createRadialGradient: () => ({ addColorStop: vi.fn() }),
      fillRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    const markers = Array.from({ length: 13 }, (_, i) => lamp(`light_${i}`));
    const states = Object.fromEntries(
      markers.map((marker, i) => [
        marker.entity_id,
        entity(marker.entity_id, "on", { brightness: 100 + i, rgb_color: [i, 0, 0] }),
      ])
    );
    const viewport = mount({ markers, states });
    expect(await viewport.ready).toBe(true);
    drawFrame();
    const scene = webgl.render.mock.lastCall?.[0] as Scene;
    const lights = scene.children.filter(
      (object): object is PointLight => object instanceof PointLight
    );
    const glows = scene.children.filter((object) => object instanceof Mesh);
    expect(lights).toHaveLength(12);
    expect(lights.every((light) => light.intensity > 0)).toBe(true);
    expect(lights[0].intensity).toBeGreaterThan(lights[11].intensity);
    expect(glows.filter((glow) => glow.visible)).toHaveLength(13);

    viewport.update({ lighting: false });
    expect(lights.every((light) => light.intensity === 0)).toBe(true);
    expect(glows.every((glow) => !glow.visible)).toBe(true);
    expect(pendingFrames.size).toBe(1);
    drawFrame();
    expect(pendingFrames.size).toBe(0);
  });

  it("disposes a decoded model arriving after viewport destruction", async () => {
    let finishLoad: (() => void) | undefined;
    let markParsed: () => void;
    const parsed = new Promise<void>((resolve) => {
      markParsed = resolve;
    });
    const mesh = addRoomToLoadedScene((finish) => {
      finishLoad = finish;
      markParsed();
    });
    const dispose = vi.spyOn(mesh.material, "dispose");
    const viewport = mount();
    await parsed;
    viewport.destroy();
    finishLoad?.();
    expect(await viewport.ready).toBe(false);
    expect(dispose).toHaveBeenCalledOnce();
    expect(container.childElementCount).toBe(0);
  });
});
