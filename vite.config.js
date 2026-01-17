import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { minify } from "html-minifier-terser";
import webfontDownload from "vite-plugin-webfont-dl";
import { resolve } from "path";
import { fileURLToPath } from "url";

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
    webfontDownload(["https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap"], {
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

        if (cssFiles.length > 0) {
          const cssContent = cssFiles.join("\n");
          const styleTag = `<style>${cssContent}</style>`;

          // Remove existing link tags for CSS
          html = html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, "");

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
