import { defineConfig, type PluginOption } from "vite";
import tailwindcss from "@tailwindcss/vite";
import webfontDownload from "vite-plugin-webfont-dl";
import { readFileSync, existsSync } from "node:fs";
import pug from "pug";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
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
      name: "inject-css",
      enforce: "post",
      apply: "build",
      transformIndexHtml(html: string, ctx): string {
        if (!ctx.bundle) return html;

        // Find CSS file in bundle
        const cssFile = Object.values(ctx.bundle).find(
          (output) => output.type === "asset" && output.fileName.endsWith(".css")
        );

        if (cssFile && typeof cssFile.fileName === "string") {
          const cssLink = `<link rel="stylesheet" href="./${cssFile.fileName}">`;
          // Inject CSS link before closing head tag
          html = html.replace("</head>", `  ${cssLink}\n</head>`);
        }

        return html;
      },
    },
  ] as PluginOption[],
});
