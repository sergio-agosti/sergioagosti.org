import { defineConfig, normalizePath } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { viteConvertPugInHtml } from "@mish.dev/vite-convert-pug-in-html";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { resolve } from "path";

const DATA_DIR = resolve(import.meta.dirname, "src/data");
const CV_PDF = resolve(import.meta.dirname, "src/public/sergio-agosti-cv.pdf");

// "227 KB", "1.5 MB" - files are shipped to browsers, so 1024-based units.
const formatBytes = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${unit === 0 ? value : value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
};

// Reload the browser whenever any JSON data file under src/data changes.
const dataJsonReload = {
  name: "data-json-reload",
  apply: "serve",
  configureServer(server) {
    server.watcher.add(DATA_DIR);
  },
  handleHotUpdate({ file, server }) {
    if (file.startsWith(normalizePath(DATA_DIR)) && file.endsWith(".json")) {
      server.config.logger.info(`[data-json] ${file} changed - full reload`, { timestamp: true });
      server.ws.send({ type: "full-reload", path: "*" });
    }
  },
};

export default defineConfig(({ mode }) => {
  // One Pug local per JSON file in src/data (projects.json -> PROJECTS), defined
  // as getters so they are re-read from disk on every render. Editing the data
  // therefore shows up immediately instead of requiring a Vite restart.
  // (New JSON files are picked up at the next startup - templates need new
  // locals wired in anyway, and Vite auto-restarts when vite.config.ts changes.)
  const locals = {
    CONTACT_FORM_ACTION: mode === "development" ? "/thank-you" : "https://api.web3forms.com/submit",
  };
  // Size shown next to the CV download link. Read from the PDF itself so it
  // cannot go stale when the CV is re-exported.
  Object.defineProperty(locals, "CV_PDF_SIZE", {
    enumerable: true,
    get() {
      return formatBytes(statSync(CV_PDF).size);
    },
  });
  if (existsSync(DATA_DIR)) {
    for (const file of readdirSync(DATA_DIR)) {
      if (!file.endsWith(".json")) continue;
      const localName = file.slice(0, -".json".length).toUpperCase();
      const filePath = resolve(DATA_DIR, file);
      Object.defineProperty(locals, localName, {
        enumerable: true,
        get() {
          return JSON.parse(readFileSync(filePath, "utf8"));
        },
      });
    }
  }

  return {
    root: "src",
    resolve: {
      alias: {
        "@": resolve(import.meta.dirname, "src"),
      },
    },
    build: {
      outDir: "../dist",
      emptyOutDir: true,
    },
    server: {
      allowedHosts: ["sergios-laptop"],
    },
    plugins: [
      tailwindcss(),
      dataJsonReload,
      viteConvertPugInHtml({
        locals,
      }),
    ],
  };
});
