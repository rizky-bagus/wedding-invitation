import { open, stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { ALL_TYPES, STORED_NAME, UPLOAD_DIR, extOf } from "@/lib/uploads";

export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  // Hanya nama hasil upload (uuid.ext); mencegah path traversal.
  if (!STORED_NAME.test(name) || !(extOf(name) in ALL_TYPES)) return new Response("Not found", { status: 404 });

  const full = path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name);
  const info = await stat(full).catch(() => null);
  if (!info?.isFile()) return new Response("Not found", { status: 404 });

  const headers: Record<string, string> = {
    "Content-Type": ALL_TYPES[extOf(name)],
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  };

  let start = 0;
  let end = info.size - 1;
  let status = 200;
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") ?? "");
  if (range && (range[1] || range[2])) {
    if (range[1]) {
      start = Number(range[1]);
      if (range[2]) end = Math.min(Number(range[2]), end);
    } else {
      start = Math.max(0, info.size - Number(range[2])); // "bytes=-N": N byte terakhir
    }
    if (start > end || start >= info.size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${info.size}` } });
    }
    status = 206;
    headers["Content-Range"] = `bytes ${start}-${end}/${info.size}`;
  }
  headers["Content-Length"] = String(end - start + 1);

  const handle = await open(full, "r");
  const stream = handle.createReadStream({ start, end, autoClose: true });
  return new Response(Readable.toWeb(stream) as ReadableStream, { status, headers });
}
