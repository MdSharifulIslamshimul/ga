import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";

function copyExtensionFiles() {
  return {
    name: "copy-extension-files",
    closeBundle() {
      const dist = resolve(__dirname, "dist");
      const iconsDir = resolve(dist, "icons");
      if (!existsSync(iconsDir)) mkdirSync(iconsDir, { recursive: true });

      copyFileSync(
        resolve(__dirname, "manifest.json"),
        resolve(dist, "manifest.json")
      );

      for (const size of [16, 48, 128]) {
        copyFileSync(
          resolve(__dirname, "public", "icons", `icon${size}.png`),
          resolve(iconsDir, `icon${size}.png`)
        );
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyExtensionFiles()],
  base: "",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
