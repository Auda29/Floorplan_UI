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
      formats: ["es"],
    },
    rollupOptions: {
      // The entry registers the panel as a side effect and has no public exports.
      preserveEntrySignatures: false,
      output: {
        entryFileNames: "floorplan-ui.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        inlineDynamicImports: false,
      },
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
