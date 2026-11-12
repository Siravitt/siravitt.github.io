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
  const file =
    (await resolveFile(decodeURIComponent(url.pathname))) ??
    (await resolveFile("/404.html"));

  if (!file) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
    return;
  }

  const body = await readFile(file);
  const contentType =
    CONTENT_TYPES[extname(file)] ?? "application/octet-stream";
  res.writeHead(200, { "content-type": contentType });
  res.end(body);
});

server.listen(PORT, () => {
  console.log(`Serving out/ at http://localhost:${PORT}`);
});
