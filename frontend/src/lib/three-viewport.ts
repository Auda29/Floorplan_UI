import {
  AdditiveBlending,
  Box3,
  CanvasTexture,
  Color,
  DirectionalLight,
  HemisphereLight,
  LoadingManager,
  MathUtils,
  Matrix3,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PointLight,
  Raycaster,
  Scene,
  Sphere,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import type { Material, Texture } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { areaHasActiveEntities, resolveAreaAggregate } from "./area-aggregates";
import type { AggregateValueSpec } from "./area-aggregates";
import type { AreaShape3D, CameraPreset, Vec3, ViewStyleConfig } from "./viewport-types";
import { validateGlbHeader } from "./glb-utils";
import { getMdiIconPath, resolveDynamicMdiPath, resolveMdiIconName } from "./mdi-icons";
import type {
  BadgeSpec,
  HassArea,
  HassEntity,
  HassEntityRegistry,
  Marker,
} from "../types/home-assistant";
import {
  getActiveBadges,
  getDomainGlyph,
  getEntityDisplayName,
  getMarkerLabel,
  getMarkerValue,
  markerMatchesView,
  resolveValueBinding,
} from "./marker-utils";

export type Point3D = Vec3;

export interface ModelHit extends Point3D {
  meshName?: string;
}

export type ThreeCameraMode = CameraPreset["mode"];
export type BuiltInCameraPreset = "isometric" | "top" | "front";
export type ThreeCameraPreset = Pick<CameraPreset, "position" | "target" | "zoom"> &
  Partial<Pick<CameraPreset, "id" | "name" | "mode">>;

export type ThreeViewportMarker = Marker & {
  pos: { x: number; y: number; z?: number };
};

export interface ThreeViewportArea {
  id: string;
  area_id: string | null;
  tags: string[];
  shape: AreaShape3D | { type: "rect" | "polygon" };
  style?: {
    fill?: string;
    stroke?: string;
    fillOpacity?: number;
    strokeWidth?: number;
  };
}

type TapAction = "more-info" | "toggle" | "none";
type EntityState = Pick<HassEntity, "state" | "attributes">;
type OverlayValue =
  | { mode: "entity"; entity_id: string; source: "state" | "attr"; attr?: string; format?: string }
  | AggregateValueSpec;
interface ViewOverlay {
  primary?: OverlayValue;
  secondary?: OverlayValue;
  badges?: BadgeSpec[];
}

export interface ThreeViewportView {
  id: string;
  name: string;
  filters: { domains?: string[]; tags?: string[]; area_ids?: string[] };
  style?: ViewStyleConfig;
  marker_overlay?: ViewOverlay;
  area_overlay?: ViewOverlay;
}

export interface ThreeViewportState {
  markers?: readonly ThreeViewportMarker[];
  areas?: readonly ThreeViewportArea[];
  states?: Record<string, HassEntity>;
  hassAreas?: readonly HassArea[];
  entities?: readonly HassEntityRegistry[];
  view?: ThreeViewportView;
  editMode?: boolean;
  meshPickMode?: boolean;
  anchorPickMode?: boolean;
  armedEntityId?: string | null;
  selectedMarkerId?: string | null;
  selectedAreaId?: string | null;
  shadows?: boolean;
  lighting?: boolean;
  camera_presets?: readonly ThreeCameraPreset[];
}

export interface ThreeViewportOptions extends ThreeViewportState {
  loadModelBuffer: () => Promise<ArrayBuffer>;
  cameraMode?: ThreeCameraMode;
  cameraPreset?: string | ThreeCameraPreset;
  resolveIconPath?: (marker: ThreeViewportMarker) => string | null;
  resolveBadgeIconPath?: (badge: BadgeSpec) => string | null;
  onPlaceMarker?: (entityId: string, position: ModelHit) => void;
  onDrop?: (event: DragEvent, position: ModelHit) => void;
  onSelectMarker?: (markerId: string) => void;
  onMoveMarker?: (markerId: string, position: Point3D) => void;
  onActivateMarker?: (marker: ThreeViewportMarker, action: Exclude<TapAction, "none">) => void;
  onPickMesh?: (meshName: string, anchorPoint: Point3D) => void;
  onPlaceAnchor?: (position: Point3D) => void;
  onSelectArea?: (areaId: string) => void;
  onEmptyCanvasClick?: () => void;
  onError?: (error: Error) => void;
}

export interface ThreeViewportController {
  /** Resolves after the first model load. False indicates failure or destruction. */
  readonly ready: Promise<boolean>;
  update(state: Partial<ThreeViewportState>): void;
  requestRender(): void;
  setCameraMode(mode: ThreeCameraMode): void;
  applyCameraPreset(preset: string | ThreeCameraPreset): boolean;
  getCameraPreset(): ThreeCameraPreset | null;
  fit(): void;
  zoomIn(): void;
  zoomOut(): void;
  focusArea(areaId: string): boolean;
  focusMarker(markerId: string): boolean;
  getAvailableMeshes(): string[];
  raycastClientPoint(clientX: number, clientY: number): ModelHit | null;
  /** Use for editor pointer drops originating outside of the viewport. */
  dropAt(clientX: number, clientY: number, entityId?: string): boolean;
  destroy(): void;
}

type ViewportCamera = OrthographicCamera | PerspectiveCamera;

const FIELD_OF_VIEW = 45;
const MAX_POINT_LIGHTS = 12;
const FOCUS_DURATION = 350;
const LABEL_OFFSET = 4;
const DRAG_THRESHOLD = 5;
const SVG_NS = "http://www.w3.org/2000/svg";
const DEFAULT_AREA_COLOR = "#03a9f4";

function vector(point: Point3D): Vector3 {
  return new Vector3(point.x, point.y, point.z);
}

function point({ x, y, z }: Point3D): Point3D {
  return { x, y, z };
}

function isPoint(value: { x?: number; y?: number; z?: number }): value is Point3D {
  return [value.x, value.y, value.z].every(Number.isFinite);
}

function markerPosition(pos: { x?: number; y?: number; z?: number }): Point3D | null {
  if (!Number.isFinite(pos.x) || !Number.isFinite(pos.y)) return null;
  const z = pos.z ?? 0;
  if (!Number.isFinite(z)) return null;
  return { x: pos.x!, y: pos.y!, z };
}

function perspectiveDistance(radius: number, aspect: number): number {
  const vertical = MathUtils.degToRad(FIELD_OF_VIEW / 2);
  const horizontal = Math.atan(Math.tan(vertical) * aspect);
  return (radius * 1.15) / Math.sin(Math.min(vertical, horizontal));
}

export function computeCameraPreset(
  bounds: Box3,
  preset: BuiltInCameraPreset,
  aspect = 1
): { position: Vector3; target: Vector3; viewHeight: number } {
  const target = bounds.getCenter(new Vector3());
  const radius = bounds.isEmpty() ? 1 : Math.max(bounds.getSize(new Vector3()).length() / 2, 1e-6);
  const direction =
    preset === "top"
      ? new Vector3(0, 1, 0.000001)
      : preset === "front"
        ? new Vector3(0, 0, 1)
        : new Vector3(1, 1, 1);
  const ratio = Number.isFinite(aspect) && aspect > 0 ? aspect : 1;
  return {
    position: direction.normalize().multiplyScalar(perspectiveDistance(radius, ratio)).add(target),
    target,
    viewHeight: (2.3 * radius) / Math.min(1, ratio),
  };
}

/** Project to CSS pixels. The camera matrices must already be current. */
export function projectPointToScreen(
  position: Point3D,
  camera: ViewportCamera,
  width: number,
  height: number,
  scratch = new Vector3()
): { x: number; y: number } | null {
  const projected = scratch.copy(position).applyMatrix4(camera.matrixWorldInverse);
  if (projected.z >= 0) return null;
  projected.applyMatrix4(camera.projectionMatrix);
  if (
    !isPoint(projected) ||
    Math.abs(projected.z) > 1 ||
    Math.abs(projected.x) > 1 ||
    Math.abs(projected.y) > 1
  ) {
    return null;
  }
  return { x: ((projected.x + 1) * width) / 2, y: ((1 - projected.y) * height) / 2 };
}

/** Return approximate sRGB channels (0–255) for a black-body color temperature. */
export function kelvinToRgb(kelvin: number): [number, number, number] {
  const temperature = MathUtils.clamp(kelvin, 1000, 40000) / 100;
  const red = temperature <= 66 ? 255 : 329.698727446 * (temperature - 60) ** -0.1332047592;
  const green =
    temperature <= 66
      ? 99.4708025861 * Math.log(temperature) - 161.1195681661
      : 288.1221695283 * (temperature - 60) ** -0.0755148492;
  const blue =
    temperature >= 66
      ? 255
      : temperature <= 19
        ? 0
        : 138.5177312231 * Math.log(temperature - 10) - 305.0447927307;
  const channel = (value: number) => Math.round(MathUtils.clamp(value, 0, 255));
  return [channel(red), channel(green), channel(blue)];
}

export function getLightSettings(
  state: EntityState | undefined
): { brightness: number; color: Color } | null {
  if (state?.state !== "on") return null;
  const { brightness, rgb_color: rgb, color_temp_kelvin: kelvin } = state.attributes;
  const level =
    typeof brightness === "number" && Number.isFinite(brightness)
      ? MathUtils.clamp(brightness / 255, 0, 1)
      : 1;
  const channels =
    Array.isArray(rgb) && rgb.length === 3 && rgb.every(Number.isFinite)
      ? rgb
      : typeof kelvin === "number" && Number.isFinite(kelvin) && kelvin > 0
        ? kelvinToRgb(kelvin)
        : [255, 217, 160];
  return {
    brightness: level,
    color: new Color().setRGB(
      MathUtils.clamp(channels[0], 0, 255) / 255,
      MathUtils.clamp(channels[1], 0, 255) / 255,
      MathUtils.clamp(channels[2], 0, 255) / 255,
      "srgb"
    ),
  };
}

const overlayCss = `
.floorplan-three-canvas, .floorplan-three-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.floorplan-three-overlay { pointer-events: none; overflow: hidden; }
.floorplan-three-chip {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: min(260px, 90%);
  padding: 4px 8px;
  margin-top: -${LABEL_OFFSET}px;
  border: 1px solid var(--divider-color, #7776);
  border-radius: 6px;
  background: var(--card-background-color, var(--ha-card-background, #fff));
  color: var(--primary-text-color, #222);
  font: inherit;
  font-size: 12px;
  line-height: 1.3;
  text-align: start;
  user-select: none;
  pointer-events: none;
}
.floorplan-three-chip[hidden] { display: none; }
.floorplan-three-chip[data-interactive] { pointer-events: auto; cursor: pointer; touch-action: none; }
.floorplan-three-chip[data-selected], .floorplan-three-chip:focus-visible {
  outline: 2px solid var(--primary-color, ${DEFAULT_AREA_COLOR});
  outline-offset: 1px;
  z-index: 1;
}
.floorplan-three-chip svg { width: 16px; height: 16px; fill: currentColor; flex: none; }
.floorplan-three-status { width: 6px; height: 6px; border-radius: 50%; flex: none; }
.floorplan-three-status[data-status=idle] { background: var(--state-inactive-color, var(--primary-color, #1976d2)); }
.floorplan-three-status[data-status=active] { background: var(--state-active-color, var(--accent-color, #ffb300)); }
.floorplan-three-status[data-status=unavailable] { background: var(--state-unavailable-color, var(--disabled-text-color, #9e9e9e)); }
.floorplan-three-chip-text { display: grid; gap: 1px; overflow-wrap: anywhere; }
.floorplan-three-label { font-weight: 600; }
.floorplan-three-primary, .floorplan-three-secondary { font-variant-numeric: tabular-nums; }
.floorplan-three-secondary, .floorplan-three-badges { color: var(--secondary-text-color, #555); }
.floorplan-three-badges, .floorplan-three-badge { display: inline-flex; gap: 4px; align-items: center; flex-wrap: wrap; }
.floorplan-three-badge svg { width: 14px; height: 14px; }
.floorplan-three-error {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  max-width: 80%; padding: 12px; border-radius: 6px; text-align: center;
  background: var(--card-background-color, #fff); color: var(--primary-text-color, #222);
}
`;

interface Chip {
  element: HTMLButtonElement;
  position: Point3D;
  signature: string;
}
interface ChipContent {
  label: string;
  accessibleName: string;
  primary: string;
  secondary: string;
  badges: { label: string; iconPath?: string | null }[];
  iconPath?: string | null;
  glyph?: string;
  status?: "active" | "idle" | "unavailable";
}

function appendIcon(parent: HTMLElement, path: string): void {
  const { ownerDocument } = parent;
  const svg = ownerDocument.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const shape = ownerDocument.createElementNS(SVG_NS, "path");
  shape.setAttribute("d", path);
  svg.append(shape);
  parent.append(svg);
}

function appendText(parent: HTMLElement, text: string, className: string): void {
  const span = parent.ownerDocument.createElement("span");
  span.className = className;
  span.textContent = text;
  parent.append(span);
}

function updateChip(chip: Chip, content: ChipContent): void {
  const signature = JSON.stringify(content);
  if (signature === chip.signature) return;
  chip.signature = signature;
  const { element } = chip;
  element.replaceChildren();
  element.setAttribute("aria-label", content.accessibleName);
  if (content.status) {
    const status = element.ownerDocument.createElement("span");
    status.className = "floorplan-three-status";
    status.dataset.status = content.status;
    status.setAttribute("aria-hidden", "true");
    element.append(status);
  }
  if (content.iconPath) appendIcon(element, content.iconPath);
  else if (content.glyph) appendText(element, content.glyph, "floorplan-three-glyph");
  const text = element.ownerDocument.createElement("span");
  text.className = "floorplan-three-chip-text";
  if (content.label) appendText(text, content.label, "floorplan-three-label");
  if (content.primary) appendText(text, content.primary, "floorplan-three-primary");
  if (content.secondary) appendText(text, content.secondary, "floorplan-three-secondary");
  const badges = element.ownerDocument.createElement("span");
  badges.className = "floorplan-three-badges";
  for (const badge of content.badges) {
    const item = element.ownerDocument.createElement("span");
    item.className = "floorplan-three-badge";
    if (badge.iconPath) appendIcon(item, badge.iconPath);
    item.append(badge.label);
    badges.append(item);
  }
  if (badges.childElementCount) text.append(badges);
  if (text.childElementCount) element.append(text);
}

function isBuiltInPreset(preset: string): preset is BuiltInCameraPreset {
  return preset === "isometric" || preset === "top" || preset === "front";
}

function indexByArea<T extends { area_id?: string | null }>(
  entries: readonly T[]
): Map<string, T[]> {
  const result = new Map<string, T[]>();
  for (const entry of entries) {
    if (!entry.area_id) continue;
    const list = result.get(entry.area_id);
    if (list) list.push(entry);
    else result.set(entry.area_id, [entry]);
  }
  return result;
}

function areaMatchesView(area: ThreeViewportArea, view: ThreeViewportView | undefined): boolean {
  const { tags, area_ids: areaIds } = view?.filters ?? {};
  return (
    (!tags?.length || tags.some((tag) => area.tags.includes(tag))) &&
    (!areaIds?.length || (area.area_id !== null && areaIds.includes(area.area_id)))
  );
}

function markerStatus(state: HassEntity | undefined): ChipContent["status"] {
  if (!state || state.state === "unknown" || state.state === "unavailable") return "unavailable";
  return ["on", "open", "playing", "home", "heat"].includes(state.state) ? "active" : "idle";
}

function disposeModel(roots: readonly Object3D[]): void {
  const geometries = new Set<Mesh["geometry"]>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  const images = new Set<ImageBitmap>();
  const extra = new Set<{ dispose(): void }>();
  for (const root of new Set(roots)) {
    root.traverse((object) => {
      if ("geometry" in object) geometries.add(object.geometry as Mesh["geometry"]);
      if ("material" in object) {
        const material = object.material as Mesh["material"];
        for (const item of Array.isArray(material) ? material : [material]) materials.add(item);
      }
      if ("skeleton" in object) extra.add(object.skeleton as { dispose(): void });
      if ("dispose" in object && typeof object.dispose === "function") {
        extra.add(object as Object3D & { dispose(): void });
      }
    });
  }
  for (const material of materials) {
    for (const value of Object.values(material) as unknown[]) {
      if (value && typeof value === "object" && "isTexture" in value && value.isTexture) {
        textures.add(value as Texture);
      }
    }
    material.dispose();
  }
  for (const texture of textures) {
    if (typeof ImageBitmap !== "undefined" && texture.image instanceof ImageBitmap) {
      images.add(texture.image);
    }
    texture.dispose();
  }
  for (const image of images) image.close();
  for (const geometry of geometries) geometry.dispose();
  for (const object of extra) object.dispose();
}

type AreaMaterial = Material & { color?: Color; emissive?: Color; emissiveIntensity?: number };
interface MeshMaterials {
  original: Mesh["material"];
  clones: AreaMaterial[];
}

interface CameraTransition {
  start: number;
  fromTarget: Vector3;
  toTarget: Vector3;
  direction: Vector3;
  fromDistance: number;
  toDistance: number;
  fromHeight: number;
  toHeight: number;
}

interface Glow {
  mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
  position: Vector3;
}

class ThreeViewport implements ThreeViewportController {
  readonly ready: Promise<boolean>;

  private readonly scene = new Scene();
  private readonly projectionPoint = new Vector3();
  private readonly ortho = new OrthographicCamera();
  private readonly perspective = new PerspectiveCamera(FIELD_OF_VIEW);
  private readonly bounds = new Box3();
  private readonly modelCenter = new Vector3();
  private readonly roomCenters = new Map<Mesh, Vector3>();
  private readonly keyLight = new DirectionalLight(0xffffff, 2);
  private readonly ambient = new HemisphereLight(0xffffff, 0xbac3ce, 2);
  private readonly raycaster = new Raycaster();
  private readonly floor = new Plane(new Vector3(0, 1, 0));
  private readonly meshes: Mesh[] = [];
  private readonly namedMeshes = new Map<string, Mesh>();
  private readonly meshAreas = new Map<Mesh, ThreeViewportArea>();
  private readonly styledMeshes = new Map<Mesh, MeshMaterials>();
  private readonly pointLights: PointLight[] = [];
  private readonly glows = new Map<string, Glow>();
  private readonly glowGeometry = new PlaneGeometry(1, 1);
  private readonly chips = new Map<string, Chip>();
  private readonly events = new AbortController();
  private readonly overlay: HTMLDivElement;
  private readonly style: HTMLStyleElement;
  private readonly previousPosition: string;
  private readonly changedPosition: boolean;

  private state: ThreeViewportState;
  private camera: ViewportCamera;
  private renderer?: WebGLRenderer;
  private controls?: OrbitControls;
  private observer?: ResizeObserver;
  private error?: HTMLDivElement;
  private model?: Object3D;
  private modelScenes: Object3D[] = [];
  private glowTexture?: CanvasTexture | null;
  private areaEntities = new Map<string, HassEntityRegistry[]>();
  private areaMarkers = new Map<string, ThreeViewportMarker[]>();
  private hovered?: Mesh;
  private transition?: CameraTransition;
  private frame?: number;
  private orbitPending = false;
  private destroyed = false;
  private contextLost = false;
  private aspect = 1;
  private height = 1;
  private width = 1;
  private viewHeight = 2;
  private radius = 1;
  private pendingPreset: string | ThreeCameraPreset;
  private canvasPress?: { pointerId: number; x: number; y: number };
  private drag?: {
    pointerId: number;
    id: string;
    x: number;
    y: number;
    element: HTMLElement;
    position?: ModelHit;
  };
  private suppressMarkerClick?: string;
  private readonly pendingDynamicIcons = new Set<string>();

  constructor(
    private readonly container: HTMLElement,
    private readonly options: ThreeViewportOptions
  ) {
    this.state = { ...options };
    this.camera = options.cameraMode === "perspective" ? this.perspective : this.ortho;
    this.pendingPreset = options.cameraPreset ?? "isometric";
    const document = container.ownerDocument;
    this.previousPosition = container.style.position;
    const position = document.defaultView?.getComputedStyle(container).position;
    this.changedPosition = !position || position === "static";
    if (this.changedPosition) container.style.position = "relative";
    this.style = document.createElement("style");
    this.style.textContent = overlayCss;
    this.overlay = document.createElement("div");
    this.overlay.className = "floorplan-three-overlay";
    container.append(this.style, this.overlay);

    try {
      this.renderer = new WebGLRenderer({
        canvas: document.createElement("canvas"),
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch (error) {
      this.showError("3D view requires WebGL.", error);
      this.ready = Promise.resolve(false);
      return;
    }

    const canvas = this.renderer.domElement;
    canvas.classList.add("floorplan-three-canvas");
    this.renderer.setPixelRatio(Math.min(document.defaultView?.devicePixelRatio || 1, 2));
    this.overlay.before(canvas);
    this.scene.add(this.ambient, this.keyLight, this.keyLight.target);
    this.camera.position.set(1, 1, 1);
    this.connectControls(new Vector3());
    this.connectEvents(canvas);
    if (typeof ResizeObserver !== "undefined") {
      this.observer = new ResizeObserver(this.resize);
      this.observer.observe(container);
    } else {
      document.defaultView?.addEventListener("resize", this.resize, { signal: this.events.signal });
    }
    this.resize();
    this.ready = this.loadModel();
  }

  private showError(message: string, cause?: unknown): void {
    if (this.destroyed) return;
    const element = this.error ?? this.container.ownerDocument.createElement("div");
    element.className = "floorplan-three-error";
    element.setAttribute("role", "alert");
    element.textContent = message;
    if (!this.error) this.container.append(element);
    this.error = element;
    if (cause !== undefined) {
      this.options.onError?.(cause instanceof Error ? cause : new Error(String(cause)));
    }
  }

  private async loadModel(): Promise<boolean> {
    try {
      const data = await this.options.loadModelBuffer();
      if (this.destroyed) return false;
      const validation = validateGlbHeader(data);
      if (!validation.valid) throw new Error(validation.reason);
      const manager = new LoadingManager().setURLModifier((url) => {
        if (/^(data:|blob:)/i.test(url)) return url;
        throw new Error("The model tried to load an external resource.");
      });
      const gltf = await new Promise<Awaited<ReturnType<GLTFLoader["parseAsync"]>>>(
        (resolve, reject) => new GLTFLoader(manager).parse(data, "", resolve, reject)
      );
      if (this.destroyed) {
        disposeModel([gltf.scene, ...gltf.scenes]);
        return false;
      }
      this.model = gltf.scene;
      this.modelScenes = [gltf.scene, ...gltf.scenes];
      this.scene.add(gltf.scene);
      gltf.scene.updateMatrixWorld(true);
      gltf.scene.traverseVisible((object) => {
        if (!(object instanceof Mesh)) return;
        this.meshes.push(object);
        if (object.name) this.namedMeshes.set(object.name, object);
      });

      this.bounds.setFromObject(gltf.scene);
      if (this.bounds.isEmpty()) this.bounds.set(new Vector3(-1, 0, -1), new Vector3(1, 0, 1));
      const sphere = this.bounds.getBoundingSphere(new Sphere());
      this.modelCenter.copy(sphere.center);
      this.radius = Math.max(sphere.radius, 1e-6);
      this.floor.constant = -this.bounds.min.y;
      this.configureKeyLight();
      if (!this.applyCameraPreset(this.pendingPreset)) this.fit();
      this.refresh();
      return true;
    } catch (error) {
      this.showError("The 3D model could not be loaded.", error);
      return false;
    }
  }

  private configureKeyLight(): void {
    const center = this.modelCenter;
    const size = this.radius;
    this.keyLight.target.position.copy(center);
    this.keyLight.position.copy(center).addScaledVector(new Vector3(1, 2, 1), size);
    const { camera, mapSize } = this.keyLight.shadow;
    mapSize.set(1024, 1024);
    camera.left = camera.bottom = -size;
    camera.right = camera.top = size;
    camera.near = size / 10;
    camera.far = size * 5;
    camera.updateProjectionMatrix();
    this.keyLight.shadow.normalBias = size * 0.001;
  }

  private connectControls(target: Vector3): void {
    this.controls?.dispose();
    if (!this.renderer) return;
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.copy(target);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = this.radius * 0.005;
    controls.maxDistance = Math.max(this.radius * 100, this.camera.position.distanceTo(target));
    controls.minZoom = 0.015;
    controls.maxZoom = 100;
    controls.enablePan = true;
    controls.screenSpacePanning = false;
    controls.update();
    controls.addEventListener("start", () => {
      this.transition = undefined;
    });
    controls.addEventListener("change", () => {
      this.orbitPending = true;
      this.requestRender();
    });
    this.controls = controls;
    this.orbitPending = false;
  }

  private connectEvents(canvas: HTMLCanvasElement): void {
    const { signal } = this.events;
    canvas.addEventListener("pointerdown", this.onCanvasDown, { signal });
    canvas.addEventListener("pointermove", this.onCanvasMove, { signal });
    canvas.addEventListener("pointerup", this.onCanvasUp, { signal });
    canvas.addEventListener("pointercancel", this.clearCanvasPress, { signal });
    canvas.addEventListener("pointerleave", this.clearHover, { signal });
    canvas.addEventListener("dragover", this.onDragOver, { signal });
    canvas.addEventListener("drop", this.onNativeDrop, { signal });
    canvas.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();
        this.contextLost = true;
        this.transition = undefined;
        this.showError("The WebGL context was lost.");
      },
      { signal }
    );
    canvas.addEventListener(
      "webglcontextrestored",
      () => {
        this.contextLost = false;
        this.error?.remove();
        this.error = undefined;
        this.applyShadows();
        this.requestRender();
      },
      { signal }
    );

    this.overlay.addEventListener("click", this.onChipClick, { signal });
    this.overlay.addEventListener("pointerdown", this.onChipDown, { signal });
    this.overlay.addEventListener("pointermove", this.onChipMove, { signal });
    this.overlay.addEventListener("pointerup", this.onChipUp, { signal });
    this.overlay.addEventListener("pointercancel", this.cancelDrag, { signal });
    this.overlay.addEventListener("lostpointercapture", this.cancelDrag, { signal });
    this.overlay.addEventListener("dragover", this.onDragOver, { signal });
    this.overlay.addEventListener("drop", this.onNativeDrop, { signal });
  }

  private readonly resize = (): void => {
    if (!this.renderer || this.destroyed) return;
    this.width = Math.max(this.container.clientWidth, 1);
    this.height = Math.max(this.container.clientHeight, 1);
    this.aspect = this.width / this.height;
    this.renderer.setSize(this.width, this.height, false);
    this.updateProjection();
    this.requestRender();
  };

  private updateProjection(): void {
    const range = this.radius * 20 + this.camera.position.distanceTo(this.modelCenter);
    this.camera.near = this.radius * 0.001;
    this.camera.far = range;
    if (this.camera instanceof OrthographicCamera) {
      this.camera.left = (-this.viewHeight * this.aspect) / 2;
      this.camera.right = -this.camera.left;
      this.camera.top = this.viewHeight / 2;
      this.camera.bottom = -this.camera.top;
    } else {
      this.camera.aspect = this.aspect;
    }
    this.camera.updateProjectionMatrix();
  }

  private visibleHeight(): number {
    if (this.camera instanceof OrthographicCamera) return this.viewHeight / this.camera.zoom;
    return (
      (2 *
        (this.controls?.getDistance() ?? this.radius) *
        Math.tan(MathUtils.degToRad(FIELD_OF_VIEW / 2))) /
      this.camera.zoom
    );
  }

  setCameraMode(mode: ThreeCameraMode): void {
    const camera = mode === "ortho" ? this.ortho : this.perspective;
    if (camera === this.camera || this.destroyed) return;
    const visibleHeight = this.visibleHeight();
    const target = this.controls?.target.clone() ?? new Vector3();
    const offset = this.camera.position.clone().sub(target);
    this.transition = undefined;
    this.camera = camera;
    camera.zoom = 1;
    if (camera instanceof OrthographicCamera) {
      this.viewHeight = visibleHeight;
    } else {
      offset.setLength(visibleHeight / (2 * Math.tan(MathUtils.degToRad(FIELD_OF_VIEW / 2))));
    }
    camera.position.copy(target).add(offset);
    this.updateProjection();
    this.connectControls(target);
    this.requestRender();
  }

  applyCameraPreset(preset: string | ThreeCameraPreset): boolean {
    const builtIn = typeof preset === "string" && isBuiltInPreset(preset) ? preset : undefined;
    const custom =
      typeof preset === "string"
        ? builtIn
          ? undefined
          : this.state.camera_presets?.find((entry) => entry.id === preset)
        : preset;
    if (this.destroyed || (!custom && !builtIn)) return false;
    if (
      custom &&
      (!isPoint(custom.position) ||
        !isPoint(custom.target) ||
        vector(custom.position).distanceToSquared(custom.target) === 0 ||
        (custom.zoom !== undefined && (!Number.isFinite(custom.zoom) || custom.zoom <= 0)))
    )
      return false;
    if (!this.model) {
      this.pendingPreset = preset;
      if (custom?.mode) this.setCameraMode(custom.mode);
      return true;
    }

    this.transition = undefined;
    if (custom?.mode) this.setCameraMode(custom.mode);
    const framing = computeCameraPreset(this.bounds, builtIn ?? "isometric", this.aspect);
    // Presets save zoom relative to the fitted orthographic frustum.
    this.viewHeight = framing.viewHeight;
    this.camera.zoom = custom?.zoom ?? 1;
    this.camera.position.copy(custom ? vector(custom.position) : framing.position);
    this.updateProjection();
    this.connectControls(custom ? vector(custom.target) : framing.target);
    this.requestRender();
    return true;
  }

  getCameraPreset(): ThreeCameraPreset | null {
    if (!this.controls || this.destroyed) return null;
    return {
      mode: this.camera === this.ortho ? "ortho" : "perspective",
      position: point(this.camera.position),
      target: point(this.controls.target),
      zoom:
        this.camera === this.ortho
          ? (computeCameraPreset(this.bounds, "isometric", this.aspect).viewHeight /
              this.viewHeight) *
            this.camera.zoom
          : this.camera.zoom,
    };
  }

  fit(): void {
    this.applyCameraPreset("isometric");
  }

  private zoom(factor: number): void {
    if (!this.controls || this.destroyed) return;
    this.transition = undefined;
    if (this.camera instanceof OrthographicCamera) {
      this.camera.zoom = MathUtils.clamp(
        this.camera.zoom * factor,
        this.controls.minZoom,
        this.controls.maxZoom
      );
      this.camera.updateProjectionMatrix();
    } else {
      const distance = MathUtils.clamp(
        this.controls.getDistance() / factor,
        this.radius * 0.005,
        this.radius * 100
      );
      this.camera.position.sub(this.controls.target).setLength(distance).add(this.controls.target);
      this.updateProjection();
    }
    this.controls.update();
    this.requestRender();
  }

  zoomIn(): void {
    this.zoom(1.2);
  }
  zoomOut(): void {
    this.zoom(1 / 1.2);
  }

  private areaPosition(area: ThreeViewportArea): Point3D | undefined {
    const { shape } = area;
    if (shape.type === "anchor3d") return shape;
    if (shape.type !== "mesh") return undefined;
    if (shape.anchor) return shape.anchor;
    const mesh = this.namedMeshes.get(shape.mesh_name);
    if (!mesh) return undefined;
    let center = this.roomCenters.get(mesh);
    if (!center) {
      center = new Box3().setFromObject(mesh).getCenter(new Vector3());
      this.roomCenters.set(mesh, center);
    }
    return center;
  }

  private focusRegion(target: Vector3, region: Box3): boolean {
    if (!this.controls || !this.model || this.destroyed) return false;
    const framing = computeCameraPreset(region, "isometric", this.aspect);
    const fromTarget = this.controls.target.clone();
    const offset = this.camera.position.clone().sub(fromTarget);
    const distance = framing.position.distanceTo(framing.target);
    this.connectControls(fromTarget);
    this.transition = {
      start: performance.now(),
      fromTarget,
      toTarget: target,
      direction: offset.clone().normalize(),
      fromDistance: offset.length(),
      toDistance: this.camera instanceof PerspectiveCamera ? distance * this.camera.zoom : distance,
      fromHeight: this.visibleHeight(),
      toHeight: framing.viewHeight,
    };
    this.requestRender();
    return true;
  }

  focusArea(areaId: string): boolean {
    if (!this.controls || !this.model || this.destroyed) return false;
    const area = this.state.areas?.find((item) => item.id === areaId);
    const anchor = area && this.areaPosition(area);
    if (!area || !anchor) return false;
    const mesh =
      area.shape.type === "mesh" ? this.namedMeshes.get(area.shape.mesh_name) : undefined;
    const target = vector(anchor);
    const region = mesh ? new Box3().setFromObject(mesh) : new Box3();
    if (region.isEmpty()) {
      const size = this.radius * 0.18;
      region.setFromCenterAndSize(target, new Vector3(size, size, size));
    } else {
      // Fit the entire bound room even when its explicit anchor is off-center.
      const size = region.max
        .clone()
        .sub(target)
        .max(target.clone().sub(region.min))
        .multiplyScalar(2);
      region.setFromCenterAndSize(target, size);
    }
    return this.focusRegion(target, region);
  }

  focusMarker(markerId: string): boolean {
    if (!this.controls || !this.model || this.destroyed) return false;
    const marker = this.state.markers?.find((item) => item.id === markerId);
    const pos = marker && markerPosition(marker.pos);
    if (!pos) return false;
    const target = vector(pos);
    const size = this.radius * 0.18;
    const region = new Box3().setFromCenterAndSize(target, new Vector3(size, size, size));
    return this.focusRegion(target, region);
  }

  private advanceTransition(timestamp: number): void {
    const transition = this.transition;
    const controls = this.controls;
    if (!transition || !controls) return;
    const progress = MathUtils.clamp((timestamp - transition.start) / FOCUS_DURATION, 0, 1);
    const t = 1 - (1 - progress) ** 3;
    controls.target.lerpVectors(transition.fromTarget, transition.toTarget, t);
    this.camera.position
      .copy(controls.target)
      .addScaledVector(
        transition.direction,
        MathUtils.lerp(transition.fromDistance, transition.toDistance, t)
      );
    this.camera.lookAt(controls.target);
    if (this.camera instanceof OrthographicCamera) {
      this.camera.zoom =
        this.viewHeight / MathUtils.lerp(transition.fromHeight, transition.toHeight, t);
    }
    this.updateProjection();
    if (progress === 1) {
      this.transition = undefined;
      controls.update();
    }
  }

  requestRender(): void {
    if (this.frame !== undefined || !this.renderer || this.destroyed || this.contextLost) return;
    this.frame = requestAnimationFrame(this.render);
  }

  private readonly render = (timestamp: number): void => {
    if (this.renderer && !this.destroyed && !this.contextLost) {
      if (this.transition) this.advanceTransition(timestamp);
      else if (this.orbitPending) {
        this.orbitPending = this.controls?.update() ?? false;
        this.updateProjection();
      }
      this.camera.updateMatrixWorld();
      this.renderer.render(this.scene, this.camera);
      for (const chip of this.chips.values()) {
        const position = projectPointToScreen(
          chip.position,
          this.camera,
          this.width,
          this.height,
          this.projectionPoint
        );
        chip.element.hidden = !position;
        if (position) {
          chip.element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -100%)`;
        }
      }
    }
    this.frame = undefined;
    if (this.transition || this.orbitPending) this.requestRender();
  };

  getAvailableMeshes(): string[] {
    return [...this.namedMeshes.keys()].sort();
  }

  private raycast(clientX: number, clientY: number): { hit: ModelHit; mesh?: Mesh } | null {
    if (!this.model || !this.renderer || this.destroyed || this.contextLost) return null;
    const rect = this.renderer.domElement.getBoundingClientRect();
    if (
      rect.width <= 0 ||
      rect.height <= 0 ||
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    )
      return null;
    const ndc = new Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      1 - ((clientY - rect.top) / rect.height) * 2
    );
    this.camera.updateMatrixWorld();
    this.raycaster.setFromCamera(ndc, this.camera);
    const [intersection] = this.raycaster.intersectObjects(this.meshes, false);
    if (intersection) {
      const mesh = intersection.object as Mesh;
      const hit: ModelHit = point(intersection.point);
      if (mesh.name) hit.meshName = mesh.name;
      return { hit, mesh };
    }
    const { ray } = this.raycaster;
    const projected =
      Math.abs(ray.direction.y) > 1e-6 ? ray.intersectPlane(this.floor, new Vector3()) : null;
    if (projected && projected.distanceTo(ray.origin) <= this.camera.far)
      return { hit: point(projected) };

    // In an elevation view the ray can be parallel to the floor. Use the
    // floor point closest to the ray at the orbit target's depth.
    const target = this.controls?.target ?? new Vector3();
    const fallback = ray.at(
      Math.max(0, target.clone().sub(ray.origin).dot(ray.direction)),
      new Vector3()
    );
    fallback.y = -this.floor.constant;
    return { hit: point(fallback) };
  }

  raycastClientPoint(clientX: number, clientY: number): ModelHit | null {
    return this.raycast(clientX, clientY)?.hit ?? null;
  }

  private readonly onCanvasDown = (event: PointerEvent): void => {
    if (!event.isPrimary || event.button !== 0) {
      this.canvasPress = undefined;
      return;
    }
    this.canvasPress = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  };

  private readonly onCanvasMove = (event: PointerEvent): void => {
    if (
      this.canvasPress &&
      Math.hypot(event.clientX - this.canvasPress.x, event.clientY - this.canvasPress.y) >=
        DRAG_THRESHOLD
    ) {
      this.canvasPress = undefined;
    }
    if (this.state.editMode && event.buttons === 0 && event.pointerType !== "touch") {
      const mesh = this.raycast(event.clientX, event.clientY)?.mesh;
      this.setHover(
        mesh && (this.meshAreas.has(mesh) || (this.state.meshPickMode && mesh.name))
          ? mesh
          : undefined
      );
    }
  };

  private readonly clearCanvasPress = (): void => {
    this.canvasPress = undefined;
  };

  private readonly onCanvasUp = (event: PointerEvent): void => {
    const press = this.canvasPress;
    this.canvasPress = undefined;
    if (
      !press ||
      press.pointerId !== event.pointerId ||
      !this.state.editMode ||
      Math.hypot(event.clientX - press.x, event.clientY - press.y) >= DRAG_THRESHOLD
    )
      return;
    const result = this.raycast(event.clientX, event.clientY);
    if (!result) return;
    const { hit, mesh } = result;
    if (this.state.meshPickMode && hit.meshName) {
      this.options.onPickMesh?.(hit.meshName, point(hit));
    } else if (this.state.anchorPickMode && this.options.onPlaceAnchor) {
      this.options.onPlaceAnchor(point(hit));
    } else if (this.state.armedEntityId && this.options.onPlaceMarker) {
      this.options.onPlaceMarker(this.state.armedEntityId, hit);
    } else {
      const area = mesh && this.meshAreas.get(mesh);
      if (area) this.options.onSelectArea?.(area.id);
      else this.options.onEmptyCanvasClick?.();
    }
  };

  private readonly onDragOver = (event: DragEvent): void => {
    if (
      this.state.editMode &&
      (this.options.onDrop || (this.state.armedEntityId && this.options.onPlaceMarker))
    ) {
      event.preventDefault();
    }
  };

  private readonly onNativeDrop = (event: DragEvent): void => {
    if (!this.state.editMode) return;
    const hit = this.raycastClientPoint(event.clientX, event.clientY);
    if (!hit) return;
    if (this.options.onDrop) {
      event.preventDefault();
      this.options.onDrop(event, hit);
    } else if (this.state.armedEntityId && this.options.onPlaceMarker) {
      event.preventDefault();
      this.options.onPlaceMarker(this.state.armedEntityId, hit);
    }
  };

  dropAt(clientX: number, clientY: number, entityId = this.state.armedEntityId): boolean {
    if (!this.state.editMode || !entityId || !this.options.onPlaceMarker) return false;
    const hit = this.raycastClientPoint(clientX, clientY);
    if (!hit) return false;
    this.options.onPlaceMarker(entityId, hit);
    return true;
  }

  private eventChip(event: Event): HTMLElement | null {
    return event.target instanceof Element
      ? event.target.closest<HTMLElement>("[data-viewport-chip]")
      : null;
  }

  private readonly onChipClick = (event: MouseEvent): void => {
    const chip = this.eventChip(event);
    if (!chip?.hasAttribute("data-interactive")) return;
    event.stopPropagation();
    const { markerId, areaId } = chip.dataset;
    if (markerId !== undefined) {
      if (this.suppressMarkerClick === markerId && event.detail !== 0) {
        this.suppressMarkerClick = undefined;
        return;
      }
      if (this.state.editMode) {
        this.options.onSelectMarker?.(markerId);
        return;
      }
      const marker = this.state.markers?.find((item) => item.id === markerId);
      if (!marker) return;
      const action = marker.action?.tap ?? "more-info";
      if (action === "none") return;
      if (this.options.onActivateMarker) this.options.onActivateMarker(marker, action);
      else if (action === "more-info") {
        this.container.dispatchEvent(
          new CustomEvent("hass-more-info", {
            detail: { entityId: marker.entity_id },
            bubbles: true,
            composed: true,
          })
        );
      }
    } else if (areaId !== undefined && this.state.editMode) {
      this.options.onSelectArea?.(areaId);
    }
  };

  private readonly onChipDown = (event: PointerEvent): void => {
    this.suppressMarkerClick = undefined;
    const element = this.eventChip(event);
    const id = element?.dataset.markerId;
    if (
      !element ||
      !id ||
      !event.isPrimary ||
      event.button !== 0 ||
      !this.state.editMode ||
      id !== this.state.selectedMarkerId ||
      !this.options.onMoveMarker
    )
      return;
    this.drag = { pointerId: event.pointerId, id, x: event.clientX, y: event.clientY, element };
    element.setPointerCapture?.(event.pointerId);
  };

  private readonly onChipMove = (event: PointerEvent): void => {
    const drag = this.drag;
    if (
      !drag ||
      event.pointerId !== drag.pointerId ||
      (!drag.position &&
        Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < DRAG_THRESHOLD)
    )
      return;
    const position = this.raycastClientPoint(event.clientX, event.clientY);
    if (!position) return;
    drag.position = position;
    const chip = this.chips.get(`marker:${drag.id}`);
    if (chip) chip.position = position;
    this.requestRender();
  };

  private readonly onChipUp = (event: PointerEvent): void => {
    const drag = this.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    this.onChipMove(event);
    this.drag = undefined;
    if (drag.position) {
      this.suppressMarkerClick = drag.id;
      // Keep the preview until the editor supplies the new marker position.
      this.options.onMoveMarker?.(drag.id, point(drag.position));
    }
  };

  private readonly cancelDrag = (event?: PointerEvent): void => {
    const drag = this.drag;
    if (!drag || (event && event.pointerId !== drag.pointerId)) return;
    this.drag = undefined;
    if (drag.element.hasPointerCapture?.(drag.pointerId))
      drag.element.releasePointerCapture(drag.pointerId);
    const marker = this.state.markers?.find(({ id }) => id === drag.id);
    const chip = this.chips.get(`marker:${drag.id}`);
    if (chip && marker && isPoint(marker.pos)) chip.position = marker.pos;
    this.requestRender();
  };

  private readonly clearHover = (): void => {
    this.setHover(undefined);
  };

  private setHover(mesh?: Mesh): void {
    if (this.hovered === mesh) return;
    this.hovered = mesh;
    this.updateMeshStyles();
    this.requestRender();
  }

  update(state: Partial<ThreeViewportState>): void {
    if (this.destroyed) return;
    this.state = { ...this.state, ...state };
    if (!this.state.editMode || this.drag?.id !== this.state.selectedMarkerId) this.cancelDrag();
    if (
      !this.state.editMode ||
      (this.hovered && !this.state.meshPickMode && !this.meshAreas.has(this.hovered))
    ) {
      this.hovered = undefined;
    }
    if (this.model) this.refresh();
  }

  private refresh(): void {
    const {
      markers = [],
      view,
      editMode,
      states = {},
      entities = [],
      areas = [],
      hassAreas = [],
    } = this.state;
    this.areaEntities = indexByArea(entities);
    this.areaMarkers = indexByArea(markers);
    this.meshAreas.clear();
    for (const area of areas) {
      if (area.shape.type !== "mesh") continue;
      const mesh = this.namedMeshes.get(area.shape.mesh_name);
      if (mesh && !this.meshAreas.has(mesh)) this.meshAreas.set(mesh, area);
    }
    if (this.hovered && !this.state.meshPickMode && !this.meshAreas.has(this.hovered))
      this.hovered = undefined;

    const filter = view && { id: view.id, name: view.name, filters: view.filters };
    const visibleMarkers = markers.flatMap((marker) => {
      const pos = markerPosition(marker.pos);
      if (!pos || !(editMode || markerMatchesView(marker, filter))) return [];
      return [{ ...marker, pos }];
    });
    const registry = new Map(entities.map((entry) => [entry.entity_id, entry]));
    const areaNames = new Map(hassAreas.map((area) => [area.id, area.name]));
    const remaining = new Set(this.chips.keys());
    const markerOverlay = view?.marker_overlay;
    const markerBadges = this.badgeContent(markerOverlay?.badges, states);
    for (const marker of visibleMarkers) {
      const chip = this.getChip("marker", marker.id, remaining);
      const entityState = states[marker.entity_id];
      const entry = registry.get(marker.entity_id);
      const label = getMarkerLabel(marker, entityState, entry);
      chip.position = (this.drag?.id === marker.id && this.drag.position) || marker.pos;
      this.setChipInteraction(
        chip,
        !!editMode || (marker.action?.tap ?? "more-info") !== "none",
        !!editMode && this.state.selectedMarkerId === marker.id
      );
      const iconName = resolveMdiIconName(marker.icon, entityState, entry, marker.entity_id);
      let iconPath = this.options.resolveIconPath
        ? this.options.resolveIconPath(marker)
        : getMdiIconPath(iconName);
      if (!iconPath && !this.options.resolveIconPath && !this.pendingDynamicIcons.has(iconName)) {
        this.pendingDynamicIcons.add(iconName);
        void resolveDynamicMdiPath(iconName).then((resolved) => {
          if (resolved && !this.destroyed) {
            this.refresh();
          }
        });
      }
      updateChip(chip, {
        label,
        accessibleName: label || getEntityDisplayName(marker, entityState, entry),
        primary: markerOverlay?.primary
          ? this.resolveOverlayValue(
              markerOverlay.primary,
              marker.area_id ?? entry?.area_id ?? "",
              states
            )
          : getMarkerValue(marker, entityState),
        secondary: markerOverlay?.secondary
          ? this.resolveOverlayValue(
              markerOverlay.secondary,
              marker.area_id ?? entry?.area_id ?? "",
              states
            )
          : getMarkerValue(marker, entityState, "secondary"),
        badges: markerBadges,
        iconPath,
        glyph: getDomainGlyph(marker.entity_id) || "?",
        status: markerStatus(entityState),
      });
    }

    const areaOverlay = view?.area_overlay;
    const areaBadges = this.badgeContent(areaOverlay?.badges, states);
    for (const area of areas) {
      if (!editMode && !areaMatchesView(area, view)) continue;
      const position = this.areaPosition(area);
      if (!position || !isPoint(position)) continue;
      const chip = this.getChip("area", area.id, remaining);
      const label = areaNames.get(area.area_id ?? "") ?? area.area_id ?? area.id;
      chip.position = position;
      this.setChipInteraction(
        chip,
        !!editMode,
        !!editMode && this.state.selectedAreaId === area.id
      );
      updateChip(chip, {
        label,
        accessibleName: label,
        primary: this.resolveOverlayValue(areaOverlay?.primary, area.area_id ?? "", states),
        secondary: this.resolveOverlayValue(areaOverlay?.secondary, area.area_id ?? "", states),
        badges: areaBadges,
      });
    }
    for (const key of remaining) {
      this.chips.get(key)?.element.remove();
      this.chips.delete(key);
    }

    this.applyShadows();
    this.updateMeshStyles();
    this.updateLights(visibleMarkers);
    this.requestRender();
  }

  private getChip(kind: "marker" | "area", id: string, remaining: Set<string>): Chip {
    const key = `${kind}:${id}`;
    remaining.delete(key);
    let chip = this.chips.get(key);
    if (!chip) {
      const element = this.container.ownerDocument.createElement("button");
      element.type = "button";
      element.className = "floorplan-three-chip";
      element.dataset.viewportChip = kind;
      element.dataset[kind === "marker" ? "markerId" : "areaId"] = id;
      element.hidden = true;
      chip = { element, position: { x: 0, y: 0, z: 0 }, signature: "" };
      this.chips.set(key, chip);
      this.overlay.append(element);
    }
    return chip;
  }

  private setChipInteraction(chip: Chip, interactive: boolean, selected: boolean): void {
    chip.element.toggleAttribute("data-interactive", interactive);
    chip.element.toggleAttribute("data-selected", selected);
    chip.element.tabIndex = interactive ? 0 : -1;
    chip.element.disabled = !interactive;
  }

  private badgeContent(
    badges: BadgeSpec[] | undefined,
    states: Record<string, HassEntity>
  ): ChipContent["badges"] {
    return getActiveBadges(badges, states).map((badge) => ({
      label: badge.label ?? badge.entity_id,
      iconPath: this.options.resolveBadgeIconPath
        ? this.options.resolveBadgeIconPath(badge)
        : badge.icon && getMdiIconPath(badge.icon),
    }));
  }

  private resolveOverlayValue(
    spec: OverlayValue | undefined,
    areaId: string,
    states: Record<string, HassEntity>
  ): string {
    if (!spec) return "";
    if (spec.mode === "entity") return resolveValueBinding(spec, states[spec.entity_id]);
    return areaId
      ? resolveAreaAggregate(
          spec,
          areaId,
          states,
          this.areaEntities.get(areaId) ?? [],
          this.areaMarkers.get(areaId)
        )
      : "";
  }

  private applyShadows(): void {
    if (!this.renderer) return;
    const enabled = this.state.shadows === true;
    if (this.renderer.shadowMap.enabled === enabled) return;
    this.renderer.shadowMap.enabled = enabled;
    this.keyLight.castShadow = enabled;
    for (const mesh of this.meshes) {
      mesh.castShadow = enabled;
      mesh.receiveShadow = enabled;
      for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        material.needsUpdate = true;
      }
    }
  }

  private updateMeshStyles(): void {
    const { view, editMode, selectedAreaId, states = {} } = this.state;
    const style = view?.style;
    const meshStates = new Map<
      Mesh,
      { opacity: number; tint?: Color; tintStrength?: number; selected?: boolean }
    >();
    for (const [mesh, area] of this.meshAreas) {
      if (area.style?.fill && area.style.fill !== "#2196f3") {
        const strength = MathUtils.clamp(area.style.fillOpacity ?? 0.4, 0, 1) * 0.5;
        if (strength > 0) {
          meshStates.set(mesh, {
            opacity: 1,
            tint: new Color(area.style.fill),
            tintStrength: strength,
          });
        }
      }
    }
    if (style?.dim_inactive_areas || style?.highlight_active_areas) {
      const fill = style.active_area_fill || this.themeColor();
      const tint = new Color(fill);
      for (const [mesh, area] of this.meshAreas) {
        const areaId = area.area_id ?? "";
        const active =
          areaMatchesView(area, view) &&
          areaHasActiveEntities(
            areaId,
            view?.filters?.domains,
            states,
            this.areaEntities.get(areaId) ?? [],
            this.areaMarkers.get(areaId)
          );
        if (active && style.highlight_active_areas) {
          meshStates.set(mesh, { opacity: style.active_area_opacity ?? 1, tint, tintStrength: 1 });
        } else if (!active && style.dim_inactive_areas) {
          meshStates.set(mesh, { opacity: style.inactive_area_opacity ?? 0.35 });
        }
      }
    }
    if (editMode) {
      for (const [mesh, area] of this.meshAreas) {
        if (area.id === selectedAreaId) meshStates.set(mesh, { opacity: 1, selected: true });
      }
      if (this.hovered && !meshStates.get(this.hovered)?.selected) {
        meshStates.set(this.hovered, { opacity: 1, selected: false });
      }
    }

    for (const [mesh, record] of this.styledMeshes) {
      if (meshStates.has(mesh)) continue;
      mesh.material = record.original;
      if (!this.meshAreas.has(mesh)) {
        for (const clone of record.clones) clone.dispose();
        this.styledMeshes.delete(mesh);
      }
    }
    const selectionColor = new Color(this.themeColor());
    for (const [mesh, { opacity, tint, tintStrength = 1, selected }] of meshStates) {
      let record = this.styledMeshes.get(mesh);
      if (!record) {
        const original = mesh.material;
        record = {
          original,
          clones: (Array.isArray(original) ? original : [original]).map((item) => item.clone()),
        };
        this.styledMeshes.set(mesh, record);
      }
      const originals: AreaMaterial[] = Array.isArray(record.original)
        ? record.original
        : [record.original];
      record.clones.forEach((clone, index) => {
        const original = originals[index];
        clone.opacity = original.opacity * MathUtils.clamp(opacity, 0, 1);
        const transparent = original.transparent || clone.opacity < 1;
        if (clone.transparent !== transparent) {
          clone.transparent = transparent;
          clone.needsUpdate = true;
        }
        clone.depthWrite = original.depthWrite && (original.transparent || !transparent);
        if (clone.color && original.color) {
          clone.color.copy(original.color);
          if (tint) clone.color.lerp(tint, MathUtils.clamp(tintStrength, 0, 1));
          if (selected !== undefined) clone.color.lerp(selectionColor, selected ? 0.24 : 0.14);
        }
        if (clone.emissive && original.emissive) {
          clone.emissive.copy(original.emissive);
          clone.emissiveIntensity = original.emissiveIntensity;
          if (selected !== undefined) {
            clone.emissive.lerp(selectionColor, selected ? 0.32 : 0.18);
            clone.emissiveIntensity = Math.max(original.emissiveIntensity ?? 0, 0.4);
          }
        }
      });
      mesh.material = Array.isArray(record.original) ? record.clones : record.clones[0];
    }
  }

  private themeColor(): string {
    return (
      this.container.ownerDocument.defaultView
        ?.getComputedStyle(this.container)
        .getPropertyValue("--primary-color")
        .trim() || DEFAULT_AREA_COLOR
    );
  }

  private createGlowTexture(): CanvasTexture | undefined {
    const canvas = this.container.ownerDocument.createElement("canvas");
    canvas.width = canvas.height = 64;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    return new CanvasTexture(canvas);
  }

  private glowFor(id: string, position: Point3D): Glow | undefined {
    let glow = this.glows.get(id);
    if (!glow) {
      if (this.glowTexture === undefined) this.glowTexture = this.createGlowTexture() ?? null;
      if (!this.glowTexture) return undefined;
      const mesh = new Mesh(
        this.glowGeometry,
        new MeshBasicMaterial({
          map: this.glowTexture,
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          toneMapped: false,
        })
      );
      mesh.rotation.x = -Math.PI / 2;
      this.scene.add(mesh);
      glow = { mesh, position: new Vector3(Infinity, Infinity, Infinity) };
      this.glows.set(id, glow);
    }
    if (!glow.position.equals(vector(position))) {
      glow.position.copy(position);
      const lift = this.radius * 0.002;
      const origin = vector(position);
      origin.y += lift;
      this.raycaster.set(origin, new Vector3(0, -1, 0));
      const normalMatrix = new Matrix3();
      const surface = this.raycaster.intersectObjects(this.meshes, false).find((hit) => {
        if (!hit.face) return false;
        const normal = hit.face.normal
          .clone()
          .applyNormalMatrix(normalMatrix.getNormalMatrix(hit.object.matrixWorld));
        return normal.y > 0.6;
      });
      glow.mesh.position.set(
        position.x,
        (surface?.point.y ?? -this.floor.constant) + lift,
        position.z
      );
    }
    return glow;
  }

  private updateLights(markers: readonly (ThreeViewportMarker & { pos: Point3D })[]): void {
    const candidates: {
      marker: ThreeViewportMarker & { pos: Point3D };
      brightness: number;
      color: Color;
    }[] = [];
    const lightMarkerIds = new Set<string>();
    for (const marker of markers) {
      if (!marker.entity_id.startsWith("light.")) continue;
      lightMarkerIds.add(marker.id);
      if (this.state.lighting === false) continue;
      const settings = getLightSettings(this.state.states?.[marker.entity_id]);
      if (settings?.brightness) candidates.push({ marker, ...settings });
    }

    for (const [id, glow] of this.glows) {
      glow.mesh.visible = false;
      if (!lightMarkerIds.has(id)) {
        glow.mesh.removeFromParent();
        glow.mesh.material.dispose();
        this.glows.delete(id);
      }
    }
    candidates.sort((a, b) => b.brightness - a.brightness);
    const slots = Math.min(lightMarkerIds.size, MAX_POINT_LIGHTS);
    while (this.state.lighting !== false && this.pointLights.length < slots) {
      const light = new PointLight(0xffffff, 0, this.radius * 0.65);
      this.pointLights.push(light);
      this.scene.add(light);
    }
    this.pointLights.forEach((light, index) => {
      const candidate = candidates[index];
      // Keep light slots attached to avoid changing the shader as entities toggle.
      light.intensity = candidate ? 3.5 * this.radius ** 2 * candidate.brightness : 0;
      if (!candidate) return;
      light.color.copy(candidate.color);
      light.position.copy(candidate.marker.pos);
      light.position.y += this.radius * 0.035;
    });
    for (const { marker, brightness, color } of candidates) {
      const glow = this.glowFor(marker.id, marker.pos);
      if (!glow) continue;
      glow.mesh.visible = true;
      glow.mesh.material.color.copy(color);
      glow.mesh.material.opacity = 0.5 * brightness;
      glow.mesh.scale.setScalar(this.radius * (0.12 + brightness * 0.2));
    }
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
    this.events.abort();
    this.cancelDrag();
    this.observer?.disconnect();
    this.controls?.dispose();
    for (const [mesh, record] of this.styledMeshes) {
      mesh.material = record.original;
      for (const clone of record.clones) clone.dispose();
    }
    disposeModel(this.modelScenes);
    this.keyLight.dispose();
    this.ambient.dispose();
    for (const light of this.pointLights) light.dispose();
    for (const { mesh } of this.glows.values()) mesh.material.dispose();
    this.glowGeometry.dispose();
    this.glowTexture?.dispose();
    this.scene.clear();
    this.renderer?.dispose();
    this.renderer?.forceContextLoss();
    this.renderer?.domElement.remove();
    this.overlay.remove();
    this.style.remove();
    this.error?.remove();
    if (this.changedPosition && this.container.style.position === "relative") {
      this.container.style.position = this.previousPosition;
    }
    this.model = undefined;
    this.modelScenes = [];
    this.meshes.length = 0;
    this.namedMeshes.clear();
    this.meshAreas.clear();
    this.roomCenters.clear();
    this.areaEntities.clear();
    this.areaMarkers.clear();
    this.styledMeshes.clear();
    this.chips.clear();
    this.glows.clear();
    this.pointLights.length = 0;
    this.hovered = undefined;
    this.renderer = undefined;
    this.controls = undefined;
  }
}

export function createThreeViewport(
  container: HTMLElement,
  options: ThreeViewportOptions
): ThreeViewportController {
  return new ThreeViewport(container, options);
}
