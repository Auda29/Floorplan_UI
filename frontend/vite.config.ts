import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  esbuild: {
    drop: ["console"],
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "FloorplanUI",
      fileName: () => "floorplan-ui.js",
      formats: ["es"],
    },
    outDir: "../custom_components/floorplan_ui/frontend",
    emptyOutDir: true,
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
