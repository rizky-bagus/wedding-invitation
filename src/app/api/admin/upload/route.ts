import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { isAdmin } from "@/lib/auth";
import { KINDS, UPLOAD_DIR, extOf, type Kind } from "@/lib/uploads";

const MAX_SIDE = 1600;

const kb = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Tidak diizinkan." }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const kind = String(form?.get("kind") ?? "") as Kind;
  if (!(file instanceof File) || !(kind in KINDS)) {
    return Response.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const rule = KINDS[kind];
  let ext = extOf(file.name);
  if (!(ext in rule.types)) {
    return Response.json({ error: `Format tidak didukung. Gunakan: ${Object.keys(rule.types).join(", ")}.` }, { status: 400 });
  }
  if (file.size === 0 || file.size > rule.maxBytes) {
    return Response.json({ error: `Ukuran file maksimal ${rule.maxBytes / 1024 / 1024} MB.` }, { status: 413 });
  }

  const original = Buffer.from(await file.arrayBuffer());
  let data = original;
  let note: string | undefined;

  if (kind === "image") {
    try {
      if (ext === "gif") {
        // GIF dibiarkan agar animasinya utuh; cukup dipastikan benar-benar gambar.
        await sharp(original, { limitInputPixels: 80_000_000 }).metadata();
      } else {
        // Putar sesuai EXIF, kecilkan, ubah ke WebP. Metadata (termasuk lokasi GPS) tidak ikut tersimpan.
        data = await sharp(original, { limitInputPixels: 80_000_000 })
          .rotate()
          .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
        ext = "webp";
        note = `Foto dioptimalkan: ${kb(original.length)} → ${kb(data.length)}`;
      }
    } catch {
      // Ekstensi bisa dipalsukan; sharp menolak isi yang bukan gambar.
      return Response.json({ error: "File bukan gambar yang valid." }, { status: 400 });
    }
  }

  const name = `${randomUUID()}.${ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), data);
  return Response.json({ url: `/files/${name}`, note });
}
