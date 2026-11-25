import type {
  HassArea,
  HassEntity,
  HassEntityRegistry,
  Marker,
  Plan,
  View,
} from "../types/home-assistant";
import type { AreaGeometryUpdate } from "./area-config";
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}
export interface CameraPreset {
  id: string;
  name: string;
  mode: "ortho" | "perspective";
  zoom?: number;
  position: Vec3;
  target: Vec3;
}
export interface ViewStyleConfig {
  inactive_area_opacity?: number;
  active_area_fill?: string;
  active_area_stroke?: string;
  active_area_opacity?: number;
  highlight_active_areas?: boolean;
  dim_inactive_areas?: boolean;
}
export type AreaShape3D =
  | { type: "mesh"; mesh_name: string; anchor?: Vec3 }
  | ({ type: "anchor3d" } & Vec3);
export interface ModelBackground {
  type: "model";
  width?: number;
  height?: number;
  unit_scale?: number;
  asset_id?: string;
  url?: string;
  content_type?: "model/gltf-binary";
}
export interface ViewportCallbacks {
  onSelectMarker(markerId: string): void;
  onActivateMarker(marker: Marker): void;
  onMoveMarker(markerId: string, position: { x: number; y: number; z?: number }): void;
  onSelectArea(areaId: string): void;
  onUpdateAreaShape(areaId: string, update: AreaGeometryUpdate | AreaShape3D): void;
  onEmptyCanvasClick(): void;
}
export interface ViewportRenderState {
  plan: Plan | null;
  view?: View;
  states: Record<string, HassEntity>;
  entities: HassEntityRegistry[];
  areas: HassArea[];
  editMode: boolean;
  selectedMarkerId: string | null;
  selectedAreaId: string | null;
}
export interface PlanViewportController {
  updateState(state: ViewportRenderState): void;
  fit(): void;
  zoomIn(): void;
  zoomOut(): void;
  applyCameraPreset(preset: CameraPreset): void;
  captureCameraPreset(): CameraPreset | null;
  getAvailableMeshes(): readonly string[];
  destroy(): void;
}
