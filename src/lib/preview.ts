import type { InvitationData } from "@/components/invitation/Invitation";
import {
  BODY_FONTS,
  HEADING_FONTS,
  TEMPLATES,
  cleanAccounts,
  cleanColors,
  cleanSchedule,
  cleanStory,
  extractMapSrc,
  formatDate,
  formatTime,
  isHexColor,
  parseJakartaInput,
} from "@/lib/util";
import { normLang } from "@/lib/i18n";

const TEXT_KEYS = [
  "title",
  "groomParents",
  "brideParents",
  "venueName",
  "venueAddress",
  "openingText",
  "closingText",
  "coverPhoto",
  "groomPhoto",
  "bridePhoto",
  "musicUrl",
  "dressCode",
  "giftNote",
  "giftQr",
  "notes",
] as const;

/**
 * Ubah isi form dashboard (yang dikirim lewat postMessage) menjadi penimpa data undangan
 * untuk pratinjau. Hanya kunci yang dikenali dan nilai yang valid yang diterima.
 */
export function previewOverrides(fields: unknown): Partial<InvitationData> {
  const out: Partial<InvitationData> = {};
  if (!fields || typeof fields !== "object") return out;
  const f = fields as Record<string, unknown>;
  const str = (k: string) => (typeof f[k] === "string" ? (f[k] as string).trim().slice(0, 2000) : undefined);

  for (const k of TEXT_KEYS) {
    const v = str(k);
    if (v !== undefined) out[k] = v;
  }
  // Nama mempelai tidak boleh kosong di pratinjau.
  for (const k of ["groomName", "brideName"] as const) {
    const v = str(k);
    if (v) out[k] = v;
  }

  const template = str("template");
  if (template && TEMPLATES.some((t) => t.id === template)) out.template = template;

  for (const [field, key] of [
    ["primaryColor", "primaryColor"],
    ["bgColor", "bgColor"],
    ["textColor", "textColor"],
    ["accentColor", "accentColor"],
  ] as const) {
    const v = str(field);
    if (v && isHexColor(v)) out[key] = v;
  }

  const heading = str("headingFont");
  if (heading && HEADING_FONTS.includes(heading)) out.headingFont = heading;
  const body = str("bodyFont");
  if (body && BODY_FONTS.includes(body)) out.bodyFont = body;

  const schedule = str("schedule");
  if (schedule !== undefined) out.schedule = cleanSchedule(schedule);
  const story = str("story");
  if (story !== undefined) out.story = cleanStory(story);
  const dressColors = str("dressColors");
  if (dressColors !== undefined) out.dressColors = cleanColors(dressColors);
  const giftAccounts = str("giftAccounts");
  if (giftAccounts !== undefined) out.giftAccounts = cleanAccounts(giftAccounts);
  const phone = str("contactPhone");
  if (phone !== undefined) out.contactPhone = phone.replace(/[^\d+]/g, "").slice(0, 20);

  const map = str("mapEmbedUrl");
  if (map !== undefined) out.mapEmbedUrl = extractMapSrc(map);

  const gallery = str("gallery");
  if (gallery !== undefined) out.gallery = gallery.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const lang = normLang(str("lang"));
  out.lang = lang;

  const date = str("eventDate");
  if (date && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(date)) {
    const d = parseJakartaInput(date);
    if (!Number.isNaN(d.getTime())) {
      out.eventISO = d.toISOString();
      out.dateText = formatDate(d, lang);
      out.timeText = formatTime(d, lang);
    }
  }
  return out;
}
