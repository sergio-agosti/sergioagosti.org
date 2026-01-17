import { defineConfig, type PluginOption } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { minify } from "html-minifier-terser";
import webfontDownload from "vite-plugin-webfont-dl";
import { readFileSync, existsSync } from "node:fs";
import pug from "pug";

export default defineConfig({
  root: "src",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: "esbuild",
  },
  server: {
    allowedHosts: ["sergios-laptop"],
  },
  plugins: [
    tailwindcss(),
    {
      name: "pug-to-html",
      enforce: "pre",
      transformIndexHtml(html: string): string {
        const pugPath = "src/index.pug";
        if (existsSync(pugPath)) {
          const pugTemplate = readFileSync(pugPath, "utf-8");
          const compiled = pug.compile(pugTemplate, {
            filename: pugPath,
            basedir: "src",
          });
          return compiled();
        }
        return html;
      },
    },
    webfontDownload(["https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap"], {
      injectAsStyleTag: true,
      minifyCss: true,
      async: true,
      cache: true,
    }),
    {
      name: "minify-html",
      enforce: "post",
      apply: "build",
      async transformIndexHtml(html: string): Promise<string> {
        // Minify HTML
        return await minify(html, {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true,
        });
      },
    },
  ] as PluginOption[],
});
