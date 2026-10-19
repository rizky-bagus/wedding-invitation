import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { db } from "@/lib/db";
import { STORED_NAME, UPLOAD_DIR } from "@/lib/uploads";
import { formatDate } from "@/lib/util";

export const alt = "Undangan pernikahan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Foto cover -> data URL JPEG 1200x630. Satori tidak membaca semua format (mis. WebP), jadi dikonversi. */
async function coverDataUrl(src: string): Promise<string | null> {
  try {
    let input: Buffer | null = null;
    if (src.startsWith("/files/")) {
      const name = src.slice("/files/".length);
      if (STORED_NAME.test(name)) input = await readFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name));
    } else if (/^https?:\/\//i.test(src)) {
      const res = await fetch(src, { signal: AbortSignal.timeout(4000) });
      const len = Number(res.headers.get("content-length") ?? 0);
      if (res.ok && len < 8 * 1024 * 1024) input = Buffer.from(await res.arrayBuffer());
    }
    if (!input || input.length > 8 * 1024 * 1024) return null;
    const jpeg = await sharp(input, { limitInputPixels: 80_000_000 })
      .rotate()
      .resize(size.width, size.height, { fit: "cover" })
      .jpeg({ quality: 78 })
      .toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null; // foto gagal dibaca: pakai latar warna
  }
}

export default async function Image({ params }: { params: Promise<{ invitation: string }> }) {
  const { invitation } = await params;
  const inv = await db.invitation.findUnique({ where: { slug: invitation } });

  const primary = inv?.primaryColor ?? "#b08968";
  const bg = inv?.bgColor ?? "#fffaf3";
  const photo = inv?.coverPhoto ? await coverDataUrl(inv.coverPhoto) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: `linear-gradient(135deg, ${primary}, ${bg})`,
          fontFamily: "sans-serif",
        }}
      >
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" width={size.width} height={size.height} style={{ position: "absolute", inset: 0 }} />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: photo ? "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.65))" : "transparent",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: 60,
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 10, textTransform: "uppercase", opacity: 0.9 }}>
            {inv?.title ?? "Undangan Pernikahan"}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 28,
              fontSize: 104,
              fontWeight: 700,
              lineHeight: 1.1,
              textShadow: "0 4px 24px rgba(0,0,0,0.35)",
            }}
          >
            {inv ? `${inv.groomName} & ${inv.brideName}` : "Undangan"}
          </div>
          {inv && (
            <div style={{ display: "flex", marginTop: 30, fontSize: 36, opacity: 0.95 }}>{formatDate(inv.eventDate)}</div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
