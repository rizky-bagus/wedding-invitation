import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { db } from "@/lib/db";
import { STORED_NAME, UPLOAD_DIR } from "@/lib/uploads";
import { formatDate } from "@/lib/util";
import { Divider, FlourishCorner, FloralCorner, WaxSeal, mix } from "./og-art";

export const alt = "Undangan pernikahan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FONT_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "src/assets/fonts");
const font = (file: string) => readFile(path.join(/*turbopackIgnore: true*/ FONT_DIR, file));

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

/**
 * Ukuran nama menyesuaikan lebar yang tersedia (900 px) agar selalu satu baris.
 * Huruf kapital font script lebar, jadi perkiraan lebar per karakter dibuat longgar.
 */
function nameSize(text: string, script: boolean): number {
  const base = script ? 140 : 108;
  const perChar = script ? 0.66 : 0.58;
  return Math.max(52, Math.min(base, Math.floor(900 / (Math.max(text.length, 1) * perChar))));
}

const shadow = "0 3px 18px rgba(0,0,0,0.55)";
const { width: W, height: H } = size;

export default async function Image({ params }: { params: Promise<{ invitation: string }> }) {
  const { invitation } = await params;
  const inv = await db.invitation.findUnique({ where: { slug: invitation } });

  const primary = inv?.primaryColor ?? "#b08968";
  const template = inv?.template ?? "elegant";
  const photo = inv?.coverPhoto ? await coverDataUrl(inv.coverPhoto) : null;

  const [serif, serifRegular, script] = await Promise.all([
    font("playfair-display-latin-700-normal.woff"),
    font("playfair-display-latin-400-normal.woff"),
    font("great-vibes-latin-400-normal.woff"),
  ]);

  // Template yang bernuansa bunga/tulisan tangan memakai font script untuk nama.
  const floral = ["floral", "botanical", "satin", "kraft"].includes(template);
  const scriptNames = floral || template === "envelope";
  const names = inv ? `${inv.groomName} & ${inv.brideName}` : "Undangan";
  const initials = inv ? `${inv.groomName.charAt(0)} & ${inv.brideName.charAt(0)}`.toUpperCase() : "";
  const venue = inv?.venueName ? (inv.venueName.length > 46 ? `${inv.venueName.slice(0, 44)}…` : inv.venueName) : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: `linear-gradient(135deg, ${mix(primary, "#000000", 0.4)}, ${mix(primary, "#000000", 0.05)})`,
          fontFamily: "Playfair",
          color: "#ffffff",
        }}
      >
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" width={size.width} height={size.height} style={{ position: "absolute", left: 0, top: 0 }} />
        )}
        {/* Lapisan gelap: menjaga teks putih terbaca di atas foto terang */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background: photo
              ? "linear-gradient(180deg, rgba(0,0,0,0.52), rgba(0,0,0,0.78))"
              : "radial-gradient(70% 70% at 50% 45%, rgba(0,0,0,0), rgba(0,0,0,0.35))",
          }}
        />

        {/* Bingkai ganda */}
        <div
          style={{
            position: "absolute",
            left: 26,
            top: 26,
            right: 26,
            bottom: 26,
            display: "flex",
            border: "2px solid rgba(255,255,255,0.78)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 38,
            top: 38,
            right: 38,
            bottom: 38,
            display: "flex",
            border: "1px solid rgba(255,255,255,0.42)",
          }}
        />

        {/* Hiasan sudut */}
        {/* Posisi memakai left/top eksplisit: Satori tidak menghitung right/bottom untuk elemen SVG. */}
        {floral ? (
          <>
            <FloralCorner primary={primary} style={{ left: 0, top: 0 }} />
            <FloralCorner primary={primary} style={{ left: W - 330, top: H - 330 }} flipX flipY />
            <FloralCorner primary={primary} size={210} style={{ left: W - 210, top: 0 }} flipX />
            <FloralCorner primary={primary} size={210} style={{ left: 0, top: H - 210 }} flipY />
          </>
        ) : (
          <>
            <FlourishCorner style={{ left: 44, top: 44 }} />
            <FlourishCorner style={{ left: W - 44 - 150, top: 44 }} flipX />
            <FlourishCorner style={{ left: 44, top: H - 44 - 150 }} flipY />
            <FlourishCorner style={{ left: W - 44 - 150, top: H - 44 - 150 }} flipX flipY />
          </>
        )}

        {/* Isi */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "0 150px",
            textAlign: "center",
          }}
        >
          {template === "envelope" && inv && (
            <div style={{ position: "relative", display: "flex", width: 132, height: 132, marginBottom: 14 }}>
              <WaxSeal primary={primary} />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 132,
                  height: 132,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 38,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                {initials}
              </div>
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 9,
              textTransform: "uppercase",
              textShadow: shadow,
            }}
          >
            {inv?.title ?? "Undangan Pernikahan"}
          </div>
          <div style={{ display: "flex", marginTop: 14 }}>
            <Divider />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              whiteSpace: "nowrap",
              marginTop: 8,
              fontFamily: scriptNames ? "Script" : "Playfair",
              fontWeight: scriptNames ? 400 : 700,
              fontSize: nameSize(names, scriptNames),
              lineHeight: 1.12,
              textShadow: shadow,
            }}
          >
            {names}
          </div>
          {inv && (
            <div style={{ display: "flex", marginTop: 20, fontSize: 36, letterSpacing: 2, textShadow: shadow }}>
              {formatDate(inv.eventDate)}
            </div>
          )}
          {venue && (
            <div style={{ display: "flex", marginTop: 10, fontSize: 27, opacity: 0.92, textShadow: shadow }}>{venue}</div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair", data: serif, weight: 700, style: "normal" },
        { name: "Playfair", data: serifRegular, weight: 400, style: "normal" },
        { name: "Script", data: script, weight: 400, style: "normal" },
      ],
    },
  );
}
