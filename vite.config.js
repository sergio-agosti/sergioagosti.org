import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { minify } from "html-minifier-terser";
import webfontDownload from "vite-plugin-webfont-dl";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";
import pug from "pug";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: "src",
  build: {
    outDir: resolve(__dirname, "dist"),
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
      transformIndexHtml(html) {
        const pugPath = resolve(__dirname, "src", "index.pug");
        if (existsSync(pugPath)) {
          const pugTemplate = readFileSync(pugPath, "utf-8");
          const compiled = pug.compile(pugTemplate, {
            filename: pugPath,
            basedir: resolve(__dirname, "src"),
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
      name: "inline-css-and-minify",
      enforce: "post",
      apply: "build",
      async transformIndexHtml(html, ctx) {
        if (!ctx.bundle) return html;

        const cssFiles = [];

        // Extract CSS from bundle
        for (const output of Object.values(ctx.bundle)) {
          if (output.type === "asset" && output.fileName.endsWith(".css") && typeof output.source === "string") {
            cssFiles.push(output.source);
          }
        }

        // Remove local stylesheet link tags (relative paths like ./style.css)
        html = html.replace(/<link[^>]*\.\/style\.css[^>]*>/gi, "");

        if (cssFiles.length > 0) {
          const cssContent = cssFiles.join("\n");
          const styleTag = `<style>${cssContent}</style>`;

          // Inject style tag before closing head tag
          html = html.replace("</head>", `${styleTag}</head>`);
        }

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
      generateBundle(options, bundle) {
        // Remove CSS files from bundle since we're inlining them
        for (const fileName in bundle) {
          if (fileName.endsWith(".css")) {
            delete bundle[fileName];
          }
        }
      },
    },
  ],
});
