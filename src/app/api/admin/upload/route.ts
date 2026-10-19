import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { isAdmin } from "@/lib/auth";
import { KINDS, UPLOAD_DIR, extOf, type Kind } from "@/lib/uploads";

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Tidak diizinkan." }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const kind = String(form?.get("kind") ?? "") as Kind;
  if (!(file instanceof File) || !(kind in KINDS)) {
    return Response.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const rule = KINDS[kind];
  const ext = extOf(file.name);
  if (!(ext in rule.types)) {
    return Response.json({ error: `Format tidak didukung. Gunakan: ${Object.keys(rule.types).join(", ")}.` }, { status: 400 });
  }
  if (file.size === 0 || file.size > rule.maxBytes) {
    return Response.json({ error: `Ukuran file maksimal ${rule.maxBytes / 1024 / 1024} MB.` }, { status: 413 });
  }

  const name = `${randomUUID()}.${ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return Response.json({ url: `/files/${name}` });
}
