import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { viteConvertPugInHtml } from "@mish.dev/vite-convert-pug-in-html";
import { readFileSync } from "fs";
import { resolve } from "path";

const PROJECTS = JSON.parse(readFileSync(resolve(import.meta.dirname, "src/data/projects.json"), "utf8"));

export default defineConfig(({ mode }) => ({
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
    viteConvertPugInHtml({
      locals: {
        CONTACT_FORM_ACTION: mode === "development" ? "/thank-you" : "https://api.web3forms.com/submit",
        PROJECTS,
      },
    }),
  ],
}));
