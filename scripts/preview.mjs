// Serves the static export in `out/` over plain HTTP for local preview
// (ticket 01 decision: no new runtime dependency — Node's own `http` and
// `fs` modules are enough for a static file server).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const OUT_DIR = join(process.cwd(), "out");
const PORT = Number(process.env.PORT ?? 4173);

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

/** Resolves a request path to a file under `out/`, trying `.html` and `index.html`. */
async function resolveFile(requestPath) {
  const safePath = normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const candidates = [
    join(OUT_DIR, safePath),
    join(OUT_DIR, `${safePath}.html`),
    join(OUT_DIR, safePath, "index.html"),
  ];
  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch (error) {
    if (error instanceof URIError) {
      res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
      res.end("400 Bad Request");
      return;
    }
    throw error;
  }

  const file = await resolveFile(pathname);

  if (!file) {
    // Mirrors GitHub Pages: an unknown path gets `out/404.html` served with
    // a real 404 status, not 200 (the preview must match prod for Flame's
    // release checks and for Lighthouse, which runs against this server).
    const notFoundFile = await resolveFile("/404.html");
    if (!notFoundFile) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }
    const body = await readFile(notFoundFile);
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end(body);
    return;
  }

  const body = await readFile(file);
  const contentType =
    CONTENT_TYPES[extname(file)] ?? "application/octet-stream";
  res.writeHead(200, { "content-type": contentType });
  res.end(body);
});

// Bound to loopback only (ticket 01: "serves out/ on localhost"), not every
// interface — this is a local dev tool, not something to expose on the LAN.
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Serving out/ at http://127.0.0.1:${PORT}`);
});
