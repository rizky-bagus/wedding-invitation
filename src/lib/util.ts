/** Hasil server action untuk ActionForm: pesan sukses atau error. */
export type ActionResult = { ok: boolean; message: string } | null;
export const fail = (message: string): ActionResult => ({ ok: false, message });
export const done = (message: string): ActionResult => ({ ok: true, message });

export const TIME_ZONE = "Asia/Jakarta";
const TZ_OFFSET = "+07:00";

export const TEMPLATES = [
  { id: "elegant", name: "Elegant", desc: "Klasik, bingkai emas, tipografi serif." },
  { id: "floral", name: "Floral", desc: "Lembut, sudut membulat, nuansa bunga." },
  { id: "modern", name: "Modern", desc: "Minimalis, garis tegas, banyak ruang kosong." },
] as const;

/** Preset warna siap pakai: [nama, utama, latar, teks]. */
export const PALETTES = [
  { name: "Emas Klasik", primary: "#b08968", bg: "#fffaf3", text: "#3b2f2f" },
  { name: "Sage Green", primary: "#6b8f71", bg: "#f4f8f2", text: "#26332a" },
  { name: "Dusty Rose", primary: "#c76b7e", bg: "#fff5f6", text: "#4a2c33" },
  { name: "Navy & Emas", primary: "#d4af5f", bg: "#101b33", text: "#f3ead2" },
  { name: "Terracotta", primary: "#c4623a", bg: "#fbf1ea", text: "#3d2418" },
  { name: "Monokrom", primary: "#111111", bg: "#ffffff", text: "#111111" },
] as const;

export const HEADING_FONTS = [
  "Playfair Display",
  "Cormorant Garamond",
  "Great Vibes",
  "Dancing Script",
  "Cinzel",
  "Montserrat",
];

export const BODY_FONTS = ["Lato", "Poppins", "Nunito", "Merriweather"];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Slug yang bentrok dengan rute aplikasi sendiri. */
export const RESERVED_SLUGS = ["admin", "api", "files", "u", "_next", "favicon", "robots", "sitemap"];

/** Slug bawaan: "<istri>-with-<suami>", mis. "ani-with-budi". */
export function defaultSlug(groomName: string, brideName: string): string {
  const bride = slugify(brideName);
  const groom = slugify(groomName);
  return bride && groom ? `${bride}-with-${groom}` : bride || groom;
}

/** Path undangan umum: "/ani-with-budi". */
export function invitationPath(slug: string): string {
  return `/${slug}`;
}

/** Path undangan personal: "/ani-with-budi?to=Tamu+Undangan". */
export function guestPath(slug: string, guestName: string): string {
  return `/${slug}?${new URLSearchParams({ to: guestName })}`;
}

/** Rapikan nama tamu dari query ?to= (spasi ganda, panjang, karakter kontrol). */
export function cleanGuestName(raw: string | undefined): string {
  return (raw ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

/** "2026-12-12T09:00" (waktu WIB) -> Date */
export function parseJakartaInput(value: string): Date {
  return new Date(`${value}:00${TZ_OFFSET}`);
}

/** Date -> "2026-12-12T09:00" untuk <input type="datetime-local"> (waktu WIB) */
export function toJakartaInput(date: Date): string {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
  return parts.replace(" ", "T");
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTime(date: Date): string {
  return (
    new Intl.DateTimeFormat("id-ID", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .format(date)
      .replace(".", ":") + " WIB"
  );
}

/** Terima URL embed langsung atau seluruh tag <iframe ...> dari Google Maps. */
export function extractMapSrc(input: string): string {
  const match = input.match(/src=["']([^"']+)["']/);
  return (match ? match[1] : input).trim();
}

export function parseGallery(json: string): string[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string" && x) : [];
  } catch {
    return [];
  }
}

export function cleanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return digits;
}

export function isHexColor(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v);
}
