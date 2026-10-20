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
  { id: "envelope", name: "Envelope", desc: "Dibuka dari amplop bersegel lilin, kartu foto bertumpuk." },
  { id: "botanical", name: "Botanical", desc: "Bingkai lengkung, bunga dan daun, tepi kertas sobek." },
  { id: "panel", name: "Panel", desc: "Panel warna pekat bergantian, ikon garis tipis, rapi." },
  { id: "satin", name: "Satin", desc: "Kain satin bergelombang, plakat berlekuk, calla lily dan mawar." },
  { id: "kraft", name: "Kraft", desc: "Kertas kraft sobek, dahlia, amplop berbunga, piringan hitam." },
  { id: "lavender", name: "Lavender", desc: "Gambar garis lavender dan daisy, hati di kalender." },
  { id: "renda", name: "Renda", desc: "Vintage: renda oval, pita beludru, cermin emas." },
  { id: "batik", name: "Batik", desc: "Motif kawung dan tumpal, warna sogan dan emas." },
  { id: "islami", name: "Islami", desc: "Lengkung masjid, bintang geometris, Basmalah." },
  { id: "boho", name: "Boho", desc: "Pelangi lengkung, rumput pampas, daun palem kering." },
  { id: "deco", name: "Art Deco", desc: "Sunburst emas, bingkai bertingkat, hitam dan emas." },
  { id: "pantai", name: "Pantai", desc: "Ombak berlapis, kerang, bintang laut, pasir." },
] as const;

/** Preset warna siap pakai: [nama, utama, latar, teks]. */
export const PALETTES = [
  { name: "Emas Klasik", primary: "#b08968", bg: "#fffaf3", text: "#3b2f2f", accent: "#9c6b4a" },
  { name: "Sage Green", primary: "#6b8f71", bg: "#f4f8f2", text: "#26332a", accent: "#c98f8a" },
  { name: "Dusty Rose", primary: "#c76b7e", bg: "#fff5f6", text: "#4a2c33", accent: "#a84a5c" },
  { name: "Navy & Emas", primary: "#d4af5f", bg: "#101b33", text: "#f3ead2", accent: "#e9c46a" },
  { name: "Terracotta", primary: "#c4623a", bg: "#fbf1ea", text: "#3d2418", accent: "#9a3f22" },
  { name: "Monokrom", primary: "#111111", bg: "#ffffff", text: "#111111", accent: "#555555" },
  { name: "Navy Klasik", primary: "#3b4a6b", bg: "#f7f3ec", text: "#2a3148", accent: "#8aa0c8" },
  { name: "Olive Sage", primary: "#7d8a68", bg: "#f6f1e7", text: "#2f3626", accent: "#8c2f3d" },
  { name: "Blush Garden", primary: "#d98f9b", bg: "#fff7f4", text: "#4a2f33", accent: "#b8566a" },
  { name: "Lilac", primary: "#8c7aa8", bg: "#f7f3fa", text: "#3a3150", accent: "#6d4c93" },
  { name: "Cornflower", primary: "#3f62b5", bg: "#fbf8f1", text: "#1f2b4d", accent: "#7fa0e0" },
  { name: "Burgundy Satin", primary: "#5b1423", bg: "#f6eee4", text: "#3b1c22", accent: "#8f2236" },
  { name: "Kraft Wine", primary: "#6f7f4d", bg: "#f7f2e8", text: "#3a2b24", accent: "#8c1c2f" },
  { name: "Lavender Line", primary: "#5a2a6e", bg: "#faf6fb", text: "#3a2a45", accent: "#9a7bbd" },
  { name: "Plum Velvet", primary: "#4a1830", bg: "#f1e6da", text: "#3a1d2a", accent: "#7a2a45" },
  { name: "Sogan Emas", primary: "#5a3a22", bg: "#f3e7cf", text: "#3b2616", accent: "#b8832f" },
  { name: "Emerald Gold", primary: "#0f5a4a", bg: "#f6f1e3", text: "#12342c", accent: "#c8a24a" },
  { name: "Boho Clay", primary: "#b0603a", bg: "#f5ece0", text: "#4a3326", accent: "#8a9a78" },
  { name: "Deco Gold", primary: "#17181c", bg: "#f3ead3", text: "#17181c", accent: "#c9a24a" },
  { name: "Ocean Sand", primary: "#0f4c6b", bg: "#f7f1e3", text: "#11323f", accent: "#e08a63" },
] as const;

export const HEADING_FONTS = [
  "Playfair Display",
  "Cormorant Garamond",
  "Great Vibes",
  "Dancing Script",
  "Allura",
  "Pinyon Script",
  "Cinzel",
  "Marcellus",
  "Italiana",
  "Parisienne",
  "Lora",
  "Montserrat",
];

/* ---------- Data baris: rangkaian acara, rekening, warna dress code ---------- */
export type ScheduleItem = { time: string; title: string; note: string };
export type GiftAccount = { bank: string; number: string; holder: string };

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function asArray(input: unknown): unknown[] {
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(input) ? input : [];
}

/** Terima JSON string atau array; buang baris kosong, batasi panjang dan jumlah. */
export function cleanSchedule(input: unknown): ScheduleItem[] {
  return asArray(input)
    .map((r) => {
      const o = (r ?? {}) as Record<string, unknown>;
      return { time: text(o.time, 8), title: text(o.title, 80), note: text(o.note, 200) };
    })
    .filter((r) => r.title)
    .slice(0, 20);
}

export function cleanAccounts(input: unknown): GiftAccount[] {
  return asArray(input)
    .map((r) => {
      const o = (r ?? {}) as Record<string, unknown>;
      return { bank: text(o.bank, 40), number: text(o.number, 40), holder: text(o.holder, 80) };
    })
    .filter((r) => r.bank && r.number)
    .slice(0, 6);
}

export function cleanColors(input: unknown): string[] {
  return asArray(input)
    .map((c) => (typeof c === "string" ? c.trim() : ""))
    .filter((c) => /^#[0-9a-fA-F]{6}$/.test(c))
    .slice(0, 6);
}

export const BODY_FONTS = ["Lato", "Poppins", "Nunito", "Merriweather", "Montserrat", "Raleway", "Josefin Sans"];

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

/** Bulan acara untuk kartu kalender: header, hari pertama (0 = Senin), jumlah hari, tanggal acara. */
export function calendarMonth(date: Date): { title: string; offset: number; days: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" })
    .format(date)
    .split("-")
    .map(Number);
  const [year, month, day] = parts;
  const first = new Date(Date.UTC(year, month - 1, 1));
  return {
    title: new Intl.DateTimeFormat("id-ID", { timeZone: "UTC", month: "long", year: "numeric" }).format(first),
    offset: (first.getUTCDay() + 6) % 7,
    days: new Date(Date.UTC(year, month, 0)).getUTCDate(),
    day,
  };
}

export function cleanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return digits;
}

export function isHexColor(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v);
}
