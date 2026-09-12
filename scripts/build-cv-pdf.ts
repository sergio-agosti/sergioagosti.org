/**
 * Regenerates the CV PDF that ships with the site.
 *
 * Printing the page by hand is not reproducible: the paper size follows the
 * machine's default printer, Chrome bakes its own header and footer into the
 * output, and whatever sits in the browser profile can affect the render. This
 * serves the built site to a headless Chrome with a throwaway profile instead.
 * Paper size and light ink are pinned in CSS - see the print layer in
 * src/main.css.
 *
 * Usage: pnpm cv:pdf
 */
import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = join(ROOT, "dist");
const OUT = join(ROOT, "src/public/sergio-agosti-cv.pdf");
const PAGE = "/cv/";
const TIMEOUT = 30_000;

const CHROME = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find((path) => path && existsSync(path));

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

if (!CHROME) {
  console.error("No Chrome or Chromium found. Set CHROME_PATH to the executable.");
  process.exit(1);
}
if (!existsSync(join(DIST, "index.html"))) {
  console.error("No build found in dist/. Run `pnpm build` first.");
  process.exit(1);
}

/**
 * Chrome writes the PDF but does not reliably exit afterwards, so settle on the
 * file rather than on the process: wait for a plausible size that stops
 * changing between polls.
 */
const waitForPdf = async (path, child, timeout) => {
  const deadline = Date.now() + timeout;
  let previous = -1;

  while (Date.now() < deadline) {
    await new Promise((done) => setTimeout(done, 150));

    let size = -1;
    try {
      size = (await stat(path)).size;
    } catch {
      // Not written yet.
    }

    if (size > 10_000 && size === previous) return;
    previous = size;

    if (size <= 0 && child.exitCode !== null) {
      throw new Error(`Chrome exited with code ${child.exitCode} without writing a PDF.`);
    }
  }

  throw new Error(`Chrome wrote no PDF within ${timeout / 1000}s.`);
};

// Serve dist/ so the page can resolve its absolute asset paths (/main.css and
// the fonts), which a file:// URL would not.
const server = createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? "/", "http://localhost");
  const file = join(DIST, pathname.endsWith("/") ? join(pathname, "index.html") : pathname);
  try {
    const body = await readFile(file);
    response.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

await new Promise((done) => server.listen(0, "127.0.0.1", done));
const port = server.address().port;

const profile = await mkdtemp(join(tmpdir(), "cv-pdf-profile-"));
const scratch = await mkdtemp(join(tmpdir(), "cv-pdf-out-"));
const scratchPdf = join(scratch, "cv.pdf");

const chrome = spawn(
  CHROME,
  [
    "--headless",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--hide-scrollbars",
    "--force-color-profile=srgb",
    // No URL, date or page-number furniture, and a clean profile so nothing
    // carried over from a real browsing session can affect the output.
    "--no-pdf-header-footer",
    `--user-data-dir=${profile}`,
    `--print-to-pdf=${scratchPdf}`,
    `http://127.0.0.1:${port}${PAGE}`,
  ],
  // Drain stderr: leaving it unread lets a full pipe buffer block Chrome.
  { stdio: ["ignore", "ignore", "pipe"] },
);

let noise = "";
chrome.stderr.on("data", (chunk) => {
  noise = (noise + chunk).slice(-2000);
});

try {
  await waitForPdf(scratchPdf, chrome, TIMEOUT);
} catch (error) {
  chrome.kill("SIGKILL");
  console.error(error.message);
  if (noise) console.error(noise);
  process.exit(1);
}

// Stop the browser (it may well still be running), then stop the server.
if (chrome.exitCode === null && chrome.signalCode === null) {
  chrome.kill("SIGKILL");
  await once(chrome, "exit");
}
server.closeAllConnections();
server.close();
await rm(profile, { recursive: true, force: true });

// dist/ and src/public live on the repo's own volume, so copy rather than rename.
//
// Skia stamps the current time into /CreationDate and /ModDate, which would make
// two renders of an unchanged page differ byte for byte - leaving the pre-push
// hook unable to tell a real change from a timestamp. Both values are a fixed
// length, so they are rewritten in place: matching sizes keep the xref offsets
// valid, and the output becomes reproducible.
const STAMP = /D:\d{14}[+-]\d{2}'\d{2}'/g;
const PINNED = "D:20260101000000+00'00'";
const rendered = await readFile(scratchPdf);
await writeFile(OUT, rendered.toString("latin1").replace(STAMP, PINNED), "latin1");
await rm(scratch, { recursive: true, force: true });

const { size } = await stat(OUT);
console.log(`Wrote ${relative(ROOT, OUT)} (${Math.round(size / 1024)} KB)`);
