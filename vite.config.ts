import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { viteConvertPugInHtml } from "@mish.dev/vite-convert-pug-in-html";
import { resolve } from "path";

export default defineConfig({
  root: "src",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    allowedHosts: ["sergios-laptop"],
  },
  plugins: [tailwindcss(), viteConvertPugInHtml()],
});
