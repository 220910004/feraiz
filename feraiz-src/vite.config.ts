import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  const buildSingleFile = process.env.BUILD_SINGLEFILE !== "false";

  return {
    plugins: [react(), tailwindcss(), ...(buildSingleFile ? [viteSingleFile()] : [])],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    build: {
      sourcemap: false,
      cssCodeSplit: !buildSingleFile,
      modulePreload: !buildSingleFile,
      rollupOptions: {
        output: buildSingleFile
          ? undefined
          : {
              manualChunks(id) {
                if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
                  return "react-vendor";
                }
                if (id.includes("/src/components/FortyRules") || id.includes("/src/components/SourcesPanel") || id.includes("/src/components/InfoPanel")) {
                  return "knowledge";
                }
                if (id.includes("/src/components/ResultsDisplay") || id.includes("/src/core/") || id.includes("/src/utils/inheritanceCalculator")) {
                  return "results-engine";
                }
              },
            },
      },
    },
  };
});
